import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RankSignals, Level } from "@/lib/types";
import { formatLevel } from "@/lib/format";
import { cn } from "@/lib/utils";

// Exclude 'raw' from the keys we iterate over
type SignalKey = keyof Omit<RankSignals, "raw">;

const SIGNAL_LABELS: Record<SignalKey, string> = {
  semantic: "Semantic Match",
  keyword: "Keyword Match",
  topic_match: "Topic Match",
  methodology_match: "Methodology Match",
  dataset_match: "Dataset Match",
  recency: "Recency",
  citations: "Citations",
  question_relevance: "Question Relevance",
};

interface SignalBadgesProps {
  signals: RankSignals;
  className?: string;
}

export function SignalBadges({ signals, className }: SignalBadgesProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <TooltipProvider delayDuration={200}>
        {(Object.entries(signals) as [keyof RankSignals, any][])
          .filter(([key]) => key !== "raw")
          .map(([key, level]) => {
            const typedKey = key as SignalKey;
            const typedLevel = level as Level;
            let badgeClass = "";
            switch (typedLevel) {
              case "High":
                badgeClass = "bg-[#16a34a] text-white hover:bg-[#16a34a]/80"; // signal.high
                break;
              case "Medium":
                badgeClass = "bg-[#d97706] text-white hover:bg-[#d97706]/80"; // signal.medium
                break;
              case "Low":
                badgeClass = "bg-[#dc2626] text-white hover:bg-[#dc2626]/80"; // signal.low
                break;
              case "Unavailable":
                badgeClass = "bg-[#6b7280] text-white hover:bg-[#6b7280]/80"; // signal.unavailable
                break;
            }

            return (
              <Tooltip key={typedKey}>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className={cn("cursor-help border-transparent px-2 py-0", badgeClass)}>
                    {SIGNAL_LABELS[typedKey]}: {formatLevel(typedLevel)}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {SIGNAL_LABELS[typedKey]}: {formatLevel(typedLevel)}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
      </TooltipProvider>
    </div>
  );
}
