// ============================================================
// C3 — Core types (frozen, per contract)
// ============================================================

export type Level = "High" | "Medium" | "Low" | "Unavailable";

export interface Paper {
  id: number;
  title: string;
  authors: { id: number; name: string }[];
  year: number | null;
  venue: string | null;
  doi: string | null;
  url: string | null;
  abstract: string | null;
  citation_count: number | null;
  open_access: boolean | null;
  source: "demo" | "openalex" | "semantic_scholar" | "arxiv" | "upload";
  topics: string[];
  methods: string[];
  datasets: string[];
  keywords: string[];
}

export interface RankSignals {
  // interpretable — NO single "quality score"
  semantic: Level;
  keyword: Level;
  topic_match: Level;
  methodology_match: Level;
  dataset_match: Level;
  recency: Level;
  citations: Level;
  question_relevance: Level;
  raw: Record<string, number | null>;
}

export interface SourceRef {
  paper_id: number;
  title: string;
  authors: string[];
  year: number | null;
  url: string | null;
  doi: string | null;
  section: string | null;
  page: number | null;
  quote: string | null; // max 25 words
}

export interface Claim {
  id: string;
  text: string;
  kind: "sourced" | "synthesis" | "inference";
  sources: SourceRef[]; // must be non-empty when kind="sourced"
}

export interface SearchFilters {
  year_from?: number;
  year_to?: number;
  authors?: string[];
  venues?: string[];
  topics?: string[];
  methods?: string[];
  datasets?: string[];
  min_citations?: number;
  open_access?: boolean;
  paper_type?: string;
}

// ============================================================
// C4 — Request / Response types (Person 1 endpoints)
// ============================================================

// POST /query/understand
export interface UnderstandRequest {
  text: string;
  objectives?: string;
  methodology_pref?: string;
  date_from?: number;
  date_to?: number;
  domain?: string;
}
export interface ExpandedQuery {
  id: string;
  text: string;
  type: "synonym" | "related" | "method" | "user";
}
export interface UnderstandResponse {
  main_topic: string;
  concepts: string[];
  keywords: string[];
  research_area: string;
  synonyms: string[];
  expanded_queries: ExpandedQuery[];
}

// POST /search  |  GET /search/{id}
export interface SearchRequest {
  query: string;
  expanded_queries: string[];
  filters?: SearchFilters;
  sort?: "relevance" | "year" | "citations" | "recency";
  page?: number;
  page_size?: number;
  project_id?: number;
}
export interface SearchResultItem {
  rank: number;
  paper: Paper;
  signals: RankSignals;
}
export interface SearchFacets {
  years: { year: number; count: number }[];
  methods: { name: string; count: number }[];
  datasets: { name: string; count: number }[];
  topics: { name: string; count: number }[];
  venues: { name: string; count: number }[];
}
export interface AgentTraceStep {
  step: string;
  detail: string;
  status: "running" | "done" | "error";
}
export interface SearchResponse {
  search_id: number;
  total: number;
  page: number;
  page_size: number;
  items: SearchResultItem[];
  facets: SearchFacets;
  agent_trace: AgentTraceStep[];
}

// GET /papers/{id}
export interface PaperDetail extends Paper {
  chunks_available: boolean;
}

// GET /papers/{id}/analysis
export interface AnalysisResponse {
  paper_id: number;
  summary: Claim[];
  research_problem: Claim[];
  methodology: Claim[];
  dataset: Claim[];
  experiments: Claim[];
  metrics: Claim[];
  key_findings: Claim[];
  contributions: Claim[];
  limitations: Claim[];
  future_work: Claim[];
  full_text_available: boolean;
}

// GET /papers/{id}/related
export interface RelatedItem {
  paper: Paper;
  relation: string;
  explanation: Claim;
}
export interface RelatedResponse {
  earlier: RelatedItem[];
  later: RelatedItem[];
  references: RelatedItem[];
  cited_by: RelatedItem[];
  similar_method: RelatedItem[];
  same_dataset: RelatedItem[];
}

