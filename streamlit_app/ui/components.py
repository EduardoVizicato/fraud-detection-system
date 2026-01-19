import streamlit as stream
from streamlit_app.data_layer.loaders import Artifacts

def render_reports(artifacts: Artifacts):
    stream.subheader("Reports and artifacts")

    c1, c2, c3 = stream.columns(3)

    with c1:
        stream.markdown("### 📌 Final report")
        if artifacts.final_md.strip():
            stream.download_button("Download final_report.md", artifacts.final_md, file_name="final_report.md")
            stream.text_area("Preview", artifacts.final_md, height=280)
        else:
            stream.info("Not found `data/processed/final_report.md`.")
    
    with c2: 
        stream.markdown("### ✅Audit")
        if artifacts.audit_md.strip():
            stream.download_button("Download audit_report.md", artifacts.audit_md, file_name="audit_report.md")
            stream.text_area("Preview", artifacts.audit_md, height=280)
        else:
            stream.info("Not found `data/processed/audit_report.md`.")
    
    with c3:
        stream.markdown("### 🤖 IA Conclusions")
        if artifacts.ai_md.strip():
            stream.download_button("Download ai_conclusions.md", artifacts.ai_md, file_name="ai_conclusion.md")
            stream.text_area("Preview", artifacts.ai_md, height=280)
        else:
            stream.info("Not found `data/processed/ai_conclusions`.")