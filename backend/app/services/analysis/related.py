from app.database import SessionLocal
from app.models.paper import Paper
from app.models.citation import Citation

def paper_to_dict(p):
    return {"id": p.id, "title": p.title, "authors": [], "year": p.year, "venue": p.venue, "abstract": p.abstract, "citation_count": p.citation_count, "open_access": p.open_access, "source": p.source, "topics": [], "methods": [], "datasets": [], "keywords": []}

def get_paper_related(paper_id: int):
    db = SessionLocal()
    res = {"earlier": [], "later": [], "references": [], "cited_by": [], "similar_method": [], "same_dataset": []}
    
    p = db.query(Paper).filter(Paper.id == paper_id).first()
    if not p:
        db.close()
        return res
        
    all_papers = db.query(Paper).all()
    for other in all_papers:
        if other.id == p.id: continue
        
        # earlier/later by year (simplistic semantics)
        if other.year and p.year:
            if other.year < p.year:
                res["earlier"].append({"paper": paper_to_dict(other), "relation": "earlier", "explanation": {"id":"1", "text": f"Published {other.year} vs {p.year}", "kind": "inference", "sources":[]}})
            elif other.year > p.year:
                res["later"].append({"paper": paper_to_dict(other), "relation": "later", "explanation": {"id":"1", "text": f"Published {other.year} vs {p.year}", "kind": "inference", "sources":[]}})
                
    db.close()
    return res

def get_paper_evolution(paper_id: int):
    return {"stages": [], "earlier_count": 0, "later_count": 0}
