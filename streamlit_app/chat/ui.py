import streamlit as st
from streamlit_app.data_layer.loaders import Artifacts
from streamlit_app.chat.fallback import answer_fallback
from streamlit_app.chat.llm import answer_with_gemini

def render_chat(artifacts: Artifacts):
    st.subheader("Chatbot")
    st.caption("Pergunte sobre métricas, trade-offs, KPIs e alertas.")

    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"role": "assistant", "content": "Sou a FRIDAY. Pergunte: 'qual modelo é melhor?', 'mostre KPIs', 'top alertas'."}
        ]

    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    user_q = st.chat_input("Pergunte algo...")
    if not user_q:
        return

    st.session_state.messages.append({"role": "user", "content": user_q})
    with st.chat_message("user"):
        st.markdown(user_q)

    # LLM (Gemini) se disponível, senão fallback
    answer = answer_with_gemini(user_q, artifacts)
    if not answer:
        answer = answer_fallback(user_q, artifacts)

    st.session_state.messages.append({"role": "assistant", "content": answer})
    with st.chat_message("assistant"):
        st.markdown(answer)
