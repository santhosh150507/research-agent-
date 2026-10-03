"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  Upload,
  Network,
  Columns2,
  TrendingUp,
  SearchX,
  Library,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Microscope,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/research", label: "Research", icon: FlaskConical },
  { href: "/discover", label: "Discover Papers", icon: BookOpen },
  { href: "/upload", label: "Upload Paper", icon: Upload },
  { href: "/graph", label: "Research Graph", icon: Network },
  { href: "/compare", label: "Compare", icon: Columns2 },
  { href: "/trends", label: "Trends", icon: TrendingUp },
  { href: "/gaps", label: "Research Gaps", icon: SearchX },
  { href: "/library", label: "Library", icon: Library },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ElementType;
  collapsed: boolean;
  active: boolean;
}

function NavItem({ href, label, icon: Icon, collapsed, active }: NavItemProps) {
  const content = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        "hover:bg-accent hover:text-accent-foreground",
        active
          ? "bg-primary/10 text-primary dark:bg-primary/20"
          : "text-muted-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

function SidebarContent({ collapsed }: { collapsed?: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Logo */}
      <div className={cn("flex items-center gap-2 px-3 py-4", collapsed && "justify-center")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Microscope className="h-4 w-4" />
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold">Research</span>
            <span className="text-xs text-muted-foreground">AI Agent</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Nav */}
      <ScrollArea className="flex-1 px-2">
        <nav className="flex flex-col gap-1 py-2">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                collapsed={collapsed ?? false}
                active={
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)
                }
              />
            ))}
          </TooltipProvider>
        </nav>
      </ScrollArea>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r bg-background transition-all duration-200 lg:flex lg:flex-col",
          collapsed ? "w-[60px]" : "w-[240px]"
        )}
        style={{ top: "var(--topbar-height)" }}
      >
        <SidebarContent collapsed={collapsed} />

        {/* Collapse toggle */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar (Sheet) */}
      <div className="fixed left-0 top-0 z-40 flex h-[var(--topbar-height)] items-center px-4 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <SidebarContent collapsed={false} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Spacer so main content doesn't sit under sidebar */}
      <div
        className={cn(
          "hidden shrink-0 transition-all duration-200 lg:block",
          collapsed ? "w-[60px]" : "w-[240px]"
        )}
      />
    </>
  );
}
