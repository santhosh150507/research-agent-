import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <EmptyState
        icon={<Settings className="h-6 w-6" />}
        title="Settings coming soon"
        description="Researcher profile, interests, preferred domains and methodology preferences."
      />
    </div>
  );
}
