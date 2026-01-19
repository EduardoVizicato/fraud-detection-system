import os
from typing import Optional
from streamlit_app.data_layer.loaders import Artifacts
from streamlit_app.chat.context import build_context

def _extract_text(content) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        texts = []
        for part in content:
            if isinstance(part, dict) and part.get("type") == "text":
                texts.append(part.get("text", ""))
        return "\n".join([t for t in texts if t]).strip()
    return str(content)

def answer_with_gemini(question: str, artifacts: Artifacts) -> Optional[str]:
    key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not key:
        return None

    try:
        from langchain_google_genai import ChatGoogleGenerativeAI
    except Exception:
        return None

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)

    context = build_context(artifacts)
    prompt = f"""
Você é um assistente técnico do projeto de detecção de fraudes.
Responda em português, em tópicos curtos, usando apenas o contexto.

CONTEXTO:
{context}

PERGUNTA:
{question}

REGRAS:
- Se recomendar um modelo, explique trade-off (precision vs recall).
- Se faltar dado, diga o que falta.
"""
    resp = llm.invoke(prompt)
    return _extract_text(getattr(resp, "content", ""))
