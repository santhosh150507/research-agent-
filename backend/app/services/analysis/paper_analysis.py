import re
from app.database import SessionLocal
from app.models.paper import Paper

def extract_claims(text, cue_words):
    if not text: return []
    sentences = re.split(r'(?<=[.!?]) +', text)
    claims = []
    for s in sentences:
        s_lower = s.lower()
        if any(c in s_lower for c in cue_words):
            words = s.split()
            truncated = " ".join(words[:25])
            claims.append({
                "id": "gen",
                "text": truncated,
                "kind": "sourced",
                "sources": [{"section": "abstract", "quote": truncated}]
            })
    return claims

def get_paper_analysis(paper_id: int):
    db = SessionLocal()
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        db.close()
        return {}

    text = paper.abstract or ""
    
    analysis = {
        "paper_id": paper_id,
        "summary": [],
        "research_problem": extract_claims(text, ["address", "propose", "challenge", "aim", "problem"]),
        "methodology": extract_claims(text, ["we propose", "using", "based on", "method", "model", "algorithm"]),
        "dataset": extract_claims(text, ["dataset", "data", "corpus", "evaluate on"]),
        "experiments": extract_claims(text, ["experiment", "setting", "baseline"]),
        "metrics": extract_claims(text, ["metric", "accuracy", "auc", "f1", "precision", "recall"]),
        "key_findings": extract_claims(text, ["results show", "outperform", "improve", "demonstrate", "show"]),
        "contributions": extract_claims(text, ["contribute", "contribution", "introduce"]),
        "limitations": extract_claims(text, ["however", "limitation", "fails", "difficult", "struggle"]),
        "future_work": extract_claims(text, ["future work", "we plan", "future direction"]),
        "full_text_available": False
    }
    
    if len(text.split()) > 0:
        words = text.split()
        summary_text = " ".join(words[:25])
        analysis["summary"] = [{"id": "gen", "text": summary_text, "kind": "sourced", "sources": [{"section": "abstract", "quote": summary_text}]}]

    db.close()
    return analysis
