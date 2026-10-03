def build_graph(search_id: int = None, paper_ids: list[int] = None, depth: int = 1):
    return {"nodes": [{"id": "p1", "label": "Paper 1", "type": "paper", "properties": {}}], "edges": [{"source": "p1", "target": "a1", "label": "authored_by", "weight": 1.0}]}
