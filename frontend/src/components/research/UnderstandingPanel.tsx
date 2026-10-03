"use client";

import { UnderstandResponse } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit } from "lucide-react";

interface UnderstandingPanelProps {
  data: UnderstandResponse | null;
}

export function UnderstandingPanel({ data }: UnderstandingPanelProps) {
  if (!data) return null;

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center gap-2 border-b pb-2">
        <BrainCircuit className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Query Understanding</h3>
      </div>
      
      <div className="flex flex-col gap-3 text-sm">
        <div>
          <span className="font-medium text-muted-foreground block mb-1">Main Topic</span>
          <p className="font-medium">{data.main_topic}</p>
        </div>
        
        <div>
          <span className="font-medium text-muted-foreground block mb-1">Research Area</span>
          <p>{data.research_area}</p>
        </div>
        
        <div>
          <span className="font-medium text-muted-foreground block mb-1">Core Concepts</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {data.concepts.map((c, i) => (
              <Badge key={i} variant="secondary" className="font-normal">{c}</Badge>
            ))}
          </div>
        </div>
        
        <div>
          <span className="font-medium text-muted-foreground block mb-1">Keywords</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {data.keywords.map((k, i) => (
              <Badge key={i} variant="outline" className="font-normal">{k}</Badge>
            ))}
          </div>
        </div>
        
        {data.synonyms && data.synonyms.length > 0 && (
          <div>
            <span className="font-medium text-muted-foreground block mb-1">Synonyms</span>
            <p className="text-muted-foreground text-xs">{data.synonyms.join(", ")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
