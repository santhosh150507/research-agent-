import {
  Paper,
  RankSignals,
  Claim,
  SourceRef,
  SearchResultItem,
  SearchFacets,
  AnalysisResponse,
  RelatedResponse,
  EvolutionResponse,
  CompareResponse,
  GraphResponse,
  MethodsResponse,
  DatasetsResponse,
  TrendsResponse,
  GapsResponse,
  UnderstandResponse,
  ChallengesResponse,
  SendMessageResponse,
  LiteratureReviewResponse,
  DashboardResponse,
  RecommendationsResponse,
  HistoryItem,
  LibraryResponse,
  CollectionData,
  ProfileData,
} from "@/lib/types";

// ============================================================
// DEMO DATA — "Adaptive learning for personalized recommendation systems"
// source = "demo" | DOIs = null where uncertain | quotes <= 25 words
// ============================================================

const mkSignals = (overrides: Partial<RankSignals> = {}): RankSignals => ({
  semantic: "High",
  keyword: "High",
  topic_match: "High",
  methodology_match: "Medium",
  dataset_match: "Medium",
  recency: "Medium",
  citations: "Medium",
  question_relevance: "High",
  raw: { semantic: 0.91, keyword: 0.87, topic_match: 0.88, methodology_match: 0.72, dataset_match: 0.65, recency: 0.60, citations: 0.70, question_relevance: 0.90 },
  ...overrides,
});

const src = (paperId: number, section: string, quote: string): SourceRef => ({
  paper_id: paperId,
  title: PAPERS_MAP[paperId]?.title ?? "Unknown",
  authors: PAPERS_MAP[paperId]?.authors.map((a) => a.name) ?? [],
  year: PAPERS_MAP[paperId]?.year ?? null,
  url: PAPERS_MAP[paperId]?.url ?? null,
  doi: PAPERS_MAP[paperId]?.doi ?? null,
  section,
  page: null,
  quote,
});

const claim = (
  id: string,
  kind: Claim["kind"],
  text: string,
  sources: SourceRef[] = []
): Claim => ({ id, kind, text, sources });

