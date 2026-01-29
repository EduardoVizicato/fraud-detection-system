from pathlib import Path
import csv
import asyncio
import heapq
from collections import OrderedDict
from time import time as now
import json
from typing import Any, Dict, List, Optional
import numpy as np
import pandas as pd

from app.core.config import DATA_ROOT, ALLOWED_EXTS, MAX_CSV_ROWS, MAX_NPZ_PREVIEW_ELEMENTS


def safe_resolve(rel_path: str) -> Path:
    """Impede ../ (path traversal) e restringe tudo ao DATA_ROOT."""
    p = (DATA_ROOT / rel_path).resolve()
    if DATA_ROOT not in p.parents and p != DATA_ROOT:
        raise ValueError("Caminho inválido (fora de DATA_ROOT).")
    return p


def list_tree(subdir: str = "", exts: Optional[List[str]] = None) -> Dict[str, Any]:
    base = safe_resolve(subdir) if subdir else DATA_ROOT
    if not base.exists() or not base.is_dir():
        raise FileNotFoundError("Pasta não encontrada.")

    ext_filter = None
    if exts:
        ext_filter = {("." + e.lower().lstrip(".")) for e in exts}

    folders = []
    files = []

    for item in sorted(base.iterdir(), key=lambda x: (not x.is_dir(), x.name.lower())):
        if item.is_dir():
            folders.append(str(item.relative_to(DATA_ROOT)))
            continue

        ext = item.suffix.lower()
        if ext_filter and ext not in ext_filter:
            continue
        if ext not in ALLOWED_EXTS:
            continue

        st = item.stat()
        files.append({
            "name": item.name,
            "rel": str(item.relative_to(DATA_ROOT)),
            "ext": ext,
            "size_bytes": st.st_size,
            "modified_ts": int(st.st_mtime),
        })

    return {"data_root": str(DATA_ROOT), "subdir": str(base.relative_to(DATA_ROOT)), "folders": folders, "files": files}


def read_csv(rel_path: str, offset: int = 0, limit: int = 200) -> Dict[str, Any]:
    p = safe_resolve(rel_path)
    if not p.exists() or p.suffix.lower() != ".csv":
        raise FileNotFoundError("CSV não encontrado.")

    if limit > MAX_CSV_ROWS:
        limit = MAX_CSV_ROWS

    df = pd.read_csv(p)
    total = len(df)
    page = df.iloc[offset: offset + limit]

    return {
        "meta": {"name": p.name, "rel": rel_path},
        "columns": list(df.columns),
        "total_rows": total,
        "offset": offset,
        "limit": limit,
        "rows": page.to_dict(orient="records"),
    }


def npz_keys(rel_path: str) -> Dict[str, Any]:
    p = safe_resolve(rel_path)
    if not p.exists() or p.suffix.lower() != ".npz":
        raise FileNotFoundError("NPZ não encontrado.")

    with np.load(p, allow_pickle=False) as z:
        return {"meta": {"name": p.name, "rel": rel_path}, "keys": list(z.keys())}


def npz_preview(rel_path: str, key: str, start: int = 0, stop: int = 200) -> Dict[str, Any]:
    p = safe_resolve(rel_path)
    if not p.exists() or p.suffix.lower() != ".npz":
        raise FileNotFoundError("NPZ não encontrado.")

    with np.load(p, allow_pickle=False) as z:
        if key not in z:
            raise KeyError("Key não encontrada no NPZ.")
        a = z[key]

        if a.ndim == 1:
            sl = a[start:stop]
        elif a.ndim == 2:
            sl = a[start:stop, :]
        else:
            flat = a.reshape(-1)
            sl = flat[start:min(stop, flat.size)]

        if sl.size > MAX_NPZ_PREVIEW_ELEMENTS:
            sl = sl.reshape(-1)[:MAX_NPZ_PREVIEW_ELEMENTS]

        stats = {}
        if np.issubdtype(sl.dtype, np.number) and sl.size > 0:
            stats = {
                "min": float(np.nanmin(sl)),
                "max": float(np.nanmax(sl)),
                "mean": float(np.nanmean(sl)),
            }

        return {
            "meta": {"name": p.name, "rel": rel_path},
            "key": key,
            "dtype": str(a.dtype),
            "shape": list(a.shape),
            "slice": {"start": start, "stop": stop, "returned": int(sl.size)},
            "stats": stats,
            "data": sl.tolist(),
        }


async def stream_metrics(
    csv_path: str | None = None,
    interval_ms: int = 50,
    window_minutes: int = 60,
    top_n: int = 5,
    save_every_ms: int = 1000,
):
    path = Path(csv_path) if csv_path else (
        Path(__file__).resolve().parents[2] / "data" / "raw" / "creditcard.csv"
    )

    total = 0
    fraud_total = 0
    amount_sum = 0.0
    minute_counts: "OrderedDict[int, int]" = OrderedDict()
    top_heap: list[tuple[float, dict]] = []
    last_save = 0.0
    snapshot_path = Path(__file__).resolve().parents[2] / "data" / "processed" / "realtime_metrics.json"

    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            total += 1
            amount = float(row.get("Amount", 0) or 0)
            amount_sum += amount
            label = int(float(row.get("Class", 0) or 0))
            t = float(row.get("Time", 0) or 0)
            minute = int(t // 60)

            if minute not in minute_counts:
                minute_counts[minute] = 0

            if label == 1:
                fraud_total += 1
                minute_counts[minute] += 1

                alert = {"time": t, "amount": amount, "class": label}
                if len(top_heap) < top_n:
                    heapq.heappush(top_heap, (amount, alert))
                else:
                    if amount > top_heap[0][0]:
                        heapq.heapreplace(top_heap, (amount, alert))

            while len(minute_counts) > 0:
                oldest_minute = next(iter(minute_counts))
                if minute - oldest_minute >= window_minutes:
                    minute_counts.popitem(last=False)
                else:
                    break

            payload = {
                "type": "metrics",
                "timestamp": now(),
                "fraudCountByMinute": [
                    {"minute": m, "count": c} for m, c in minute_counts.items()
                ],
                "avgAmount": amount_sum / total if total else 0,
                "fraudRate": fraud_total / total if total else 0,
                "topAlerts": sorted(
                    [item for _, item in top_heap],
                    key=lambda x: x["amount"],
                    reverse=True,
                ),
            }

            if (payload["timestamp"] - last_save) * 1000 >= save_every_ms:
                snapshot_path.write_text(json.dumps(payload, ensure_ascii=False))
                last_save = payload["timestamp"]

            yield payload
            await asyncio.sleep(interval_ms / 1000)
