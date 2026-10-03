from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.search_query import SearchQuery
from app.core.errors import AppException

def get_history(db: Session, user_id: int):
    queries = db.execute(
        select(SearchQuery).where(SearchQuery.user_id == user_id).order_by(SearchQuery.created_at.desc())
    ).scalars().all()
    
    items = []
    for q in queries:
        items.append({
            "search_id": q.id,
            "query": q.query,
            "created_at": q.created_at.isoformat(),
            "result_count": 0, # MOCK
            "saved_count": 0, # MOCK
            "related_topics": [] # MOCK
        })
    return {"items": items}

def get_history_item(db: Session, user_id: int, history_id: int):
    q = db.execute(select(SearchQuery).where(SearchQuery.id == history_id, SearchQuery.user_id == user_id)).scalar_one_or_none()
    if not q:
        raise AppException("History item not found", status_code=404)
        
    return {
        "search_id": q.id,
        "query": q.query,
        "created_at": q.created_at.isoformat(),
        "result_count": 0,
        "saved_count": 0,
        "related_topics": []
    }

def delete_history_item(db: Session, user_id: int, history_id: int):
    q = db.execute(select(SearchQuery).where(SearchQuery.id == history_id, SearchQuery.user_id == user_id)).scalar_one_or_none()
    if not q:
        raise AppException("History item not found", status_code=404)
    db.delete(q)
    db.commit()
