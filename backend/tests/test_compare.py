from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
def test_compare_validation():
    assert client.post("/api/v1/compare", json={"paper_ids": [1]}).status_code == 400
def test_compare_ok():
    assert client.post("/api/v1/compare", json={"paper_ids": [1, 2]}).status_code == 200
