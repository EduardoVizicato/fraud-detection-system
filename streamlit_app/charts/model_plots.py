import streamlit as stream
import plotly.express as px
import plotly.graph_objects as go
from sklearn.metrics import precision_recall_curve
from streamlit_app.data_layer.loaders import Artifacts

def render_model_section(artifacts: Artifacts):
    stream.subheader("Models (Fraud Class)")

    if artifacts.kpis_df is not None and not artifacts.kpis_df.empty:
        row = artifacts.kpis_df.iloc[0].to_dict()
        a, b, c, d = stream.columns(4)
        a.metric("Total (tests)", int(row.get("total_causes", 0)))
        b.metric("Real frauds", int(row.get("true_fraud", 0)))
        c.metric("Alerts (pred=1)", int(row.get("predicted_fraud", 0)))
        d.metric("Recall", float(row.get("recall", 0.0)))
    else:
        stream.info("KPIs not found (`audit_kpis.csv`).")

    if artifacts.comparison_df is None:
        stream.warning("Not found `model_comparison_metrics.csv`.")
        return
    
    df = artifacts.comparison_df
    if "class" in df.columns:
        fraud = df[df["class"].isin([1, "1"])].copy()
    else:
        fraud = df.copy()
    
    for col in ["precision", "recall", "f1_score", "support"]:
        if col in fraud.columns:
            fraud[col] = fraud[col].astype(float)
    
    if fraud.empty:
        stream.info("There is no lines of fraud class to plot.")
        return
    
    fig = px.scatter(
        fraud, x="recall", y="precision",
        text= "model" if "model" in fraud.columns else None,
        hover_data=["f1_score", "support"] if "f1_score" in df.columns else None,
        title="Precision vs Recall (Fraud)"
    )
    fig.update_traces(textposition="top center")
    fig.update_layout(height=420)
    stream.plotly_chart(fig, use_container_width=True)


    if "f1_score" in fraud.columns and "model" in fraud.columns:
        fig2 = px.bar(fraud, x="model", y="f1_score", title="F1-score (Fraud) per Model")
        fig2.update_layout(height=320)
        stream.plotly_chart(fig2, use_container_width=True)

    stream.subheader("Precision-Recall Curve")
    if artifacts.baseline_npz is None and artifacts.balanced_npz is None:
        stream.info("Add `baseline_scores.npz` and `balanced_scores.npz` in `data/processed/` to see the PR Curve.")
        return

    pr_fig = go.Figure()

    def add_pr(npz, name: str):
        y_true = npz["y_test"].reshape(-1)
        y_proba = npz["y_proba"]
        if y_proba.ndim == 2:
            y_proba = y_proba[:, 1]
        y_proba = y_proba.reshape(-1)
        p, r, _ = precision_recall_curve(y_true, y_proba)
        pr_fig.add_trace(go.Scatter(x=r, y=p, mode="lines", name=name))
    
    if artifacts.baseline_npz is not None:
        add_pr(artifacts.baseline_npz, "Baseline")
    if artifacts.balanced_npz is not None:
        add_pr(artifacts.balanced_npz, "Balanced")

    pr_fig.update_layout(title="Precision-Recall Curve", xaxis_title="Recall", yaxis_title="Precision", height=420)
    stream.plotly_chart(pr_fig, use_container_width=True)