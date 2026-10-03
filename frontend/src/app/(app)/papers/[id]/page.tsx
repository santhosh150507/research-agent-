"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { formatAuthors, formatYear, getSourceLabel, getSourceColor } from "@/lib/format";
import { ClaimView } from "@/components/claims/ClaimView";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, LineChart, BookmarkPlus, ArrowLeft, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Claim } from "@/lib/types";

export default function PaperDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const id = parseInt(params.id, 10);

  const { data: paper, isLoading: isPaperLoading } = useQuery({
    queryKey: ["paper", id],
    queryFn: () => api.getPaper(id),
  });

  const { data: analysis, isLoading: isAnalysisLoading } = useQuery({
    queryKey: ["analysis", id],
    queryFn: () => api.getAnalysis(id),
  });

  if (isPaperLoading || isAnalysisLoading) {
    return (
      <div className="flex flex-col gap-8 p-8 max-w-4xl mx-auto w-full">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!paper || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-12 text-center text-muted-foreground">
        <AlertCircle className="h-8 w-8 mb-4 text-destructive" />
        <p className="text-lg font-medium text-foreground">Failed to load paper details</p>
        <p>The paper might not exist or there was an error retrieving its analysis.</p>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const renderSection = (title: string, claims: Claim[] | undefined) => {
    if (!claims || claims.length === 0) return null;
    return (
      <section className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold border-b pb-2">{title}</h3>
        <div className="flex flex-col gap-3">
          {claims.map((c, i) => (
            <ClaimView key={i} claim={c} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-muted/10">
      <div className="max-w-5xl mx-auto w-full p-6 lg:p-8 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4 bg-card p-6 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-muted-foreground -ml-2">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <div className="flex-1" />
            <Button variant="outline" size="sm">
              <BookmarkPlus className="mr-2 h-4 w-4" /> Save to Library
            </Button>
            <Button variant="default" size="sm" onClick={() => router.push(`/research?tab=timeline&paper=${id}`)}>
              <LineChart className="mr-2 h-4 w-4" /> Explore Research Evolution
            </Button>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold leading-tight">{paper.title}</h1>
          
          <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
            <span className="font-medium text-foreground">{formatAuthors(paper.authors)}</span>
            <span>•</span>
            <span>{formatYear(paper.year)}</span>
            {paper.venue && (
              <>
                <span>•</span>
                <span>{paper.venue}</span>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-2 items-center">
            <Badge variant="outline" className={getSourceColor(paper.source)}>
              {getSourceLabel(paper.source)}
            </Badge>
            
            {paper.open_access && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-300">
                Open Access
              </Badge>
            )}
            
            {paper.doi && (
              <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noreferrer" className="flex items-center text-sm text-primary hover:underline ml-2">
                DOI: {paper.doi} <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            )}
            
            {paper.url && !paper.doi && (
              <a href={paper.url} target="_blank" rel="noreferrer" className="flex items-center text-sm text-primary hover:underline ml-2">
                View Source <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            {paper.topics?.map(t => <Badge key={t} variant="secondary" className="font-normal">{t}</Badge>)}
            {paper.methods?.map(m => <Badge key={m} variant="outline" className="font-normal border-primary/20">{m}</Badge>)}
          </div>
        </div>

        {/* Full Text Status */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-200">
          <FileText className="h-5 w-5 shrink-0" />
          <div className="text-sm">
            <span className="font-semibold">Full text availability:</span>{" "}
            {analysis.full_text_available 
              ? "The full text of this paper was retrieved and analyzed successfully." 
              : "Only abstract and metadata were available. Analysis is limited to these sources."}
          </div>
        </div>

        {/* Abstract (Raw) */}
        {paper.abstract && (
          <section className="flex flex-col gap-3">
            <h3 className="text-xl font-semibold border-b pb-2">Abstract</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{paper.abstract}</p>
          </section>
        )}

        {/* Analysis Sections */}
        {renderSection("Summary", analysis.summary)}
        {renderSection("Research Problem", analysis.research_problem)}
        {renderSection("Methodology", analysis.methodology)}
        {renderSection("Datasets", analysis.dataset)}
        {renderSection("Experiments", analysis.experiments)}
        {renderSection("Metrics", analysis.metrics)}
        {renderSection("Key Findings", analysis.key_findings)}
        {renderSection("Contributions", analysis.contributions)}
        {renderSection("Limitations", analysis.limitations)}
        {renderSection("Future Work", analysis.future_work)}

        <div className="h-12" /> {/* Bottom spacing */}
      </div>
    </div>
  );
}
