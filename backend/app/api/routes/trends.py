from fastapi import APIRouter
from app.services.analysis.trends import get_trends, get_trends_year
router = APIRouter()
@router.get("/trends")
def trends_endpoint(search_id: int = None):
    return get_trends(search_id)
@router.get("/trends/year/{year}")
def trends_year_endpoint(year: int, search_id: int = None):
    return get_trends_year(year, search_id)
