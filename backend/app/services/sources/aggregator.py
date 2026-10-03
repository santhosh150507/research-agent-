from app.services.sources.demo_data import DemoDataClient
from app.config import settings

def search_external(query: str, filters: dict = None):
    if settings.demo_mode:
        return DemoDataClient().search(query)
    # real external calls + dedup
    return []
