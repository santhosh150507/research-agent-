import type { Metadata } from "next";
import { History } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Search History" };

export default function HistoryPage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<History className="h-6 w-6" />}
        title="Search History coming soon"
        description="Reopen previous research searches and review past queries."
      />
    </div>
  );
}
