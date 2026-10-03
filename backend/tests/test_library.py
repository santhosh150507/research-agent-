from app.database import SessionLocal
from app.models.saved_paper import SavedPaper
from app.models.user import User
from app.models.paper import Paper
from app.db.seed import seed_demo_data

def test_saved_paper_defaults():
    seed_demo_data()
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            user = User(email="libtest@demo.com", name="LibTest")
            db.add(user)
            db.commit()
            db.refresh(user)
            
        paper = db.query(Paper).first()
        
        # Clean up existing to avoid uq conflict
        db.query(SavedPaper).filter_by(user_id=user.id, paper_id=paper.id).delete()
        db.commit()
        
        sp = SavedPaper(user_id=user.id, paper_id=paper.id)
        db.add(sp)
        db.commit()
        db.refresh(sp)
        
        assert sp.status == "unread"
        assert sp.bookmarked is False
        assert sp.tags == []
        assert sp.saved_at is not None
    finally:
        db.close()
