from fastapi import APIRouter
from app.services.analysis.graph_builder import build_graph

router = APIRouter()
@router.get("/graph")
def get_graph(search_id: int = None, depth: int = 1):
    return build_graph(search_id=search_id, depth=depth)
