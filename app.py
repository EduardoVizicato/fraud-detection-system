import streamlit as st
from streamlit_app.ui.styles import inject_css
from streamlit_app.ui.layout import render_app
from streamlit_app.data_layer.loaders import load_artifacts

st.set_page_config(page_title="Fraud Monitor", page_icon="🛰️", layout="wide")
inject_css()

render_app(load_artifacts)
