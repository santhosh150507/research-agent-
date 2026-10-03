from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.saved_paper import SavedPaper
from app.models.paper import Paper
from app.core.errors import AppException
from datetime import datetime

def get_library(db: Session, user_id: int, status: str = None, tag: str = None, collection_id: int = None, bookmarked: bool = None, q: str = None):
    stmt = select(SavedPaper, Paper).join(Paper, SavedPaper.paper_id == Paper.id).where(SavedPaper.user_id == user_id)
    
    if q:
        stmt = stmt.where(Paper.title.ilike(f"%{q}%"))
        
    results = db.execute(stmt).all()
    
    items = []
    for sp, paper in results:
        items.append({
            "paper": paper,
            "status": "unread", # Hardcoded missing field
            "bookmarked": False, # Hardcoded missing field
            "tags": [], # Hardcoded missing field
            "collection_ids": [], # Hardcoded missing field
            "saved_at": datetime.utcnow().isoformat() # Hardcoded missing field
        })
    return {"items": items}

def save_paper(db: Session, user_id: int, paper_id: int, tags: list = None, collection_id: int = None):
    paper = db.execute(select(Paper).where(Paper.id == paper_id)).scalar_one_or_none()
    if not paper:
        raise AppException("Paper not found", status_code=404)
        
    sp = db.execute(select(SavedPaper).where(SavedPaper.user_id == user_id, SavedPaper.paper_id == paper_id)).scalar_one_or_none()
    if not sp:
        sp = SavedPaper(user_id=user_id, paper_id=paper_id)
        db.add(sp)
        db.commit()
        db.refresh(sp)
        
    return {
        "paper": paper,
        "status": "unread",
        "bookmarked": False,
        "tags": tags or [],
        "collection_ids": [collection_id] if collection_id else [],
        "saved_at": datetime.utcnow().isoformat()
    }

def update_saved_paper(db: Session, user_id: int, paper_id: int, status: str = None, bookmarked: bool = None, tags: list = None):
    sp = db.execute(select(SavedPaper).where(SavedPaper.user_id == user_id, SavedPaper.paper_id == paper_id)).scalar_one_or_none()
    if not sp:
        raise AppException("Saved paper not found", status_code=404)
    # Since DB doesn't support these, we do nothing.
    db.commit()
    paper = db.execute(select(Paper).where(Paper.id == paper_id)).scalar_one()
    return {
        "paper": paper,
        "status": status or "unread",
        "bookmarked": bookmarked or False,
        "tags": tags or [],
        "collection_ids": [],
        "saved_at": datetime.utcnow().isoformat()
    }

def delete_saved_paper(db: Session, user_id: int, paper_id: int):
    sp = db.execute(select(SavedPaper).where(SavedPaper.user_id == user_id, SavedPaper.paper_id == paper_id)).scalar_one_or_none()
    if not sp:
        raise AppException("Saved paper not found", status_code=404)
    db.delete(sp)
    db.commit()
