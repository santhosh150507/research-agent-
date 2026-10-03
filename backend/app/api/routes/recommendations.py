from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.services.workspace import recommendations

router = APIRouter()

@router.get("/recommendations")
def get_recommendations(db: Session = Depends(get_db), user = Depends(get_current_user)):
    return recommendations.get_recommendations(db, user.id)
