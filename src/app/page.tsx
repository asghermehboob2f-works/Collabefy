import React from "react";
import Link from "next/link";
import { siteConfig } from "@/site.config";
import { calculatePlatformStats, getFeaturedCampaigns, getCreatorActivities } from "@/lib/data";
import { StatsBar } from "@/components/StatsBar";
import { CampaignCard } from "@/components/CampaignCard";
import { HowItWorks } from "@/components/HowItWorks";
import { HeroPreviewStack } from "@/components/HeroPreviewStack";
import { PlatformIcon } from "@/components/PlatformIcons";
import { ArrowRight, ShieldCheck, Zap, Scale, CheckCircle2, Eye, UserPlus, Sparkles } from "lucide-react";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

export default function HomePage() {
  const stats = calculatePlatformStats();
  const featured = getFeaturedCampaigns();
  const creatorActivities = getCreatorActivities();

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-28 md:pb-36 border-b border-border/40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/8 via-bg to-bg">
        {/* Decorative background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-border,#333) 1px, transparent 1px), linear-gradient(90deg, var(--color-border,#333) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        {/* Soft radial glow */}
        <div className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-accent/10 rounded-full blur-[180px]" />
        {/* Secondary accent orb */}
        <div className="pointer-events-none absolute top-1/2 -right-64 w-[500px] h-[500px] bg-lime-400/5 rounded-full blur-[120px]" />

        <div className="container-fluid relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Headline Block */}
            <div className="lg:col-span-7 space-y-7">

              {/* Animated live badge */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent/8 px-4 py-1.5 text-xs font-mono font-medium text-accent shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                <span>Verified Campaign Platform</span>
              </div>

              {/* Display Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-bold tracking-[-0.04em] leading-[1.06] text-text">
                Turn your content into{" "}
                <span className="bg-gradient-to-r from-accent to-lime-300 bg-clip-text text-transparent">
                  revenue
                </span>
                .
              </h1>

              {/* Supporting narrative */}
              <p className="text-base sm:text-lg text-text-muted max-w-xl leading-relaxed">
                Discover creator campaigns, understand the rewards upfront, publish authentic content and earn based on verified performance.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  href="/campaigns"
                  className="flex items-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink hover:opacity-90 transition-all shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Browse Campaigns</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface-1/60 backdrop-blur-sm px-6 py-3.5 text-sm font-medium text-text hover:border-accent/40 hover:bg-surface-2 transition-all"
                >
                  <UserPlus className="w-4 h-4 text-accent" />
                  <span>Join as Creator</span>
                </Link>
              </div>

              {/* Micro-trust indicators */}
              <div className="pt-2 flex flex-wrap items-center gap-5 text-xs font-mono text-text-subtle">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                  <span>Transparent CPM &amp; Rules</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-accent" />
                  <span>Verified 48h Organic View Audits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span>Direct Weekly Creator Payouts</span>
                </div>
              </div>

              {/* Social proof row */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full border-2 border-bg bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">A</div>
                  <div className="w-7 h-7 rounded-full border-2 border-bg bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white">M</div>
                  <div className="w-7 h-7 rounded-full border-2 border-bg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-bold text-white">J</div>
                </div>
                <p className="text-xs text-text-muted font-medium">
                  <span className="text-text font-semibold">2,400+</span> creators earning this week
                </p>
              </div>
            </div>

            {/* Right Stack Preview Artwork */}
            <div className="lg:col-span-5 w-full">
              <HeroPreviewStack campaigns={featured} />
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
