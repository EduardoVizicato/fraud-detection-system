from fastapi import APIRouter
from pydantic import BaseModel

from app.services.chat_service import reply

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatIn(BaseModel):
    message: str


@router.post("")
def chat(payload: ChatIn):
    return {"reply": reply(payload.message)}
