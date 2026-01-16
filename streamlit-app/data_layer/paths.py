from dataclasses import dataclass

@dataclass(frozen=True)

class Paths:
    comparison_csv: str = "../data/processed/model_comparison_metrics.csv"
    kpis_csv: str = "../data/processed/audit_kpis.csv"
    alerts_csv: str = "../data/processed/top_alerts_50.csv"
    ai_md: str = "../data/processed/reports/ai_conclusions.md"
    audit_md: str = "../data/processed/reports/audit_report.md"
    final_md: str = "../data/processed/reports/final_report.md"
    baseline_npz: str = "../data/processed/reports/baseline_scores.npz"
    balanced_npz: str = "../data/processed/reports/balanced_scores.npz"
    balanced_metrics: str = "../data/processed/balanced_metrics.csv"
    baseline_metrics: str = "../data/processed/balanced_metrics.csv"
    fraud_cases: str = "../data/processed/fraud_cases.csv"
    final_summary: str = "../data/processed/final_summary.csv"
    threshold_summary: str = "../data/processed/threshold_summary.csv"
    feature_importance_logred: str = "../data/processed/feature_importance_logred.csv" 
