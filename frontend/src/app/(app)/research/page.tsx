import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Research Workspace" };

export default function ResearchPage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<FlaskConical className="h-6 w-6" />}
        title="Research Workspace coming soon"
        description="Three-pane workspace: query + filters · paper results tabs · AI research assistant chat."
      />
    </div>
  );
}
