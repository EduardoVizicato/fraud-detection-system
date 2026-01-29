import pandas as pd
import numpy as np
from pathlib import Path
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, precision_recall_fscore_support, roc_auc_score
import pickle
import json
from datetime import datetime

class FraudProcessor:
    def __init__(self, csv_path: str | None = None):
        self.csv_path = Path(csv_path) if csv_path else (
            Path(__file__).resolve().parents[2] / "data" / "raw" / "creditcard.csv"
        )
        self.processed_dir = self.csv_path.parent.parent / "processed"
        self.df = None
        self.scaler = StandardScaler()
        self.model = None
        
    def load_data(self):
        """Carrega creditcard.csv"""
        self.df = pd.read_csv(self.csv_path)
        return self.df
    
    def preprocess(self):
        """Normaliza features (exceto Time e Class)"""
        if self.df is None:
            self.load_data()
        
        X = self.df.drop(['Time', 'Class'], axis=1)
        y = self.df['Class']
        
        X_scaled = self.scaler.fit_transform(X)
        return X_scaled, y
    
    def train_model(self, X, y, model_type: str = "logistic"):
        """Treina modelo (Logistic Regression ou Random Forest)"""
        if model_type == "logistic":
            self.model = LogisticRegression(max_iter=1000, random_state=42)
        else:
            self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        
        self.model.fit(X, y)
        return self.model
    
    def predict(self, X):
        """Faz previsões"""
        if self.model is None:
            raise ValueError("Model não foi treinado. Chame train_model() primeiro.")
        return self.model.predict(X)
    
    def compute_metrics(self, y_true, y_pred, y_proba=None):
        """Calcula métricas de desempenho"""
        tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
        precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='binary')
        
        auc = roc_auc_score(y_true, y_proba) if y_proba is not None else None
        
        return {
            "tp": int(tp),
            "fp": int(fp),
            "fn": int(fn),
            "tn": int(tn),
            "precision": float(precision),
            "recall": float(recall),
            "f1": float(f1),
            "auc": float(auc) if auc else None,
            "accuracy": float((tp + tn) / (tp + tn + fp + fn)),
        }
    
    def get_feature_importance(self, top_n: int = 20):
        """Retorna importância das features (se usar RandomForest)"""
        if self.model is None or not hasattr(self.model, 'feature_importances_'):
            return []
        
        importances = self.model.feature_importances_
        feature_names = [f for f in self.df.columns if f not in ['Time', 'Class']]
        
        sorted_idx = np.argsort(importances)[::-1][:top_n]
        return [
            {"feature": feature_names[i], "importance": float(importances[i])}
            for i in sorted_idx
        ]
    
    def get_fraud_distribution(self):
        """Distribuição de fraude vs legítimo"""
        if self.df is None:
            self.load_data()
        
        counts = self.df['Class'].value_counts()
        return {
            "legitimate": int(counts.get(0, 0)),
            "fraud": int(counts.get(1, 0)),
            "fraud_rate": float(counts.get(1, 0) / len(self.df) * 100),
        }
    
    def get_amount_statistics(self):
        """Estatísticas de valor (Amount)"""
        if self.df is None:
            self.load_data()
        
        fraud_amounts = self.df[self.df['Class'] == 1]['Amount']
        legit_amounts = self.df[self.df['Class'] == 0]['Amount']
        
        return {
            "fraud": {
                "mean": float(fraud_amounts.mean()),
                "median": float(fraud_amounts.median()),
                "std": float(fraud_amounts.std()),
                "min": float(fraud_amounts.min()),
                "max": float(fraud_amounts.max()),
            },
            "legitimate": {
                "mean": float(legit_amounts.mean()),
                "median": float(legit_amounts.median()),
                "std": float(legit_amounts.std()),
                "min": float(legit_amounts.min()),
                "max": float(legit_amounts.max()),
            }
        }
    
    def save_checkpoint(self, name: str = "model_checkpoint"):
        """Salva modelo e scaler"""
        if self.model is None:
            raise ValueError("Nenhum modelo para salvar")
        
        checkpoint = {
            "model": self.model,
            "scaler": self.scaler,
            "timestamp": datetime.now().isoformat(),
        }
        path = self.processed_dir / f"{name}.pkl"
        with open(path, "wb") as f:
            pickle.dump(checkpoint, f)
        return str(path)
    
    def export_summary(self, y_true, y_pred, y_proba=None):
        """Exporta relatório completo em JSON"""
        metrics = self.compute_metrics(y_true, y_pred, y_proba)
        distribution = self.get_fraud_distribution()
        amounts = self.get_amount_statistics()
        importance = self.get_feature_importance()
        
        summary = {
            "timestamp": datetime.now().isoformat(),
            "dataset_size": len(self.df),
            "metrics": metrics,
            "fraud_distribution": distribution,
            "amount_statistics": amounts,
            "top_features": importance,
        }
        
        path = self.processed_dir / "fraud_summary.json"
        with open(path, "w") as f:
            json.dump(summary, f, indent=2)
        
        return summary