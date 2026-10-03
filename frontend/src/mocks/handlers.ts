import {
  UnderstandRequest,
  UnderstandResponse,
  SearchRequest,
  SearchResponse,
  PaperDetail,
  AnalysisResponse,
  RelatedResponse,
  EvolutionResponse,
  ChallengeRequest,
  ChallengesResponse,
  PaperQARequest,
  PaperQAResponse,
  UploadStatusResponse,
  CompareRequest,
  CompareResponse,
  GraphResponse,
  MethodsResponse,
  DatasetsResponse,
  TrendsResponse,
  TrendsYearResponse,
  GapsRequest,
  GapsResponse,
  MultiQARequest,
  MultiQAResponse,
  LiteratureReviewRequest,
  LiteratureReviewCreateResponse,
  LiteratureReviewResponse,
  ConversationCreateResponse,
  ConversationDetail,
  SendMessageRequest,
  SendMessageResponse,
  ProfileData,
  LibraryResponse,
  SavePaperRequest,
  LibraryItem,
  UpdateSavedPaperRequest,
  CollectionData,
  CreateCollectionRequest,
  UpdateCollectionRequest,
  NoteData,
  CreateNoteRequest,
  AnnotationData,
  CreateAnnotationRequest,
  HistoryItem,
  HistoryResponse,
  DashboardResponse,
  RecommendationsResponse,
  SearchFilters,
  ConversationListItem,
} from "@/lib/types";
import {
  MOCK_UNDERSTAND,
  MOCK_SEARCH_ITEMS,
  MOCK_FACETS,
  MOCK_ANALYSIS,
  MOCK_RELATED,
  MOCK_EVOLUTION,
  MOCK_COMPARE,
  MOCK_GRAPH,
  MOCK_METHODS,
  MOCK_DATASETS,
  MOCK_TRENDS,
  MOCK_GAPS,
  MOCK_CHALLENGES,
  MOCK_SEND_MESSAGE,
  MOCK_LITERATURE_REVIEW,
  MOCK_DASHBOARD,
  MOCK_RECOMMENDATIONS,
  MOCK_HISTORY,
  MOCK_LIBRARY,
  MOCK_COLLECTIONS,
  MOCK_PROFILE,
  MOCK_PAPERS,
} from "./fixtures/index";

const delay = <T>(ms: number, val: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(val), ms));

const D = 400; // standard mock delay ms

