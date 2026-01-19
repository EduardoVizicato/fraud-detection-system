from streamlit_app.data_layer.loaders import Artifacts

def build_context(artifacts: Artifacts) -> str:
    parts = []
    parts.append("PROJECT: Fraud Detection (Baseline vs Balanced) with Autid and Threshold tuning.")

    if artifacts.comparison_df is not None:
        parts.append("\nMODEL_COMPARISON:\n" + artifacts.comparison_df.to_string(index=False))

    if artifacts.kpis_df is not None and not artifacts.alerts_df.empty:
        parts.append("\nAUDIT_KPIS:\n" + artifacts.kpis_df.to_string(index=False))

    if artifacts.alerts_df is not None and not artifacts.alerts_df.empty:
        parts.append("\nTOP_ALERTS (20 firts):\n" + artifacts.alerts_df.head(20).to_string(index=False))
    
    for md in [artifacts.final_md, artifacts.audit_md, artifacts.ai_md]:
        if md.strip():
            parts.append("\nRELATORIO:\n" + md[:4000])
    
    return "\n".join(parts)