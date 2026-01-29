from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.realtime_processor import RealtimeProcessor

router = APIRouter()

@router.websocket("/ws/transactions")
async def ws_transactions(websocket: WebSocket):
    """WebSocket para streamar transações individuais (para detecção de fraude no frontend)"""
    await websocket.accept()
    processor = RealtimeProcessor()
    try:
        async for transaction in processor.stream_individual_transactions(interval_ms=50):
            await websocket.send_json(transaction)
    except WebSocketDisconnect:
        return
    except Exception as e:
        print(f"Erro no ws/transactions: {e}")
        await websocket.close()

@router.websocket("/ws/metrics")
async def ws_metrics(websocket: WebSocket):
    await websocket.accept()
    processor = RealtimeProcessor()
    try:
        async for payload in processor.stream_with_predictions():
            await websocket.send_json(payload)
    except WebSocketDisconnect:
        return
    except Exception as e:
        await websocket.close()

@router.get("/api/fraud/report")
async def get_fraud_report():
    """Retorna relatório completo processado"""
    processor = RealtimeProcessor()
    return await processor.export_full_report()