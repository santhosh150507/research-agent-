from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

def not_impl():
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)

@router.get("/profile")
def get_profile(): not_impl()
@router.put("/profile")
def update_profile(): not_impl()
