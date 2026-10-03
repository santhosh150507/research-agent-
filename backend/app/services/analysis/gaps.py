def get_gaps(search_id: int = None, paper_ids: list[int] = None):
    c_obs = {"id": "1", "text": "Most evaluate offline.", "kind": "inference", "sources": []}
    c_opp = {"id": "2", "text": "Potentially underexplored", "kind": "inference", "sources": []}
    return {"observations": [{"observation": c_obs, "supporting_papers": []}], "opportunities": [{"opportunity": c_opp, "supporting_papers": []}]}

def get_paper_challenges(paper_id: int, mode: str):
    c1 = {"id": "1", "text": "Contradicts X.", "kind": "sourced", "sources": []}
    c2 = {"id": "2", "text": "Different dataset.", "kind": "inference", "sources": []}
    return [{"evidence": [c1], "interpretation": c2}]
