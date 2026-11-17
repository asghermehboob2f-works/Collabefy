import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/site.config";
import { calculatePlatformStats, getFeaturedCampaigns, getCreatorActivities } from "@/lib/data";
import { StatsBar } from "@/components/StatsBar";
import { CampaignCard } from "@/components/CampaignCard";
import { HowItWorks } from "@/components/HowItWorks";
import { PlatformIcon } from "@/components/PlatformIcons";
import { ArrowRight, UserPlus, Sparkles, Scale, ShieldCheck, Zap } from "lucide-react";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";
import { PlatformStats } from "@/types";

async function getCmsHero() {
  const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${backendUrl}/api/v1/cms/homepage_hero`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      return json?.data?.content || null;
    }
  } catch {
    // fallback
  }
  return null;
}

async function getLivePlatformStats(): Promise<PlatformStats> {
  const backendUrl = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${backendUrl}/api/v1/admin/analytics/overview`, {
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const json = await res.json();
      const m = json?.data?.metrics;
      if (m) {
        return {
          ongoingCampaigns: Number(m.activeCampaignsCount) || 0,
          totalCampaignsLaunched: Number(m.totalCampaignsCount) || 0,
          totalVerifiedViews: Number(m.totalVerifiedViews) || 0,
          totalRewardsPaid: Number(m.totalRewardedUsd) || 0,
          activeCreators: Number(m.creatorCount) || 0,
          lastCalculatedAt: new Date().toISOString(),
        };
      }
    }
  } catch {}
  return calculatePlatformStats();
}

