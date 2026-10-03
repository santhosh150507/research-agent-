from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

def not_impl():
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)

@router.get("/history")
def get_history(): not_impl()
@router.get("/history/{id}")
def get_history_item(id: int): not_impl()
@router.delete("/history/{id}")
def delete_history(id: int): not_impl()
