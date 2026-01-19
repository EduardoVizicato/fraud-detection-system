import numpy as np
import pandas as pd
from streamlit_app.data_layer.loaders import Artifacts

def answer_fallback(question: str, artifacts: Artifacts) -> str:
    q = question.lower().strip()

    df = artifacts.comparison_df
    if df is not None and "class" in df.columns:
        fraud = df[df["class"].isin([1, "1"])].copy()
    else:
        fraud = None

    if "qual modelo" in q or "recomenda" in q:
        if fraud is not None and not fraud.empty:
            fraud["precision"] = fraud["precision"].astype(float)
            fraud["recall"] = fraud["recall"].astype(float)
            if "f1_score" in fraud.columns:
                fraud["f1_score"] = fraud["f1_score"].astype(float)
                best = fraud.sort_values(["f1_score", "recall"], ascending=False).iloc[0]
                return (
                    f"Recomendação rápida: **{best['model']}**.\n\n"
                    f"- Precision (fraude): {best['precision']:.3f}\n"
                    f"- Recall (fraude): {best['recall']:.3f}\n"
                    f"- F1 (fraude): {best['f1_score']:.3f}\n"
                )
            best = fraud.sort_values(["recall"], ascending=False).iloc[0]
            return f"Modelo com maior recall na fraude: **{best['model']}** (recall={best['recall']:.3f})."

    if "kpi" in q or "tp" in q or "fp" in q or "fn" in q:
        if artifacts.kpis_df is not None and not artifacts.kpis_df.empty:
            row = artifacts.kpis_df.iloc[0].to_dict()
            return (
                "KPIs:\n"
                f"- TP={row.get('tp')} FP={row.get('fp')} FN={row.get('fn')} TN={row.get('tn')}\n"
                f"- Precision={float(row.get('precision', 0)):.3f}\n"
                f"- Recall={float(row.get('recall', 0)):.3f}"
            )

    if "top" in q or "alerta" in q:
        if artifacts.alerts_df is not None and not artifacts.alerts_df.empty:
            top = artifacts.alerts_df.sort_values("fraud_probability", ascending=False).head(10)
            return "Top 10 alertas:\n\n" + top.to_string(index=False)

    # fallback final
    return (
        "Não tenho LLM ativo agora, mas posso responder com base nos CSVs.\n"
        "Tente: 'qual modelo é melhor?', 'mostre KPIs', 'top alertas'."
    )
