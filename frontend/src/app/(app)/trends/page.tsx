"use client";

import { TrendsTab } from "@/components/research/tabs/TrendsTab";

export default function TrendsPage() {
  return (
    <div className="flex flex-1 flex-col p-6 bg-muted/10 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Research Trends</h1>
        <TrendsTab />
      </div>
    </div>
  );
}
