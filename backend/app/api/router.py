from fastapi import APIRouter
from app.api.routes import data
from app.api.routes.chat import router as chat_router
from app.api.routes.data_csv import router as data_csv_router

router = APIRouter(prefix="/api")
router.include_router(data.router)
router.include_router(chat_router)
router.include_router(data_csv_router)

