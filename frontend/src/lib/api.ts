import { MockHandlers } from "@/mocks/handlers";
import {
  SearchRequest,
  SearchResponse,
  AnalysisResponse,
  CompareRequest,
  CompareResponse,
  EvolutionResponse,
  GraphResponse,
  GapsResponse,
  TrendsResponse,
  MultiQARequest,
  MultiQAResponse,
  QAQuery,
  QAResponse,
  ConversationHistoryResponse,
} from "./types";

export class ApiError extends Error {
  code: string;
  constructor(message: string, code: string = "UNKNOWN_ERROR") {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = new URL(API_URL + endpoint);
  
  if (typeof window !== "undefined" && window.location.search.includes("_mock_error=true")) {
    throw new ApiError("Simulated error", "MOCK_ERROR");
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.error?.message || "An error occurred", errorData.error?.code);
  }

  return response.json();
}

export const api = {
  search: async (req: SearchRequest): Promise<SearchResponse> => {
    if (USE_MOCKS) return MockHandlers.search(req);
    return fetchApi<SearchResponse>("/search", {
      method: "POST",
      body: JSON.stringify(req),
    });
  },

  getPaperAnalysis: async (id: number): Promise<AnalysisResponse> => {
    if (USE_MOCKS) return MockHandlers.getPaperAnalysis(id);
    return fetchApi<AnalysisResponse>(`/papers/${id}/analysis`);
  },

  comparePapers: async (req: CompareRequest): Promise<CompareResponse> => {
    if (USE_MOCKS) return MockHandlers.compare(req);
    return fetchApi<CompareResponse>("/papers/compare", {
      method: "POST",
      body: JSON.stringify(req),
    });
  },

  getEvolution: async (topicId: number): Promise<EvolutionResponse> => {
    if (USE_MOCKS) return MockHandlers.getEvolution();
    return fetchApi<EvolutionResponse>(`/topics/${topicId}/evolution`);
  },

  getGraph: async (topicId: number): Promise<GraphResponse> => {
    if (USE_MOCKS) return MockHandlers.getGraph();
    return fetchApi<GraphResponse>(`/topics/${topicId}/graph`);
  },

  getGaps: async (topicId: number): Promise<GapsResponse> => {
    if (USE_MOCKS) return MockHandlers.getGaps();
    return fetchApi<GapsResponse>(`/topics/${topicId}/gaps`);
  },

  getTrends: async (topicId: number): Promise<TrendsResponse> => {
    if (USE_MOCKS) return MockHandlers.getTrends();
    return fetchApi<TrendsResponse>(`/topics/${topicId}/trends`);
  },

  multiQA: async (req: MultiQARequest): Promise<MultiQAResponse> => {
    if (USE_MOCKS) return MockHandlers.multiQA(req);
    return fetchApi<MultiQAResponse>("/papers/qa", {
      method: "POST",
      body: JSON.stringify(req),
    });
  },

  askQuestion: async (conversationId: number, query: QAQuery): Promise<QAResponse> => {
    if (USE_MOCKS) {
      return { answer: "Mock answer", claims: [] };
    }
    return fetchApi<QAResponse>(`/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify(query),
    });
  },

  getConversationHistory: async (id: number): Promise<ConversationHistoryResponse> => {
    if (USE_MOCKS) return MockHandlers.getConversationHistory(id);
    return fetchApi<ConversationHistoryResponse>(`/conversations/${id}/history`);
  },
};