// 8 demo papers
export const MOCK_PAPERS: Paper[] = [
  {
    id: 1,
    title: "Neural Collaborative Filtering",
    authors: [{ id: 101, name: "Xiangnan He" }, { id: 102, name: "Lizi Liao" }],
    year: 2017,
    venue: "WWW",
    doi: null,
    url: "https://arxiv.org/abs/1708.05031",
    abstract: "We present Neural Collaborative Filtering (NCF), a general framework for collaborative filtering with neural networks replacing the inner product of matrix factorization.",
    citation_count: 5200,
    open_access: true,
    source: "demo",
    topics: ["Collaborative Filtering", "Neural Networks"],
    methods: ["Matrix Factorization", "Neural Networks"],
    datasets: ["MovieLens", "Pinterest"],
    keywords: ["collaborative filtering", "neural network", "recommendation"],
  },
  {
    id: 2,
    title: "Self-Attentive Sequential Recommendation",
    authors: [{ id: 103, name: "Wang-Cheng Kang" }, { id: 104, name: "Julian McAuley" }],
    year: 2018,
    venue: "ICDM",
    doi: null,
    url: "https://arxiv.org/abs/1808.09781",
    abstract: "We propose SASRec, a self-attention based sequential model that adaptively assigns weights to items at different positions for recommendation.",
    citation_count: 3100,
    open_access: true,
    source: "demo",
    topics: ["Sequential Recommendation", "Attention Mechanism"],
    methods: ["Self-Attention", "Transformer"],
    datasets: ["Amazon", "Steam"],
    keywords: ["sequential recommendation", "self-attention", "adaptive"],
  },
  {
    id: 3,
    title: "BERT4Rec: Sequential Recommendation with Bidirectional Encoder Representations",
    authors: [{ id: 105, name: "Fei Sun" }, { id: 106, name: "Jun Liu" }],
    year: 2019,
    venue: "CIKM",
    doi: null,
    url: "https://arxiv.org/abs/1904.06690",
    abstract: "We adapt BERT to sequential recommendation, showing that bidirectional self-attention outperforms unidirectional models on multiple benchmarks.",
    citation_count: 2800,
    open_access: true,
    source: "demo",
    topics: ["Sequential Recommendation", "Pre-trained Models"],
    methods: ["BERT", "Bidirectional Transformer"],
    datasets: ["MovieLens", "Amazon Beauty"],
    keywords: ["bert", "recommendation", "pretraining"],
  },
  {
    id: 4,
    title: "Graph Neural Networks for Social Recommendation",
    authors: [{ id: 107, name: "Wenqi Fan" }, { id: 108, name: "Yao Ma" }],
    year: 2019,
    venue: "WWW",
    doi: null,
    url: null,
    abstract: "We propose a framework that captures the complex interactions between users and items using graph neural networks in social recommendation settings.",
    citation_count: 1600,
    open_access: false,
    source: "demo",
    topics: ["Graph Neural Networks", "Social Recommendation"],
    methods: ["Graph Neural Networks", "Attention"],
    datasets: ["Ciao", "Epinions"],
    keywords: ["graph neural network", "social recommendation"],
  },
  {
    id: 5,
    title: "Deep Reinforcement Learning for Adaptive Recommendation",
    authors: [{ id: 109, name: "Xiangyu Zhao" }, { id: 110, name: "Liang Zhang" }],
    year: 2021,
    venue: "KDD",
    doi: null,
    url: null,
    abstract: "We model the recommendation process as a Markov decision process and train a deep reinforcement learning agent to adaptively generate recommendations.",
    citation_count: 890,
    open_access: false,
    source: "demo",
    topics: ["Reinforcement Learning", "Adaptive Recommendation"],
    methods: ["Deep Q-Network", "Policy Gradient"],
    datasets: ["MovieLens", "News Recommendation Dataset"],
    keywords: ["reinforcement learning", "adaptive", "recommendation"],
  },
  {
    id: 6,
    title: "Contrastive Learning for Recommendation",
    authors: [{ id: 111, name: "Junliang Yu" }, { id: 112, name: "Hongzhi Yin" }],
    year: 2022,
    venue: "SIGIR",
    doi: null,
    url: "https://arxiv.org/abs/2205.01483",
    abstract: "We propose a contrastive learning paradigm for recommendation that creates self-supervised signals from user-item interaction data.",
    citation_count: 620,
    open_access: true,
    source: "demo",
    topics: ["Contrastive Learning", "Self-Supervised"],
    methods: ["Contrastive Learning", "Graph Convolution"],
    datasets: ["Yelp2018", "Amazon Books"],
    keywords: ["contrastive learning", "self-supervised", "recommendation"],
  },
  {
    id: 7,
    title: "LLM-based User Simulators for Evaluating Conversational Recommender Systems",
    authors: [{ id: 113, name: "Zhankui He" }, { id: 114, name: "Handong Zhao" }],
    year: 2023,
    venue: "NeurIPS",
    doi: null,
    url: null,
    abstract: "We investigate using large language models as user simulators to evaluate conversational recommendation systems without expensive human studies.",
    citation_count: 145,
    open_access: true,
    source: "demo",
    topics: ["Large Language Models", "Conversational Recommendation"],
    methods: ["LLM", "Simulation"],
    datasets: ["ReDial", "INSPIRED"],
    keywords: ["llm", "conversational", "recommendation", "simulation"],
  },
  {
    id: 8,
    title: "Meta-Learning for Cold-Start Recommendation",
    authors: [{ id: 115, name: "Manasi Vartak" }, { id: 116, name: "Arvind Thiagarajan" }],
    year: 2020,
    venue: "WWW",
    doi: null,
    url: null,
    abstract: "We use meta-learning to rapidly adapt recommendation models to new users with few interactions, addressing the cold-start problem.",
    citation_count: 410,
    open_access: false,
    source: "demo",
    topics: ["Meta-Learning", "Cold-Start"],
    methods: ["MAML", "Few-Shot Learning"],
    datasets: ["MovieLens", "Book-Crossing"],
    keywords: ["meta-learning", "cold-start", "few-shot"],
  },
];

// Map for quick lookup in src()
const PAPERS_MAP: Record<number, Paper> = Object.fromEntries(
  MOCK_PAPERS.map((p) => [p.id, p])
);

// ============================================================
// Search fixtures
// ============================================================

export const MOCK_SEARCH_ITEMS: SearchResultItem[] = MOCK_PAPERS.map((p, i) => ({
  rank: i + 1,
  paper: p,
  signals: mkSignals({
    recency: p.year && p.year >= 2022 ? "High" : p.year && p.year >= 2019 ? "Medium" : "Low",
    citations: p.citation_count && p.citation_count > 2000 ? "High" : p.citation_count && p.citation_count > 500 ? "Medium" : "Low",
  }),
}));

