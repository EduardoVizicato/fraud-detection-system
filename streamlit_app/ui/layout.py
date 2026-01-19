import streamlit as stream
from streamlit_app.data_layer.loaders import Artifacts
from streamlit_app.charts.model_plots import render_model_section
from streamlit_app.chat.ui import render_chat
from streamlit_app.ui.components import render_reports

def render_header():
    left, right = stream.columns([0.75, 0.25])
    with left:
        stream.title("Fraud Detection • Dashboard")
        stream.markdown('<div class="small-muted"> Baseline vs Balanced • Audit • Threshold • Chatbot </div>', unsafe_allow_html=True)
    with right:
        stream.write("")
        stream.write("**Status**: ✅Online")

    stream.divider()

def render_tabs(artifacts: Artifacts):
    tab_dash, tab_chat, tab_docs = stream.tabs(["📊 Dashboard", "💭 Chat", "Reports"])

    with tab_dash:
        render_model_section(artifacts)
        stream.divider()
        render_model_section(artifacts)
    
    with tab_chat:
        render_chat(artifacts)

    with tab_docs:
        render_reports(artifacts)