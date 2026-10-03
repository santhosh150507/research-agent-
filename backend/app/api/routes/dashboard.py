from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.services.workspace import dashboard

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db), user = Depends(get_current_user)):
    return dashboard.get_dashboard(db, user.id)
