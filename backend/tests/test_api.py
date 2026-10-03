import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.common import Claim

client = TestClient(app)

def test_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}

def test_claim_validator():
    Claim(id="1", text="test", kind="synthesis", sources=[])
    with pytest.raises(ValueError):
        Claim(id="2", text="test", kind="sourced", sources=[])
