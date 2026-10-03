from app.database import SessionLocal
from app.models.literature_review import LiteratureReview

def generate_review_bg(review_id: int, paper_ids: list[int]):
    db = SessionLocal()
    try:
        rev = db.query(LiteratureReview).filter(LiteratureReview.id == review_id).first()
        if not rev: return
        rev.status = "running"
        db.commit()
        
        sections_names = ["Introduction", "Background", "Scope and Method", "Research Problems", "Methodologies", "Datasets", "Metrics and Results", "Key Findings", "Comparison", "Limitations", "Research Gaps", "Conclusion"]
        sections = [{"heading": s, "blocks": [{"id": f"b_{s}", "text": f"Content for {s}", "kind": "synthesis", "sources": []}]} for s in sections_names]
        
        rev.status = "done"
        rev.sections = sections
        rev.references = []
        db.commit()
    except Exception:
        db.rollback()
        rev = db.query(LiteratureReview).filter(LiteratureReview.id == review_id).first()
        if rev:
            rev.status = "failed"
            db.commit()
    finally:
        db.close()
