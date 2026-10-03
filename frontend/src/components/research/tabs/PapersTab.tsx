"use client";

import { SearchResultItem } from "@/lib/types";
import { PaperCard } from "@/components/papers/PaperCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSelectedPaperIds, useResearchStore } from "@/store/research";

interface PapersTabProps {
  items: SearchResultItem[];
  total: number;
  page: number;
  pageSize: number;
}

export function PapersTab({ items, total, page, pageSize }: PapersTabProps) {
  const selectedIds = useSelectedPaperIds();
  const togglePaper = useResearchStore((s) => s.togglePaper);
  const setPage = useResearchStore((s) => s.setPage);

  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg bg-card border-dashed">
        <p>No papers found for the given query and filters.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} results
        </p>
        <div className="text-sm font-medium">
          {selectedIds.length} paper{selectedIds.length !== 1 && "s"} selected
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <PaperCard
            key={item.paper.id}
            paper={item.paper}
            signals={item.signals}
            selected={selectedIds.includes(item.paper.id)}
            onToggleSelect={togglePaper}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm px-2 text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
