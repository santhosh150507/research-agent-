from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

def not_impl():
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)

@router.get("/library")
def get_library(): not_impl()
@router.post("/library/papers")
def add_lib_paper(): not_impl()
@router.patch("/library/papers/{paper_id}")
def upd_lib_paper(paper_id: int): not_impl()
@router.delete("/library/papers/{paper_id}")
def del_lib_paper(paper_id: int): not_impl()
