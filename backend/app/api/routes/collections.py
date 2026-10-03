from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user
from app.services.workspace import collections
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class CreateCollectionRequest(BaseModel):
    name: str
    description: Optional[str] = None

class UpdateCollectionRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

@router.get("/collections")
def get_collections(db: Session = Depends(get_db), user = Depends(get_current_user)):
    return collections.get_collections(db, user.id)

@router.post("/collections")
def create_collection(req: CreateCollectionRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return collections.create_collection(db, user.id, req.name, req.description)

@router.patch("/collections/{col_id}")
def update_collection(col_id: int, req: UpdateCollectionRequest, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return collections.update_collection(db, user.id, col_id, req.name, req.description)

@router.delete("/collections/{col_id}", status_code=204)
def delete_collection(col_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    collections.delete_collection(db, user.id, col_id)

@router.post("/collections/{col_id}/papers/{paper_id}", status_code=204)
def add_paper_to_collection(col_id: int, paper_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    collections.add_paper_to_collection(db, user.id, col_id, paper_id)

@router.delete("/collections/{col_id}/papers/{paper_id}", status_code=204)
def remove_paper_from_collection(col_id: int, paper_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    collections.remove_paper_from_collection(db, user.id, col_id, paper_id)
