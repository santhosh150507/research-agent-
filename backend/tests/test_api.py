import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.schemas.common import Claim

client = TestClient(app)

def test_health():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}

def test_501_stub():
    res = client.get("/api/v1/dashboard/stats")
    assert res.status_code == 501
    assert res.json() == {"error": {"code": "NOT_IMPLEMENTED", "message": "Not Implemented"}}

def test_claim_validator():
    # synthesis kind allows empty sources
    Claim(id="1", text="test", kind="synthesis", sources=[])
    
    # sourced kind raises ValueError if sources are empty
    with pytest.raises(ValueError):
        Claim(id="2", text="test", kind="sourced", sources=[])
