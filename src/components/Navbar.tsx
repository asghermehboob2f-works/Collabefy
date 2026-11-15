"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/site.config";
import { Menu, X, User as UserIcon, ArrowRight, ShieldAlert } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("collabefy_role");
      const storedEmail = localStorage.getItem("collabefy_email");
      if (storedRole) {
        setUserRole(storedRole);
        setUserEmail(storedEmail || "creator@collabefy.com");
      } else {
        setUserRole(null);
        setUserEmail(null);
      }
    }
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Campaigns", href: "/campaigns" },
    { label: "Support", href: "/contact" },
  ];

  const isAdmin = userRole === "admin" || userRole === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/95 backdrop-blur-md transition-colors">
      <div className="container-fluid flex h-16 items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-ink font-mono font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              C
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-text">
                {siteConfig.name}
              </span>
              <span className="rounded-[4px] border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-accent uppercase tracking-wider font-medium">
                Live
              </span>
            </div>
          </Link>

          {/* Desktop Nav: Home, Campaigns, Support */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-accent" : "text-text-muted hover:text-text"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {userRole ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                  title="Administrative Workspace"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin Workspace</span>
                </Link>
              )}

              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-text hover:border-border-strong hover:bg-surface-3 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-accent" />
                <span className="truncate max-w-[120px]">{userEmail?.split("@")[0]}</span>
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/campaigns"
            className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-1.5 text-sm font-semibold text-accent-ink hover:opacity-95 transition-all shadow-sm"
          >
            <span>Browse Campaigns</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/campaigns"
            className="rounded-md bg-accent px-3 py-1 text-xs font-semibold text-accent-ink"
          >
            Campaigns
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-surface-2"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface-1 px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-1 ${
                  pathname === link.href ? "text-accent" : "text-text-muted hover:text-text"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-medium text-accent py-1"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Workspace</span>
              </Link>
            )}
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-base font-medium text-text-muted hover:text-text py-1"
            >
              <UserIcon className="w-4 h-4 text-accent" />
              <span>Creator Profile & Submissions</span>
            </Link>
          </nav>
          <div className="pt-4 border-t border-border flex flex-col gap-2.5">
            {userRole ? (
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("collabefy_role");
                    localStorage.removeItem("collabefy_email");
                    setUserRole(null);
                  }
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center py-2.5 text-sm font-medium rounded-md border border-border text-danger hover:bg-surface-2"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium rounded-md border border-border text-text hover:bg-surface-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold rounded-md bg-accent text-accent-ink hover:opacity-95"
                >
                  Join as Creator
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
