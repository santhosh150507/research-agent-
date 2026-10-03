from pydantic import BaseModel, Field, model_validator
from typing import List, Optional, Literal, Dict, Any

Level = Literal["High", "Medium", "Low", "Unavailable"]

class Author(BaseModel):
    id: int
    name: str

class Paper(BaseModel):
    id: int
    title: str
    authors: List[Author]
    year: Optional[int] = None
    venue: Optional[str] = None
    doi: Optional[str] = None
    url: Optional[str] = None
    abstract: Optional[str] = None
    citation_count: Optional[int] = None
    open_access: Optional[bool] = None
    source: Literal["demo", "openalex", "semantic_scholar", "arxiv", "upload"]
    topics: List[str]
    methods: List[str]
    datasets: List[str]
    keywords: List[str]

class RankSignals(BaseModel):
    semantic: Level
    keyword: Level
    topic_match: Level
    methodology_match: Level
    dataset_match: Level
    recency: Level
    citations: Level
    question_relevance: Level
    raw: Dict[str, Optional[float]]

class SourceRef(BaseModel):
    paper_id: int
    title: str
    authors: List[str]
    year: Optional[int] = None
    url: Optional[str] = None
    doi: Optional[str] = None
    section: Optional[str] = None
    page: Optional[int] = None
    quote: Optional[str] = None

class Claim(BaseModel):
    id: str
    text: str
    kind: Literal["sourced", "synthesis", "inference"]
    sources: List[SourceRef]

    @model_validator(mode="after")
    def validate_sources(self) -> "Claim":
        if self.kind == "sourced" and not self.sources:
            raise ValueError("Sourced claims must have at least one source.")
        return self

class SearchFilters(BaseModel):
    year_from: Optional[int] = None
    year_to: Optional[int] = None
    authors: Optional[List[str]] = None
    venues: Optional[List[str]] = None
    topics: Optional[List[str]] = None
    methods: Optional[List[str]] = None
    datasets: Optional[List[str]] = None
    min_citations: Optional[int] = None
    open_access: Optional[bool] = None
    paper_type: Optional[str] = None
