from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

@router.get("/papers/{id}")
def get_paper(id: int):
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)
