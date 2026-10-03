import type { Metadata } from "next";
import { Library } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "My Library" };

export default function LibraryPage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<Library className="h-6 w-6" />}
        title="Library coming soon"
        description="Save papers, create collections, add notes, annotations and tags."
      />
    </div>
  );
}
