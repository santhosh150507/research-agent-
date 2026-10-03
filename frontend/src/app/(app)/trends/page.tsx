import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Research Trends" };

export default function TrendsPage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<TrendingUp className="h-6 w-6" />}
        title="Research Trends coming soon"
        description="Papers by year, emerging methods, popular datasets and keyword trends."
      />
    </div>
  );
}
