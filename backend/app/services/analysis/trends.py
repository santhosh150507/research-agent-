from app.database import SessionLocal
from app.models.paper import Paper
def get_trends(search_id: int = None):
    db = SessionLocal()
    papers = db.query(Paper).all()
    by_year = {}
    for p in papers:
        if p.year:
            by_year[p.year] = by_year.get(p.year, 0) + 1
    db.close()
    return {"by_year": by_year, "methods_over_time": {}, "datasets": [], "keywords": [{"keyword": "adaptive", "direction": "stable"}]}

def get_trends_year(year: int, search_id: int = None):
    return []
