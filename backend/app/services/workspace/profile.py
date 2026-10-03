from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.research_profile import ResearchProfile
from app.core.errors import AppException

def get_profile(db: Session, user_id: int):
    profile = db.execute(select(ResearchProfile).where(ResearchProfile.user_id == user_id)).scalar_one_or_none()
    if not profile:
        profile = ResearchProfile(user_id=user_id, name="Researcher")
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    return {
        "name": profile.name,
        "interests": profile.interests or [],
        "preferred_domains": profile.preferred_domains or [],
        "favorite_methods": profile.favorite_methods or [],
        "topics_researching": profile.topics_researching or []
    }

def update_profile(db: Session, user_id: int, data: dict):
    profile = db.execute(select(ResearchProfile).where(ResearchProfile.user_id == user_id)).scalar_one_or_none()
    if not profile:
        profile = ResearchProfile(user_id=user_id, name="Researcher")
        db.add(profile)
    
    if "name" in data and data["name"] is not None:
        profile.name = data["name"]
    if "interests" in data and data["interests"] is not None:
        profile.interests = data["interests"]
    if "preferred_domains" in data and data["preferred_domains"] is not None:
        profile.preferred_domains = data["preferred_domains"]
    if "favorite_methods" in data and data["favorite_methods"] is not None:
        profile.favorite_methods = data["favorite_methods"]
    if "topics_researching" in data and data["topics_researching"] is not None:
        profile.topics_researching = data["topics_researching"]
        
    db.commit()
    db.refresh(profile)
    
    return {
        "name": profile.name,
        "interests": profile.interests or [],
        "preferred_domains": profile.preferred_domains or [],
        "favorite_methods": profile.favorite_methods or [],
        "topics_researching": profile.topics_researching or []
    }
