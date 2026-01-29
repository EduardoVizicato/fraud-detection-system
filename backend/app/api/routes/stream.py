from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.realtime_processor import RealtimeProcessor

router = APIRouter()

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