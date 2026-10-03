from app.services.llm.llm_client import generate_json
def understand_query_agent(text: str):
    res = generate_json("understand " + text, {})
    if not res:
        res = {
            "main_topic": text.title() if text.islower() else text,
            "concepts": [text],
            "keywords": [text],
            "research_area": "General",
            "synonyms": [],
            "expanded_queries": []
        }
    return res
