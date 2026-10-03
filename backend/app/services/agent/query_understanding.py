from app.services.llm.llm_client import generate_json
def understand_query_agent(text: str):
    return generate_json("understand " + text, {})
