from fastapi import APIRouter, HTTPException
from app.services.analysis.paper_analysis import get_paper_analysis
from app.services.analysis.related import get_paper_related, get_paper_evolution
from app.services.analysis.gaps import get_paper_challenges

router = APIRouter()

@router.get("/papers/{id}")
def get_paper(id: int):
    return {"id": id, "title": "Mock Paper", "authors": [], "year": 2023, "venue": "UAI", "abstract": "Mock", "citation_count": 0, "open_access": False, "source": "demo", "topics": [], "methods": [], "datasets": [], "keywords": []}

@router.get("/papers/{id}/analysis")
def paper_analysis(id: int):
    return get_paper_analysis(id)

@router.get("/papers/{id}/related")
def paper_related(id: int):
    return get_paper_related(id)

@router.get("/papers/{id}/evolution")
def paper_evolution(id: int):
    return get_paper_evolution(id)

@router.post("/papers/{id}/challenges")
def paper_challenges(id: int, body: dict):
    return get_paper_challenges(id, body.get("mode", "challenge"))
