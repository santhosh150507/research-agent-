from app.schemas.common import RankSignals
def compute_signals(paper) -> RankSignals:
    return RankSignals(
        semantic="Medium", keyword="Medium", topic_match="Medium",
        methodology_match="Medium", dataset_match="Medium", recency="Medium",
        citations="Medium", question_relevance="Medium", raw={}
    )
