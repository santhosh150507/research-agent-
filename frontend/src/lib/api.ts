import { MockHandlers } from "@/mocks/handlers";
import type {
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
  HistoryResponse,
  HistoryItem,
  DashboardResponse,
  RecommendationsResponse,
  ExportFormat,
  SearchFilters,
  ConversationListItem,
} from "./types";

// ============================================================
// Error class
// ============================================================
export class ApiError extends Error {
  code: string;
  status: number;
  constructor(message: string, code = "UNKNOWN_ERROR", status = 500) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

// ============================================================
// Config
// ============================================================
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1").replace(/\/$/, "");

// ============================================================
// Fetch wrapper
// ============================================================
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    let code = "HTTP_ERROR";
    let message = res.statusText;
    try {
      const body = await res.json();
      code = body?.error?.code ?? code;
      message = body?.error?.message ?? message;
    } catch {
      // ignore
    }
    throw new ApiError(message, code, res.status);
  }
  return res.json();
}

async function fetchBlob(endpoint: string): Promise<Blob> {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) throw new ApiError(res.statusText, "HTTP_ERROR", res.status);
  return res.blob();
}

// ============================================================
// API — C4 (Person 1 endpoints)
// ============================================================
export const api = {
  // ---- Query --------------------------------------------------
  understand: (req: UnderstandRequest): Promise<UnderstandResponse> =>
    USE_MOCKS ? MockHandlers.understand(req)
      : fetchApi("/query/understand", { method: "POST", body: JSON.stringify(req) }),

  // ---- Search -------------------------------------------------
  search: (req: SearchRequest): Promise<SearchResponse> =>
    USE_MOCKS ? MockHandlers.search(req)
      : fetchApi("/search", { method: "POST", body: JSON.stringify(req) }),

  getSearch: (searchId: number, params?: { page?: number; sort?: string; filters?: SearchFilters }): Promise<SearchResponse> => {
    if (USE_MOCKS) return MockHandlers.getSearch(searchId);
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.sort) qs.set("sort", params.sort);
    return fetchApi(`/search/${searchId}?${qs}`);
  },

  // ---- Papers -------------------------------------------------
  getPaper: (id: number): Promise<PaperDetail> =>
    USE_MOCKS ? MockHandlers.getPaper(id) : fetchApi(`/papers/${id}`),

  getAnalysis: (id: number): Promise<AnalysisResponse> =>
    USE_MOCKS ? MockHandlers.getAnalysis(id) : fetchApi(`/papers/${id}/analysis`),

  getRelated: (id: number): Promise<RelatedResponse> =>
    USE_MOCKS ? MockHandlers.getRelated(id) : fetchApi(`/papers/${id}/related`),

  getEvolution: (id: number): Promise<EvolutionResponse> =>
    USE_MOCKS ? MockHandlers.getEvolution(id) : fetchApi(`/papers/${id}/evolution`),

  getChallenges: (id: number, req: ChallengeRequest): Promise<ChallengesResponse> =>
    USE_MOCKS ? MockHandlers.getChallenges(id, req)
      : fetchApi(`/papers/${id}/challenges`, { method: "POST", body: JSON.stringify(req) }),

  paperQA: (id: number, req: PaperQARequest): Promise<PaperQAResponse> =>
    USE_MOCKS ? MockHandlers.paperQA(id, req)
      : fetchApi(`/papers/${id}/qa`, { method: "POST", body: JSON.stringify(req) }),

  // ---- Upload -------------------------------------------------
  uploadPaper: (file: File): Promise<{ upload_id: string; status: string }> => {
    if (USE_MOCKS) return MockHandlers.upload();
    const form = new FormData();
    form.append("file", file);
    return fetchApi("/upload", { method: "POST", body: form, headers: {} });
  },

  getUpload: (uploadId: string): Promise<UploadStatusResponse> =>
    USE_MOCKS ? MockHandlers.getUpload(uploadId) : fetchApi(`/upload/${uploadId}`),

  // ---- Compare ------------------------------------------------
  compare: (req: CompareRequest): Promise<CompareResponse> =>
    USE_MOCKS ? MockHandlers.compare(req)
      : fetchApi("/compare", { method: "POST", body: JSON.stringify(req) }),

  // ---- Graph --------------------------------------------------
  getGraph: (params: { search_id?: number; paper_ids?: number[]; depth?: number }): Promise<GraphResponse> => {
    if (USE_MOCKS) return MockHandlers.getGraph();
    const qs = new URLSearchParams();
    if (params.search_id) qs.set("search_id", String(params.search_id));
    if (params.paper_ids?.length) qs.set("paper_ids", params.paper_ids.join(","));
    if (params.depth) qs.set("depth", String(params.depth));
    return fetchApi(`/graph?${qs}`);
  },

  // ---- Methods / Datasets ------------------------------------
  getMethods: (searchId?: number): Promise<MethodsResponse> => {
    if (USE_MOCKS) return MockHandlers.getMethods();
    const qs = searchId ? `?search_id=${searchId}` : "";
    return fetchApi(`/methods${qs}`);
  },

  getDatasets: (params?: { search_id?: number; domain?: string; task?: string; method?: string; min_size?: number }): Promise<DatasetsResponse> => {
    if (USE_MOCKS) return MockHandlers.getDatasets();
    const qs = new URLSearchParams();
    if (params?.search_id) qs.set("search_id", String(params.search_id));
    if (params?.domain) qs.set("domain", params.domain);
    if (params?.task) qs.set("task", params.task);
    if (params?.method) qs.set("method", params.method);
    if (params?.min_size) qs.set("min_size", String(params.min_size));
    return fetchApi(`/datasets?${qs}`);
  },

  // ---- Trends -------------------------------------------------
  getTrends: (searchId?: number): Promise<TrendsResponse> => {
    if (USE_MOCKS) return MockHandlers.getTrends();
    const qs = searchId ? `?search_id=${searchId}` : "";
    return fetchApi(`/trends${qs}`);
  },

  getTrendsYear: (year: number, searchId?: number): Promise<TrendsYearResponse> => {
    if (USE_MOCKS) return MockHandlers.getTrendsYear(year);
    const qs = searchId ? `?search_id=${searchId}` : "";
    return fetchApi(`/trends/year/${year}${qs}`);
  },

  // ---- Gaps ---------------------------------------------------
  getGaps: (req: GapsRequest): Promise<GapsResponse> =>
    USE_MOCKS ? MockHandlers.getGaps(req)
      : fetchApi("/gaps", { method: "POST", body: JSON.stringify(req) }),

  // ---- Multi-QA -----------------------------------------------
  multiQA: (req: MultiQARequest): Promise<MultiQAResponse> =>
    USE_MOCKS ? MockHandlers.multiQA(req)
      : fetchApi("/multi-qa", { method: "POST", body: JSON.stringify(req) }),

  // ---- Literature Review --------------------------------------
  createReview: (req: LiteratureReviewRequest): Promise<LiteratureReviewCreateResponse> =>
    USE_MOCKS ? MockHandlers.createReview(req)
      : fetchApi("/literature-review", { method: "POST", body: JSON.stringify(req) }),

  getReview: (reviewId: number): Promise<LiteratureReviewResponse> =>
    USE_MOCKS ? MockHandlers.getReview(reviewId)
      : fetchApi(`/literature-review/${reviewId}`),

  // ---- Conversations ------------------------------------------
  createConversation: (): Promise<ConversationCreateResponse> =>
    USE_MOCKS ? MockHandlers.createConversation()
      : fetchApi("/conversations", { method: "POST", body: JSON.stringify({}) }),

  listConversations: (): Promise<ConversationListItem[]> =>
    USE_MOCKS ? MockHandlers.listConversations() : fetchApi("/conversations"),

  getConversation: (id: number): Promise<ConversationDetail> =>
    USE_MOCKS ? MockHandlers.getConversation(id) : fetchApi(`/conversations/${id}`),

  sendMessage: (id: number, req: SendMessageRequest): Promise<SendMessageResponse> =>
    USE_MOCKS ? MockHandlers.sendMessage(id, req)
      : fetchApi(`/conversations/${id}/messages`, { method: "POST", body: JSON.stringify(req) }),

  // ============================================================
  // C5 — Person 2 workspace endpoints
  // ============================================================

  // ---- Profile ------------------------------------------------
  getProfile: (): Promise<ProfileData> =>
    USE_MOCKS ? MockHandlers.getProfile() : fetchApi("/profile"),

  updateProfile: (data: Partial<ProfileData>): Promise<ProfileData> =>
    USE_MOCKS ? MockHandlers.updateProfile(data)
      : fetchApi("/profile", { method: "PUT", body: JSON.stringify(data) }),

  // ---- Library ------------------------------------------------
  getLibrary: (params?: { status?: string; tag?: string; collection_id?: number; bookmarked?: boolean; q?: string }): Promise<LibraryResponse> => {
    if (USE_MOCKS) return MockHandlers.getLibrary();
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.tag) qs.set("tag", params.tag);
    if (params?.collection_id) qs.set("collection_id", String(params.collection_id));
    if (params?.bookmarked !== undefined) qs.set("bookmarked", String(params.bookmarked));
    if (params?.q) qs.set("q", params.q);
    return fetchApi(`/library?${qs}`);
  },

  savePaper: (req: SavePaperRequest): Promise<LibraryItem> =>
    USE_MOCKS ? MockHandlers.savePaper(req)
      : fetchApi("/library/papers", { method: "POST", body: JSON.stringify(req) }),

  updateSavedPaper: (paperId: number, req: UpdateSavedPaperRequest): Promise<LibraryItem> =>
    USE_MOCKS ? MockHandlers.updateSavedPaper(paperId, req)
      : fetchApi(`/library/papers/${paperId}`, { method: "PATCH", body: JSON.stringify(req) }),

  deleteSavedPaper: (paperId: number): Promise<void> =>
    USE_MOCKS ? MockHandlers.deleteSavedPaper(paperId)
      : fetchApi(`/library/papers/${paperId}`, { method: "DELETE" }),

  // ---- Collections --------------------------------------------
  getCollections: (): Promise<CollectionData[]> =>
    USE_MOCKS ? MockHandlers.getCollections() : fetchApi("/collections"),

  createCollection: (req: CreateCollectionRequest): Promise<CollectionData> =>
    USE_MOCKS ? MockHandlers.createCollection(req)
      : fetchApi("/collections", { method: "POST", body: JSON.stringify(req) }),

  updateCollection: (id: number, req: UpdateCollectionRequest): Promise<CollectionData> =>
    USE_MOCKS ? MockHandlers.updateCollection(id, req)
      : fetchApi(`/collections/${id}`, { method: "PATCH", body: JSON.stringify(req) }),

  deleteCollection: (id: number): Promise<void> =>
    USE_MOCKS ? MockHandlers.deleteCollection(id)
      : fetchApi(`/collections/${id}`, { method: "DELETE" }),

  addPaperToCollection: (collectionId: number, paperId: number): Promise<void> =>
    USE_MOCKS ? MockHandlers.addPaperToCollection()
      : fetchApi(`/collections/${collectionId}/papers/${paperId}`, { method: "POST", body: "{}" }),

  removePaperFromCollection: (collectionId: number, paperId: number): Promise<void> =>
    USE_MOCKS ? MockHandlers.removePaperFromCollection()
      : fetchApi(`/collections/${collectionId}/papers/${paperId}`, { method: "DELETE" }),

  // ---- Notes --------------------------------------------------
  getNotes: (paperId: number): Promise<NoteData[]> =>
    USE_MOCKS ? MockHandlers.getNotes(paperId) : fetchApi(`/papers/${paperId}/notes`),

  createNote: (paperId: number, req: CreateNoteRequest): Promise<NoteData> =>
    USE_MOCKS ? MockHandlers.createNote(paperId, req)
      : fetchApi(`/papers/${paperId}/notes`, { method: "POST", body: JSON.stringify(req) }),

  updateNote: (noteId: number, req: Partial<CreateNoteRequest>): Promise<NoteData> =>
    USE_MOCKS ? MockHandlers.updateNote(noteId, req)
      : fetchApi(`/notes/${noteId}`, { method: "PATCH", body: JSON.stringify(req) }),

  deleteNote: (noteId: number): Promise<void> =>
    USE_MOCKS ? MockHandlers.deleteNote(noteId)
      : fetchApi(`/notes/${noteId}`, { method: "DELETE" }),

  // ---- Annotations --------------------------------------------
  getAnnotations: (paperId: number): Promise<AnnotationData[]> =>
    USE_MOCKS ? MockHandlers.getAnnotations(paperId) : fetchApi(`/papers/${paperId}/annotations`),

  createAnnotation: (paperId: number, req: CreateAnnotationRequest): Promise<AnnotationData> =>
    USE_MOCKS ? MockHandlers.createAnnotation(paperId, req)
      : fetchApi(`/papers/${paperId}/annotations`, { method: "POST", body: JSON.stringify(req) }),

  updateAnnotation: (annotationId: number, req: Partial<CreateAnnotationRequest>): Promise<AnnotationData> =>
    USE_MOCKS ? MockHandlers.updateAnnotation(annotationId, req)
      : fetchApi(`/annotations/${annotationId}`, { method: "PATCH", body: JSON.stringify(req) }),

  deleteAnnotation: (annotationId: number): Promise<void> =>
    USE_MOCKS ? MockHandlers.deleteAnnotation(annotationId)
      : fetchApi(`/annotations/${annotationId}`, { method: "DELETE" }),

  // ---- History ------------------------------------------------
  getHistory: (): Promise<HistoryResponse> =>
    USE_MOCKS ? MockHandlers.getHistory() : fetchApi("/history"),

  getHistoryItem: (id: number): Promise<HistoryItem> =>
    USE_MOCKS ? MockHandlers.getHistoryItem(id) : fetchApi(`/history/${id}`),

  deleteHistoryItem: (id: number): Promise<void> =>
    USE_MOCKS ? MockHandlers.deleteHistoryItem(id)
      : fetchApi(`/history/${id}`, { method: "DELETE" }),

  // ---- Dashboard ----------------------------------------------
  getDashboard: (): Promise<DashboardResponse> =>
    USE_MOCKS ? MockHandlers.getDashboard() : fetchApi("/dashboard"),

  // ---- Recommendations ----------------------------------------
  getRecommendations: (): Promise<RecommendationsResponse> =>
    USE_MOCKS ? MockHandlers.getRecommendations() : fetchApi("/recommendations"),

  // ---- Export -------------------------------------------------
  exportReview: (reviewId: number, format: ExportFormat): Promise<Blob> =>
    USE_MOCKS ? MockHandlers.exportReview(reviewId, format)
      : fetchBlob(`/export/review/${reviewId}?format=${format}`),
};
