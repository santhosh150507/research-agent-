from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.analysis.compare import compare_papers

class CompareReq(BaseModel):
    paper_ids: list[int]

router = APIRouter()
@router.post("/compare")
def compare(req: CompareReq):
    if len(req.paper_ids) < 2 or len(req.paper_ids) > 5:
        raise HTTPException(400, "Need 2-5 papers")
    return compare_papers(req.paper_ids)