export const MOCK_FACETS: SearchFacets = {
  years: [
    { year: 2017, count: 1 }, { year: 2018, count: 1 }, { year: 2019, count: 2 },
    { year: 2020, count: 1 }, { year: 2021, count: 1 }, { year: 2022, count: 1 }, { year: 2023, count: 1 },
  ],
  methods: [
    { name: "Neural Networks", count: 3 }, { name: "Self-Attention", count: 2 },
    { name: "Reinforcement Learning", count: 1 }, { name: "Contrastive Learning", count: 1 },
  ],
  datasets: [
    { name: "MovieLens", count: 4 }, { name: "Amazon", count: 2 },
    { name: "Yelp2018", count: 1 }, { name: "Ciao", count: 1 },
  ],
  topics: [
    { name: "Sequential Recommendation", count: 2 }, { name: "Collaborative Filtering", count: 1 },
    { name: "Graph Neural Networks", count: 1 }, { name: "Reinforcement Learning", count: 1 },
  ],
  venues: [
    { name: "WWW", count: 3 }, { name: "CIKM", count: 1 }, { name: "KDD", count: 1 },
    { name: "SIGIR", count: 1 }, { name: "NeurIPS", count: 1 }, { name: "ICDM", count: 1 },
  ],
};

// ============================================================
// Query understanding
// ============================================================
export const MOCK_UNDERSTAND: UnderstandResponse = {
  main_topic: "Adaptive learning for personalized recommendation systems",
  concepts: ["collaborative filtering", "neural networks", "sequential patterns", "user modelling"],
  keywords: ["adaptive learning", "personalized recommendation", "reinforcement learning", "attention mechanism"],
  research_area: "Recommender Systems / Machine Learning",
  synonyms: ["recommendation engine", "personalised filtering", "adaptive filtering"],
  expanded_queries: [
    { id: "q1", text: "personalized recommendation neural networks", type: "synonym" },
    { id: "q2", text: "sequential user behaviour modelling", type: "related" },
    { id: "q3", text: "reinforcement learning recommendation", type: "method" },
    { id: "q4", text: "attention mechanisms in recommendations", type: "method" },
    { id: "q5", text: "adaptive collaborative filtering", type: "synonym" },
  ],
};

// ============================================================
// Paper analysis (paper id=1)
// ============================================================
export const MOCK_ANALYSIS: AnalysisResponse = {
  paper_id: 1,
  full_text_available: false,
  summary: [
    claim("s1", "synthesis", "NCF replaces the inner product with a neural architecture to model user-item interactions, improving recommendation accuracy.", []),
  ],
  research_problem: [
    claim("rp1", "sourced", "Matrix factorization models user-item interactions with an inner product, which may not capture complex non-linear relationships.", [
      src(1, "Introduction", "matrix factorization models are limited by the fixed inner product"),
    ]),
  ],
  methodology: [
    claim("m1", "sourced", "The model uses a multi-layer perceptron to learn the interaction function between user and item embeddings.", [
      src(1, "Method", "a multi-layer perceptron to learn the interaction function"),
    ]),
  ],
  dataset: [
    claim("d1", "sourced", "Experiments are conducted on the MovieLens and Pinterest datasets.", [
      src(1, "Experiments", "MovieLens and Pinterest datasets are used for evaluation"),
    ]),
  ],
  experiments: [
    claim("e1", "sourced", "NCF outperforms state-of-the-art methods on HR@10 and NDCG@10 metrics.", [
      src(1, "Results", "NCF achieves significantly better HR@10 and NDCG@10"),
    ]),
  ],
  metrics: [
    claim("met1", "sourced", "Hit Ratio at 10 (HR@10) and Normalised Discounted Cumulative Gain at 10 (NDCG@10) are the primary metrics.", [
      src(1, "Evaluation", "HR@10 and NDCG@10 are adopted as evaluation metrics"),
    ]),
  ],
  key_findings: [
    claim("kf1", "sourced", "Non-linear neural architectures consistently outperform inner product-based matrix factorization for recommendation.", [
      src(1, "Conclusion", "non-linear activation functions improve over inner product consistently"),
    ]),
  ],
  contributions: [
    claim("c1", "synthesis", "The paper presents a general NCF framework that unifies existing collaborative filtering methods as special cases.", []),
  ],
  limitations: [
    claim("l1", "inference", "The model may struggle with very sparse user interaction data where few examples exist per user.", []),
  ],
  future_work: [
    claim("fw1", "inference", "Combining NCF with side information such as item content or social signals could further improve accuracy.", []),
  ],
};

