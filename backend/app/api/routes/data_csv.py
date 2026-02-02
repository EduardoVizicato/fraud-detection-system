import json
from pathlib import Path
import os
import pandas as pd
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Query

load_dotenv()  # ✅ agora carrega o .env

router = APIRouter(prefix="/data", tags=["data"])

BACKEND_ROOT = Path(__file__).resolve().parents[3]

_raw = (os.getenv("DATA_ROOT") or "data").strip()
DATA_ROOT = (BACKEND_ROOT / _raw).resolve() if not Path(_raw).is_absolute() else Path(_raw).resolve()

def safe_resolve(rel_path: str) -> Path:
    p = (DATA_ROOT / rel_path).resolve()
    if DATA_ROOT not in p.parents and p != DATA_ROOT:
        raise HTTPException(status_code=400, detail="Invalid Path.")
    return p

@router.get("/csv-files")
def list_csv_files(subdir: str = Query("processed", description="ex: processed")):
    base = safe_resolve(subdir)
    if not base.exists() or not base.is_dir():
        raise HTTPException(status_code=400, detail=f"Folder not found: {base}")

    files = [str(p.relative_to(DATA_ROOT)).replace("\\", "/") for p in sorted(base.rglob("*.csv"))]
    return {"data_root": str(DATA_ROOT), "files": files}

@router.get("/csv")
def read_csv(
    rel_path: str = Query(..., description="ex: processed/audit_kpis.csv"),
    offset: int = Query(0, ge=0),
    limit: int = Query(500, ge=1, le=5000),
):
    p = safe_resolve(rel_path)
    if not p.exists() or not p.is_file() or p.suffix.lower() != ".csv":
        raise HTTPException(status_code=404, detail=f"CSV not found: {p}")

    df = pd.read_csv(p)
    total = len(df)
    page = df.iloc[offset : offset + limit]

    return {
        "file": rel_path,
        "columns": list(df.columns),
        "total_rows": total,
        "offset": offset,
        "limit": limit,
        "rows": page.to_dict(orient="records"),
    }

@router.get("/full-test-metrics")
def get_full_test_metrics():
    path = DATA_ROOT / "processed" / "full_test_metrics.json"
    if not path.exists():
        return {"error": f"Arquivo não encontrado em {path}"}
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data