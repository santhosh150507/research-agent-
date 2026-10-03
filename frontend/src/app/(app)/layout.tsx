import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Research Agent",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Sidebar />
      <main
        className="min-h-screen pt-[var(--topbar-height)] transition-all duration-200"
        // Sidebar pushes content via its own spacer div
      >
        <div className="flex min-h-[calc(100vh-var(--topbar-height))]">
          {children}
        </div>
      </main>
    </div>
  );
}
