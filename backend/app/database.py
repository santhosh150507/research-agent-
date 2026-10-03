from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import settings

DATABASE_URL = settings.database_url

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from app.models.user import User
    db = SessionLocal()
    try:
        if not db.query(User).filter_by(id=1).first():
            demo_user = User(id=1, email="demo@example.com", name="Demo User")
            db.add(demo_user)
            db.commit()
    except Exception:
        pass
    finally:
        db.close()
