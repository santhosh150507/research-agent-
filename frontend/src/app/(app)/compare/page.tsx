"use client";

import { ComparisonTab } from "@/components/research/tabs/ComparisonTab";

export default function ComparePage() {
  return (
    <div className="flex flex-1 flex-col p-6 bg-muted/10 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Compare Papers</h1>
        <ComparisonTab />
      </div>
    </div>
  );
}
