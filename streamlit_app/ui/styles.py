import streamlit as stream

CSS = """
<style>
.block-container { padding-top: 1.1rem; padding-bottom: 2rem; }
.small-muted { opacity: .75; font-size: 0.92rem; }
.card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding 14px 14px;
    border-radius: 16px;
}
hr { opacity: .25; }
</style>
"""

def inject_css():
    stream.markdown(CSS, unsafe_allow_html=True)