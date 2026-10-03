from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
import uuid
from app.services.review.review_generator import generate_review_bg

router = APIRouter()

reviews_db = {}

class ReviewReq(BaseModel):
    paper_ids: list[int]
    title: str

@router.post("/literature-review")
def create_review(req: ReviewReq, bt: BackgroundTasks):
    rid = str(uuid.uuid4())
    reviews_db[rid] = {"status": "queued", "title": req.title, "sections": [], "references": []}
    bt.add_task(generate_review_bg, rid, req.paper_ids)
    return {"review_id": rid, "status": "queued"}

@router.get("/literature-review/{review_id}")
def get_review(review_id: str):
    if review_id not in reviews_db:
        raise HTTPException(404)
    return reviews_db[review_id]