// GET /papers/{id}/evolution
export interface EvolutionStage {
  year_range: string;
  label: string;
  papers: Paper[];
  explanation: Claim;
}
export interface EvolutionResponse {
  stages: EvolutionStage[];
  earlier_count: number;
  later_count: number;
}

// POST /papers/{id}/challenges
export interface ChallengeRequest {
  mode: "challenge" | "conflicting" | "alternative";
}
export interface ChallengeItem {
  paper: Paper;
  evidence: Claim[]; // kind=sourced
  interpretation: Claim; // kind=inference
}
export interface ChallengesResponse {
  items: ChallengeItem[];
}

// POST /papers/{id}/qa
export interface PaperQARequest {
  question: string;
  conversation_id?: number;
}
export interface PaperQAResponse {
  answer: Claim[];
}

// POST /upload  |  GET /upload/{id}
export interface UploadResponse {
  upload_id: string;
  status: "queued" | "running" | "done" | "failed";
}
export interface UploadStructure {
  title: string | null;
  authors: string[] | null;
  year: number | null;
  abstract: string | null;
  keywords: string[] | null;
  methodology: string | null;
  datasets: string[] | null;
  findings: string | null;
  limitations: string | null;
  references: string[] | null;
  future_work: string | null;
}
export interface UploadStatusResponse {
  status: "queued" | "running" | "done" | "failed";
  error?: string | null;
  paper?: Paper | null;
  structure?: UploadStructure | null;
}

// POST /compare
export interface CompareRequest {
  paper_ids: number[];
}
export interface CompareRow {
  feature: string;
  cells: Record<string, Claim | null>; // key = paper_id as string
}
export interface CompareResponse {
  papers: Paper[];
  rows: CompareRow[];
  narrative: Claim[];
}

// GET /graph
export interface GraphNode {
  id: string;
  type: "paper" | "author" | "topic" | "method" | "dataset";
  label: string;
  meta: Record<string, unknown>;
}
export interface GraphEdge {
  source: string;
  target: string;
  type:
    | "cites"
    | "authored_by"
    | "about"
    | "uses_method"
    | "uses_dataset"
    | "similar_method"
    | "same_dataset"
    | "related";
}
export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// GET /methods
export interface MethodItem {
  name: string;
  description: Claim;
  papers: Paper[];
  common_uses: Claim[];
  advantages: Claim[];
  limitations: Claim[];
  datasets: string[];
}
export interface MethodsResponse {
  items: MethodItem[];
}

// GET /datasets
export interface DatasetItem {
  name: string;
  description: string | null;
  domain: string | null;
  size: string | null;
  tasks: string[];
  papers: Paper[];
  evaluation_use: string | null;
  link: string | null;
}
export interface DatasetLink {
  method: string;
  dataset: string;
  paper_ids: number[];
}
export interface DatasetsResponse {
  items: DatasetItem[];
  links: DatasetLink[];
}

// GET /trends
export interface TrendYearItem {
  year: number;
  count: number;
}
export interface MethodTrendItem {
  method: string;
  series: TrendYearItem[];
}
export interface KeywordTrend {
  term: string;
  direction: "emerging" | "stable" | "declining";
  series: TrendYearItem[];
}
export interface TrendsResponse {
  by_year: TrendYearItem[];
  methods_over_time: MethodTrendItem[];
  datasets: { name: string; count: number }[];
  keywords: KeywordTrend[];
}

// GET /trends/year/{year}
export interface TrendsYearResponse {
  papers: Paper[];
}

// POST /gaps
export interface GapsRequest {
  search_id?: number;
  paper_ids?: number[];
}
export type GapWording =
  | "Potentially underexplored"
  | "Limited evidence was found in the retrieved literature"
  | "Few papers in the current search set address...";
export interface GapOpportunity {
  title: string;
  description: Claim;
  wording: GapWording;
  supporting_papers: Paper[];
}
export interface GapsResponse {
  observations: Claim[];
  opportunities: GapOpportunity[];
  caveat: string;
}

