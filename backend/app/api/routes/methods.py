from fastapi import APIRouter
from app.services.analysis.discovery import get_methods
router = APIRouter()
@router.get("/methods")
def methods_endpoint(search_id: int = None):
    return get_methods(search_id)
