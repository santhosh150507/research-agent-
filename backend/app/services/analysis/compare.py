from app.services.analysis.paper_analysis import get_paper_analysis
def compare_papers(paper_ids: list[int]):
    rows = []
    categories = ["Research Problem", "Methodology", "Dataset", "Metrics", "Results", "Contributions", "Limitations", "Future Work"]
    
    for cat in categories:
        val_map = {}
        for pid in paper_ids:
            an = get_paper_analysis(pid)
            key = cat.lower().replace(" ", "_")
            if key == "results": key = "key_findings"
            items = an.get(key, [])
            val_map[str(pid)] = items[0] if items else None
        rows.append({"category": cat, "values": val_map})
        
    narrative = [{"id": "n1", "text": "Comparison narrative computed from data.", "kind": "synthesis", "sources": []}]
    return {"rows": rows, "narrative": narrative}
