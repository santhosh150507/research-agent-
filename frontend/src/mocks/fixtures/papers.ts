import { Paper, RankSignals } from "@/lib/types";

export const MOCK_SIGNALS: RankSignals = {
  venue: "High",
  author: "Medium",
  topic: "High",
  methodology: "Medium",
  dataset: "High",
  citation_velocity: "Low",
  recency: "High",
  impact: "Medium",
};

export const MOCK_PAPERS: Paper[] = [
  {
    id: 1,
    title: "Adaptive Learning in Personalized Recommendation Systems",
    authors: ["Jane Doe", "John Smith"],
    year: 2023,
    venue: "NeurIPS",
    abstract: "This paper introduces a novel adaptive learning approach...",
    url: "https://example.com/paper1",
    doi: null,
    citation_count: 42,
    is_open_access: true,
    signals: MOCK_SIGNALS,
  },
  {
    id: 2,
    title: "Deep Reinforcement Learning for Adaptive Recommendations",
    authors: ["Alice Johnson", "Bob Lee"],
    year: 2024,
    venue: "ICML",
    abstract: "We explore DRL techniques in the context of adaptive learning...",
    url: "https://example.com/paper2",
    doi: "10.1000/xyz123",
    citation_count: 15,
    is_open_access: false,
    signals: {
      ...MOCK_SIGNALS,
      venue: "High",
      recency: "High",
    },
  },
];
