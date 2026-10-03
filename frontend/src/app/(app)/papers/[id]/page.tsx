import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Paper Detail" };

export default function PaperDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<FileText className="h-6 w-6" />}
        title={`Paper ${params.id}`}
        description="Full paper analysis — summary, methodology, datasets, findings, limitations, future work, all with citations."
      />
    </div>
  );
}
