import { Paper } from "@/lib/types";
import { formatAuthors, formatYear } from "@/lib/format";
import { SignalBadges } from "./SignalBadges";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaperCardProps {
  paper: Paper;
  selected?: boolean;
  onToggleSelect?: (id: number) => void;
  className?: string;
}

export function PaperCard({ paper, selected, onToggleSelect, className }: PaperCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors",
        selected && "border-primary ring-1 ring-primary",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {onToggleSelect && (
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={selected}
              onChange={() => onToggleSelect(paper.id)}
            />
          )}
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-semibold leading-tight">{paper.title}</h3>
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
          </div>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0" title="Save to Library">
          <BookmarkPlus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs text-muted-foreground">Relevance Signals</div>
        <SignalBadges signals={paper.signals} />
      </div>
    </div>
  );
}
