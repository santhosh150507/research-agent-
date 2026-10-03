import type { Metadata } from "next";
import { Network } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Research Graph" };

export default function GraphPage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<Network className="h-6 w-6" />}
        title="Research Graph coming soon"
        description="Interactive knowledge graph connecting papers, authors, topics, methods and datasets."
      />
    </div>
  );
}
