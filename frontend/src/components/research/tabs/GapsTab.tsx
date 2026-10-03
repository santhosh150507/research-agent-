"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useResearchStore, useSelectedPaperIds } from "@/store/research";
import { Loader2, AlertTriangle, Lightbulb, Target } from "lucide-react";
import { ClaimView } from "@/components/claims/ClaimView";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatAuthors, formatYear } from "@/lib/format";

export function GapsTab() {
  const searchId = useResearchStore(s => s.search_id);
  const selectedIds = useSelectedPaperIds();

  const { data, isLoading } = useQuery({
    queryKey: ["gaps", searchId, selectedIds],
    queryFn: () => api.getGaps({ 
      search_id: searchId || undefined,
      paper_ids: selectedIds.length > 0 ? selectedIds : undefined
    }),
    enabled: !!searchId || selectedIds.length > 0,
  });

  if (!searchId && selectedIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg bg-card border-dashed">
        <Target className="h-8 w-8 mb-4 opacity-50" />
        <p className="text-lg font-medium text-foreground">Run a search to find research gaps</p>
        <p className="mt-2">We will analyze the current literature to identify underexplored areas and open challenges.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Identifying research gaps and opportunities...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-6 p-4">
      
      {data.caveat && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-300 shadow-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="text-sm leading-relaxed">
            <span className="font-semibold block mb-1">Important Caveat</span>
            {data.caveat}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        <div className="xl:col-span-1 flex flex-col gap-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" /> 
                Key Observations
              </CardTitle>
              <CardDescription>Synthesized from current literature</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {data.observations.map((obs, idx) => (
                <ClaimView key={idx} claim={obs} className="text-sm bg-muted/30 border-none p-3" />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2 flex flex-col gap-4">
          <h3 className="text-xl font-semibold flex items-center gap-2 px-1">
            <Lightbulb className="h-6 w-6 text-amber-500" /> 
            Research Opportunities
          </h3>
          
          <div className="flex flex-col gap-4">
            {data.opportunities.map((opp, idx) => (
              <Card key={idx} className="shadow-sm overflow-hidden border-primary/20 hover:border-primary/50 transition-colors">
                <div className="bg-primary/5 px-6 py-3 border-b flex items-center justify-between">
                  <h4 className="font-semibold text-lg text-primary-foreground">{opp.title}</h4>
                  <Badge variant="outline" className="bg-background border-primary/30 text-primary">
                    {opp.wording}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <ClaimView claim={opp.description} className="mb-6 border-none p-0" />
                  
                  {opp.supporting_papers.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Related Papers</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {opp.supporting_papers.map(p => (
                          <div key={p.id} className="flex flex-col gap-1 p-3 rounded-md border bg-muted/30 text-sm">
                            <Link href={`/papers/${p.id}`} className="font-medium line-clamp-1 hover:underline hover:text-primary">
                              {p.title}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              {formatAuthors(p.authors)} • {formatYear(p.year)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
