"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SearchFilters, ExpandedQuery } from "@/lib/types";

export type ActiveTab = "papers" | "timeline" | "graph" | "compare" | "trends" | "gaps";

export interface ResearchState {
  // Search identity
  search_id: number | null;
  query: string;
  expanded_queries: ExpandedQuery[];
  filters: SearchFilters;
  sort: "relevance" | "year" | "citations" | "recency";
  page: number;

  // Paper selection
  selected_paper_ids: number[];

  // UI state
  active_tab: ActiveTab;

  // Chat
  conversation_id: number | null;

  // Synced from chat agent
  literature_state: {
    search_id: number | null;
    paper_ids: number[];
    filters: SearchFilters;
  };

  // Actions
  setSearchId: (id: number | null) => void;
  setQuery: (q: string) => void;
  setExpandedQueries: (eqs: ExpandedQuery[]) => void;
  setFilters: (f: SearchFilters) => void;
  setSort: (s: ResearchState["sort"]) => void;
  setPage: (p: number) => void;
  togglePaper: (id: number) => void;
  selectPapers: (ids: number[]) => void;
  clearSelection: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  setConversationId: (id: number | null) => void;
  applyLiteratureState: (ls: ResearchState["literature_state"]) => void;
  resetResearch: () => void;
}

const initialState = {
  search_id: null,
  query: "",
  expanded_queries: [] as ExpandedQuery[],
  filters: {} as SearchFilters,
  sort: "relevance" as const,
  page: 1,
  selected_paper_ids: [] as number[],
  active_tab: "papers" as ActiveTab,
  conversation_id: null,
  literature_state: { search_id: null, paper_ids: [] as number[], filters: {} as SearchFilters },
};

export const useResearchStore = create<ResearchState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSearchId: (id) => set({ search_id: id }),
      setQuery: (q) => set({ query: q }),
      setExpandedQueries: (eqs) => set({ expanded_queries: eqs }),
      setFilters: (f) => set({ filters: f, page: 1 }),
      setSort: (s) => set({ sort: s, page: 1 }),
      setPage: (p) => set({ page: p }),

      togglePaper: (id) => {
        const current = get().selected_paper_ids;
        set({
          selected_paper_ids: current.includes(id)
            ? current.filter((x) => x !== id)
            : [...current, id],
        });
      },

      selectPapers: (ids) => set({ selected_paper_ids: ids }),
      clearSelection: () => set({ selected_paper_ids: [] }),
      setActiveTab: (tab) => set({ active_tab: tab }),
      setConversationId: (id) => set({ conversation_id: id }),

      applyLiteratureState: (ls) => {
        const updates: Partial<ResearchState> = { literature_state: ls };
        if (ls.search_id !== null) updates.search_id = ls.search_id;
        if (ls.paper_ids.length > 0) updates.selected_paper_ids = ls.paper_ids;
        if (Object.keys(ls.filters).length > 0) updates.filters = ls.filters;
        set(updates);
      },

      resetResearch: () => set(initialState),
    }),
    {
      name: "research-store",
      // Only persist identity, not transient UI state
      partialize: (state) => ({
        search_id: state.search_id,
        query: state.query,
        expanded_queries: state.expanded_queries,
        filters: state.filters,
        sort: state.sort,
        conversation_id: state.conversation_id,
        selected_paper_ids: state.selected_paper_ids,
        literature_state: state.literature_state,
      }),
    }
  )
);

// Selector helpers
export const useSelectedPaperIds = () =>
  useResearchStore((s) => s.selected_paper_ids);
export const useSearchId = () => useResearchStore((s) => s.search_id);
export const useActiveTab = () => useResearchStore((s) => s.active_tab);
