"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { UnderstandRequest } from "@/lib/types";

interface QueryFormProps {
  onUnderstand: (res: any, query: string) => void;
  isLoading: boolean;
}

export function QueryForm({ onUnderstand, isLoading }: QueryFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState("");
  const [objectives, setObjectives] = useState("");
  const [methodology, setMethodology] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [domain, setDomain] = useState("");

  const understandMutation = useMutation({
    mutationFn: (req: UnderstandRequest) => api.understand(req),
    onSuccess: (data) => {
      onUnderstand(data, text);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    understandMutation.mutate({
      text,
      objectives: objectives || undefined,
      methodology_pref: methodology || undefined,
      date_from: dateFrom ? parseInt(dateFrom) : undefined,
      date_to: dateTo ? parseInt(dateTo) : undefined,
      domain: domain || undefined,
    });
  };

  const isSubmitting = isLoading || understandMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-2">
        <Label htmlFor="query-text" className="font-semibold text-base">Research Topic or Question</Label>
        <Textarea
          id="query-text"
          placeholder="e.g., Adaptive learning for personalized recommendation systems..."
          value={text}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value)}
          className="min-h-[80px] resize-none"
          required
        />
      </div>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="objectives">Research Objectives</Label>
            <Input
              id="objectives"
              placeholder="e.g., Find state-of-the-art models, identify limitations..."
              value={objectives}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setObjectives(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="methodology">Methodology Preference</Label>
            <Input
              id="methodology"
              placeholder="e.g., Deep Learning, Empirical..."
              value={methodology}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMethodology(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              placeholder="e.g., Computer Science, Medicine..."
              value={domain}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDomain(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Date Range (Years)</Label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="From"
                type="number"
                value={dateFrom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value)}
              />
              <span className="text-muted-foreground">-</span>
              <Input
                placeholder="To"
                type="number"
                value={dateTo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>Less options <ChevronUp className="ml-1 h-4 w-4" /></>
          ) : (
            <>Advanced options <ChevronDown className="ml-1 h-4 w-4" /></>
          )}
        </Button>
        <Button type="submit" disabled={isSubmitting || !text.trim()} className="gap-2">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Understand & Search
        </Button>
      </div>
      
      {understandMutation.isError && (
        <div className="text-sm text-destructive mt-2">
          Failed to process query. Please try again.
        </div>
      )}
    </form>
  );
}
