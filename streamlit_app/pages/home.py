import streamlit as stream

def render_home():
    left, right = stream.columns([0.62, 0.38], vertical_alignment="top")

    with left:
        stream.markdown("## Fraud Monitor • Plataforma de Detecção & Auditoria")
        stream.markdown('<div class="badge">🛰️ Tracking • 🛡️ Audit • 🎯 Threshold tuning • 💬 Chat</div>',
                    unsafe_allow_html=True)
        stream.write("")
        stream.write(
            "Fraud detection system, operational audit and explanation layer for stakeholders.")
        stream.write("")

        c1, c2, c3 = stream.columns(3)
        with c1:
            stream.markdown(
                '<div class="card"><b>Reliable</b><br/><span style="opacity:.75">Foco em clareza e estabilidade</span></div>',
                unsafe_allow_html=True)
        with c2:
            stream.markdown(
                '<div class="card"><b>Auditável</b><br/><span style="opacity:.75">KPIs + Top alerts + reports</span></div>',
                unsafe_allow_html=True)
        with c3:
            stream.markdown(
                '<div class="card"><b>Accessible</b><br/><span style="opacity:.75">High contrast for better reading</span></div>',
                unsafe_allow_html=True)

        stream.write("")
        a, b = stream.columns([0.25, 0.25])
        with a:
            if stream.button("Open Dashboard", type="primary"):
                stream.session_state.page = "Dashboard"
                stream.rerun()
        with b:
            if stream.button("Open Chat"):
                stream.session_state.page = "Chat"
                stream.rerun()

    with right:
        stream.markdown(
            '<div class="card"><b>Presentation mode</b><br/>Use navbar to navigate through the system. the panel read the artifacts <code>data/processed</code>.</div>',
            unsafe_allow_html=True)
        stream.write("")
        stream.markdown(
            '<div class="card"><b>O que mostrar pros SDLs</b><br/>• Trade-off precision vs recall<br/>• PR curve + threshold<br/>• Auditoria (TP/FP/FN/TN)<br/>• Top alertas priorizados</div>',
            unsafe_allow_html=True)