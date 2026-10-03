from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

def not_impl():
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)

@router.post("/upload")
def upload_file(): not_impl()

@router.get("/upload/{upload_id}")
def get_upload(upload_id: int): not_impl()
