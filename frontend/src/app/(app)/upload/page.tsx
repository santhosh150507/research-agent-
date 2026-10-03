"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, UploadCloud, FileText, CheckCircle2, AlertTriangle, Send, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClaimView } from "@/components/claims/ClaimView";
import { Claim } from "@/lib/types";
import Link from "next/link";
import { formatAuthors, formatYear } from "@/lib/format";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState<{q: string, a: Claim[]}[]>([]);

  const uploadMutation = useMutation({
    mutationFn: (f: File) => api.uploadPaper(f),
    onSuccess: (data) => setUploadId(data.upload_id),
  });

  const { data: statusData, error } = useQuery({
    queryKey: ["upload", uploadId],
    queryFn: () => api.getUpload(uploadId!),
    enabled: !!uploadId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return (status === "done" || status === "failed") ? false : 2000;
    },
  });

  const qaMutation = useMutation({
    mutationFn: (req: { id: number, question: string }) => api.paperQA(req.id, { question: req.question }),
    onSuccess: (data, req) => {
      setQaHistory(prev => [...prev, { q: req.question, a: data.answer }]);
      setQuestion("");
    }
  });

  const challengeMutation = useMutation({
    mutationFn: (id: number) => api.getChallenges(id, { mode: "challenge" }),
  });

  const handleUpload = () => {
    if (file) uploadMutation.mutate(file);
  };

  const isProcessing = statusData?.status === "queued" || statusData?.status === "running";
  const isDone = statusData?.status === "done";
  const isFailed = statusData?.status === "failed";
  const paperId = statusData?.paper?.id;
  const struct = statusData?.structure;

  // Load challenges once done
  useEffect(() => {
    if (isDone && paperId) {
      challengeMutation.mutate(paperId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone, paperId]);

  return (
    <div className="flex flex-1 flex-col p-6 bg-muted/10 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-2">Upload PDF</h1>
        <p className="text-muted-foreground mb-8">Upload a research paper to extract its structure, ask questions, and identify challenges.</p>

        {!uploadId && (
          <Card className="border-dashed border-2 shadow-none bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <UploadCloud className="h-12 w-12 mb-4 text-muted-foreground" />
              <p className="font-medium text-lg mb-1">Select a PDF file to analyze</p>
              <p className="text-sm text-muted-foreground mb-6">Maximum file size: 20MB</p>
              
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              
              <div className="flex gap-3 items-center">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Browse Files
                </Button>
                {file && (
                  <span className="text-sm font-medium">{file.name}</span>
                )}
                {file && (
                  <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
                    {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Upload & Analyze
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {isProcessing && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-12 gap-4 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <div>
                <p className="font-semibold text-lg">Analyzing Document...</p>
                <p className="text-muted-foreground text-sm max-w-sm mt-2">
                  Extracting text, formatting citations, generating summaries, and identifying key claims. This may take a minute.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isFailed && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center p-12 gap-4 text-center">
              <AlertTriangle className="h-10 w-10 text-destructive" />
              <div>
                <p className="font-semibold text-lg text-destructive">Analysis Failed</p>
                <p className="text-muted-foreground text-sm mt-1">{statusData?.error || error?.message || "An unknown error occurred"}</p>
              </div>
              <Button variant="outline" onClick={() => { setUploadId(null); setFile(null); }}>Try Again</Button>
            </CardContent>
          </Card>
        )}

        {isDone && struct && paperId && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg dark:bg-green-950/30 dark:border-green-900 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <div>
                <span className="font-semibold">Analysis Complete!</span>
                <p className="text-sm">The document has been successfully parsed and indexed.</p>
              </div>
              <div className="ml-auto">
                <Link href={`/papers/${paperId}`}>
                  <Button variant="outline" size="sm" className="bg-background">View Full Details</Button>
                </Link>
              </div>
            </div>

            <Tabs defaultValue="structure" className="w-full bg-card border rounded-lg shadow-sm">
              <div className="border-b px-4">
                <TabsList className="bg-transparent space-x-2 pt-2 pb-0">
                  <TabsTrigger value="structure" className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary pb-2 pt-3">
                    <FileText className="h-4 w-4 mr-2" /> Document Structure
                  </TabsTrigger>
                  <TabsTrigger value="qa" className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary pb-2 pt-3">
                    <Send className="h-4 w-4 mr-2" /> Ask Questions
                  </TabsTrigger>
                  <TabsTrigger value="challenges" className="data-[state=active]:bg-muted/50 data-[state=active]:shadow-none rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary pb-2 pt-3">
                    <ShieldAlert className="h-4 w-4 mr-2" /> Critical Analysis
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-6">
                <TabsContent value="structure" className="m-0 border-none p-0">
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-bold">{struct.title}</h2>
                      {struct.authors && (
                        <p className="text-muted-foreground mt-2">{struct.authors.join(", ")} • {struct.year}</p>
                      )}
                    </div>
                    
                    {struct.abstract && (
                      <div>
                        <h3 className="font-semibold text-lg border-b pb-2 mb-3">Abstract</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground bg-muted p-4 rounded-lg">{struct.abstract}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {struct.methodology && (
                        <div>
                          <h3 className="font-semibold text-lg border-b pb-2 mb-3">Methodology</h3>
                          <p className="text-sm">{struct.methodology}</p>
                        </div>
                      )}
                      
                      {struct.findings && (
                        <div>
                          <h3 className="font-semibold text-lg border-b pb-2 mb-3">Key Findings</h3>
                          <p className="text-sm">{struct.findings}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {struct.keywords?.map(k => <Badge key={k} variant="secondary">{k}</Badge>)}
                      {struct.datasets?.map(d => <Badge key={d} variant="outline" className="border-primary text-primary">{d}</Badge>)}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="qa" className="m-0 border-none p-0 flex flex-col gap-4">
                  <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
                    Ask questions specifically about this uploaded document. The AI will answer using only facts extracted from the text, with exact citations.
                  </div>

                  <div className="space-y-4">
                    {qaHistory.map((item, i) => (
                      <div key={i} className="flex flex-col gap-3">
                        <div className="bg-primary/10 text-primary p-3 rounded-lg rounded-tr-none self-end max-w-[80%]">
                          {item.q}
                        </div>
                        <div className="bg-muted p-3 rounded-lg rounded-tl-none self-start w-full border">
                          <div className="flex flex-col gap-2">
                            {item.a.map((claim, cidx) => <ClaimView key={cidx} claim={claim} />)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form 
                    className="flex gap-2 mt-4" 
                    onSubmit={e => {
                      e.preventDefault();
                      if (question.trim() && paperId) qaMutation.mutate({ id: paperId, question });
                    }}
                  >
                    <Input 
                      placeholder="e.g. What datasets were used in the evaluation?" 
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      disabled={qaMutation.isPending}
                    />
                    <Button type="submit" disabled={!question.trim() || qaMutation.isPending}>
                      {qaMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ask"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="challenges" className="m-0 border-none p-0">
                  {challengeMutation.isPending ? (
                    <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                  ) : challengeMutation.data?.items ? (
                    <div className="space-y-6">
                      <p className="text-sm text-muted-foreground mb-4">
                        We scanned the document for claims that conflict with the broader literature or have known methodological flaws.
                      </p>
                      {challengeMutation.data.items.length === 0 ? (
                        <div className="p-6 text-center border rounded bg-muted/20 text-muted-foreground">
                          No major challenges or conflicting evidence found for the claims in this paper.
                        </div>
                      ) : (
                        challengeMutation.data.items.map((item, idx) => (
                          <div key={idx} className="border rounded-lg p-4 bg-muted/10">
                            <h4 className="font-medium mb-3 text-destructive flex items-center gap-2">
                              <ShieldAlert className="h-4 w-4" /> Potential Issue Identified
                            </h4>
                            <ClaimView claim={item.interpretation} className="mb-4 bg-background border-destructive/20" />
                            <h5 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Conflicting Evidence From</h5>
                            <Link href={`/papers/${item.paper.id}`} className="block p-3 border rounded bg-background hover:border-primary/50 text-sm mb-3">
                              <div className="font-medium">{item.paper.title}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatAuthors(item.paper.authors)} • {formatYear(item.paper.year)}
                              </div>
                            </Link>
                            <div className="space-y-2 border-l-2 border-muted pl-3">
                              {item.evidence.map((c, i) => <ClaimView key={i} claim={c} className="border-none p-0 bg-transparent" />)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : null}
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}

      </div>
    </div>
  );
}