// ============================================================
// Related papers (paper id=1)
// ============================================================
export const MOCK_RELATED: RelatedResponse = {
  earlier: [
    { paper: MOCK_PAPERS[0], relation: "precedes", explanation: claim("r1", "synthesis", "NCF directly extends matrix factorization, a foundational earlier approach.", []) },
  ],
  later: [
    { paper: MOCK_PAPERS[1], relation: "extends", explanation: claim("r2", "synthesis", "SASRec introduced self-attention to sequential modelling after NCF established neural approaches.", []) },
    { paper: MOCK_PAPERS[2], relation: "extends", explanation: claim("r3", "synthesis", "BERT4Rec applies bidirectional pretraining techniques building on transformer architectures in recommendations.", []) },
  ],
  references: [],
  cited_by: [
    { paper: MOCK_PAPERS[3], relation: "cites", explanation: claim("r4", "synthesis", "Graph-based methods cite NCF as a key baseline for collaborative filtering.", []) },
  ],
  similar_method: [
    { paper: MOCK_PAPERS[5], relation: "similar_method", explanation: claim("r5", "synthesis", "Contrastive learning builds on the same embedding architecture as NCF.", []) },
  ],
  same_dataset: [
    { paper: MOCK_PAPERS[2], relation: "same_dataset", explanation: claim("r6", "sourced", "Both papers evaluate on MovieLens dataset.", [src(3, "Experiments", "MovieLens is used for evaluation in this work")]) },
  ],
};

// ============================================================
// Evolution (paper id=1)
// ============================================================
export const MOCK_EVOLUTION: EvolutionResponse = {
  earlier_count: 2,
  later_count: 5,
  stages: [
    {
      year_range: "2015–2017",
      label: "Matrix Factorization Era",
      papers: [MOCK_PAPERS[0]],
      explanation: claim("ev1", "synthesis", "Neural collaborative filtering emerged as neural alternatives to matrix factorization became viable.", []),
    },
    {
      year_range: "2018–2019",
      label: "Sequential & Attention Models",
      papers: [MOCK_PAPERS[1], MOCK_PAPERS[2]],
      explanation: claim("ev2", "synthesis", "Attention mechanisms and pre-trained models transformed recommendation into a sequential modelling task.", []),
    },
    {
      year_range: "2020–2023",
      label: "RL, GNNs & LLMs",
      papers: [MOCK_PAPERS[4], MOCK_PAPERS[5], MOCK_PAPERS[6]],
      explanation: claim("ev3", "synthesis", "The field expanded to reinforcement learning, graph networks, and large language model integration.", []),
    },
  ],
};

