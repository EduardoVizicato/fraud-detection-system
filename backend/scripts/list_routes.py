import sys
from pathlib import Path

# garante que a pasta backend esteja no sys.path
REPO_BACKEND = Path(__file__).resolve().parents[1]  # ...\backend
sys.path.insert(0, str(REPO_BACKEND))

from app.main import app

for r in app.router.routes:
    try:
        print(r.path)
    except Exception:
        pass