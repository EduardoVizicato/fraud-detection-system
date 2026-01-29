import asyncio
import csv
from collections import OrderedDict, deque
import heapq
from time import time as now
from pathlib import Path
from app.services.fraud_processor import FraudProcessor
import numpy as np
import warnings

# Suprimir warnings de feature names
warnings.filterwarnings('ignore', category=UserWarning, module='sklearn')

class RealtimeProcessor:
    def __init__(self, csv_path: str | None = None, batch_size: int = 100):
        self.csv_path = Path(csv_path) if csv_path else (
            Path(__file__).resolve().parents[2] / "data" / "raw" / "creditcard.csv"
        )
        self.fraud_processor = FraudProcessor(str(self.csv_path))
        self.batch_size = batch_size
        
        # Estado do stream
        self.total_rows = 0
        self.fraud_total = 0
        self.amount_sum = 0.0
        self.minute_counts: "OrderedDict[int, int]" = OrderedDict()
        self.top_alerts: "deque" = deque(maxlen=10)
        
        # Buffer de batch para predição
        self.batch_buffer = []
        self.batch_predictions = []
        
        # Feature names
        self.feature_names = [f"V{i}" for i in range(1, 29)] + ["Amount"]
        
        # Treina modelo na inicialização
        self._train_initial_model()
    
    def _train_initial_model(self):
        """Treina modelo com todos os dados (uma vez)"""
        self.fraud_processor.load_data()
        X, y = self.fraud_processor.preprocess()
        
        # Força feature names no scaler
        self.fraud_processor.scaler.feature_names_in_ = np.array(self.feature_names)
        
        self.fraud_processor.train_model(X, y, model_type="logistic")
    
    async def stream_with_predictions(
        self,
        interval_ms: int = 50,
        window_minutes: int = 60,
        top_n: int = 10,
    ):
        """Stream de dados com predições em tempo real"""
        
        with self.csv_path.open("r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            
            for row in reader:
                self.total_rows += 1
                
                # Parse valores
                amount = float(row.get("Amount", 0) or 0)
                actual_class = int(float(row.get("Class", 0) or 0))
                t = float(row.get("Time", 0) or 0)
                minute = int(t // 60)
                
                # Extrai features (V1-V28 + Amount)
                features = []
                for i in range(1, 29):
                    try:
                        features.append(float(row.get(f"V{i}", 0)))
                    except:
                        features.append(0.0)
                features.append(amount)
                
                # Normaliza com nome de features correto
                X_sample = np.array([features], dtype=np.float64)
                X_sample_df = np.asarray(X_sample)
                X_scaled = self.fraud_processor.scaler.transform(X_sample_df)
                
                # Faz predição
                prediction = self.fraud_processor.model.predict(X_scaled)[0]
                prediction_proba = self.fraud_processor.model.predict_proba(X_scaled)[0][1]
                
                # Adiciona ao batch
                self.batch_buffer.append({
                    "time": t,
                    "amount": amount,
                    "actual": actual_class,
                    "prediction": int(prediction),
                    "confidence": float(prediction_proba),
                })
                
                # Atualiza contadores
                self.amount_sum += amount
                
                if minute not in self.minute_counts:
                    self.minute_counts[minute] = 0
                
                if prediction == 1:
                    self.fraud_total += 1
                    self.minute_counts[minute] += 1
                    
                    alert = {
                        "time": t,
                        "amount": amount,
                        "actual": actual_class,
                        "predicted": int(prediction),
                        "confidence": float(prediction_proba),
                    }
                    self.top_alerts.append(alert)
                
                # Limpa janela móvel
                while len(self.minute_counts) > 0:
                    oldest_minute = next(iter(self.minute_counts))
                    if minute - oldest_minute >= window_minutes:
                        self.minute_counts.popitem(last=False)
                    else:
                        break
                
                # A cada batch_size, gera payload
                if len(self.batch_buffer) >= self.batch_size:
                    payload = {
                        "type": "realtime_metrics",
                        "timestamp": now(),
                        "total_processed": self.total_rows,
                        "total_fraud_predictions": self.fraud_total,
                        "avg_amount": self.amount_sum / self.total_rows if self.total_rows else 0,
                        "fraud_rate": self.fraud_total / self.total_rows if self.total_rows else 0,
                        "fraud_by_minute": [
                            {"minute": m, "count": c} for m, c in sorted(self.minute_counts.items())
                        ],
                        "top_alerts": sorted(
                            list(self.top_alerts),
                            key=lambda x: x["confidence"],
                            reverse=True,
                        )[:top_n],
                        "batch_accuracy": self._compute_batch_accuracy(),
                    }
                    
                    self.batch_buffer = []
                    yield payload
                
                await asyncio.sleep(interval_ms / 1000)
    
    def _compute_batch_accuracy(self):
        """Calcula acurácia do batch processado"""
        if not self.batch_buffer:
            return None
        
        actual = [b["actual"] for b in self.batch_buffer]
        pred = [b["prediction"] for b in self.batch_buffer]
        
        correct = sum(a == p for a, p in zip(actual, pred))
        return correct / len(self.batch_buffer)
    
    async def stream_individual_transactions(
        self,
        interval_ms: int = 100,
    ):
        """Stream de transações individuais com todas as features"""
        with self.csv_path.open("r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            
            for idx, row in enumerate(reader):
                try:
                    time_val = float(row.get("Time", 0) or 0)
                    amount = float(row.get("Amount", 0) or 0)
                    actual_class = int(float(row.get("Class", 0) or 0))
                    
                    # Extrai V1-V28
                    features = []
                    for i in range(1, 29):
                        try:
                            features.append(float(row.get(f"V{i}", 0) or 0))
                        except:
                            features.append(0.0)
                    
                    # Payload para frontend
                    transaction = {
                        "id": f"txn_{idx}",
                        "idx": idx,
                        "time": time_val,
                        "amount": amount,
                        "features": features,  # V1-V28
                        "class": actual_class,  # Label real (só para validação backend)
                    }
                    
                    yield transaction
                    await asyncio.sleep(interval_ms / 1000)
                except Exception as e:
                    print(f"Erro processando linha {idx}: {e}")
                    continue
    
    async def export_full_report(self):
        """Gera relatório completo após processamento"""
        self.fraud_processor.load_data()
        X, y = self.fraud_processor.preprocess()
        
        # Force feature names
        self.fraud_processor.scaler.feature_names_in_ = np.array(self.feature_names)
        
        y_pred = self.fraud_processor.predict(X)
        y_proba = self.fraud_processor.model.predict_proba(X)[:, 1]
        
        return self.fraud_processor.export_summary(y, y_pred, y_proba)