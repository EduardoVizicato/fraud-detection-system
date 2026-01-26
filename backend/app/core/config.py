import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

DATA_ROOT = Path(os.getenv("DATA_ROOT", "./data")).resolve()

ALLOWED_EXTS = {".csv", ".npz", ".md", ".json", ".txt", ".png", ".jpg", ".jpeg", ".webp"}

MAX_CSV_ROWS = int(os.getenv("MAX_CSV_ROWS", "5000"))
MAX_NPZ_PREVIEW_ELEMENTS = int(os.getenv("MAX_NPZ_PREVIEW_ELEMENTS", "20000"))
