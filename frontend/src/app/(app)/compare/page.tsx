import type { Metadata } from "next";
import { Columns2 } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Compare Papers" };

export default function ComparePage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<Columns2 className="h-6 w-6" />}
        title="Paper Comparison coming soon"
        description="Select 2–5 papers to generate a side-by-side comparison table with grounded narrative."
      />
    </div>
  );
}
