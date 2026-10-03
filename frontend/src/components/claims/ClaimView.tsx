import { Claim } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, Hash } from "lucide-react";
import { CitationPopover } from "./CitationPopover";
import { Badge } from "@/components/ui/badge";

interface ClaimViewProps {
  claim: Claim;
  className?: string;
}

export function ClaimView({ claim, className }: ClaimViewProps) {
  const isSourced = claim.kind === "sourced";
  const isSynthesis = claim.kind === "synthesis";
  const isInference = claim.kind === "inference";

  const missingSources = isSourced && (!claim.sources || claim.sources.length === 0);

  let kindBadge = null;
  let wrapperClass = "rounded-md border p-3";

  if (isSourced) {
    kindBadge = (
      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
        Extracted Fact
      </Badge>
    );
    wrapperClass = cn(wrapperClass, "claim-sourced");
  } else if (isSynthesis) {
    kindBadge = (
      <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
        AI Synthesis
      </Badge>
    );
    wrapperClass = cn(wrapperClass, "claim-synthesis");
  } else if (isInference) {
    kindBadge = (
      <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
        AI Inference
      </Badge>
    );
    wrapperClass = cn(wrapperClass, "claim-inference");
  }

  return (
    <div className={cn(wrapperClass, className)} data-claim-id={claim.id}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {kindBadge}
          <span className="text-[10px] text-muted-foreground flex items-center" title={`Claim ID: ${claim.id}`}>
            <Hash className="h-3 w-3 mr-0.5" />
            {claim.id.slice(0, 8)}
          </span>
        </div>
        {isInference && (
          <Tooltip icon={<Info className="h-4 w-4 text-amber-600" />} text="This is an AI-generated conclusion not explicitly stated in the sources." />
        )}
      </div>

      <p className="text-sm leading-relaxed text-foreground">{claim.text}</p>

      {missingSources && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-xs text-destructive font-medium border border-destructive/20">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>Warning: Extracted fact is missing source citations. This claim may be hallucinated or ungrounded.</span>
        </div>
      )}

      {!missingSources && claim.sources && claim.sources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {claim.sources.map((source, idx) => (
            <CitationPopover key={idx} source={source}>
              <button className="inline-flex h-5 items-center justify-center rounded bg-background px-1.5 text-xs font-medium border text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/50 transition-colors">
                [{idx + 1}]
              </button>
            </CitationPopover>
          ))}
        </div>
      )}
    </div>
  );
}

function Tooltip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span title={text} className="cursor-help">
      {icon}
    </span>
  );
}
