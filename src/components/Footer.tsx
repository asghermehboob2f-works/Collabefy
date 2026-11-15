import React from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { PlatformIcon } from "./PlatformIcons";
import { ArrowUpRight, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-1/60 pt-16 pb-12 text-sm text-text-muted">
      <div className="container-fluid">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-ink font-mono font-bold text-base">
                C
              </div>
              <span className="font-semibold text-base tracking-tight text-text">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-text-muted max-w-md leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-text hover:border-border-strong transition-colors"
              >
                <PlatformIcon platform="discord" className="w-3.5 h-3.5" />
                <span>Discord Community</span>
                <ArrowUpRight className="w-3 h-3 text-text-subtle" />
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-text hover:border-border-strong transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-accent" />
                <span>{siteConfig.supportEmail}</span>
              </Link>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:text-accent transition-colors">
                  Browse Campaigns
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent transition-colors">
                  Support & Contact
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-accent transition-colors">
                  Creator Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text">
              Legal & Compliance
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtle">
          <div>{siteConfig.footer.copyright}</div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-text-muted">
              Campaign Verification Engine: Active • Payments: Audited
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
