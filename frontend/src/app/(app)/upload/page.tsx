import type { Metadata } from "next";
import { Upload } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Upload Paper" };

export default function UploadPage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<Upload className="h-6 w-6" />}
        title="Upload Paper coming soon"
        description="Upload a PDF to extract structured data, find related papers, and run Q&A."
      />
    </div>
  );
}
