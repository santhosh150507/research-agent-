"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, History, Trash2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: () => api.getHistory(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteHistoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    }
  });

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
        
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <History className="h-6 w-6" /> Search History
          </h1>
          <p className="text-muted-foreground mt-1">Review your past research queries.</p>
        </div>

        <div className="space-y-4">
          {data?.items.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground border border-dashed rounded-lg bg-card">
              <History className="h-8 w-8 mx-auto mb-4 opacity-50" />
              <p>No search history found.</p>
            </div>
          ) : data?.items.map(item => (
            <Card key={item.search_id} className="shadow-sm hover:border-primary/40 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="h-4 w-4 text-primary" />
                    <Link href={`/research?search=${item.search_id}`} className="font-semibold text-lg hover:underline text-foreground">
                      {item.query}
                    </Link>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(item.search_id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
