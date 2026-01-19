import streamlit as stream
import plotly.express as px
from streamlit_app.data_layer.loaders import Artifacts

def render_audit_section(artifacts: Artifacts):
    stream.subheader("Alerts and Audit")

    if artifacts.alerts_df in None or artifacts.alerts_df.empty:
        stream.info("Not found `top_alerts_50.csv` in `data/processed`.")
        return
    
    alerts = artifacts.alerts_df.copy()
    if "fraud_probability" in alerts.columns:
        alerts["fraud_probability"] = alerts["fraud_probability"].astype(float)

    c1, c2 = stream.columns([0.6, 0.4])

    with c1:
        stream.markdown("### Top alerts")
        cols = [ c for c in ["fraud_probability", "y_true", "y_pred", "outcome", "test_index"] if c in alerts.columns]
        stream.dataframe(alerts[cols].head(25) if cols else alerts.head(25), use_container_width=True, height=340)

    with c2:
        stream.markdown("### Distribution of probabilities")
        if "fraud_probability" in alerts.columns:
            fig = px.histogram(alerts, x="fraud_probability", nbins=30, title="Probabilities (alerts)")
            fig.update_layout(height=340)
            stream.plotly_chart(fig, use_container_width=True)
        else:
            stream.info("Column `fraud_probability` not found in `top_alerts_50.csv`")