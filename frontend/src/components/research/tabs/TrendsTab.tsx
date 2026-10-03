"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useResearchStore } from "@/store/research";
import { Loader2, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function TrendsTab() {
  const searchId = useResearchStore(s => s.search_id);

  const { data, isLoading } = useQuery({
    queryKey: ["trends", searchId],
    queryFn: () => api.getTrends(searchId || undefined),
    enabled: !!searchId,
  });

  if (!searchId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg bg-card border-dashed">
        <TrendingUp className="h-8 w-8 mb-4 opacity-50" />
        <p className="text-lg font-medium text-foreground">Run a search to view trends</p>
        <p className="mt-2">Trend analysis requires an active search topic to aggregate data over time.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Analyzing publication trends...</p>
      </div>
    );
  }

  if (!data) return null;

  // Transform methods_over_time for LineChart
  const allYears = Array.from(new Set(data.methods_over_time.flatMap(m => m.series.map(s => s.year)))).sort();
  const methodChartData = allYears.map(year => {
    const row: any = { year: year.toString() };
    data.methods_over_time.forEach(m => {
      const pt = m.series.find(s => s.year === year);
      row[m.method] = pt ? pt.count : 0;
    });
    return row;
  });

  const methodColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="flex flex-col gap-6 p-4">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Publication Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Publication Volume</CardTitle>
            <CardDescription>Number of relevant papers published per year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.by_year.map(d => ({ year: d.year.toString(), count: d.count }))} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Methodologies over time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Methods Evolution</CardTitle>
            <CardDescription>Popularity of different methodologies over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={methodChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  {data.methods_over_time.map((m, i) => (
                    <Line 
                      key={m.method} 
                      type="monotone" 
                      dataKey={m.method} 
                      stroke={methodColors[i % methodColors.length]} 
                      strokeWidth={2}
                      dot={{ r: 3, strokeWidth: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Datasets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Datasets</CardTitle>
            <CardDescription>Most frequently used datasets in this domain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.datasets} layout="vertical" margin={{ top: 10, right: 10, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} width={120} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Keyword Trends</CardTitle>
            <CardDescription>Emerging and declining research topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">🔥 Emerging Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.filter(k => k.direction === "emerging").map(k => (
                    <Badge key={k.term} variant="outline" className="bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300">
                      {k.term}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Stable Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.filter(k => k.direction === "stable").map(k => (
                    <Badge key={k.term} variant="secondary" className="font-normal">
                      {k.term}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 text-orange-600 dark:text-orange-400">📉 Declining Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.filter(k => k.direction === "declining").map(k => (
                    <Badge key={k.term} variant="outline" className="bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300">
                      {k.term}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
