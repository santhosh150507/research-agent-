from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from app.services.review.review_generator import generate_review_bg
from app.database import SessionLocal
from app.models.literature_review import LiteratureReview

router = APIRouter()

class ReviewReq(BaseModel):
    paper_ids: list[int]
    title: str

@router.post("/literature-review")
def create_review(req: ReviewReq, bt: BackgroundTasks):
    from app.models.user import User
    db = SessionLocal()
    user = db.query(User).first()
    if not user:
        user = User(email="test@example.com", name="Test")
        db.add(user)
        db.commit()
        db.refresh(user)
    uid = user.id
    rev = LiteratureReview(user_id=uid, title=req.title, status="queued", sections=[], references=[])
    db.add(rev)
    db.commit()
    db.refresh(rev)
    rid = rev.id
    db.close()
    
    bt.add_task(generate_review_bg, rid, req.paper_ids)
    return {"review_id": str(rid), "status": "queued"}

@router.get("/literature-review/{review_id}")
def get_review(review_id: str):
    db = SessionLocal()
    rev = db.query(LiteratureReview).filter(LiteratureReview.id == int(review_id)).first()
    if not rev:
        db.close()
        raise HTTPException(404)
        
    res = {
        "status": rev.status,
        "title": rev.title,
        "sections": rev.sections,
        "references": rev.references
    }
    db.close()
    return res
