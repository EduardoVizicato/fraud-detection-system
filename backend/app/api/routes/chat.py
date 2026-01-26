from fastapi import APIRouter
from pydantic import BaseModel

from app.services.chat_service import call_llm

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatIn(BaseModel):
    message: str


@router.post("")
def chat(payload: ChatIn):
    return {"reply": call_llm(payload.message)}
