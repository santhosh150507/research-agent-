"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useResearchStore } from "@/store/research";
import { QueryForm } from "@/components/research/QueryForm";
import { UnderstandingPanel } from "@/components/research/UnderstandingPanel";
import { ExpansionChips } from "@/components/research/ExpansionChips";
import { SearchFiltersPanel } from "@/components/research/SearchFiltersPanel";
import { PapersTab } from "@/components/research/tabs/PapersTab";
import { TimelineTab } from "@/components/research/tabs/TimelineTab";
import { GraphTab } from "@/components/research/tabs/GraphTab";
import { ComparisonTab } from "@/components/research/tabs/ComparisonTab";
import { TrendsTab } from "@/components/research/tabs/TrendsTab";
import { GapsTab } from "@/components/research/tabs/GapsTab";
import { ResearchChat } from "@/components/chat/ResearchChat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Network, BarChart3, LineChart, Target, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ResearchWorkspacePage() {
  const store = useResearchStore();

  const searchMutation = useMutation({
    mutationFn: (req: any) => api.search(req),
    onSuccess: (data) => {
      store.setSearchId(data.search_id);
      store.setPage(1);
    },
  });

  const handleUnderstand = (res: any, queryText: string) => {
    store.setQuery(queryText);
    store.setExpandedQueries(res.expanded_queries || []);
    store.setFilters({});
    
    // Automatically trigger search
    searchMutation.mutate({
      query: queryText,
      expanded_queries: res.expanded_queries?.map((q: any) => q.text) || [],
    });
  };

  const { data: searchData, isLoading: isSearchLoading } = useQuery({
    queryKey: ["search", store.search_id, store.page, store.filters, store.sort],
    queryFn: () => api.getSearch(store.search_id!, {
      page: store.page,
      sort: store.sort,
      filters: store.filters,
    }),
    enabled: !!store.search_id && !searchMutation.isPending,
  });

  const { data: understandData } = useQuery({
    queryKey: ["understand", store.query],
    queryFn: () => api.understand({ text: store.query }),
    enabled: !!store.query && !store.search_id, // Fetch if we have query but no search yet
  });

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-muted/20">
      {/* LEFT PANE: Search & Filters */}
      <div className="w-[350px] shrink-0 border-r bg-background p-4 flex flex-col gap-4 overflow-y-auto hidden md:flex">
        <QueryForm onUnderstand={handleUnderstand} isLoading={searchMutation.isPending} />
        
        {understandData && !store.search_id && (
          <UnderstandingPanel data={understandData} />
        )}

        {store.query && store.expanded_queries.length > 0 && (
          <ExpansionChips 
            queries={store.expanded_queries} 
            onChange={(qs) => {
              store.setExpandedQueries(qs);
              if (store.search_id) {
                // Re-search
                searchMutation.mutate({
                  query: store.query,
                  expanded_queries: qs.map(q => q.text),
                  filters: store.filters,
                });
              }
            }} 
          />
        )}

        {searchData?.facets && (
          <SearchFiltersPanel 
            filters={store.filters} 
            facets={searchData.facets} 
            onChange={(f) => store.setFilters(f)} 
          />
        )}
      </div>

      {/* CENTER PANE: Results */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-background/50">
        {!store.search_id && !searchMutation.isPending ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8 gap-4">
            <div className="rounded-full bg-muted p-6">
              <FileText className="h-10 w-10 opacity-50" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Start your research</h2>
            <p className="max-w-md">Enter a topic or question in the left panel to begin. We&apos;ll analyze your query, expand it with relevant concepts, and search across millions of papers.</p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full">
            <Tabs 
              value={store.active_tab} 
              onValueChange={(v: string) => store.setActiveTab(v as any)}
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              <div className="px-6 pt-4 border-b bg-background sticky top-0 z-10 shrink-0">
                <TabsList className="w-full justify-start h-12 bg-transparent space-x-2 p-0">
                  <TabsTrigger value="papers" className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary pb-3">
                    <FileText className="h-4 w-4 mr-2" /> Papers
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary pb-3">
                    <LineChart className="h-4 w-4 mr-2" /> Timeline
                  </TabsTrigger>
                  <TabsTrigger value="graph" className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary pb-3">
                    <Network className="h-4 w-4 mr-2" /> Graph
                  </TabsTrigger>
                  <TabsTrigger value="compare" className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary pb-3">
                    <BarChart3 className="h-4 w-4 mr-2" /> Compare
                  </TabsTrigger>
                  <TabsTrigger value="trends" className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary pb-3">
                    <Target className="h-4 w-4 mr-2" /> Trends
                  </TabsTrigger>
                  <TabsTrigger value="gaps" className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary pb-3">
                    <AlertCircle className="h-4 w-4 mr-2" /> Gaps
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {(isSearchLoading || searchMutation.isPending) && !searchData ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-3">
                    <RefreshCcw className="h-6 w-6 animate-spin" />
                    <p>Retrieving and analyzing papers...</p>
                  </div>
                ) : (
                  <>
                    <TabsContent value="papers" className="m-0 border-none p-0 outline-none h-full">
                      <PapersTab 
                        items={searchData?.items || []} 
                        total={searchData?.total || 0}
                        page={store.page}
                        pageSize={10}
                      />
                    </TabsContent>
                    
                    <TabsContent value="timeline" className="m-0 border-none p-0 outline-none h-full">
                      <TimelineTab />
                    </TabsContent>
                    <TabsContent value="graph" className="m-0 border-none p-0 outline-none h-full">
                      <GraphTab />
                    </TabsContent>
                    <TabsContent value="compare" className="m-0 border-none p-0 outline-none h-full">
                      <ComparisonTab />
                    </TabsContent>
                    <TabsContent value="trends" className="m-0 border-none p-0 outline-none h-full">
                      <TrendsTab />
                    </TabsContent>
                    <TabsContent value="gaps" className="m-0 border-none p-0 outline-none h-full">
                      <GapsTab />
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>
          </div>
        )}
      </div>

      {/* RIGHT PANE: Chat */}
      <div className="w-[320px] lg:w-[400px] shrink-0 p-4 pl-0 hidden xl:flex flex-col">
        <ResearchChat />
      </div>
    </div>
  );
}
