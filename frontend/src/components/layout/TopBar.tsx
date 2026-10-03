"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const routeLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/research": "Research Workspace",
  "/discover": "Discover Papers",
  "/upload": "Upload Paper",
  "/graph": "Research Graph",
  "/compare": "Compare Papers",
  "/trends": "Research Trends",
  "/gaps": "Research Gaps",
  "/library": "My Library",
  "/history": "Search History",
  "/settings": "Settings",
  "/dev/components": "Dev: Components",
};

function getLabel(pathname: string): string {
  if (pathname.startsWith("/papers/")) return "Paper Detail";
  for (const [prefix, label] of Object.entries(routeLabels)) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) return label;
  }
  return "AI Research Agent";
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes: { value: string; icon: React.ElementType; label: string }[] = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];

  const current = themes.find((t) => t.value === theme) ?? themes[2];
  const Icon = current.icon;

  const cycle = () => {
    const idx = themes.findIndex((t) => t.value === theme);
    setTheme(themes[(idx + 1) % themes.length].value);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycle}
      aria-label={`Theme: ${current.label}. Click to switch.`}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export function TopBar() {
  const pathname = usePathname();
  const label = getLabel(pathname);

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 flex h-[var(--topbar-height)] items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      {/* Mobile hamburger slot (rendered by Sidebar) */}
      <div className="flex h-full w-[60px] shrink-0 items-center justify-center lg:w-0" />

      {/* Logo on mobile (hidden on desktop — sidebar has it) */}
      <span className="ml-2 text-sm font-semibold lg:hidden">
        AI Research Agent
      </span>

      <Separator orientation="vertical" className="mx-3 h-5 lg:hidden" />

      {/* Page title */}
      <h1 className="flex-1 text-sm font-semibold text-foreground lg:ml-4">
        {label}
      </h1>

      {/* Actions */}
      <div className="flex items-center gap-1 px-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
