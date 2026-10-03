"use client";

import { GapsTab } from "@/components/research/tabs/GapsTab";

export default function GapsPage() {
  return (
    <div className="flex flex-1 flex-col p-6 bg-muted/10 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Research Gaps & Opportunities</h1>
        <GapsTab />
      </div>
    </div>
  );
}
