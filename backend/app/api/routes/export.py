from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.services.workspace import export

router = APIRouter()

@router.get("/export/review/{review_id}")
def export_review(
    review_id: int, 
    format: str = Query("md", description="Export format: pdf, docx, md"), 
    db: Session = Depends(get_db), 
    user = Depends(get_current_user)
):
    return export.export_review(db, user.id, review_id, format)
