from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from app.services.data_service import (
    list_tree, read_csv, npz_keys, npz_preview, safe_resolve
)
from app.core.config import ALLOWED_EXTS

router = APIRouter(prefix="/data", tags=["data"])


@router.get("/tree")
def tree(
    subdir: str = Query("", description="ex: processed"),
    exts: str | None = Query(None, description="ex: csv,npz")
):
    try:
        ext_list = [e.strip() for e in exts.split(",")] if exts else None
        return list_tree(subdir=subdir, exts=ext_list)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/csv")
def csv(rel_path: str, offset: int = 0, limit: int = 200):
    try:
        return read_csv(rel_path=rel_path, offset=offset, limit=limit)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/npz/keys")
def keys(rel_path: str):
    try:
        return npz_keys(rel_path=rel_path)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/npz/preview")
def preview(rel_path: str, key: str, start: int = 0, stop: int = 200):
    try:
        return npz_preview(rel_path=rel_path, key=key, start=start, stop=stop)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/download")
def download(rel_path: str):
    try:
        p = safe_resolve(rel_path)
        if not p.exists() or not p.is_file():
            raise HTTPException(status_code=404, detail="Arquivo não encontrado.")
        if p.suffix.lower() not in ALLOWED_EXTS:
            raise HTTPException(status_code=400, detail="Extensão não permitida.")
        return FileResponse(str(p), filename=p.name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
