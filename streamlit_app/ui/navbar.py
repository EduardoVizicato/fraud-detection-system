import streamlit as stream
from streamlit_option_menu import option_menu

PAGES = ["Home", "DashBoard", "Chat", "Threshold", "Audit", "Reports", "AboutMe"]

def render_navbar() -> str:
    if "page" not in stream.session_state:
        stream.session_state.page = "Home"

    default_index = PAGES.index(stream.session_state.page) if stream.session_state.page in PAGES else 0

    selected_page = option_menu(
        None,
        PAGES,
        icons=["house", "bar-chart", "chat", "sliders", "shield-check", "file-text", "info-circle"],
        default_index = default_index,
        orientation="horizontal",
        styles={
            "container": {"padding": "0!important", "background-color": "rgba(255,255,255,0.02)",
                          "border": "1px solid rgba(230,241,255,.10)", "border-radius": "16px"},
            "icon": {"color": "#8AB4FF", "font-size": "16px"},
            "nav-link": {"font-size": "14px", "text-align": "center", "margin": "0px",
                         "color": "rgba(230,241,255,.85)"},
            "nav-link-selected": {"background": "linear-gradient(90deg, #1D4ED8, #2563EB)", "color": "white",
                                  "border-radius": "12px"},
        }
    )

    stream.session_state.page = selected_page
    return selected_page