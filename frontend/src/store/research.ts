import { create } from "zustand";
import type { SearchFilters } from "@/lib/types";

interface ResearchState {
  // Current search context
  searchId: number | null;
  query: string;
  expandedQueries: string[];
  filters: SearchFilters;

  // Selected papers (for comparison, multi-qa, etc.)
  selectedPaperIds: number[];

  // Conversation
  conversationId: number | null;

  // Actions
  setSearchId: (id: number | null) => void;
  setQuery: (query: string) => void;
  setExpandedQueries: (queries: string[]) => void;
  setFilters: (filters: SearchFilters) => void;
  setConversationId: (id: number | null) => void;
  togglePaperSelection: (paperId: number) => void;
  setSelectedPaperIds: (ids: number[]) => void;
  clearSelectedPapers: () => void;
  resetSearch: () => void;
}

const initialFilters: SearchFilters = {};

export const useResearchStore = create<ResearchState>((set) => ({
  searchId: null,
  query: "",
  expandedQueries: [],
  filters: initialFilters,
  selectedPaperIds: [],
  conversationId: null,

  setSearchId: (id) => set({ searchId: id }),
  setQuery: (query) => set({ query }),
  setExpandedQueries: (queries) => set({ expandedQueries: queries }),
  setFilters: (filters) => set({ filters }),
  setConversationId: (id) => set({ conversationId: id }),

  togglePaperSelection: (paperId) =>
    set((state) => ({
      selectedPaperIds: state.selectedPaperIds.includes(paperId)
        ? state.selectedPaperIds.filter((id) => id !== paperId)
        : [...state.selectedPaperIds, paperId],
    })),

  setSelectedPaperIds: (ids) => set({ selectedPaperIds: ids }),
  clearSelectedPapers: () => set({ selectedPaperIds: [] }),

  resetSearch: () =>
    set({
      searchId: null,
      query: "",
      expandedQueries: [],
      filters: initialFilters,
      selectedPaperIds: [],
      conversationId: null,
    }),
}));
