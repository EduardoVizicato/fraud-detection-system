import sys
import json
from pathlib import Path
from math import isclose

import requests

BACKEND_ROOT = Path(__file__).resolve().parents[1]  # ...\backend
LOCAL_PATH = BACKEND_ROOT / "data" / "processed" / "full_test_metrics.json"
URL = "http://localhost:8000/data/full-test-metrics"

def load_local(path: Path):
    if not path.exists():
        print(f"ERROR: local file not found: {path}")
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"ERROR: failed to read/parse local file: {e}")
        return None

def fetch_remote(url: str):
    try:
        r = requests.get(url, timeout=10)
    except Exception as e:
        print(f"ERROR: request failed: {e}")
        return None, None
    return r.status_code, r.json() if r.headers.get("content-type","").startswith("application/json") else r.text

def compare_json(a, b):
    if type(a) != type(b):
        return False, "type-mismatch"
    if isinstance(a, dict):
        for k in a:
            if k not in b:
                return False, f"missing-key:{k}"
            ok, msg = compare_json(a[k], b[k])
            if not ok:
                return False, f"{k}.{msg}"
        return True, "ok"
    if isinstance(a, list):
        if len(a) != len(b):
            return False, f"list-len {len(a)} != {len(b)}"
        for i, (ai, bi) in enumerate(zip(a, b)):
            ok, msg = compare_json(ai, bi)
            if not ok:
                return False, f"[{i}].{msg}"
        return True, "ok"
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return isclose(float(a), float(b), rel_tol=1e-6, abs_tol=1e-9), "num-compare"
    return a == b, "eq-compare"

def main():
    local = load_local(LOCAL_PATH)
    if local is None:
        sys.exit(2)

    status, remote = fetch_remote(URL)
    if status is None:
        sys.exit(3)

    if status != 200:
        print(f"ERROR: remote responded with status {status}")
        print("Remote body:", remote)
        sys.exit(4)

    ok, msg = compare_json(local, remote)
    if ok:
        print("OK: remote JSON matches local file")
        sys.exit(0)
    else:
        print("MISMATCH:", msg)
        print("Sample local keys:", list(local.keys())[:10])
        print("Sample remote keys:", list(remote.keys())[:10] if isinstance(remote, dict) else type(remote))
        sys.exit(5)

if __name__ == "__main__":
    main()