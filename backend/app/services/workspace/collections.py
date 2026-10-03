from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models.collection import Collection
from app.models.collection_paper import CollectionPaper
from app.core.errors import AppException

def get_collections(db: Session, user_id: int):
    stmt = (
        select(Collection, func.count(CollectionPaper.paper_id).label("paper_count"))
        .outerjoin(CollectionPaper, Collection.id == CollectionPaper.collection_id)
        .where(Collection.user_id == user_id)
        .group_by(Collection.id)
    )
    results = db.execute(stmt).all()
    
    return [
        {
            "id": col.id,
            "name": col.name,
            "description": col.description,
            "paper_count": count
        }
        for col, count in results
    ]

def create_collection(db: Session, user_id: int, name: str, description: str = None):
    col = Collection(user_id=user_id, name=name, description=description)
    db.add(col)
    db.commit()
    db.refresh(col)
    return {
        "id": col.id,
        "name": col.name,
        "description": col.description,
        "paper_count": 0
    }

def update_collection(db: Session, user_id: int, col_id: int, name: str = None, description: str = None):
    col = db.execute(select(Collection).where(Collection.id == col_id, Collection.user_id == user_id)).scalar_one_or_none()
    if not col:
        raise AppException("Collection not found", status_code=404)
        
    if name is not None:
        col.name = name
    if description is not None:
        col.description = description
        
    db.commit()
    db.refresh(col)
    
    count = db.execute(select(func.count(CollectionPaper.paper_id)).where(CollectionPaper.collection_id == col.id)).scalar_one()
    
    return {
        "id": col.id,
        "name": col.name,
        "description": col.description,
        "paper_count": count
    }

def delete_collection(db: Session, user_id: int, col_id: int):
    col = db.execute(select(Collection).where(Collection.id == col_id, Collection.user_id == user_id)).scalar_one_or_none()
    if not col:
        raise AppException("Collection not found", status_code=404)
    db.delete(col)
    db.commit()

def add_paper_to_collection(db: Session, user_id: int, col_id: int, paper_id: int):
    col = db.execute(select(Collection).where(Collection.id == col_id, Collection.user_id == user_id)).scalar_one_or_none()
    if not col:
        raise AppException("Collection not found", status_code=404)
        
    cp = db.execute(select(CollectionPaper).where(CollectionPaper.collection_id == col_id, CollectionPaper.paper_id == paper_id)).scalar_one_or_none()
    if not cp:
        cp = CollectionPaper(collection_id=col_id, paper_id=paper_id)
        db.add(cp)
        db.commit()

def remove_paper_from_collection(db: Session, user_id: int, col_id: int, paper_id: int):
    col = db.execute(select(Collection).where(Collection.id == col_id, Collection.user_id == user_id)).scalar_one_or_none()
    if not col:
        raise AppException("Collection not found", status_code=404)
        
    cp = db.execute(select(CollectionPaper).where(CollectionPaper.collection_id == col_id, CollectionPaper.paper_id == paper_id)).scalar_one_or_none()
    if not cp:
        raise AppException("Paper not in collection", status_code=404)
        
    db.delete(cp)
    db.commit()
