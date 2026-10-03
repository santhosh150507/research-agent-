import type { Metadata } from "next";
import { LayoutDashboard } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<LayoutDashboard className="h-6 w-6" />}
        title="Dashboard coming soon"
        description="Your active topics, recent papers, saved papers and recommendations will appear here."
      />
    </div>
  );
}