// POST /multi-qa
export interface MultiQARequest {
  paper_ids: number[];
  question: string;
}
export interface MultiQAResponse {
  answer: Claim[];
}

// POST /literature-review  |  GET /literature-review/{id}
export interface LiteratureReviewRequest {
  paper_ids: number[];
  title: string;
}
export interface LiteratureReviewCreateResponse {
  review_id: number;
  status: "queued" | "running" | "done" | "failed";
}
export interface LiteratureReviewSection {
  heading: string;
  blocks: Claim[];
}
export interface LiteratureReviewResponse {
  status: "queued" | "running" | "done" | "failed";
  title: string;
  sections: LiteratureReviewSection[];
  references: SourceRef[];
}

// POST /conversations  |  GET /conversations  |  GET /conversations/{id}
export interface ConversationCreateResponse {
  id: number;
}
export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  claims: Claim[];
}
export interface ConversationListItem {
  id: number;
  created_at: string;
  message_count: number;
}
export interface ConversationDetail {
  id: number;
  messages: ConversationMessage[];
}

// POST /conversations/{id}/messages
export interface SendMessageRequest {
  content: string;
}
export interface ConversationAction {
  type: "search" | "filter" | "compare" | "gaps" | "clarify";
  payload: Record<string, unknown>;
}
export interface LiteratureState {
  search_id: number | null;
  paper_ids: number[];
  filters: SearchFilters;
}
export interface SendMessageResponse {
  message: ConversationMessage;
  actions: ConversationAction[];
  literature_state: LiteratureState;
  agent_trace: AgentTraceStep[];
}

// ============================================================
// C5 — User workspace types (Person 2 endpoints)
// ============================================================

// GET/PUT /profile
export interface ProfileData {
  name: string;
  interests: string[];
  preferred_domains: string[];
  favorite_methods: string[];
  topics_researching: string[];
}

// GET /library
export type ReadStatus = "unread" | "read";
export interface LibraryItem {
  paper: Paper;
  status: ReadStatus;
  bookmarked: boolean;
  tags: string[];
  collection_ids: number[];
  saved_at: string;
}
export interface LibraryResponse {
  items: LibraryItem[];
}

// POST /library/papers
export interface SavePaperRequest {
  paper_id: number;
  tags?: string[];
  collection_id?: number;
}

// PATCH /library/papers/{paper_id}
export interface UpdateSavedPaperRequest {
  status?: ReadStatus;
  bookmarked?: boolean;
  tags?: string[];
}

// GET/POST /collections
export interface CollectionData {
  id: number;
  name: string;
  description: string | null;
  paper_count: number;
}
export interface CreateCollectionRequest {
  name: string;
  description?: string;
}
export interface UpdateCollectionRequest {
  name?: string;
  description?: string;
}

// GET/POST /papers/{id}/notes
export interface NoteData {
  id: number;
  paper_id: number;
  body: string;
  created_at: string;
}
export interface CreateNoteRequest {
  body: string;
}

// GET/POST /papers/{id}/annotations
export interface AnnotationData {
  id: number;
  paper_id: number;
  section: string | null;
  page: number | null;
  text_selection: string | null;
  comment: string;
}
export interface CreateAnnotationRequest {
  section?: string;
  page?: number;
  text_selection?: string;
  comment: string;
}

// GET /history
export interface HistoryItem {
  search_id: number;
  query: string;
  created_at: string;
  result_count: number;
  saved_count: number;
  related_topics: string[];
}
export interface HistoryResponse {
  items: HistoryItem[];
}

// GET /dashboard
export interface DashboardResponse {
  active_topics: string[];
  recent_papers: Paper[];
  saved_count: number;
  recent_searches: HistoryItem[];
  emerging_topics: string[];
  recommended: Paper[];
  activity: { date: string; count: number }[];
}

// GET /recommendations
export interface RecommendationItem {
  paper: Paper;
  reason: Claim; // kind=synthesis
}
export interface RecommendationsResponse {
  items: RecommendationItem[];
}

// GET /export/review/{review_id}
export type ExportFormat = "pdf" | "md" | "docx";
