import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Discover Papers" };

export default function DiscoverPage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<BookOpen className="h-6 w-6" />}
        title="Discover Papers coming soon"
        description="Browse methodologies, datasets, and trending papers in your research area."
      />
    </div>
  );
}
