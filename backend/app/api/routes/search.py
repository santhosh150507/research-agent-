from fastapi import APIRouter
from app.schemas.endpoints import SearchReq, SearchRes
from app.services.agent.research_loop import run_research_loop

router = APIRouter()

@router.post("/search", response_model=SearchRes)
def search_post(req: SearchReq):
    res = run_research_loop(req.query, req.filters)
    return SearchRes(**res)

@router.get("/search/{search_id}", response_model=SearchRes)
def search_get(search_id: int):
    return run_research_loop("", None)
