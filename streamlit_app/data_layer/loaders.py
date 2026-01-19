from __future__ import annotations
from dataclasses import dataclass
from typing import Optional
import os
import pandas as pd
import numpy as np
import streamlit as stream
from.paths import Paths

@dataclass
class Artifacts:
    comparison_df: Optional[pd.DataFrame]
    kpis_df: Optional[pd.DataFrame]
    alerts_df: Optional[pd.DataFrame]
    ai_md: str
    audit_md: str
    final_md: str
    baseline_npz: Optional[np.lib.npyio.NpzFile]
    balanced_npz: Optional[np.lib.npyio.NpzFile]
    baseline_df: Optional[pd.DataFrame]
    balanced_df: Optional[pd.DataFrame]
    fraud_cases_df: Optional[pd.DataFrame]
    final_summary_df: Optional[pd.DataFrame]
    threshold_summary_df: Optional[pd.DataFrame]
    feature_importance_logreg_df: Optional[pd.DataFrame]

def load_md(path: str) -> str:
    if not os.path.exists(path):
        return ""
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def normalize_df(df: pd.DataFrame) -> pd.DataFrame:
    if "Unnmade: 0" in df.columns and "class" not in df.columns:
        df = df.rename(columns={"Unnmed: 0": "class"})
    df.columns = df.columns.str.replace("-", "_")
    return df

def load_csv(path: str) -> Optional[pd.DataFrame]:
    if not os.path.exists(path):
        return None
    df = pd.read_csv(path)
    return normalize_df(df)

def load_npz(path: str):
    if not os.path.exists(path):
        return None
    return np.load(path)

@stream.cache_data(show_spinner=False)
def load_artifacts() -> Artifacts:
    p = Paths()
    return Artifacts(
        comparison_df= load_csv(p.comparison_csv),
        kpis_df= load_csv(p.kpis_csv),
        alerts_df= load_csv(p.alerts_csv),
        ai_md= load_md(p.ai_md),
        audit_md= load_md(p.audit_md),
        final_md= load_md(p.final_md),
        baseline_npz= load_npz(p.baseline_npz),
        balanced_npz= load_npz(p.balanced_npz),
        baseline_df= load_csv(p.baseline_csv),
        balanced_df= load_csv(p.balanced_csv),
        fraud_cases_df= load_csv(p.fraud_cases_csv),
        final_summary_df= load_csv(p.final_summary_csv),
        threshold_summary_df= load_csv(p.threshold_summary_csv),
        feature_importance_logreg_df= load_csv(p.feature_importance_logred_csv)
    )