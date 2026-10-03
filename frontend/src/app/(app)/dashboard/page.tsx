"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, LayoutDashboard, Bookmark, Search, TrendingUp, Activity, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatAuthors, formatYear } from "@/lib/format";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => api.getDashboard(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground h-full gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-1 flex-col p-6 bg-muted/10 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" /> Researcher Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Overview of your research activities and discovered literature.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saved Papers</CardTitle>
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.saved_count}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all your collections</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Searches</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.recent_searches.length}</div>
              <p className="text-xs text-muted-foreground mt-1">In the last 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Topics</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.active_topics.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Based on your interactions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1 shadow-sm border-primary/10">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest saved papers</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {data.recent_papers.length === 0 ? (
                <div className="text-sm text-muted-foreground italic p-4 bg-muted/20 rounded">No recently saved papers.</div>
              ) : data.recent_papers.map(p => (
                <Link href={`/papers/${p.id}`} key={p.id} className="block p-3 rounded-md border bg-card hover:border-primary/50 transition-colors text-sm group">
                  <div className="font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">{p.title}</div>
                  <div className="text-xs text-muted-foreground flex justify-between items-center">
                    <span>{formatAuthors(p.authors)} • {formatYear(p.year)}</span>
                    <FileText className="h-3 w-3 opacity-50" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
          
          <Card className="col-span-1 shadow-sm border-primary/10">
            <CardHeader>
              <CardTitle>Recent Searches</CardTitle>
              <CardDescription>Jump back into your recent research queries</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {data.recent_searches.length === 0 ? (
                <div className="text-sm text-muted-foreground italic p-4 bg-muted/20 rounded">No recent searches.</div>
              ) : data.recent_searches.map(q => (
                <Link href={`/research?search=${q.search_id}`} key={q.search_id} className="block p-3 rounded-md border bg-card hover:border-primary/50 transition-colors text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Search className="h-3 w-3 text-primary" />
                    <span className="font-medium">{q.query}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(q.created_at).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-sm border-amber-500/20 bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
              <TrendingUp className="h-5 w-5" /> Recommended for You
            </CardTitle>
            <CardDescription>Based on your active topics: {data.active_topics.join(", ")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {data.recommended.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">No recommendations available yet. Read more papers to get personalized suggestions.</div>
            ) : data.recommended.map(p => (
              <div key={p.id} className="p-3 rounded-md border bg-background text-sm flex flex-col gap-2">
                <Link href={`/papers/${p.id}`} className="font-medium hover:text-amber-600 transition-colors">{p.title}</Link>
                <div className="text-xs text-muted-foreground">{formatAuthors(p.authors)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
