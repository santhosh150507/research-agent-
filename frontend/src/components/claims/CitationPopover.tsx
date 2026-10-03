import { SourceRef } from "@/lib/types";
import { formatAuthorStrings, formatYear } from "@/lib/format";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CitationPopoverProps {
  source: SourceRef;
  children: React.ReactNode;
}

export function CitationPopover({ source, children }: CitationPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2 border-b pb-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold leading-tight line-clamp-2" title={source.title}>
                {source.title}
              </span>
              <div className="text-xs text-muted-foreground line-clamp-1">
                {formatAuthorStrings(source.authors)} • {formatYear(source.year)}
              </div>
            </div>
            <Link
              href={`/papers/${source.paper_id}`}
              className="text-muted-foreground hover:text-foreground shrink-0"
              title="Open paper"
            >
              <FileText className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            {source.section && <div><span className="font-medium text-foreground">Section:</span> {source.section}</div>}
            {source.page !== null && <div><span className="font-medium text-foreground">Page:</span> {source.page}</div>}
            {source.doi && <div><span className="font-medium text-foreground">DOI:</span> {source.doi}</div>}
            {source.url && (
              <a href={source.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                Source Link <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          
          {source.quote && (
            <div className="mt-1 border-l-2 border-primary/50 bg-muted/50 p-2 pl-3 text-sm italic text-foreground">
              &quot;{source.quote}&quot;
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
