from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

def not_impl():
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)

@router.post("/literature-review")
def create_review(): not_impl()

@router.get("/literature-review/{review_id}")
def get_review(review_id: int): not_impl()
