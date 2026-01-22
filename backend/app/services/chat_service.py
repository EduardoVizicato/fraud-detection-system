def reply(message: str) -> str:
    """
    Fase 1: stub simples.
    Aqui você liga na SUA IA de verdade (modelo local, endpoint, etc.)
    """
    msg = (message or "").strip()
    if not msg:
        return "Manda uma pergunta pra eu conseguir responder 😉"

    return f"[IA] Entendi sua pergunta: {msg}"
