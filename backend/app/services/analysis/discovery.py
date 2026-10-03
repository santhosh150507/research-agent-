from app.database import SessionLocal
from app.models.method import Method
from app.models.dataset import Dataset
def get_methods(search_id: int = None):
    db = SessionLocal()
    meths = db.query(Method).limit(10).all()
    res = []
    for m in meths:
        res.append({"name": m.name, "description": {"id": "1", "text": f"Method {m.name}", "kind": "synthesis", "sources":[]}, "papers": [], "common_uses": [], "advantages": [], "limitations": [], "datasets": []})
    db.close()
    return res

def get_datasets(search_id: int = None):
    db = SessionLocal()
    dsets = db.query(Dataset).limit(10).all()
    res = []
    for d in dsets:
        res.append({"name": d.name, "description": "Dataset", "domain": "", "size": "", "tasks": [], "papers": [], "evaluation_use": "", "link": None})
    db.close()
    return {"datasets": res, "links": []}
