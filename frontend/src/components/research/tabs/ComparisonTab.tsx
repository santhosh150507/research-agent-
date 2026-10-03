"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSelectedPaperIds } from "@/store/research";
import { Loader2, GitCompare, FileText } from "lucide-react";
import { ClaimView } from "@/components/claims/ClaimView";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ComparisonTab() {
  const selectedIds = useSelectedPaperIds();

  const { data, isLoading } = useQuery({
    queryKey: ["compare", selectedIds],
    queryFn: () => api.compare({ paper_ids: selectedIds }),
    enabled: selectedIds.length >= 2,
  });

  if (selectedIds.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg bg-card border-dashed">
        <GitCompare className="h-8 w-8 mb-4 opacity-50" />
        <p className="text-lg font-medium text-foreground">Select at least 2 papers to compare</p>
        <p className="mt-2 max-w-md">Check the boxes next to papers in the Papers tab to add them to your comparison tray.</p>
        
        <div className="flex gap-2 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 w-20 border-2 border-dashed border-muted-foreground/30 rounded-md flex items-center justify-center bg-muted/20">
              {i < selectedIds.length ? <FileText className="h-6 w-6 text-primary/50" /> : <span className="text-sm opacity-30">Empty</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Analyzing and comparing selected papers...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-8 p-4">
      
      {/* Narrative Synthesis */}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <h3 className="text-xl font-semibold mb-4 border-b pb-2">Synthesis & Narrative</h3>
        <div className="flex flex-col gap-3">
          {data.narrative.map((claim, idx) => (
            <ClaimView key={idx} claim={claim} />
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="font-semibold">Detailed Comparison Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px] font-semibold bg-muted/10 sticky left-0 z-10 border-r">Feature</TableHead>
                {data.papers.map(p => (
                  <TableHead key={p.id} className="min-w-[250px] align-top text-foreground">
                    <div className="font-semibold line-clamp-2" title={p.title}>{p.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 font-normal line-clamp-1">{p.authors.map(a => a.name).join(", ")}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium bg-muted/10 sticky left-0 z-10 border-r align-top">
                    {row.feature.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </TableCell>
                  {data.papers.map(p => {
                    const cellClaim = row.cells[p.id.toString()];
                    return (
                      <TableCell key={p.id} className="align-top">
                        {cellClaim ? (
                          <ClaimView claim={cellClaim} className="border-none p-0 text-sm" />
                        ) : (
                          <span className="text-muted-foreground italic text-sm">Not mentioned</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
    </div>
  );
}
