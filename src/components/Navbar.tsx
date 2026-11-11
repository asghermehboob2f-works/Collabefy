"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/site.config";
import { Menu, X, ArrowUpRight, ShieldCheck } from "lucide-react";
import { PlatformIcon } from "./PlatformIcons";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Campaigns", href: "/campaigns" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Leaderboards", href: "/leaderboard" },
    { label: "Community", href: "/community" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-accent text-accent-ink font-mono font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              C
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg tracking-tight text-text">
                {siteConfig.name}
              </span>
              <span className="rounded-[4px] border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-text-subtle uppercase tracking-wider">
                Beta
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-text" : "text-text-muted hover:text-text"
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
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-text-subtle hover:text-text hover:bg-surface-2 transition-colors border border-transparent hover:border-border"
            title="Administrator Portal"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Admin</span>
          </Link>

          <a
            href={siteConfig.links.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text hover:bg-surface-2 transition-colors border border-border"
          >
            <PlatformIcon platform="discord" className="w-3.5 h-3.5" />
            <span>Discord</span>
            <ArrowUpRight className="w-3 h-3 text-text-subtle" />
          </a>

          <Link
            href="/login"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
          >
            Sign In
          </Link>

          <Link
            href="/campaigns"
            className="flex items-center gap-1 rounded-md bg-accent px-4 py-1.5 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity"
          >
            <span>Browse campaigns</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/campaigns"
            className="rounded-md bg-accent px-3 py-1 text-xs font-semibold text-accent-ink"
          >
            Browse
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
                className="text-base font-medium text-text-muted hover:text-text py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-base font-medium text-text-muted hover:text-text py-1"
            >
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span>Admin Management</span>
            </Link>
          </nav>
          <div className="pt-4 border-t border-border flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-sm font-medium rounded-md border border-border text-text"
            >
              Sign In
            </Link>
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md bg-surface-2 text-text"
            >
              <PlatformIcon platform="discord" className="w-4 h-4" />
              <span>Join Community Discord</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

