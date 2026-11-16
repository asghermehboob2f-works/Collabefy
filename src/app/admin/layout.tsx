"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/site.config";
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  Users,
  History,
  Settings,
  ShieldCheck,
  ExternalLink,
  FileCheck,
  Lock,
  LogOut,
  ShieldAlert,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>("");

  useEffect(() => {
    // If on /admin/login, bypass the layout guard
    if (pathname === "/admin/login") {
      setIsAdminAuthenticated(true);
      return;
    }

    if (typeof window !== "undefined") {
      const role = localStorage.getItem("collabefy_role");
      const adminToken = localStorage.getItem("collabefy_admin_token");
      const email = localStorage.getItem("collabefy_email") ?? "";
      if ((role === "admin" || role === "ADMIN") && adminToken) {
        setAdminEmail(email);
        setIsAdminAuthenticated(true);
      } else {
        // Redirect immediately instead of showing a 403 page
        router.replace(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
      }
    }
  }, [pathname, router]);

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("collabefy_admin_token");
      localStorage.removeItem("collabefy_role");
    }
    window.location.href = "/admin/login";
  };

  // Dedicated unbranded shell for the admin login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading state while checking localStorage
  if (isAdminAuthenticated === null) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="flex items-center gap-3 text-xs font-mono text-text-subtle">
          <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  // Access Denied / Locked Security Gate
  if (isAdminAuthenticated === false) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl border border-danger/40 bg-surface-1 p-8 text-center space-y-5 shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger border border-danger/30">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-semibold text-danger uppercase tracking-wider">
              403 Forbidden • Protected Realm
            </span>
            <h2 className="text-xl font-bold text-text mt-1">
              Administrative Access Required
            </h2>
            <p className="text-xs text-text-muted mt-2 leading-relaxed">
              This workspace is restricted to authorized platform personnel. Standard visitor and creator accounts cannot
              access internal moderation, audit logs, or financial controls.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/admin/login"
              className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Authenticate as Administrator</span>
            </Link>
            <Link
              href="/"
              className="w-full rounded-md border border-border bg-surface-2 px-4 py-2 text-xs font-medium text-text hover:bg-surface-3 transition-colors"
            >
              Return to Public Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminNav = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Campaigns", href: "/admin/campaigns", icon: Layers },
    { label: "New Campaign", href: "/admin/campaigns/new", icon: PlusCircle },
    { label: "Submissions", href: "/admin/submissions", icon: FileCheck },
    { label: "Creators", href: "/admin/creators", icon: Users },
    { label: "Audit Log", href: "/admin/audit-log", icon: History },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row border-t border-border">
      {/* Left Rail Sidebar */}
      <aside className="w-full md:w-64 border-r border-border bg-surface-1/80 shrink-0 flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-text">
              Admin Portal
            </span>
          </div>
          <span className="rounded bg-accent/10 border border-accent/20 px-1.5 py-0.5 text-[10px] font-mono text-accent font-semibold">
            SECURE
          </span>
        </div>

        {/* Staff Identity */}
        <div className="p-4 border-b border-border/60 flex items-center gap-3 bg-surface-2/30">
          <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-mono text-xs font-bold text-accent">
            ER
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-text truncate">Elena Rostova</div>
            <div className="text-[10px] font-mono text-text-subtle truncate">
              Lead Platform Ops (Verified)
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-3 space-y-1 flex-1">
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-surface-3 text-accent font-semibold border border-accent/20"
                    : "text-text-muted hover:text-text hover:bg-surface-2"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-accent" : "text-text-subtle"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign Out & Live Directory */}
        <div className="p-3 border-t border-border/60 space-y-1">
          <Link
            href="/campaigns"
            className="flex items-center justify-between px-3 py-2 rounded-md text-[11px] font-mono text-text-subtle hover:text-accent transition-colors"
          >
            <span>Public Marketplace</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[11px] font-mono text-danger hover:bg-danger/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out of Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 min-w-0 bg-bg p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
