"use client";

import { AgentTraceStep } from "@/lib/types";
import { Loader2, CheckCircle2, AlertCircle, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentTraceProps {
  trace: AgentTraceStep[];
}

export function AgentTrace({ trace }: AgentTraceProps) {
  if (!trace || trace.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm text-sm">
      <h3 className="font-semibold border-b pb-2">Agent Trace</h3>
      <div className="flex flex-col gap-3 pt-1">
        {trace.map((step, idx) => (
          <div key={idx} className="flex items-start gap-3 relative">
            {idx !== trace.length - 1 && (
              <div className="absolute left-2 top-6 bottom-[-12px] w-0.5 bg-border -translate-x-1/2" />
            )}
            <div className="shrink-0 mt-0.5 z-10 bg-card rounded-full">
              {step.status === "running" && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
              {step.status === "done" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {step.status === "error" && <AlertCircle className="h-4 w-4 text-destructive" />}
              {!step.status && <PlayCircle className="h-4 w-4 text-muted-foreground" />}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className={cn(
                "font-medium leading-tight",
                step.status === "running" ? "text-primary" : "text-foreground"
              )}>
                {step.step}
              </span>
              {step.detail && (
                <span className="text-xs text-muted-foreground truncate">
                  {step.detail}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
