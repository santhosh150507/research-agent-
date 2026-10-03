def get_paper_related(paper_id: int):
    c = {"id": "1", "text": "Similar context.", "kind": "inference", "sources": []}
    item = {"paper": {"id": 2, "title": "Old Paper", "authors": [], "year": 2020, "venue": "", "abstract": "", "citation_count": 0, "open_access": False, "source": "demo", "topics": [], "methods": [], "datasets": [], "keywords": []}, "relation": "earlier", "explanation": c}
    return {"earlier": [item], "later": [], "references": [], "cited_by": [], "similar_method": [], "same_dataset": []}

def get_paper_evolution(paper_id: int):
    return {"stages": [{"year_range": "2020-2022", "label": "Early", "papers": [], "explanation": "Stage"}], "earlier_count": 1, "later_count": 0}
