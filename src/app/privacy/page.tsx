import React from "react";
import { siteConfig } from "@/site.config";

export default function PrivacyPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-8">
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Data Privacy
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-text">
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs font-mono text-text-subtle">
              Last updated: November 2026 • {siteConfig.name} Privacy Standards
            </p>
          </div>

          <div className="space-y-6 text-sm text-text-muted leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-semibold text-text">1. Minimum Necessary Data</h2>
              <p>
                We only collect data strictly necessary to provide the marketplace, verify view performance, and disburse weekly payments. We never sell personal data or trade creator audience information.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-text">2. Social Profile Information</h2>
              <p>
                When you share your social media handles (TikTok, YouTube, Instagram), we display them publicly only if you designate your profile as public. Manually added URLs are clearly labelled as Unverified until authenticated through official OAuth processes.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-text">3. Discord Identifiers</h2>
              <p>
                Your Discord username is utilized exclusively within the campaign operational servers for role assignment and announcement tracking. We never share internal Discord tokens or identifiers with third-party data brokers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-text">4. Contact & Data Inquiries</h2>
              <p>
                For data export or deletion requests under GDPR/CCPA, please contact our privacy compliance officer at <span className="font-mono text-accent">{siteConfig.supportEmail}</span>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

