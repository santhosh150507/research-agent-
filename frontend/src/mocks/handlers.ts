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
  QAResponse,
  ConversationHistoryResponse,
} from "@/lib/types";
import { MOCK_PAPERS } from "./fixtures/papers";

function delay<T>(ms: number, result: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export const MockHandlers = {
  search: (req: SearchRequest): Promise<SearchResponse> =>
    delay(400, {
      query_id: 1,
      expanded_queries: [
        "Reinforcement learning for adaptive recommendations",
        "Context-aware personalized recommendation systems",
      ],
      results: MOCK_PAPERS,
      total: MOCK_PAPERS.length,
    }),

  getPaperAnalysis: (id: number): Promise<AnalysisResponse> =>
    delay(400, {
      summary: [
        {
          kind: "synthesis",
          text: "The paper proposes a new method for recommendation.",
          sources: [],
        },
      ],
      methodology: [
        {
          kind: "sourced",
          text: "We use a multi-armed bandit approach.",
          sources: [
            { paper_id: id, section: "Methodology", quote: "We use a multi-armed bandit approach." },
          ],
        },
      ],
      datasets: [],
      findings: [],
      limitations: [],
      future_work: [],
    }),

  compare: (req: CompareRequest): Promise<CompareResponse> =>
    delay(400, {
      aspects: [
        {
          name: "Methodology",
          description: "Comparison of core methods.",
          claims: [],
        },
      ],
    }),

  getEvolution: (): Promise<EvolutionResponse> =>
    delay(400, {
      timeline: [
        {
          year: 2023,
          events: [{ paper_id: 1, event: "Introduced adaptive learning framework." }],
        },
      ],
    }),

  getGraph: (): Promise<GraphResponse> =>
    delay(400, {
      nodes: [{ id: "p1", label: "Paper 1", type: "paper" }],
      edges: [],
    }),

  getGaps: (): Promise<GapsResponse> =>
    delay(400, {
      gaps: [
        {
          description: "Lack of longitudinal studies on user retention.",
          supporting_claims: [],
        },
      ],
    }),

  getTrends: (): Promise<TrendsResponse> =>
    delay(400, {
      trends: [
        {
          metric: "Publications per Year",
          data_points: [
            { label: "2023", value: 10 },
            { label: "2024", value: 15 },
          ],
        },
      ],
    }),

  multiQA: (req: MultiQARequest): Promise<MultiQAResponse> =>
    delay(400, {
      answer: "The papers collectively suggest that adaptive learning improves metrics.",
      claims: [],
    }),

  getConversationHistory: (id: number): Promise<ConversationHistoryResponse> =>
    delay(400, { history: [] }),
};
