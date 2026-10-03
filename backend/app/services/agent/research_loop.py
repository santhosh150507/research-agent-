def run_research_loop(query, filters):
    return {
        "search_id": 1, "total": 0, "page": 1, "page_size": 10,
        "items": [], "facets": {"years": {}, "methods": {}, "datasets": {}, "topics": {}, "venues": {}},
        "agent_trace": [{"step": "init", "detail": "started", "status": "done"}]
    }
