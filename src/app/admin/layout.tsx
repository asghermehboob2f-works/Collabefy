import React from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  Users,
  Trophy,
  History,
  Settings,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminNav = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Campaigns", href: "/admin/campaigns", icon: Layers },
    { label: "New Campaign", href: "/admin/campaigns/new", icon: PlusCircle },
    { label: "Creators", href: "/admin/creators", icon: Users },
    { label: "Audit Log", href: "/admin/audit-log", icon: History },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row border-t border-border">
      {/* Left Rail Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-surface-1/70 shrink-0">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-text">
              Admin Portal
            </span>
          </div>
          <span className="rounded bg-accent/10 border border-accent/20 px-1.5 py-0.5 text-[10px] font-mono text-accent">
            Role: Owner
          </span>
        </div>

        {/* Staff Identity */}
        <div className="p-4 border-b border-border/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-mono text-xs font-bold text-accent">
            ER
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-text truncate">Elena Rostova</div>
            <div className="text-[10px] font-mono text-text-subtle truncate">
              Lead Platform Ops
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
              >
                <Icon className="w-4 h-4 text-text-subtle" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Live Marketplace shortcut */}
        <div className="p-4 mt-auto border-t border-border/60">
          <Link
            href="/campaigns"
            className="flex items-center justify-between text-[11px] font-mono text-text-subtle hover:text-accent transition-colors"
          >
            <span>View Public Directory</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 min-w-0 bg-bg p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}

