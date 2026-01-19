from dataclasses import dataclass
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]

print(PROJECT_ROOT)

@dataclass(frozen=True)
class Paths:
    comparison_csv: str = str(PROJECT_ROOT / "data" / "processed" / "model_comparison_metrics.csv")
    kpis_csv: str = str(PROJECT_ROOT / "data" / "processed" / "audit_kpis.csv")
    alerts_csv: str = str(PROJECT_ROOT / "data" / "processed" / "top_alerts_50.csv")
    ai_md: str = str(PROJECT_ROOT / "data" / "processed" / "reports" / "ai_conclusions.md")
    audit_md: str = str(PROJECT_ROOT / "data" / "processed" / "reports" / "audit_report.md")
    final_md: str = str(PROJECT_ROOT / "data" / "processed" / "reports" / "final_report.md")
    baseline_npz: str = str(PROJECT_ROOT / "data" / "processed" / "baseline_scores.npz")
    balanced_npz: str = str(PROJECT_ROOT / "data" / "processed" / "balanced_scores.npz")
    balanced_csv: str = str(PROJECT_ROOT / "data" / "processed" / "balanced_metrics.csv")
    baseline_csv: str = str(PROJECT_ROOT / "data" / "processed" / "baseline_metrics.csv")
    fraud_cases_csv: str = str(PROJECT_ROOT / "data" / "processed" / "fraud_cases.csv")
    final_summary_csv: str = str(PROJECT_ROOT / "data" / "processed" / "final_summary.csv")
    threshold_summary_csv: str = str(PROJECT_ROOT / "data" / "processed" / "threshold_summary.csv")
    feature_importance_logreg_csv: str = str(PROJECT_ROOT / "data" / "processed" / "feature_importance_logreg.csv")
