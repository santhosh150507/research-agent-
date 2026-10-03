from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

def not_impl():
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)

@router.get("/collections")
def get_collections(): not_impl()
@router.post("/collections")
def create_collection(): not_impl()
@router.patch("/collections/{id}")
def update_collection(id: int): not_impl()
@router.delete("/collections/{id}")
def delete_collection(id: int): not_impl()
@router.post("/collections/{id}/papers/{paper_id}")
def add_paper(id: int, paper_id: int): not_impl()
@router.delete("/collections/{id}/papers/{paper_id}")
def remove_paper(id: int, paper_id: int): not_impl()
