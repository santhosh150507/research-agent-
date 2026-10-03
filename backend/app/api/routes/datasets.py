from fastapi import APIRouter
from app.services.analysis.discovery import get_datasets
router = APIRouter()
@router.get("/datasets")
def datasets_endpoint(search_id: int = None):
    return get_datasets(search_id)