// ============================================================
// Compare (papers 1,2,3)
// ============================================================
export const MOCK_COMPARE: CompareResponse = {
  papers: [MOCK_PAPERS[0], MOCK_PAPERS[1], MOCK_PAPERS[2]],
  rows: [
    {
      feature: "Research Problem",
      cells: {
        "1": claim("cmp1a", "sourced", "Modelling non-linear user-item interactions beyond inner product.", [src(1, "Introduction", "inner product of matrix factorization may be insufficient")]),
        "2": claim("cmp1b", "sourced", "Capturing long-term sequential user behaviour.", [src(2, "Introduction", "user's dynamic interests evolve over time")]),
        "3": claim("cmp1c", "sourced", "Bidirectional context modelling for sequential recommendation.", [src(3, "Introduction", "unidirectional models ignore future context")]),
      },
    },
    {
      feature: "Methodology",
      cells: {
        "1": claim("cmp2a", "sourced", "Multi-layer perceptron on user/item embeddings.", [src(1, "Method", "a multi-layer perceptron over concatenated embeddings")]),
        "2": claim("cmp2b", "sourced", "Self-attention transformer over item sequences.", [src(2, "Method", "self-attention mechanism over item embeddings")]),
        "3": claim("cmp2c", "sourced", "Bidirectional transformer with masked-item prediction.", [src(3, "Method", "masked item prediction with bidirectional attention")]),
      },
    },
    {
      feature: "Dataset",
      cells: {
        "1": claim("cmp3a", "sourced", "MovieLens, Pinterest.", [src(1, "Experiments", "MovieLens and Pinterest")]),
        "2": claim("cmp3b", "sourced", "Amazon, Steam.", [src(2, "Experiments", "Amazon and Steam game datasets")]),
        "3": claim("cmp3c", "sourced", "MovieLens, Amazon Beauty.", [src(3, "Experiments", "MovieLens-1M and Amazon Beauty")]),
      },
    },
    { feature: "Metrics", cells: { "1": claim("cmp4a", "sourced", "HR@10, NDCG@10.", [src(1, "Evaluation", "HR@10 and NDCG@10")]), "2": claim("cmp4b", "sourced", "HR@10, NDCG@10.", [src(2, "Evaluation", "HR and NDCG at 10")]), "3": claim("cmp4c", "sourced", "HR@1, NDCG@10.", [src(3, "Evaluation", "HR@1, NDCG@10")]) } },
    { feature: "Results", cells: { "1": claim("cmp5a", "sourced", "Outperforms MF baselines on all metrics.", [src(1, "Results", "consistently outperforms matrix factorization baselines")]), "2": claim("cmp5b", "sourced", "SASRec achieves state-of-the-art with efficient single-head attention.", [src(2, "Results", "outperforms RNN and CNN baselines significantly")]), "3": claim("cmp5c", "sourced", "BERT4Rec surpasses unidirectional models on most benchmarks.", [src(3, "Results", "bidirectional model outperforms unidirectional counterparts")]) } },
    { feature: "Contributions", cells: { "1": claim("cmp6a", "synthesis", "General NCF framework unifying collaborative filtering with neural architectures.", []), "2": claim("cmp6b", "synthesis", "Efficient self-attention for sequential recommendation with O(n) complexity.", []), "3": claim("cmp6c", "synthesis", "First application of bidirectional BERT-style pretraining to recommendation.", []) } },
    { feature: "Limitations", cells: { "1": claim("cmp7a", "inference", "Does not model temporal dynamics or item sequences.", []), "2": claim("cmp7b", "inference", "Unidirectional — may miss future context signals.", []), "3": null } },
    { feature: "Future Work", cells: { "1": claim("cmp8a", "inference", "Incorporating side information and social signals.", []), "2": claim("cmp8b", "inference", "Extending to cross-domain sequential recommendation.", []), "3": claim("cmp8c", "inference", "Combining with external knowledge graphs.", []) } },
  ],
  narrative: [
    claim("narr1", "synthesis", "All three papers address user-item interaction modelling but differ fundamentally in whether they treat recommendation as a point-wise, sequential, or masked prediction task.", []),
    claim("narr2", "synthesis", "The evolution from NCF (2017) through SASRec (2018) to BERT4Rec (2019) reflects a broader shift from shallow neural models to transformer-based architectures in recommender systems.", []),
  ],
};

// ============================================================
// Graph
// ============================================================
export const MOCK_GRAPH: GraphResponse = {
  nodes: [
    { id: "p1", type: "paper", label: "Neural Collaborative Filtering", meta: { year: 2017 } },
    { id: "p2", type: "paper", label: "SASRec", meta: { year: 2018 } },
    { id: "p3", type: "paper", label: "BERT4Rec", meta: { year: 2019 } },
    { id: "a1", type: "author", label: "Xiangnan He", meta: {} },
    { id: "t1", type: "topic", label: "Sequential Recommendation", meta: {} },
    { id: "m1", type: "method", label: "Self-Attention", meta: {} },
    { id: "d1", type: "dataset", label: "MovieLens", meta: {} },
  ],
  edges: [
    { source: "p1", target: "a1", type: "authored_by" },
    { source: "p1", target: "t1", type: "about" },
    { source: "p2", target: "m1", type: "uses_method" },
    { source: "p3", target: "m1", type: "uses_method" },
    { source: "p1", target: "d1", type: "uses_dataset" },
    { source: "p3", target: "d1", type: "uses_dataset" },
    { source: "p2", target: "p3", type: "related" },
    { source: "p1", target: "p2", type: "cites" },
  ],
};