// ============================================================
// C4 handlers
// ============================================================
export const MockHandlers = {
  // POST /query/understand
  understand: (_req: UnderstandRequest): Promise<UnderstandResponse> =>
    delay(D, MOCK_UNDERSTAND),

  // POST /search
  search: (_req: SearchRequest): Promise<SearchResponse> =>
    delay(D * 2, {
      search_id: 1,
      total: MOCK_SEARCH_ITEMS.length,
      page: 1,
      page_size: 10,
      items: MOCK_SEARCH_ITEMS,
      facets: MOCK_FACETS,
      agent_trace: [
        { step: "Query expansion", detail: "Generated 5 expanded queries", status: "done" },
        { step: "Retrieval", detail: "Retrieved 8 papers using hybrid BM25 + semantic search", status: "done" },
        { step: "Ranking", detail: "Ranked results with interpretable signals", status: "done" },
      ],
    }),

  // GET /search/{id}
  getSearch: (searchId: number): Promise<SearchResponse> =>
    delay(D, {
      search_id: searchId,
      total: MOCK_SEARCH_ITEMS.length,
      page: 1,
      page_size: 10,
      items: MOCK_SEARCH_ITEMS,
      facets: MOCK_FACETS,
      agent_trace: [],
    }),

  // GET /papers/{id}
  getPaper: (id: number): Promise<PaperDetail> => {
    const paper = MOCK_PAPERS.find((p) => p.id === id) ?? MOCK_PAPERS[0];
    return delay(D, { ...paper, chunks_available: false });
  },

  // GET /papers/{id}/analysis
  getAnalysis: (_id: number): Promise<AnalysisResponse> =>
    delay(D, MOCK_ANALYSIS),

  // GET /papers/{id}/related
  getRelated: (_id: number): Promise<RelatedResponse> =>
    delay(D, MOCK_RELATED),

  // GET /papers/{id}/evolution
  getEvolution: (_id: number): Promise<EvolutionResponse> =>
    delay(D, MOCK_EVOLUTION),

  // POST /papers/{id}/challenges
  getChallenges: (_id: number, _req: ChallengeRequest): Promise<ChallengesResponse> =>
    delay(D, MOCK_CHALLENGES),

  // POST /papers/{id}/qa
  paperQA: (_id: number, _req: PaperQARequest): Promise<PaperQAResponse> =>
    delay(D, { answer: MOCK_ANALYSIS.summary }),

  // POST /upload
  upload: (): Promise<{ upload_id: string; status: "queued" }> =>
    delay(D, { upload_id: "upload-mock-001", status: "queued" }),

  // GET /upload/{id}
  getUpload: (_uploadId: string): Promise<UploadStatusResponse> =>
    delay(D * 3, {
      status: "done" as const,
      paper: MOCK_PAPERS[0],
      structure: {
        title: MOCK_PAPERS[0].title,
        authors: MOCK_PAPERS[0].authors.map((a) => a.name),
        year: MOCK_PAPERS[0].year,
        abstract: MOCK_PAPERS[0].abstract,
        keywords: MOCK_PAPERS[0].keywords,
        methodology: "Multi-layer perceptron over user/item embeddings.",
        datasets: MOCK_PAPERS[0].datasets,
        findings: "NCF outperforms matrix factorization on standard benchmarks.",
        limitations: "Does not model sequential user preferences.",
        references: ["Matrix Factorization Techniques for Recommender Systems"],
        future_work: "Incorporating side information and social signals.",
      },
    }),

  // POST /compare
  compare: (_req: CompareRequest): Promise<CompareResponse> =>
    delay(D * 2, MOCK_COMPARE),

  // GET /graph
  getGraph: (): Promise<GraphResponse> =>
    delay(D, MOCK_GRAPH),

  // GET /methods
  getMethods: (): Promise<MethodsResponse> =>
    delay(D, MOCK_METHODS),

  // GET /datasets
  getDatasets: (): Promise<DatasetsResponse> =>
    delay(D, MOCK_DATASETS),

  // GET /trends
  getTrends: (): Promise<TrendsResponse> =>
    delay(D, MOCK_TRENDS),

  // GET /trends/year/{year}
  getTrendsYear: (year: number): Promise<TrendsYearResponse> =>
    delay(D, { papers: MOCK_PAPERS.filter((p) => p.year === year) }),

  // POST /gaps
  getGaps: (_req: GapsRequest): Promise<GapsResponse> =>
    delay(D * 2, MOCK_GAPS),

  // POST /multi-qa
  multiQA: (_req: MultiQARequest): Promise<MultiQAResponse> =>
    delay(D, { answer: MOCK_ANALYSIS.key_findings }),

  // POST /literature-review
  createReview: (_req: LiteratureReviewRequest): Promise<LiteratureReviewCreateResponse> =>
    delay(D, { review_id: 1, status: "queued" }),

  // GET /literature-review/{id}
  getReview: (_id: number): Promise<LiteratureReviewResponse> =>
    delay(D * 3, MOCK_LITERATURE_REVIEW),

  // POST /conversations
  createConversation: (): Promise<ConversationCreateResponse> =>
    delay(D, { id: 1 }),

  // GET /conversations
  listConversations: (): Promise<ConversationListItem[]> =>
    delay(D, [{ id: 1, created_at: new Date().toISOString(), message_count: 0 }]),

  // GET /conversations/{id}
  getConversation: (_id: number): Promise<ConversationDetail> =>
    delay(D, { id: 1, messages: [] }),

  // POST /conversations/{id}/messages
  sendMessage: (_id: number, _req: SendMessageRequest): Promise<SendMessageResponse> =>
    delay(D * 2, MOCK_SEND_MESSAGE),

  // ============================================================
  // C5 handlers (Person 2 endpoints)
  // ============================================================

  // GET /profile
  getProfile: (): Promise<ProfileData> =>
    delay(D, MOCK_PROFILE),

  // PUT /profile
  updateProfile: (data: Partial<ProfileData>): Promise<ProfileData> =>
    delay(D, { ...MOCK_PROFILE, ...data }),

  // GET /library
  getLibrary: (): Promise<LibraryResponse> =>
    delay(D, MOCK_LIBRARY),

  // POST /library/papers
  savePaper: (req: SavePaperRequest): Promise<LibraryItem> => {
    const paper = MOCK_PAPERS.find((p) => p.id === req.paper_id) ?? MOCK_PAPERS[0];
    return delay(D, {
      paper,
      status: "unread" as const,
      bookmarked: false,
      tags: req.tags ?? [],
      collection_ids: req.collection_id ? [req.collection_id] : [],
      saved_at: new Date().toISOString(),
    });
  },

  // PATCH /library/papers/{paper_id}
  updateSavedPaper: (_paperId: number, data: UpdateSavedPaperRequest): Promise<LibraryItem> =>
    delay(D, { ...MOCK_LIBRARY.items[0], ...data }),

  // DELETE /library/papers/{paper_id}
  deleteSavedPaper: (_paperId: number): Promise<void> =>
    delay(D, undefined),

  // GET /collections
  getCollections: (): Promise<CollectionData[]> =>
    delay(D, MOCK_COLLECTIONS),

  // POST /collections
  createCollection: (req: CreateCollectionRequest): Promise<CollectionData> =>
    delay(D, { id: Date.now(), name: req.name, description: req.description ?? null, paper_count: 0 }),

  // PATCH /collections/{id}
  updateCollection: (id: number, req: UpdateCollectionRequest): Promise<CollectionData> => {
    const col = MOCK_COLLECTIONS.find((c) => c.id === id) ?? MOCK_COLLECTIONS[0];
    return delay(D, { ...col, ...req });
  },

  // DELETE /collections/{id}
  deleteCollection: (_id: number): Promise<void> =>
    delay(D, undefined),

  // POST /collections/{id}/papers/{paper_id}
  addPaperToCollection: (): Promise<void> =>
    delay(D, undefined),

  // DELETE /collections/{id}/papers/{paper_id}
  removePaperFromCollection: (): Promise<void> =>
    delay(D, undefined),

  // GET /papers/{id}/notes
  getNotes: (paperId: number): Promise<NoteData[]> =>
    delay(D, [{ id: 1, paper_id: paperId, body: "Key paper for NCF baseline.", created_at: new Date().toISOString() }]),

  // POST /papers/{id}/notes
  createNote: (paperId: number, req: CreateNoteRequest): Promise<NoteData> =>
    delay(D, { id: Date.now(), paper_id: paperId, body: req.body, created_at: new Date().toISOString() }),

  // PATCH /notes/{id}
  updateNote: (id: number, req: Partial<CreateNoteRequest>): Promise<NoteData> =>
    delay(D, { id, paper_id: 1, body: req.body ?? "", created_at: new Date().toISOString() }),

  // DELETE /notes/{id}
  deleteNote: (_id: number): Promise<void> =>
    delay(D, undefined),

  // GET /papers/{id}/annotations
  getAnnotations: (paperId: number): Promise<AnnotationData[]> =>
    delay(D, [{ id: 1, paper_id: paperId, section: "Introduction", page: null, text_selection: "inner product", comment: "This is the key claim" }]),

  // POST /papers/{id}/annotations
  createAnnotation: (paperId: number, req: CreateAnnotationRequest): Promise<AnnotationData> =>
    delay(D, { id: Date.now(), paper_id: paperId, section: req.section ?? null, page: req.page ?? null, text_selection: req.text_selection ?? null, comment: req.comment }),

  // PATCH /annotations/{id}
  updateAnnotation: (id: number, req: Partial<CreateAnnotationRequest>): Promise<AnnotationData> =>
    delay(D, { id, paper_id: 1, section: req.section ?? null, page: req.page ?? null, text_selection: req.text_selection ?? null, comment: req.comment ?? "" }),

  // DELETE /annotations/{id}
  deleteAnnotation: (_id: number): Promise<void> =>
    delay(D, undefined),

  // GET /history
  getHistory: (): Promise<HistoryResponse> =>
    delay(D, { items: MOCK_HISTORY }),

  // GET /history/{id}
  getHistoryItem: (id: number): Promise<HistoryItem> =>
    delay(D, MOCK_HISTORY.find((h) => h.search_id === id) ?? MOCK_HISTORY[0]),

  // DELETE /history/{id}
  deleteHistoryItem: (_id: number): Promise<void> =>
    delay(D, undefined),

  // GET /dashboard
  getDashboard: (): Promise<DashboardResponse> =>
    delay(D, MOCK_DASHBOARD),

  // GET /recommendations
  getRecommendations: (): Promise<RecommendationsResponse> =>
    delay(D, MOCK_RECOMMENDATIONS),

  // GET /export/review/{id}?format=...
  exportReview: (reviewId: number, format: string): Promise<Blob> => {
    const content = `# Literature Review (${format.toUpperCase()})\n\nReview ID: ${reviewId}\n\n[AI-generated synthesis — see section labels]\n`;
    return delay(D * 2, new Blob([content], { type: "text/plain" }));
  },
};
