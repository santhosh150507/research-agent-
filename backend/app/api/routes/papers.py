from fastapi import APIRouter
from app.core.errors import AppException

router = APIRouter()

def not_impl():
    raise AppException(code="NOT_IMPLEMENTED", message="Not Implemented", status_code=501)

@router.get("/papers/{id}")
def get_paper(id: int): not_impl()

@router.get("/papers/{id}/analysis")
def paper_analysis(id: int): not_impl()

@router.get("/papers/{id}/related")
def paper_related(id: int): not_impl()

@router.post("/papers/{id}/challenges")
def paper_challenges(id: int): not_impl()

@router.post("/papers/{id}/qa")
def paper_qa(id: int): not_impl()
