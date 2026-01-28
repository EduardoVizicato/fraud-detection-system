from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.services.chat_service import call_llm

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatIn(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None


@router.post("")
def chat(payload: ChatIn):
    return {"reply": call_llm(payload.message, payload.context)}
