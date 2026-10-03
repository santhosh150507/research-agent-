def get_methods(search_id: int = None):
    c = {"id": "1", "text": "Deep Learning", "kind": "inference", "sources": []}
    return [{"name": "CNN", "description": c, "papers": [], "common_uses": [c], "advantages": [c], "limitations": [c], "datasets": []}]

def get_datasets(search_id: int = None):
    return {"datasets": [{"name": "MovieLens", "description": "Ratings", "domain": "Movies", "size": "1M", "tasks": ["RecSys"], "papers": [], "evaluation_use": "Standard", "link": None}], "links": []}
