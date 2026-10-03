from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models.saved_paper import SavedPaper
from app.models.paper import Paper
from app.models.search_query import SearchQuery

def get_dashboard(db: Session, user_id: int):
    # recent papers
    recent_papers_query = (
        select(Paper)
        .join(SavedPaper, SavedPaper.paper_id == Paper.id)
        .where(SavedPaper.user_id == user_id)
        .order_by(SavedPaper.id.desc())
        .limit(5)
    )
    recent_papers = db.execute(recent_papers_query).scalars().all()
    
    saved_count = db.execute(select(func.count(SavedPaper.id)).where(SavedPaper.user_id == user_id)).scalar_one()
    
    # recent searches
    recent_searches_query = (
        select(SearchQuery)
        .where(SearchQuery.user_id == user_id)
        .order_by(SearchQuery.created_at.desc())
        .limit(3)
    )
    recent_searches_db = db.execute(recent_searches_query).scalars().all()
    recent_searches = [
        {
            "search_id": q.id,
            "query": q.query,
            "created_at": q.created_at.isoformat(),
            "result_count": 0,
            "saved_count": 0,
            "related_topics": []
        }
        for q in recent_searches_db
    ]
    
    return {
        "active_topics": ["Transformers", "Retrieval-Augmented Generation", "Agentic Systems"],
        "recent_papers": recent_papers,
        "saved_count": saved_count,
        "recent_searches": recent_searches,
        "emerging_topics": ["Test-Time Compute", "O1 Architecture"],
        "recommended": [], # Will be populated by recommendations endpoint or mock
        "activity": [
            {"date": "2026-09-28", "count": 2},
            {"date": "2026-09-29", "count": 5},
            {"date": "2026-09-30", "count": 1},
            {"date": "2026-10-01", "count": 8},
            {"date": "2026-10-02", "count": 3},
            {"date": "2026-10-03", "count": 4}
        ]
    }
