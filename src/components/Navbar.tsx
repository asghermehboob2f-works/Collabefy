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
    <span className="font-semibold text-lg tracking-tight text-text">{siteConfig.name}</span>
    <span className="rounded-[4px] border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-accent uppercase tracking-wider font-medium">
      Live
    </span>
  </Link>
  {/* Discord Button */}
  <Link
    href={siteConfig.links.discord}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-text hover:border-accent hover:bg-surface-3 transition-colors"
  >
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.372 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.111.82-.261.82-.577 0-.285-.01-1.04-.015-2.04-3.338.727-4.042-1.614-4.042-1.614-.546-1.387-1.332-1.756-1.332-1.756-1.089-.744.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.303-5.467-1.332-5.467-5.932 0-1.31.469-2.382 1.236-3.222-.124-.303-.536-1.525.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.29-1.553 3.295-1.24 3.295-1.24.655 1.651.243 2.873.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.625-5.48 5.921.43.371.813 1.102.813 2.222 0 1.606-.015 2.898-.015 3.293 0 .319.216.694.825.576C20.565 21.796 24 17.302 24 12c0-6.627-5.373-12-12-12z"/></svg>
    <span>Discord</span>
  </Link>
</div>
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-ink font-mono font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              C
            </Link>

</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-text">
                {siteConfig.name}
              </span>
              <span className="rounded-[4px] border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-accent uppercase tracking-wider font-medium">
                Live
              </span>
            </Link>

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
        </Link>

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
        </Link>

</div>
      </Link>

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
          </Link>

</div>
        </Link>

</div>
      )}
    </header>
  );
}
