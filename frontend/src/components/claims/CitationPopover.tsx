import { SourceRef } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface CitationPopoverProps {
  source: SourceRef;
  children: React.ReactNode;
}

export function CitationPopover({ source, children }: CitationPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-semibold">Paper {source.paper_id}</span>
            <Link
              href={`/papers/${source.paper_id}`}
              className="text-muted-foreground hover:text-foreground"
              title="Open paper"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
          <div className="text-xs text-muted-foreground">Section: {source.section}</div>
          <div className="mt-2 border-l-2 pl-3 text-sm italic text-foreground">
            "{source.quote}"
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
