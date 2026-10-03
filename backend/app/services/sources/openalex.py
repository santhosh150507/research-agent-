import httpx
from app.schemas.common import Paper

class OpenAlexClient:
    def search(self, query: str) -> list[Paper]:
        return [] # Mocked
