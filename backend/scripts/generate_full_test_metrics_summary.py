import json
from pathlib import Path
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    confusion_matrix,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
)
from sklearn.preprocessing import StandardScaler

REPO_ROOT = Path(__file__).resolve().parents[1]  # backend/
RAW_PATH = REPO_ROOT / "data" / "raw" / "creditcard.csv"
OUT_PATH = REPO_ROOT / "data" / "processed" / "full_test_metrics.json"


def summarize_model(name, model, X, y, scaler=None):
    if scaler is not None:
        X_proc = scaler.transform(X)
    else:
        X_proc = X

    model.fit(X_proc, y)
    y_pred = model.predict(X_proc)
    y_proba = model.predict_proba(X_proc)[:, 1] if hasattr(model, "predict_proba") else None

    tn, fp, fn, tp = confusion_matrix(y, y_pred).ravel()
    precision = float(precision_score(y, y_pred, zero_division=0))
    recall = float(recall_score(y, y_pred, zero_division=0))
    f1 = float(f1_score(y, y_pred, zero_division=0))
    auc = float(roc_auc_score(y, y_proba)) if y_proba is not None else None

    return {
        "model": name,
        "predicted_fraud": int(y_pred.sum()),
        "tp": int(tp),
        "fp": int(fp),
        "fn": int(fn),
        "tn": int(tn),
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "roc_auc": auc,
    }


def main():
    if not RAW_PATH.exists():
        raise FileNotFoundError(f"creditcard.csv not found: {RAW_PATH}")

    df = pd.read_csv(RAW_PATH)
    total_cases = int(len(df))
    true_fraud = int(df["Class"].sum())

    X = df.drop(["Time", "Class"], axis=1)
    y = df["Class"].astype(int)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    models = [
        ("LogisticRegression", LogisticRegression(max_iter=1000, random_state=42)),
        ("RandomForest", RandomForestClassifier(n_estimators=100, random_state=42)),
    ]

    results = {}
    for name, mdl in models:
        results[name] = summarize_model(name, mdl, X_scaled, y, scaler=None)  # X_scaled already scaled

    summary = {
        "timestamp": pd.Timestamp.now().isoformat(),
        "total_cases": total_cases,
        "true_fraud": true_fraud,
        "models": results,
    }

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print(f"Wrote summary to {OUT_PATH}")


if __name__ == "__main__":
    main()