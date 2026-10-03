from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.services.workspace import history

router = APIRouter()

@router.get("/history")
def get_history(db: Session = Depends(get_db), user = Depends(get_current_user)):
    return history.get_history(db, user.id)

@router.get("/history/{history_id}")
def get_history_item(history_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return history.get_history_item(db, user.id, history_id)

@router.delete("/history/{history_id}", status_code=204)
def delete_history_item(history_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    history.delete_history_item(db, user.id, history_id)
