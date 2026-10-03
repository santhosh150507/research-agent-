export type Level = "High" | "Medium" | "Low" | "Unavailable";

export interface RankSignals {
  venue: Level;
  author: Level;
  topic: Level;
  methodology: Level;
  dataset: Level;
  citation_velocity: Level;
  recency: Level;
  impact: Level;
}

export interface Paper {
  id: number;
  title: string;
  authors: string[];
  year: number;
  venue: string | null;
  abstract: string | null;
  url: string | null;
  doi: string | null;
  citation_count: number;
  is_open_access: boolean;
  signals: RankSignals;
}

export interface SourceRef {
  paper_id: number;
  section: string;
  quote: string; // strict: max 25 words
}

export interface Claim {
  kind: "sourced" | "synthesis" | "inference";
  text: string;
  sources: SourceRef[];
}

export interface SearchFilters {
  year_start?: number;
  year_end?: number;
  min_citations?: number;
  venues?: string[];
  has_code?: boolean;
}

// Request & Response Types
export interface SearchRequest {
  query: string;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
}
export interface SearchResponse {
  query_id: number;
  expanded_queries: string[];
  results: Paper[];
  total: number;
}

export interface MultiQARequest {
  paper_ids: number[];
  question: string;
}
export interface MultiQAResponse {
  answer: string; // markdown
  claims: Claim[];
}

export interface QAQuery {
  question: string;
}
export interface QAResponse {
  answer: string;
  claims: Claim[];
}

export interface CompareRequest {
  paper_ids: number[];
}
export interface CompareResponse {
  aspects: {
    name: string;
    description: string;
    claims: Claim[];
  }[];
}

export interface EvolutionResponse {
  timeline: {
    year: number;
    events: {
      paper_id: number;
      event: string;
    }[];
  }[];
}

export interface GraphResponse {
  nodes: { id: string; label: string; type: string }[];
  edges: { source: string; target: string; relationship: string }[];
}

export interface AnalysisResponse {
  summary: Claim[];
  methodology: Claim[];
  datasets: Claim[];
  findings: Claim[];
  limitations: Claim[];
  future_work: Claim[];
}

export interface RelatedResponse {
  papers: Paper[];
}

export interface GapsResponse {
  gaps: {
    description: string;
    supporting_claims: Claim[];
  }[];
}

export interface TrendsResponse {
  trends: {
    metric: string;
    data_points: { label: string; value: number }[];
  }[];
}

export interface ConversationMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  claims: Claim[];
  created_at: string;
}

export interface ConversationHistoryResponse {
  history: ConversationMessage[];
}
