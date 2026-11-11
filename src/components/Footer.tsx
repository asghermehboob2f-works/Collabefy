import React from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { PlatformIcon } from "./PlatformIcons";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-1/50 pt-16 pb-12 text-sm text-text-muted">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-border">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-accent text-accent-ink font-mono font-bold text-base">
                C
              </div>
              <span className="font-semibold text-base tracking-tight text-text">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-text-muted max-w-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3 pt-2">
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
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md border border-border bg-surface-2 text-text-muted hover:text-text transition-colors"
                aria-label="X / Twitter"
              >
                <PlatformIcon platform="x" className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/campaigns" className="hover:text-text transition-colors">
                  All Campaigns
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-text transition-colors">
                  Leaderboards
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-text transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:text-text transition-colors">
                  Discord Hub
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text">
              Platform & Team
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-text transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-text transition-colors">
                  FAQ & Verification
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-text transition-colors">
                  Brand Sponsorships
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-text transition-colors">
                  Staff Admin
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-text transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-text transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="text-xs text-text-subtle block pt-2">
                  Operating Model: Discord-led manual review & weekly verified payouts.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtle">
          <div>{siteConfig.footer.copyright}</div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-mono text-text-muted">
              Discord Bot: Operational • Payouts: Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

