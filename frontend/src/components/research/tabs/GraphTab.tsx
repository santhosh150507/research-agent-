"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useResearchStore, useSelectedPaperIds } from "@/store/research";
import { Loader2, Network, SearchX } from "lucide-react";
import ReactFlow, { Background, Controls, Node, Edge, MarkerType } from "reactflow";
import "reactflow/dist/style.css";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NODE_COLORS: Record<string, string> = {
  paper: "#3b82f6", // blue-500
  author: "#8b5cf6", // violet-500
  topic: "#10b981", // emerald-500
  method: "#f59e0b", // amber-500
  dataset: "#ef4444", // red-500
};

export function GraphTab() {
  const searchId = useResearchStore(s => s.search_id);
  const selectedIds = useSelectedPaperIds();
  
  const [showTopics, setShowTopics] = useState(true);
  const [showMethods, setShowMethods] = useState(true);
  const [showAuthors, setShowAuthors] = useState(false);
  const [showDatasets, setShowDatasets] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["graph", searchId, selectedIds],
    queryFn: () => api.getGraph({ 
      search_id: searchId || undefined,
      paper_ids: selectedIds.length > 0 ? selectedIds : undefined 
    }),
    enabled: !!searchId || selectedIds.length > 0,
  });

  const { nodes, edges } = useMemo(() => {
    if (!data) return { nodes: [], edges: [] };
    
    // Filter nodes based on toggles
    const filteredNodes = data.nodes.filter(n => {
      if (n.type === "topic" && !showTopics) return false;
      if (n.type === "method" && !showMethods) return false;
      if (n.type === "author" && !showAuthors) return false;
      if (n.type === "dataset" && !showDatasets) return false;
      return true;
    });
    
    const validNodeIds = new Set(filteredNodes.map(n => n.id));
    
    // Filter edges to only include those between visible nodes
    const filteredEdges = data.edges.filter(e => validNodeIds.has(e.source) && validNodeIds.has(e.target));
    
    // Simple spring layout simulation (since we don't have a real layout engine here)
    // We'll just scatter them in a circle for now as a basic placeholder
    // In a real app, use dagre or d3-force
    const radius = 300;
    const center = { x: 400, y: 300 };
    
    const rfNodes: Node[] = filteredNodes.map((n, i) => {
      const angle = (i / filteredNodes.length) * 2 * Math.PI;
      const x = center.x + radius * Math.cos(angle) * (0.8 + Math.random() * 0.4);
      const y = center.y + radius * Math.sin(angle) * (0.8 + Math.random() * 0.4);
      
      return {
        id: n.id,
        position: { x, y },
        data: { label: n.label },
        style: {
          background: NODE_COLORS[n.type] || "#cbd5e1",
          color: "white",
          border: "none",
          borderRadius: n.type === "paper" ? "4px" : "20px",
          padding: "8px 12px",
          fontSize: "12px",
          fontWeight: "bold",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
        },
      };
    });
    
    const rfEdges: Edge[] = filteredEdges.map(e => ({
      id: `${e.source}-${e.target}-${e.type}`,
      source: e.source,
      target: e.target,
      label: e.type.replace("_", " "),
      labelStyle: { fill: "#64748b", fontSize: 10 },
      labelBgStyle: { fill: "transparent" },
      style: { stroke: "#cbd5e1", strokeWidth: 1.5 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#cbd5e1",
      },
    }));
    
    return { nodes: rfNodes, edges: rfEdges };
  }, [data, showTopics, showMethods, showAuthors, showDatasets]);

  if (!searchId && selectedIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg bg-card border-dashed">
        <Network className="h-8 w-8 mb-4 opacity-50" />
        <p className="text-lg font-medium text-foreground">Run a search or select papers</p>
        <p className="mt-2">A knowledge graph will be generated based on your current search or selected papers.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground gap-3 h-[600px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Generating knowledge graph...</p>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border rounded-lg bg-card border-dashed h-[600px]">
        <SearchX className="h-8 w-8 mb-4 opacity-50" />
        <p className="text-lg font-medium text-foreground">No graph data found</p>
        <p className="mt-2">Try adjusting your filters or toggles.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[700px] border rounded-lg overflow-hidden relative bg-muted/10">
      
      {/* Legend & Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-4 bg-background/90 backdrop-blur p-4 rounded-lg border shadow-sm w-64">
        <div>
          <h3 className="font-semibold text-sm mb-3">Entity Types</h3>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: NODE_COLORS.paper }} />
                <span className="text-sm">Papers</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.topic }} />
                <span className="text-sm">Topics</span>
              </div>
              <Switch checked={showTopics} onCheckedChange={setShowTopics} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.method }} />
                <span className="text-sm">Methods</span>
              </div>
              <Switch checked={showMethods} onCheckedChange={setShowMethods} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.dataset }} />
                <span className="text-sm">Datasets</span>
              </div>
              <Switch checked={showDatasets} onCheckedChange={setShowDatasets} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.author }} />
                <span className="text-sm">Authors</span>
              </div>
              <Switch checked={showAuthors} onCheckedChange={setShowAuthors} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#ccc" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
