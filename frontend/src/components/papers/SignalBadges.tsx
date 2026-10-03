import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RankSignals, Level } from "@/lib/types";
import { formatLevel } from "@/lib/format";
import { cn } from "@/lib/utils";

const SIGNAL_LABELS: Record<keyof RankSignals, string> = {
  venue: "Venue",
  author: "Authors",
  topic: "Topic Match",
  methodology: "Methodology",
  dataset: "Dataset",
  citation_velocity: "Citation Velocity",
  recency: "Recency",
  impact: "Impact",
};

interface SignalBadgesProps {
  signals: RankSignals;
  className?: string;
}

export function SignalBadges({ signals, className }: SignalBadgesProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      <TooltipProvider delayDuration={200}>
        {(Object.entries(signals) as [keyof RankSignals, Level][]).map(([key, level]) => {
          let badgeClass = "";
          switch (level) {
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
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <Badge variant="outline" className={cn("cursor-help border-transparent px-2 py-0", badgeClass)}>
                  {SIGNAL_LABELS[key]}: {formatLevel(level)}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {SIGNAL_LABELS[key]}: {formatLevel(level)}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </div>
  );
}
