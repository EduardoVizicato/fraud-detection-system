import streamlit as stream
from streamlit_app.ui.navbar import render_navbar
from streamlit_app.pages.home import render_home
from streamlit_app.charts.model_plots import render_model_section
from streamlit_app.charts.audit_plots import render_audit_section
from streamlit_app.chat.ui import render_chat
from streamlit_app.ui.components import render_reports

def render_app(artifacts):
    page = render_navbar()
    stream.write("")

    if page == "Home":
        render_home()
        return

    if page == "DashBoard":
        render_model_section(artifacts)
        stream.divider()
        return

    if page == "Audit":
        render_audit_section(artifacts)
        return

    if page == "Threshold":
        stream.info("TESTE")
        return

    if page == "Chat":
        render_chat(artifacts)
        return

    if page == "Reports":
        render_reports(artifacts)
        return

    if page == "AboutMe":
        stream.markdown("### About the project")
        stream.write("Test")
        return