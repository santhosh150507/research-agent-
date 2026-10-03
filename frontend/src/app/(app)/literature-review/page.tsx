"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, Book, Download, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClaimView } from "@/components/claims/ClaimView";
import { useSearchParams } from "next/navigation";

export default function LiteratureReviewPage() {
  const searchParams = useSearchParams();
  const reviewId = parseInt(searchParams?.get("id") || "1");

  const { data, isLoading } = useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => api.getReview(reviewId),
  });

  const handleExport = async (format: "pdf" | "md" | "docx") => {
    try {
      const blob = await api.exportReview(reviewId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Literature_Review.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col p-6 bg-muted/10 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Book className="h-6 w-6" /> {data?.title || "Literature Review"}
            </h1>
            <p className="text-muted-foreground mt-1">Generated synthesis of selected papers.</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("md")}>
              <Download className="h-4 w-4 mr-2" /> .md
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("docx")}>
              <Download className="h-4 w-4 mr-2" /> .docx
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("pdf")}>
              <Download className="h-4 w-4 mr-2" /> .pdf
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {data?.sections.map((sec, i) => (
            <Card key={i} className="shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">{sec.heading}</h2>
                <div className="space-y-3 text-sm leading-relaxed">
                  {sec.blocks.map((block, j) => (
                    <ClaimView key={j} claim={block} className="p-0 border-none bg-transparent" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {data?.references && data.references.length > 0 && (
            <Card className="shadow-sm mt-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">References</h2>
                <ul className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                  {data.references.map((ref, i) => (
                    <li key={i}>
                      <span className="font-medium text-foreground">{ref.authors.join(", ")} ({ref.year})</span>. {ref.title}. {ref.doi ? `DOI: ${ref.doi}` : ""}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
