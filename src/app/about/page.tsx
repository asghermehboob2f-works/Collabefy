import React from "react";
import { siteConfig } from "@/site.config";
import { Shield, Zap, Target } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Company & Mission
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-text">
            About {siteConfig.name}
          </h1>
          <p className="mt-4 text-base text-text-muted leading-relaxed">
            {siteConfig.name} is a performance-based campaign marketplace connecting forward-thinking technology companies with skilled creators and video editors.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pb-16 border-b border-border">
          <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-3">
            <Target className="w-5 h-5 text-accent" />
            <h3 className="text-base font-semibold text-text">Our Philosophy</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              We believe creators should be rewarded according to the actual reach and impact of their work, with clear rules and guaranteed rates communicated upfront.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-3">
            <Zap className="w-5 h-5 text-accent" />
            <h3 className="text-base font-semibold text-text">Zero Waste Friction</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Traditional sponsorships involve weeks of back-and-forth emails, vague creative revisions, and delayed net-60 payments. We run high-velocity sprints.
            </p>
          </div>

          <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-3">
            <Shield className="w-5 h-5 text-accent" />
            <h3 className="text-base font-semibold text-text">Data Integrity</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              We never fabricate counts, follower stats, or earnings. All public platform numbers are derived from verified stored campaign data.
            </p>
          </div>
        </div>

        <div className="pt-12 text-xs font-mono text-text-subtle">
          Operating Entity: {siteConfig.legalEntity} • Domain: {siteConfig.domain}
        </div>
      </div>
    </div>
  );
}