// ============================================================
// Methods
// ============================================================
export const MOCK_METHODS: MethodsResponse = {
  items: [
    {
      name: "Self-Attention / Transformer",
      description: claim("met_d1", "synthesis", "Self-attention mechanisms allow models to weigh the importance of different items in a sequence dynamically.", []),
      papers: [MOCK_PAPERS[1], MOCK_PAPERS[2]],
      common_uses: [claim("met_u1", "sourced", "Used for modelling item sequences of variable length.", [src(2, "Method", "self-attention over variable-length item sequences")])],
      advantages: [claim("met_a1", "sourced", "Parallelisable training unlike recurrent neural networks.", [src(2, "Method", "computationally efficient compared to RNNs")])],
      limitations: [claim("met_l1", "inference", "Quadratic complexity with sequence length can be costly for very long histories.", [])],
      datasets: ["Amazon", "Steam", "MovieLens"],
    },
    {
      name: "Reinforcement Learning",
      description: claim("met_d2", "synthesis", "Reinforcement learning frames recommendation as sequential decision-making, allowing the agent to optimise long-term user satisfaction.", []),
      papers: [MOCK_PAPERS[4]],
      common_uses: [claim("met_u2", "sourced", "Used to generate recommendations that maximise long-term cumulative reward.", [src(5, "Introduction", "optimising long-term user satisfaction as cumulative reward")])],
      advantages: [claim("met_a2", "synthesis", "Can optimise for long-term engagement rather than short-term click-through.", [])],
      limitations: [claim("met_l2", "inference", "Requires substantial interaction data and is often difficult to train stably.", [])],
      datasets: ["MovieLens", "News Recommendation Dataset"],
    },
  ],
};

// ============================================================
// Datasets
// ============================================================
export const MOCK_DATASETS: DatasetsResponse = {
  items: [
    {
      name: "MovieLens-1M",
      description: "Movie ratings dataset with 1 million ratings from 6,000 users on 4,000 movies.",
      domain: "Entertainment",
      size: "1M ratings",
      tasks: ["Collaborative Filtering", "Sequential Recommendation"],
      papers: [MOCK_PAPERS[0], MOCK_PAPERS[2], MOCK_PAPERS[7]],
      evaluation_use: "Benchmark for accuracy metrics HR@10 and NDCG@10.",
      link: "https://grouplens.org/datasets/movielens/",
    },
    {
      name: "Amazon Product Reviews",
      description: "Product review dataset covering multiple categories including Books, Beauty, and Electronics.",
      domain: "E-Commerce",
      size: null,
      tasks: ["Sequential Recommendation", "Cold-Start"],
      papers: [MOCK_PAPERS[1], MOCK_PAPERS[5]],
      evaluation_use: null,
      link: "https://nijianmo.github.io/amazon/index.html",
    },
  ],
  links: [
    { method: "Self-Attention", dataset: "Amazon Product Reviews", paper_ids: [2] },
    { method: "Reinforcement Learning", dataset: "MovieLens-1M", paper_ids: [5] },
  ],
};

// ============================================================
// Trends
// ============================================================
export const MOCK_TRENDS: TrendsResponse = {
  by_year: [
    { year: 2017, count: 1 }, { year: 2018, count: 1 }, { year: 2019, count: 2 },
    { year: 2020, count: 1 }, { year: 2021, count: 1 }, { year: 2022, count: 1 }, { year: 2023, count: 1 },
  ],
  methods_over_time: [
    { method: "Neural Networks", series: [{ year: 2017, count: 1 }, { year: 2018, count: 0 }, { year: 2019, count: 1 }, { year: 2020, count: 0 }] },
    { method: "Self-Attention", series: [{ year: 2017, count: 0 }, { year: 2018, count: 1 }, { year: 2019, count: 1 }, { year: 2020, count: 0 }] },
    { method: "Reinforcement Learning", series: [{ year: 2017, count: 0 }, { year: 2018, count: 0 }, { year: 2019, count: 0 }, { year: 2021, count: 1 }] },
  ],
  datasets: [
    { name: "MovieLens", count: 4 }, { name: "Amazon", count: 2 },
    { name: "Yelp2018", count: 1 }, { name: "Ciao", count: 1 },
  ],
  keywords: [
    { term: "large language models", direction: "emerging", series: [{ year: 2022, count: 1 }, { year: 2023, count: 3 }] },
    { term: "contrastive learning", direction: "emerging", series: [{ year: 2021, count: 1 }, { year: 2022, count: 2 }] },
    { term: "matrix factorization", direction: "declining", series: [{ year: 2017, count: 3 }, { year: 2018, count: 2 }, { year: 2019, count: 1 }] },
    { term: "self-attention", direction: "stable", series: [{ year: 2018, count: 2 }, { year: 2019, count: 2 }, { year: 2020, count: 1 }, { year: 2021, count: 1 }] },
  ],
};

