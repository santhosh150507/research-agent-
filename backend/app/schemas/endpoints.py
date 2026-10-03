from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from .common import Paper, RankSignals, Claim, SourceRef, SearchFilters

# Dummy request/response models for all endpoints
class UnderstandQueryReq(BaseModel):
    text: str
    objectives: Optional[str] = None
    methodology_pref: Optional[str] = None
    date_from: Optional[int] = None
    date_to: Optional[int] = None
    domain: Optional[str] = None

class ExpandedQuery(BaseModel):
    id: str
    text: str
    type: str # "synonym"|"related"|"method"|"user"

class UnderstandQueryRes(BaseModel):
    main_topic: str
    concepts: List[str]
    keywords: List[str]
    research_area: str
    synonyms: List[str]
    expanded_queries: List[ExpandedQuery]

# You would add all models here, but for brevity we'll just use dicts or Any where unspecified,
# or define minimal Pydantic models for the endpoints.

class SearchReq(BaseModel):
    query: str
    expanded_queries: List[str]
    filters: Optional[SearchFilters] = None
    sort: Optional[str] = "relevance"
    page: Optional[int] = 1
    page_size: Optional[int] = 10
    project_id: Optional[int] = None

class SearchRes(BaseModel):
    search_id: int
    total: int
    page: int
    page_size: int
    items: List[Dict[str, Any]]
    facets: Dict[str, Any]
    agent_trace: List[Dict[str, Any]]
