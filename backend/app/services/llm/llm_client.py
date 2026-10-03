from app.config import settings

def generate_json(prompt: str, schema: dict) -> dict:
    # Rule-based fallback for DEMO_MODE
    if settings.demo_mode:
        if "understand" in prompt.lower():
            return {"main_topic": "Adaptive Learning", "concepts": [], "keywords": [], "research_area": "CS", "synonyms": [], "expanded_queries": []}
    return {}