// ============================================================
// Gaps
// ============================================================
export const MOCK_GAPS: GapsResponse = {
  observations: [
    claim("obs1", "synthesis", "Most papers in this search set focus on short-term interaction sequences, with limited exploration of very long user histories.", []),
    claim("obs2", "synthesis", "Cold-start evaluation is reported in only one of the eight retrieved papers.", []),
  ],
  opportunities: [
    {
      title: "Long-horizon user history modelling",
      description: claim("gap_d1", "inference", "Methods for efficiently representing and utilising multi-year user interaction histories remain underexplored in this literature set.", []),
      wording: "Potentially underexplored",
      supporting_papers: [MOCK_PAPERS[1], MOCK_PAPERS[2]],
    },
    {
      title: "Cross-domain adaptive recommendation",
      description: claim("gap_d2", "inference", "Transfer of learned representations across recommendation domains is addressed by few papers in the current retrieved set.", []),
      wording: "Few papers in the current search set address...",
      supporting_papers: [MOCK_PAPERS[7]],
    },
  ],
  caveat: "These observations are based on 8 papers retrieved for the current search query. They may not represent the full state of the research field.",
};

// ============================================================
// Challenges (paper id=1)
// ============================================================
export const MOCK_CHALLENGES: ChallengesResponse = {
  items: [
    {
      paper: MOCK_PAPERS[1],
      evidence: [
        claim("ch_ev1", "sourced", "SASRec demonstrates that self-attention surpasses MLP-based interaction models on sequential benchmarks.", [
          src(2, "Results", "SASRec outperforms NCF on sequential recommendation tasks"),
        ]),
      ],
      interpretation: claim("ch_int1", "inference", "The results suggest that NCF's point-wise MLP may not adequately capture the sequential nature of user preferences compared to attention-based methods.", []),
    },
  ],
};

// ============================================================
// Conversations
// ============================================================
export const MOCK_SEND_MESSAGE: SendMessageResponse = {
  message: {
    role: "assistant",
    content: "Based on the retrieved papers, the most commonly used methodologies include neural collaborative filtering, self-attention mechanisms, and reinforcement learning approaches.",
    claims: [
      claim("chat1", "synthesis", "Self-attention models (SASRec, BERT4Rec) and neural collaborative filtering are the dominant methodologies across the 8 retrieved papers.", []),
      claim("chat2", "sourced", "SASRec uses self-attention to capture dynamic user interests adaptively.", [src(2, "Method", "self-attention mechanism adaptively captures user interests")]),
    ],
  },
  actions: [],
  literature_state: { search_id: 1, paper_ids: [1, 2, 3], filters: {} },
  agent_trace: [
    { step: "Analysing question", detail: "Identifying relevant methodologies from retrieved papers", status: "done" },
    { step: "Generating answer", detail: "Synthesising findings across 8 papers", status: "done" },
  ],
};

// ============================================================
// Literature review (review_id=1)
// ============================================================
export const MOCK_LITERATURE_REVIEW: LiteratureReviewResponse = {
  status: "done",
  title: "Adaptive Learning for Personalized Recommendation Systems: A Literature Review",
  sections: [
    { heading: "Introduction", blocks: [claim("lr1", "synthesis", "Personalised recommendation systems have evolved significantly with the adoption of deep learning, from matrix factorization to transformer-based sequential models.", [])] },
    { heading: "Background", blocks: [claim("lr2", "synthesis", "The foundational work of neural collaborative filtering established the feasibility of replacing inner products with neural architectures.", [])] },
    { heading: "Methodology", blocks: [claim("lr3", "synthesis", "The dominant methodology has shifted from collaborative filtering to attention-based sequential models over 2017–2023.", [])] },
    { heading: "Datasets", blocks: [claim("lr4", "sourced", "MovieLens and Amazon product datasets are the most commonly used benchmarks.", [src(1, "Experiments", "MovieLens and Amazon are standard benchmarks")])] },
    { heading: "Results", blocks: [claim("lr5", "synthesis", "Transformer-based models consistently outperform RNN and MLP baselines in sequential recommendation tasks.", [])] },
    { heading: "Discussion", blocks: [claim("lr6", "synthesis", "The field is trending towards pre-trained LLMs and contrastive learning paradigms for recommendation.", [])] },
    { heading: "Research Gaps", blocks: [claim("lr7", "inference", "Few papers in the current search set address long-horizon history modelling or robust cross-domain transfer.", [])] },
    { heading: "Future Directions", blocks: [claim("lr8", "inference", "Combining LLMs with structured knowledge graphs may address cold-start and cross-domain challenges.", [])] },
    { heading: "Contributions", blocks: [claim("lr9", "synthesis", "Key contributions span interpretable neural architectures, efficient attention, and meta-learning for cold-start.", [])] },
    { heading: "Limitations of the Literature", blocks: [claim("lr10", "inference", "Most work evaluates on small, curated benchmark datasets, limiting real-world generalisability.", [])] },
    { heading: "Methodology Comparison", blocks: [claim("lr11", "synthesis", "Self-attention methods dominate the 2018–2023 period, with reinforcement learning as a growing alternative.", [])] },
    { heading: "Conclusion", blocks: [claim("lr12", "synthesis", "The trajectory from NCF to LLM-based recommenders illustrates rapid methodological progress requiring equally rapid evaluation frameworks.", [])] },
  ],
  references: [
    src(1, "Introduction", "NCF replaces inner product with neural interaction function"),
    src(2, "Method", "SASRec uses causal self-attention over item sequences"),
    src(3, "Method", "BERT4Rec applies masked item modelling with bidirectional attention"),
  ],
};

