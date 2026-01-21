import plotly.express as px
import plotly.graph_objects as go
from sklearn.metrics import precision_recall_curve
from streamlit_app.data_layer.loaders import Artifacts
import streamlit as stream
import numpy as np
import matplotlib.pyplot as plt


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
        text="model" if "model" in fraud.columns else None,
        hover_data=["f1_score", "support"] if "f1_score" in df.columns else None,
        title="Precision vs Recall (Fraud)"
    )
    fig.update_traces(textposition="top center")
    fig.update_layout(height=420)

    # FIX 1: Added unique key here
    stream.plotly_chart(fig, use_container_width=True, key="pr_scatter_plot")

    if "f1_score" in fraud.columns and "model" in fraud.columns:
        fig2 = px.bar(fraud, x="model", y="f1_score", title="F1-score (Fraud) per Model")
        fig2.update_layout(height=320)

        # FIX 2: Added unique key here
        stream.plotly_chart(fig2, use_container_width=True, key="f1_bar_chart")

    stream.subheader("Precision-Recall Curve")
    if artifacts.baseline_npz is None and artifacts.balanced_npz is None:
        stream.info("Add `baseline_scores.npz` and `balanced_scores.npz` in `data/processed/` to see the PR Curve.")
        return

    pr_fig = go.Figure()

    # Helper function with debugging and checks included
    def add_pr(npz_data, label):
        if isinstance(npz_data, str):
            data = np.load(npz_data)
        else:
            data = npz_data

        try:
            if 'y_true' in data:
                y_true = data['y_true']
            elif 'y_test' in data:
                y_true = data['y_test']
            else:
                stream.error(f"Keys found in {label}: {list(data.keys())}")
                return

            if 'y_proba' in data:
                y_proba = data['y_proba']
            elif 'y_pred' in data:
                y_proba = data['y_pred']
            else:
                stream.error(f"Keys found in {label}: {list(data.keys())}")
                return

        except Exception as e:
            stream.error(f"Error reading .npz for {label}: {e}")
            return

        # Debug info
        stream.write(f"--- Debug Info for {label} ---")
        stream.write(f"y_true shape: {np.shape(y_true)}")
        stream.write(f"y_proba shape: {np.shape(y_proba)}")

        if np.ndim(y_proba) == 0 or (np.ndim(y_proba) == 1 and len(y_proba) == 1):
            stream.error(f" CRITICAL: {label} probability data is a single number. Check training script.")
            return

        try:
            p, r, _ = precision_recall_curve(y_true, y_proba)
            plt.plot(r, p, label=label)
        except ValueError as e:
            stream.error(f"Sklearn Error for {label}: {e}")

    # Plotting using Matplotlib
    fig_mpl = plt.figure(figsize=(10, 6))

    if hasattr(artifacts, 'baseline_npz'):
        add_pr(artifacts.baseline_npz, "Baseline")

    if hasattr(artifacts, 'challenger_npz'):
        add_pr(artifacts.challenger_npz, "Challenger")

    plt.xlabel("Recall")
    plt.ylabel("Precision")
    plt.legend()
    stream.pyplot(fig_mpl)