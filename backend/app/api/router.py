from fastapi import APIRouter
from app.api.routes.data import router as data_router
from app.api.routes.chat import router as chat_router
from app.api.routes.data_csv import router as data_csv_router
from app.api.routes import stream

router = APIRouter(prefix="/api")
router.include_router(chat_router)
router.include_router(data_router)
router.include_router(data_csv_router)
router.include_router(stream.router)

