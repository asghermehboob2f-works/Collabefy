import React from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { calculatePlatformStats, getFeaturedCampaigns } from "@/lib/data";
import { StatsBar } from "@/components/StatsBar";
import { CampaignCard } from "@/components/CampaignCard";
import { HowItWorks } from "@/components/HowItWorks";
import { HeroPreviewStack } from "@/components/HeroPreviewStack";
import { PlatformIcon } from "@/components/PlatformIcons";
import { ArrowRight, ShieldCheck, Zap, Scale, ArrowUpRight } from "lucide-react";

export default function HomePage() {
  const stats = calculatePlatformStats();
  const featured = getFeaturedCampaigns();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Soft radial background vignette */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/5 rounded-full blur-[140px]" />

        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Headline Block */}
            <div className="lg:col-span-7 space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-1 px-3 py-1 text-xs font-mono text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span>Transparent rates & rules upfront on every campaign</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-semibold tracking-[-0.03em] leading-[1.08] text-text">
                Campaigns for creators who{" "}
                <span className="text-accent underline decoration-accent/30 underline-offset-8">
                  ship
                </span>
                .
              </h1>

              {/* Supporting narrative */}
              <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
                {siteConfig.name} connects brands with creators on verified performance terms. Know your CPM rate, content requirements, and payout schedule before you join.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/campaigns"
                  className="flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-ink hover:opacity-95 transition-all shadow-sm"
                >
                  <span>Browse active campaigns</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={siteConfig.links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-5 py-3 text-sm font-medium text-text hover:border-border-strong hover:bg-surface-3 transition-colors"
                >
                  <PlatformIcon platform="discord" className="w-4 h-4" />
                  <span>Join Discord Community</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-text-subtle" />
                </a>
              </div>

              {/* Micro-trust indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-mono text-text-subtle">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>Verified 48h view audits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span>Weekly payouts via Stripe or USDC</span>
                </div>
              </div>
            </div>

            {/* Right Stack Preview */}
            <div className="lg:col-span-5">
              <HeroPreviewStack campaigns={featured} />
            </div>
          </div>
        </div>
      </section>

      {/* Real Platform Stats Band */}
      <StatsBar stats={stats} />

      {/* Featured Campaigns Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                Curated Opportunities
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-text">
                Featured Campaigns
              </h2>
              <p className="mt-1 text-sm text-text-muted">
                Active sponsorships currently accepting submissions and Discord onboarding.
              </p>
            </div>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text hover:text-accent transition-colors"
            >
              <span>View all campaigns ({stats.ongoingCampaigns})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Platform Benefits */}
      <section className="py-20 border-b border-border bg-surface-1/30">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Creator-First Standards
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-text">
              Why top creators choose {siteConfig.name}
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              We eliminated the opaque agency middleman, delayed invoices, and vague briefs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-3">
              <div className="w-9 h-9 rounded-md bg-surface-2 border border-border flex items-center justify-center text-accent">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-text">
                Transparent Rates Upfront
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Every campaign shows the exact dollar rate per 1,000 views, the total pool cap, and clear rules. No awkward rate negotiations.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-3">
              <div className="w-9 h-9 rounded-md bg-surface-2 border border-border flex items-center justify-center text-accent">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-text">
                Discord-Led Collaboration
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Connect directly with brand marketing leads and fellow creators in dedicated campaign channels. Ask questions, get feedback, and sync.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-3">
              <div className="w-9 h-9 rounded-md bg-surface-2 border border-border flex items-center justify-center text-accent">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-semibold text-text">
                Reliable Weekly Settlements
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Performance is audited post-launch with anti-bot verification. Approved creator earnings are disbursed automatically every single Friday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Discord CTA Panel */}
      <section className="py-20">
        <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border bg-gradient-to-b from-surface-1 to-surface-2 p-8 sm:p-12 relative overflow-hidden">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-sm bg-accent/10 border border-accent/20 px-2.5 py-1 text-xs font-mono text-accent">
                <span>Discord Operational Workspace</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text">
                Join our Discord community of 4,000+ creators
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Real-time campaign announcements, direct brand Q&A, content feedback channels, and daily support. You don't need an account to browse campaigns, but Discord is where operations live.
              </p>
              <div className="pt-2">
                <a
                  href={siteConfig.links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity"
                >
                  <PlatformIcon platform="discord" className="w-4 h-4" />
                  <span>Enter the Discord Server</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

