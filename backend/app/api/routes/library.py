from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.services.workspace import library
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class SavePaperRequest(BaseModel):
    paper_id: int
    tags: Optional[list[str]] = None
    collection_id: Optional[int] = None

class UpdateSavedPaperRequest(BaseModel):
    status: Optional[str] = None
    bookmarked: Optional[bool] = None
    tags: Optional[list[str]] = None

@router.get("/library")
def get_library(
    status: Optional[str] = None,
    tag: Optional[str] = None,
    collection_id: Optional[int] = None,
    bookmarked: Optional[bool] = None,
    q: Optional[str] = None,
    db: Session = Depends(get_db),
    user = Depends(get_current_user)
):
    return library.get_library(db, user.id, status, tag, collection_id, bookmarked, q)

@router.post("/library/papers")
def add_lib_paper(req: SavePaperRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return library.save_paper(db, user.id, req.paper_id, req.tags, req.collection_id)

@router.patch("/library/papers/{paper_id}")
def upd_lib_paper(paper_id: int, req: UpdateSavedPaperRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return library.update_saved_paper(db, user.id, paper_id, req.status, req.bookmarked, req.tags)

@router.delete("/library/papers/{paper_id}", status_code=204)
def del_lib_paper(paper_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    library.delete_saved_paper(db, user.id, paper_id)
