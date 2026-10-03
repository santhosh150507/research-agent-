"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { EvolutionStage } from "@/lib/types";
import { ClaimView } from "@/components/claims/ClaimView";
import { useSelectedPaperIds } from "@/store/research";
import { Loader2, GitCommit, SearchX, MousePointerClick } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { formatAuthors, formatYear } from "@/lib/format";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TimelineTab() {
  const selectedIds = useSelectedPaperIds();
  const paperId = selectedIds.length > 0 ? selectedIds[0] : null;

  const { data, isLoading } = useQuery({
    queryKey: ["evolution", paperId],
    queryFn: () => api.getEvolution(paperId!),
    enabled: !!paperId,
  });

  if (!paperId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg bg-card border-dashed">
        <MousePointerClick className="h-8 w-8 mb-4 opacity-50" />
        <p className="text-lg font-medium text-foreground">Select a paper to view its evolution</p>
        <p className="mt-2 max-w-md">The timeline view requires a focal paper to trace how the research topic evolved before and after its publication.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Analyzing research evolution...</p>
      </div>
    );
  }

  if (!data || data.stages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg bg-card border-dashed">
        <SearchX className="h-8 w-8 mb-4 opacity-50" />
        <p className="text-lg font-medium text-foreground">No timeline data available</p>
        <p className="mt-2">We could not trace a clear evolution timeline for this paper.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div>
          <h3 className="font-semibold">Research Evolution Timeline</h3>
          <p className="text-sm text-muted-foreground">Tracing the development of concepts related to the selected paper</p>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">{data.earlier_count}</span>
            <span>Predecessors</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">{data.later_count}</span>
            <span>Successors</span>
          </div>
        </div>
      </div>

      <div className="relative pl-6 border-l-2 border-muted ml-4 space-y-8 py-4">
        {data.stages.map((stage: EvolutionStage, idx: number) => (
          <div key={idx} className="relative">
            <div className="absolute -left-[35px] top-1 bg-background rounded-full p-1 border-2 border-primary">
              <GitCommit className="h-4 w-4 text-primary" />
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm font-semibold bg-primary/10 border-primary/20 text-primary">
                  {stage.year_range}
                </Badge>
                <h4 className="text-lg font-bold">{stage.label}</h4>
              </div>
              
              <ClaimView claim={stage.explanation} className="bg-muted/50 border-none" />
              
              <div className="mt-2">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Key Papers in this Stage</h5>
                <div className="flex flex-col gap-2">
                  {stage.papers.map(paper => (
                    <Drawer key={paper.id}>
                      <DrawerTrigger asChild>
                        <button className="flex flex-col text-left p-3 rounded-md border bg-card hover:border-primary/50 transition-colors">
                          <span className="font-medium text-sm leading-tight mb-1">{paper.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatAuthors(paper.authors)} • {formatYear(paper.year)}
                          </span>
                        </button>
                      </DrawerTrigger>
                      <DrawerContent className="max-h-[85vh]">
                        <DrawerHeader>
                          <DrawerTitle className="text-xl">{paper.title}</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 pb-8 overflow-y-auto max-w-3xl mx-auto w-full flex flex-col gap-4">
                          <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                            <span>{formatAuthors(paper.authors)}</span>
                            <span>•</span>
                            <span>{formatYear(paper.year)}</span>
                            {paper.venue && (
                              <>
                                <span>•</span>
                                <span>{paper.venue}</span>
                              </>
                            )}
                          </div>
                          
                          {paper.abstract && (
                            <div className="text-sm leading-relaxed text-foreground bg-muted p-4 rounded-lg">
                              <span className="font-semibold block mb-2">Abstract</span>
                              {paper.abstract}
                            </div>
                          )}
                          
                          <div className="flex justify-end mt-4">
                            <Link href={`/papers/${paper.id}`} passHref>
                              <Button>View Full Paper Analysis</Button>
                            </Link>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
