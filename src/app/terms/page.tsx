import React from "react";
import { siteConfig } from "@/site.config";

export default function TermsPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-8">
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Legal Agreement
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text">
              Terms of Service
            </h1>
            <p className="mt-2 text-xs font-mono text-text-subtle">
              Last updated: November 2026 • Governed by {siteConfig.legalEntity}
            </p>
          </div>

          <div className="space-y-6 text-sm text-text-muted leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-text">1. Operating Model & Relationship</h2>
              <p>
                {siteConfig.name} operates as a discovery and performance verification marketplace connecting independent creators with sponsoring brands. Collabefy provides the marketplace interface and verification tooling; Discord is utilized for day-to-day community coordination.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-text">2. Performance Rewards & No Earnings Guarantee</h2>
              <p>
                Display of reward rates (e.g. $22 per 1,000 verified views) represents an agreed performance reward metric, NOT guaranteed compensation. Rewards are contingent upon the creator strictly complying with campaign rules, publishing original content, and achieving audited organic views.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-text">3. View Auditing & Fraud Prevention</h2>
              <p>
                All submitted content is subject to a 48-hour post-publication audit. Any views derived from bot farms, paid traffic exchanges, deceptive clickbait, or automated viewing scripts are filtered out and will result in immediate disqualification and forfeiture of reward claims.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-text">4. Content Rights & Licensing</h2>
              <p>
                Creators retain copyright ownership of their original work while granting the sponsoring brand and {siteConfig.name} a non-exclusive, worldwide license to display and reference the published promotional clips for attribution and marketing purposes.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

