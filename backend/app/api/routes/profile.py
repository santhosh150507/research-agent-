from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.services.workspace import profile
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    interests: Optional[list[str]] = None
    preferred_domains: Optional[list[str]] = None
    favorite_methods: Optional[list[str]] = None
    topics_researching: Optional[list[str]] = None

@router.get("/profile")
def get_profile(db: Session = Depends(get_db), user = Depends(get_current_user)):
    return profile.get_profile(db, user.id)

@router.put("/profile")
def update_profile(req: ProfileUpdateRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return profile.update_profile(db, user.id, req.dict(exclude_unset=True))
