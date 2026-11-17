"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/site.config";
import { Menu, X, User as UserIcon, ArrowRight, ShieldAlert } from "lucide-react";

const DiscordIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export default function Navbar() {
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

  const handleSignOut = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("collabefy_role");
      localStorage.removeItem("collabefy_email");
      setUserRole(null);
      setUserEmail(null);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/95 backdrop-blur-md transition-colors">
      <div className="container-fluid flex h-16 items-center justify-between">

        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link href="/" className="group flex items-center gap-2.5">
            <img
              src="/media/logo.png"
              alt={siteConfig.name}
              className="h-8 w-8 rounded-md object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-semibold text-lg tracking-tight text-text">{siteConfig.name}</span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
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

        {/* Desktop Right CTA */}
        <div className="hidden md:flex items-center gap-2">
          {userRole ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
                  title="Admin Workspace"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-text hover:border-border-strong hover:bg-surface-3 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-accent" />
                <span className="truncate max-w-[120px]">{userEmail?.split("@")[0]}</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-text-muted hover:text-danger hover:bg-surface-2 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-[#5865F2]/40 bg-[#5865F2]/10 px-3 py-1.5 text-xs font-medium text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors"
                aria-label="Join our Discord"
              >
                <DiscordIcon />
                <span>Discord</span>
              </Link>
            </>
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
            {userRole && (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-base font-medium text-text-muted hover:text-text py-1"
              >
                <UserIcon className="w-4 h-4 text-accent" />
                <span>Creator Profile & Submissions</span>
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-border flex flex-col gap-2.5">
            {userRole ? (
              <button
                onClick={handleSignOut}
                className="w-full text-center py-2.5 text-sm font-medium rounded-md border border-border text-danger hover:bg-surface-2"
              >
                Sign Out
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2.5 text-sm font-medium rounded-md border border-border text-text hover:bg-surface-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href={siteConfig.links.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md border border-[#5865F2]/40 bg-[#5865F2]/10 px-3 py-2.5 text-xs font-medium text-[#5865F2] hover:bg-[#5865F2]/20 transition-colors"
                    aria-label="Join our Discord"
                  >
                    <DiscordIcon />
                    <span>Discord</span>
                  </Link>
                </div>
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
