import pytest
from app.db.seed import seed_demo_data
from app.database import SessionLocal
from app.models import Paper

def test_seed_idempotent():
    seed_demo_data()
    db = SessionLocal()
    count1 = db.query(Paper).count()
    seed_demo_data()
    count2 = db.query(Paper).count()
    db.close()
    assert count1 > 0
    assert count1 == count2
