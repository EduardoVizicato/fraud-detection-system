from __future__ import annotations
from dataclasses import dataclass
from typing import Optional
import numpy as np
import pandas as pd
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
    baseline_metrics: Optional[pd.DataFrame]
    balanced_metrics: Optional[pd.DataFrame]
    fraud_cases: Optional[pd.DataFrame]
    final_summary: Optional[pd.DataFrame]
    threshold_summary: Optional[pd.DataFrame]
    feature_importance_logreg: Optional[pd.DataFrame]