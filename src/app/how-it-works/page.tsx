import React from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { HowItWorks } from "@/components/HowItWorks";
import { ShieldCheck, MessageSquare, DollarSign, ArrowRight } from "lucide-react";
import { PlatformIcon } from "@/components/PlatformIcons";

export default function HowItWorksPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Architecture
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-semibold tracking-tight text-text">
            How {siteConfig.name} Works
          </h1>
          <p className="mt-3 text-base text-text-muted leading-relaxed">
            A creator marketplace engineered for performance, not vanity metrics. Learn how we verify organic views, coordinate in Discord, and settle payments weekly.
          </p>
        </div>

        {/* 5-Step Core Flow */}
        <HowItWorks />

        {/* Operating Pillars */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-border">
          <div className="space-y-3">
            <div className="w-8 h-8 rounded-md bg-surface-2 flex items-center justify-center text-accent">
              <PlatformIcon platform="discord" className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-text">
              1. Discord is the Workspace
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Instead of clunky dashboards with delayed notifications, creators join campaign-specific Discord channels. Direct access to brand marketing directors, downloadable vector assets, and instantaneous support.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-8 h-8 rounded-md bg-surface-2 flex items-center justify-center text-accent">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-text">
              2. 48-Hour Fraud Auditing
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Every video link submitted goes through Collabefy's view verification service. Views are evaluated 48 hours post-posting to filter out bot farms, non-organic spikes, and invalid traffic before payment calculation.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-8 h-8 rounded-md bg-surface-2 flex items-center justify-center text-accent">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-text">
              3. Weekly Escrow Disbursements
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Brands fund campaign reward pools into escrow before any campaign goes live. Once your views are audited, payouts are dispatched automatically every Friday via Stripe Connect or USDC.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-text">Ready to join your first campaign?</h2>
            <p className="text-xs text-text-muted mt-1">No registration required to browse active sponsorships.</p>
          </div>
          <Link
            href="/campaigns"
            className="flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity"
          >
            <span>Browse campaigns</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

