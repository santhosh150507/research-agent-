"use client";

import { GraphTab } from "@/components/research/tabs/GraphTab";

export default function GraphPage() {
  return (
    <div className="flex flex-1 flex-col p-6 bg-muted/10 h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
        <h1 className="text-2xl font-bold mb-6 shrink-0">Knowledge Graph</h1>
        <div className="flex-1 min-h-0">
          <GraphTab />
        </div>
      </div>
    </div>
  );
}
