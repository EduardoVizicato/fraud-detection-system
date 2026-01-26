from pathlib import Path
import os
import pandas as pd
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Query

load_dotenv

router = APIRouter(prefix="/data", tags=["data"])

DATA_ROOT = Path(os.getenv("DATA_ROOT", "backend/data")).resolve()

def safe_resolve(rel_path: str) -> Path:
    p = (DATA_ROOT/rel_path).resolve()
    if DATA_ROOT not in p.parent and p != DATA_ROOT:
        raise HTTPException(status_code=400, detail="Invalid Path")
    return p

@router.get("/csv-files")
def list_csv_files(subdir: str = Query("", description="ex: processed")):
    base = safe_resolve(subdir) if subdir else DATA_ROOT
    if not base.exists() or not base.is_dir():
        raise HTTPException(status_code=400, detail="folder not found")

    files = []
    for p in sorted(base.glob("*.csv")):
        files.append(str(p.relative_to(DATA_ROOT)).replace("\\", "/"))
    return {"data_root": str(DATA_ROOT), "files": files}

@router.get("/csv")
def read_csv(rel_path: str = Query(..., description="ex: processed/audit_kpis.csv"), offset: int = Query(0, ge=0), limit: int = Query(500, ge=1, le=5000),):
    p = safe_resolve(rel_path)
    if not p.exists() or not p.is_file() or p.suffix.lower() != ".csv":
        raise HTTPException(status_code=404, detail="CSV não encontrado.")

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