export default async function HomePage() {
  const cmsHero = await getCmsHero();
  const stats = await getLivePlatformStats();
  const featured = getFeaturedCampaigns();
  const creatorActivities = getCreatorActivities();

  const eyebrow = cmsHero?.badge || "Creator Performance Marketplace";
  const headline = cmsHero?.headline || "Performance sponsorships with upfront rates.";
  const subheadline =
    cmsHero?.subheadline ||
    "Locked escrow pools, transparent CPM rates, and weekly payouts on audited organic views.";
  const ctaPrimary = cmsHero?.ctaPrimaryText || "Browse Campaigns";
  const ctaSecondary = cmsHero?.ctaSecondaryText || "Join as Creator";

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14 border-b border-border bg-bg overflow-hidden">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
            {/* Left Headline & Value Proposition Block */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {/* Product Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1 mb-3.5 text-[11px] font-mono text-text-muted w-fit">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>{eyebrow}</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[3rem] font-bold tracking-tight text-text leading-[1.12]">
                {headline}
              </h1>

              {/* Supporting narrative */}
              <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">
                {subheadline}
              </p>

              {/* CTAs */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/campaigns"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink hover:bg-[#bbf052] transition-colors shadow-sm"
                >
                  <span>{ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface-1 px-5 py-2.5 text-sm font-medium text-text hover:bg-surface-2 hover:border-border-strong transition-colors"
                >
                  <UserPlus className="w-4 h-4 text-text-muted" />
                  <span>{ctaSecondary}</span>
                </Link>
              </div>

              {/* Platform Standards / Core Guarantees */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs font-mono text-text-subtle">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span className="truncate">Escrow-funded pools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span className="truncate">48h organic fraud audit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span className="truncate">Fixed CPM rates upfront</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    <span className="truncate">Weekly Friday payouts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual / Artwork */}
            <div className="lg:col-span-7 w-full flex items-center justify-center">
              <div className="relative w-full flex items-center justify-center">
                <Image
                  src="/media/hero.png"
                  alt="Collabefy — Creator Performance Sponsorship Marketplace"
                  width={1536}
                  height={1024}
                  priority
                  className="w-full h-auto object-contain select-none"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Platform Stats Band */}
      <StatsBar stats={stats} />

      {/* Featured / Ongoing Campaigns Grid */}
      <section className="py-20 md:py-28 border-b border-border/50">
        <div className="container-fluid">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Featured Campaigns</span>
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-text">
                Active sponsorships accepting submissions
              </h2>
              <p className="mt-1.5 text-sm text-text-muted">
                Transparent reward rates, confirmed budgets, and clearly stated delivery guidelines.
              </p>
            </div>
            <Link
              href="/campaigns"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline decoration-accent/40 transition-colors"
            >
              <span>Explore all {stats.ongoingCampaigns} campaigns</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>

      {/* Creator Activity Section */}
      <section className="py-20 md:py-24 bg-surface-1/40 border-b border-border/50">
        <div className="container-fluid">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                Live Creator Feed
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-text">
                Recent Creator Activity &amp; Published Work
              </h2>
              <p className="mt-1.5 text-sm text-text-muted">
                Real creator submissions audited through Collabefy verification with confirmed view performance.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-text-subtle">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span>Verified performance only • No fabricated stats</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {creatorActivities.map((act) => (
              <div
                key={act.id}
                className="flex flex-col rounded-lg border border-border bg-surface-1 overflow-hidden hover:border-border-strong transition-all duration-200"
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-video w-full overflow-hidden bg-surface-2">
                  <img
                    src={act.thumbnailUrl}
                    alt={act.campaignTitle}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-2.5 right-2.5 rounded-sm bg-bg/85 backdrop-blur-md px-2 py-0.5 text-text border border-border">
                    <PlatformIcon platform={act.platform} className="w-3.5 h-3.5" />
                  </div>
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-text">
                    <span className="rounded bg-surface-2/90 px-1.5 py-0.5 border border-border">
                      {act.brandName}
                    </span>
                    <span className="text-text-muted text-[10px]">{act.publishedAt}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <img
                        src={act.avatarUrl}
                        alt={act.creatorName}
                        className="w-7 h-7 rounded-full object-cover border border-border"
                      />
                      <div>
                        <div className="text-xs font-semibold text-text leading-none">
                          {act.creatorName}
                        </div>
                        <div className="text-[11px] font-mono text-text-muted mt-0.5">
                          {act.creatorHandle}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/campaigns/${act.campaignSlug}`}
                      className="text-xs font-medium text-text hover:text-accent transition-colors line-clamp-1 block mb-3"
                    >
                      {act.campaignTitle}
                    </Link>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="text-[10px] text-text-subtle">Verified Views</div>
                      <div className="font-semibold text-text tabular-nums">
                        {formatCompactNumber(act.verifiedViews)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-text-subtle">Reward</div>
                      <div className="font-semibold text-accent tabular-nums">
                        {formatCurrency(act.rewardEarned)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Platform Benefits */}
      <section className="py-20 md:py-24 border-b border-border bg-surface-1/30">
        <div className="container-fluid">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Creator-First Standards
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-text">
              Engineered for transparent creator sponsorships
            </h2>
            <p className="mt-2 text-sm text-text-muted">
              We eliminated the opaque agency middleman, delayed invoices, and vague briefs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-3">
              <div className="w-10 h-10 rounded-md bg-surface-2 border border-border flex items-center justify-center text-accent">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-text">
                Transparent Rates Upfront
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Every campaign displays the exact dollar rate per 1,000 views, the total pool cap, and clear rules. No awkward rate negotiations.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-3">
              <div className="w-10 h-10 rounded-md bg-surface-2 border border-border flex items-center justify-center text-accent">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-text">
                Organic View Verification
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Views are audited after a 48-hour stabilization window to filter artificial bot traffic and safeguard real creator compensation.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-3">
              <div className="w-10 h-10 rounded-md bg-surface-2 border border-border flex items-center justify-center text-accent">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-text">
                Reliable Weekly Settlements
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Performance is verified post-launch. Approved creator earnings are disbursed directly every Friday via bank transfer, Stripe or USDC.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Discord CTA Panel */}
      <section className="py-20 md:py-28">
        <div className="container-fluid">
          <div className="rounded-xl border border-border bg-gradient-to-b from-surface-1 to-surface-2 p-8 sm:p-12 relative overflow-hidden">
            <div className="max-w-xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-sm bg-accent/10 border border-accent/20 px-2.5 py-1 text-xs font-mono text-accent">
                <span>Direct Community Workspace</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text">
                Ready to monetize your audience?
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Browse verified brand campaigns, check detailed guidelines, and submit your content to earn directly based on your reach.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/campaigns"
                  className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity"
                >
                  <span>Discover Campaigns</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-2 px-5 py-2.5 text-sm font-medium text-text hover:bg-surface-3 transition-colors"
                >
                  <span>Contact Brand Partnerships</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
