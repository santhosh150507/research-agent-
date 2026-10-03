"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Loader2, Library, Folder, FileText, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatAuthors, formatYear } from "@/lib/format";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LibraryPage() {
  const [q, setQ] = useState("");
  const [activeCollection, setActiveCollection] = useState<number | null>(null);

  const { data: libraryData, isLoading: libLoading } = useQuery({
    queryKey: ["library", q, activeCollection],
    queryFn: () => api.getLibrary({ q: q || undefined, collection_id: activeCollection || undefined }),
  });

  const { data: collectionsData, isLoading: colLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: () => api.getCollections(),
  });

  return (
    <div className="flex flex-1 flex-col p-6 bg-muted/10 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-6">
        
        {/* Sidebar for Collections */}
        <div className="w-full md:w-64 flex flex-col gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Library className="h-5 w-5" /> Library
          </h2>
          
          <div className="flex flex-col gap-1 mt-4">
            <Button 
              variant={activeCollection === null ? "secondary" : "ghost"} 
              className="justify-start font-medium"
              onClick={() => setActiveCollection(null)}
            >
              All Saved Papers
            </Button>
            
            <div className="py-2 mt-2">
              <h3 className="text-xs font-semibold uppercase text-muted-foreground px-4 mb-2">Collections</h3>
              {colLoading ? (
                <div className="p-4 flex justify-center"><Loader2 className="h-4 w-4 animate-spin" /></div>
              ) : collectionsData?.map(c => (
                <Button 
                  key={c.id}
                  variant={activeCollection === c.id ? "secondary" : "ghost"} 
                  className="justify-start font-medium w-full truncate flex items-center gap-2"
                  onClick={() => setActiveCollection(c.id)}
                >
                  <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{c.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{c.paper_count}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content for Papers */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search your library..." 
                className="pl-9"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {libLoading ? (
              <div className="p-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : libraryData?.items.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground border border-dashed rounded-lg bg-card">
                <FileText className="h-8 w-8 mx-auto mb-4 opacity-50" />
                <p>No papers found in this collection.</p>
              </div>
            ) : libraryData?.items.map(item => (
              <Card key={item.paper.id} className="shadow-sm hover:border-primary/40 transition-colors">
                <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <Link href={`/papers/${item.paper.id}`} className="font-semibold text-lg hover:text-primary transition-colors">
                      {item.paper.title}
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      {formatAuthors(item.paper.authors)} • {formatYear(item.paper.year)} • {item.paper.venue}
                    </div>
                    {item.paper.abstract && (
                      <p className="text-sm text-foreground line-clamp-2 mt-1">{item.paper.abstract}</p>
                    )}
                  </div>
                  
                  <div className="w-full sm:w-48 shrink-0 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4 flex flex-col gap-2">
                    <Tabs defaultValue="notes" className="w-full">
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
                        <TabsTrigger value="tags" className="text-xs">Tags</TabsTrigger>
                      </TabsList>
                      <TabsContent value="notes" className="text-sm text-muted-foreground p-2 border rounded-md mt-2 min-h-[60px] flex items-center justify-center italic bg-muted/20">
                        Select paper to view notes.
                      </TabsContent>
                      <TabsContent value="tags" className="text-sm text-muted-foreground p-2 border rounded-md mt-2 min-h-[60px] flex flex-wrap gap-1 bg-muted/20">
                        {item.tags.length === 0 ? <span className="italic">No tags</span> : item.tags.map(t => (
                          <span key={t} className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs">{t}</span>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
