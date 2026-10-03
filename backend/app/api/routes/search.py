from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

def not_impl():
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)

@router.post("/search")
def search_post(): not_impl()

@router.get("/search/{search_id}")
def search_get(search_id: int): not_impl()

@router.get("/search/{search_id}/stream")
def search_stream(search_id: int): not_impl()
