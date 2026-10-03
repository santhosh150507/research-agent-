import { Paper } from "@/lib/types";
import { formatAuthors, formatYear, getSourceLabel, getSourceColor } from "@/lib/format";
import { SignalBadges } from "./SignalBadges";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

import { RankSignals } from "@/lib/types";

interface PaperCardProps {
  paper: Paper;
  signals?: RankSignals;
  selected?: boolean;
  onToggleSelect?: (id: number) => void;
  className?: string;
}

export function PaperCard({ paper, signals, selected, onToggleSelect, className }: PaperCardProps) {
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
            <Link href={`/papers/${paper.id}`} className="text-base font-semibold leading-tight hover:underline">
              {paper.title}
            </Link>
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
            
            {(paper.topics && paper.topics.length > 0) && (
              <div className="mt-1 flex flex-wrap gap-1">
                {paper.topics.slice(0, 3).map((topic, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-normal">
                    {topic}
                  </Badge>
                ))}
                {paper.topics.length > 3 && (
                  <span className="text-xs text-muted-foreground ml-1">+{paper.topics.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className={cn("text-xs font-medium", getSourceColor(paper.source))}>
            {getSourceLabel(paper.source)}
          </Badge>
          <Button variant="ghost" size="icon" title="Save to Library">
            <BookmarkPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {signals && (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-muted-foreground">Relevance Signals</div>
          <SignalBadges signals={signals} />
        </div>
      )}
    </div>
  );
}
