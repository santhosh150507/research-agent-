import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Research Gaps" };

export default function GapsPage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<SearchX className="h-6 w-6" />}
        title="Research Gaps coming soon"
        description='Potentially underexplored areas identified from the retrieved literature, with supporting papers and caution wording.'
      />
    </div>
  );
}
