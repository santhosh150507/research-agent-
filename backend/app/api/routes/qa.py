from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.qa.qa_service import handle_qa

router = APIRouter()

class QAReq(BaseModel):
    question: str
    paper_ids: Optional[list[int]] = None

@router.post("/papers/{id}/qa")
def paper_qa(id: int, req: dict):
    return handle_qa(req.get("question", ""), [id])

@router.post("/multi-qa")
def multi_qa(req: QAReq):
    return handle_qa(req.question, req.paper_ids or [])
