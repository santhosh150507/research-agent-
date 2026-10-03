import httpx
from app.schemas.common import Paper

class SemanticScholarClient:
    def search(self, query: str) -> list[Paper]:
        return []
