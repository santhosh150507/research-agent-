def compare_papers(paper_ids: list[int]):
    c = {"id": "1", "text": "Both use adaptive models.", "kind": "inference", "sources": []}
    return {"rows": [{"category": "Research Problem", "values": {str(pid): c for pid in paper_ids}}], "narrative": [c]}
