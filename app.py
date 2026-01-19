import streamlit as stream
from streamlit_app.ui.styles import inject_css
from streamlit_app.ui.layout import render_header, render_tabs
from streamlit_app.data_layer.loaders import load_artifacts

stream.set_page_config(page_title="Fraud Detection System", page_icon="🛰️", layout="wide")

inject_css()
render_header()

artifacts = load_artifacts()
render_tabs(artifacts)