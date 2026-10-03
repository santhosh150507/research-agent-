"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, Database, Cog } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ClaimView } from "@/components/claims/ClaimView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatAuthors, formatYear } from "@/lib/format";

export default function DiscoverPage() {
  const { data: methodsData, isLoading: isLoadingMethods } = useQuery({
    queryKey: ["discover-methods"],
    queryFn: () => api.getMethods(),
  });

  const { data: datasetsData, isLoading: isLoadingDatasets } = useQuery({
    queryKey: ["discover-datasets"],
    queryFn: () => api.getDatasets(),
  });

  return (
    <div className="flex flex-1 flex-col p-6 bg-muted/10 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-2">Discover</h1>
        <p className="text-muted-foreground mb-6">Explore methodologies and datasets extracted from the literature.</p>
        
        <Tabs defaultValue="methods" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="methods" className="w-32"><Cog className="h-4 w-4 mr-2" /> Methods</TabsTrigger>
            <TabsTrigger value="datasets" className="w-32"><Database className="h-4 w-4 mr-2" /> Datasets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="methods" className="space-y-6">
            {isLoadingMethods ? (
              <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : methodsData?.items.map(method => (
              <Card key={method.name}>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{method.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ClaimView claim={method.description} className="bg-muted/30 border-none" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Common Uses</h4>
                      <div className="space-y-2">
                        {method.common_uses.map((c, i) => <ClaimView key={i} claim={c} className="p-2 text-sm" />)}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 text-green-700 dark:text-green-400">Advantages</h4>
                      <div className="space-y-2">
                        {method.advantages.map((c, i) => <ClaimView key={i} claim={c} className="p-2 text-sm border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30" />)}
                      </div>
                    </div>
                  </div>
                  
                  {method.papers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-sm mb-2">Prominent Papers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {method.papers.slice(0, 4).map(p => (
                          <Link key={p.id} href={`/papers/${p.id}`} className="block p-3 rounded border bg-card hover:border-primary/50 text-sm">
                            <div className="font-medium line-clamp-1 mb-1">{p.title}</div>
                            <div className="text-xs text-muted-foreground">{formatAuthors(p.authors)} • {formatYear(p.year)}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="datasets" className="space-y-6">
            {isLoadingDatasets ? (
              <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : datasetsData?.items.map(dataset => (
              <Card key={dataset.name}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-primary">{dataset.name}</CardTitle>
                      {dataset.domain && <div className="text-sm text-muted-foreground mt-1">Domain: {dataset.domain}</div>}
                    </div>
                    {dataset.size && <Badge variant="outline">{dataset.size}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dataset.description && (
                    <p className="text-sm leading-relaxed">{dataset.description}</p>
                  )}
                  
                  {dataset.tasks.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Used For Tasks</h4>
                      <div className="flex flex-wrap gap-2">
                        {dataset.tasks.map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
                      </div>
                    </div>
                  )}
                  
                  {dataset.papers.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-sm mb-2">Prominent Papers</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {dataset.papers.slice(0, 4).map(p => (
                          <Link key={p.id} href={`/papers/${p.id}`} className="block p-3 rounded border bg-card hover:border-primary/50 text-sm">
                            <div className="font-medium line-clamp-1 mb-1">{p.title}</div>
                            <div className="text-xs text-muted-foreground">{formatAuthors(p.authors)} • {formatYear(p.year)}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
