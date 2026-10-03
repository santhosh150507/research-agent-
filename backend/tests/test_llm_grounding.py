from app.services.grounding.validator import validate_claims
from app.schemas.common import Claim, SourceRef
def test_validator():
    c1 = Claim(id="1", text="test", kind="synthesis", sources=[])
    res = validate_claims([c1])
    assert len(res) == 1
