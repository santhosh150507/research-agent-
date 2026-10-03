def generate_review_bg(review_id: str, paper_ids: list[int]):
    from app.api.routes.review import reviews_db
    st = reviews_db[review_id]
    st["status"] = "running"
    
    sections = ["Introduction", "Background", "Scope and Method", "Research Problems", "Methodologies", "Datasets", "Metrics and Results", "Key Findings", "Comparison", "Limitations", "Research Gaps", "Conclusion"]
    
    st["sections"] = [{"heading": s, "blocks": [{"id": f"b_{s}", "text": f"Content for {s}", "kind": "synthesis", "sources": []}]} for s in sections]
    
    st["status"] = "done"
