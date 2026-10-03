from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.services.workspace import notes
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class CreateNoteRequest(BaseModel):
    body: str

class UpdateNoteRequest(BaseModel):
    body: str

class CreateAnnotationRequest(BaseModel):
    section: Optional[str] = None
    page: Optional[int] = None
    text_selection: Optional[str] = None
    comment: str

class UpdateAnnotationRequest(BaseModel):
    section: Optional[str] = None
    page: Optional[int] = None
    text_selection: Optional[str] = None
    comment: Optional[str] = None

@router.get("/papers/{paper_id}/notes")
def get_notes(paper_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return notes.get_notes(db, user.id, paper_id)

@router.post("/papers/{paper_id}/notes")
def create_note(paper_id: int, req: CreateNoteRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return notes.create_note(db, user.id, paper_id, req.body)

@router.patch("/notes/{note_id}")
def update_note(note_id: int, req: UpdateNoteRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return notes.update_note(db, user.id, note_id, req.body)

@router.delete("/notes/{note_id}", status_code=204)
def delete_note(note_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    notes.delete_note(db, user.id, note_id)

@router.get("/papers/{paper_id}/annotations")
def get_annotations(paper_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return notes.get_annotations(db, user.id, paper_id)

@router.post("/papers/{paper_id}/annotations")
def create_annotation(paper_id: int, req: CreateAnnotationRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return notes.create_annotation(db, user.id, paper_id, req.section, req.page, req.text_selection, req.comment)

@router.patch("/annotations/{annotation_id}")
def update_annotation(annotation_id: int, req: UpdateAnnotationRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return notes.update_annotation(db, user.id, annotation_id, req.section, req.page, req.text_selection, req.comment)

@router.delete("/annotations/{annotation_id}", status_code=204)
def delete_annotation(annotation_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    notes.delete_annotation(db, user.id, annotation_id)
