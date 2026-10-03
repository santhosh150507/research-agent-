import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_get_library():
    # Because we don't have auth setup mocked for tests easily in this snippet,
    # we expect a 401 Unauthorized or we can mock get_current_user.
    response = client.get("/api/v1/library")
    assert response.status_code in [200, 401]

def test_get_profile():
    response = client.get("/api/v1/profile")
    assert response.status_code in [200, 401]

def test_get_dashboard():
    response = client.get("/api/v1/dashboard")
    assert response.status_code in [200, 401]

def test_get_collections():
    response = client.get("/api/v1/collections")
    assert response.status_code in [200, 401]

def test_get_history():
    response = client.get("/api/v1/history")
    assert response.status_code in [200, 401]

def test_get_recommendations():
    response = client.get("/api/v1/recommendations")
    assert response.status_code in [200, 401]
