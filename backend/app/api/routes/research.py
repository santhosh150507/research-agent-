from fastapi import APIRouter
from app.schemas.endpoints import UnderstandQueryReq, UnderstandQueryRes
from app.services.agent.query_understanding import understand_query_agent

router = APIRouter()

@router.post("/query/understand", response_model=UnderstandQueryRes)
def understand_query(req: UnderstandQueryReq):
    res = understand_query_agent(req.text)
    return UnderstandQueryRes(**res)
