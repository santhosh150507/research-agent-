from app.schemas.common import Claim
def validate_claims(claims: list[Claim]) -> list[Claim]:
    valid = []
    for c in claims:
        try:
            c.validate_sources()
            valid.append(c)
        except ValueError:
            pass
    return valid
