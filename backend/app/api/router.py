from fastapi import APIRouter
from app.api.routes.data import router as data_router
from app.api.routes.chat import router as chat_router

router = APIRouter(prefix="/api")
router.include_router(chat_router)
router.include_router(data_router)
