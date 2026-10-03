from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.note import Note
from app.models.annotation import Annotation
from app.core.errors import AppException

# ---- Notes ----

def get_notes(db: Session, user_id: int, paper_id: int):
    notes = db.execute(select(Note).where(Note.user_id == user_id, Note.paper_id == paper_id)).scalars().all()
    return [{"id": n.id, "paper_id": n.paper_id, "body": n.body, "created_at": n.created_at.isoformat()} for n in notes]

def create_note(db: Session, user_id: int, paper_id: int, body: str):
    note = Note(user_id=user_id, paper_id=paper_id, body=body)
    db.add(note)
    db.commit()
    db.refresh(note)
    return {"id": note.id, "paper_id": note.paper_id, "body": note.body, "created_at": note.created_at.isoformat()}

def update_note(db: Session, user_id: int, note_id: int, body: str):
    note = db.execute(select(Note).where(Note.id == note_id, Note.user_id == user_id)).scalar_one_or_none()
    if not note:
        raise AppException("Note not found", status_code=404)
    note.body = body
    db.commit()
    db.refresh(note)
    return {"id": note.id, "paper_id": note.paper_id, "body": note.body, "created_at": note.created_at.isoformat()}

def delete_note(db: Session, user_id: int, note_id: int):
    note = db.execute(select(Note).where(Note.id == note_id, Note.user_id == user_id)).scalar_one_or_none()
    if not note:
        raise AppException("Note not found", status_code=404)
    db.delete(note)
    db.commit()

# ---- Annotations ----

def get_annotations(db: Session, user_id: int, paper_id: int):
    anns = db.execute(select(Annotation).where(Annotation.user_id == user_id, Annotation.paper_id == paper_id)).scalars().all()
    return [
        {
            "id": a.id,
            "paper_id": a.paper_id,
            "section": a.section,
            "page": a.page,
            "text_selection": a.text_selection,
            "comment": a.comment
        }
        for a in anns
    ]

def create_annotation(db: Session, user_id: int, paper_id: int, section: str = None, page: int = None, text_selection: str = None, comment: str = ""):
    ann = Annotation(
        user_id=user_id,
        paper_id=paper_id,
        section=section,
        page=page,
        text_selection=text_selection,
        comment=comment
    )
    db.add(ann)
    db.commit()
    db.refresh(ann)
    return {
        "id": ann.id,
        "paper_id": ann.paper_id,
        "section": ann.section,
        "page": ann.page,
        "text_selection": ann.text_selection,
        "comment": ann.comment
    }

def update_annotation(db: Session, user_id: int, annotation_id: int, section: str = None, page: int = None, text_selection: str = None, comment: str = None):
    ann = db.execute(select(Annotation).where(Annotation.id == annotation_id, Annotation.user_id == user_id)).scalar_one_or_none()
    if not ann:
        raise AppException("Annotation not found", status_code=404)
        
    if section is not None:
        ann.section = section
    if page is not None:
        ann.page = page
    if text_selection is not None:
        ann.text_selection = text_selection
    if comment is not None:
        ann.comment = comment
        
    db.commit()
    db.refresh(ann)
    
    return {
        "id": ann.id,
        "paper_id": ann.paper_id,
        "section": ann.section,
        "page": ann.page,
        "text_selection": ann.text_selection,
        "comment": ann.comment
    }

def delete_annotation(db: Session, user_id: int, annotation_id: int):
    ann = db.execute(select(Annotation).where(Annotation.id == annotation_id, Annotation.user_id == user_id)).scalar_one_or_none()
    if not ann:
        raise AppException("Annotation not found", status_code=404)
    db.delete(ann)
    db.commit()
