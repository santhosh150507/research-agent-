from app.database import SessionLocal
from app.models.paper import Paper
def build_graph(search_id: int = None, paper_ids: list[int] = None, depth: int = 1):
    db = SessionLocal()
    nodes = []
    edges = []
    papers = db.query(Paper).limit(10).all()
    for p in papers:
        nodes.append({"id": f"p_{p.id}", "label": p.title, "type": "paper", "properties": {"year": p.year}})
    db.close()
    return {"nodes": nodes, "edges": edges}
