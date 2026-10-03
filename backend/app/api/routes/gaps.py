from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.analysis.gaps import get_gaps

class GapsReq(BaseModel):
    search_id: Optional[int] = None
    paper_ids: Optional[list[int]] = None

router = APIRouter()
@router.post("/gaps")
def gaps_endpoint(req: GapsReq):
    return get_gaps(req.search_id, req.paper_ids)