// ============================================================
// Dashboard
// ============================================================
export const MOCK_DASHBOARD: DashboardResponse = {
  active_topics: ["Adaptive Recommendation", "Sequential Modelling", "LLMs for Recommendation"],
  recent_papers: MOCK_PAPERS.slice(0, 3),
  saved_count: 5,
  recent_searches: [
    { search_id: 1, query: "Adaptive learning for personalized recommendation systems", created_at: new Date(Date.now() - 86400000).toISOString(), result_count: 8, saved_count: 3, related_topics: ["Sequential Recommendation", "Neural Collaborative Filtering"] },
  ],
  emerging_topics: ["Contrastive Learning", "LLM-based Recommendation", "Cross-domain Transfer"],
  recommended: [MOCK_PAPERS[5], MOCK_PAPERS[6]],
  activity: [
    { date: new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10), count: 2 },
    { date: new Date(Date.now() - 5 * 86400000).toISOString().slice(0, 10), count: 4 },
    { date: new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10), count: 1 },
    { date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10), count: 5 },
    { date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10), count: 3 },
    { date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), count: 6 },
    { date: new Date().toISOString().slice(0, 10), count: 2 },
  ],
};

// ============================================================
// Recommendations
// ============================================================
export const MOCK_RECOMMENDATIONS: RecommendationsResponse = {
  items: [
    {
      paper: MOCK_PAPERS[5],
      reason: claim("rec1", "synthesis", "Matches your interest in self-supervised learning for recommendation and uses the Yelp2018 dataset you have explored.", []),
    },
    {
      paper: MOCK_PAPERS[6],
      reason: claim("rec2", "synthesis", "Aligns with your recent searches on LLM-based recommendation and conversational systems.", []),
    },
  ],
};

// ============================================================
// History
// ============================================================
export const MOCK_HISTORY: HistoryItem[] = [
  { search_id: 1, query: "Adaptive learning for personalized recommendation systems", created_at: new Date(Date.now() - 86400000).toISOString(), result_count: 8, saved_count: 3, related_topics: ["Sequential Recommendation", "Neural Collaborative Filtering"] },
  { search_id: 2, query: "Contrastive learning self-supervised recommendation", created_at: new Date(Date.now() - 2 * 86400000).toISOString(), result_count: 6, saved_count: 1, related_topics: ["Contrastive Learning", "Graph Neural Networks"] },
];

// ============================================================
// Library
// ============================================================
export const MOCK_LIBRARY: LibraryResponse = {
  items: [
    { paper: MOCK_PAPERS[0], status: "read", bookmarked: true, tags: ["core", "must-read"], collection_ids: [1], saved_at: new Date(Date.now() - 86400000).toISOString() },
    { paper: MOCK_PAPERS[1], status: "unread", bookmarked: false, tags: ["attention"], collection_ids: [1], saved_at: new Date().toISOString() },
    { paper: MOCK_PAPERS[4], status: "unread", bookmarked: true, tags: ["rl"], collection_ids: [], saved_at: new Date().toISOString() },
  ],
};

// ============================================================
// Collections
// ============================================================
export const MOCK_COLLECTIONS: CollectionData[] = [
  { id: 1, name: "Core Recommendation Papers", description: "Foundational papers for the literature review", paper_count: 2 },
  { id: 2, name: "RL Methods", description: null, paper_count: 1 },
];

// ============================================================
// Profile
// ============================================================
export const MOCK_PROFILE: ProfileData = {
  name: "Demo Researcher",
  interests: ["Recommendation Systems", "Deep Learning", "Sequential Modelling"],
  preferred_domains: ["Machine Learning", "Information Retrieval"],
  favorite_methods: ["Self-Attention", "Graph Neural Networks"],
  topics_researching: ["Adaptive Learning", "Personalisation", "LLMs for RecSys"],
};
