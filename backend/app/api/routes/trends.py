from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

def not_impl():
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)

@router.get("/trends")
def get_trends(): not_impl()

@router.get("/trends/year/{year}")
def get_trends_year(year: int): not_impl()
