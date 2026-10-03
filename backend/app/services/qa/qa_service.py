from app.database import SessionLocal
from app.models.paper import Paper

def handle_qa(question: str, paper_ids: list[int]):
    db = SessionLocal()
    found = False
    ans_text = ""
    for pid in paper_ids:
        p = db.query(Paper).filter(Paper.id == pid).first()
        if p and p.abstract and question.lower().split()[0] in p.abstract.lower():
            # mock match
            found = True
            ans_text = " ".join(p.abstract.split()[:15])
            break
    db.close()
    
    if found:
        return {"answer": [{"id": "a1", "text": ans_text, "kind": "sourced", "sources": [{"section": "abstract", "quote": ans_text}]}]}
    else:
        return {"answer": [{"id": "a1", "text": "not found in the provided papers", "kind": "inference", "sources": []}]}
