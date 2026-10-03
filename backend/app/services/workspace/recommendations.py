from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.paper import Paper

def get_recommendations(db: Session, user_id: int):
    # Mocking recommendations since we don't have a real recommendation engine setup here
    # Just return a few random papers
    papers = db.execute(select(Paper).limit(3)).scalars().all()
    
    items = []
    for p in papers:
        items.append({
            "paper": p,
            "reason": {
                "id": f"rec-{p.id}",
                "text": "Based on your recent search history in related topics.",
                "kind": "synthesis",
                "sources": []
            }
        })
    return {"items": items}
