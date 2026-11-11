import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampaignBySlug, getLeaderboard, initialCampaigns } from "@/lib/data";
import { formatCurrency, formatDaysRemaining, formatDate, formatNumber } from "@/lib/utils";
import { PlatformIcon } from "@/components/PlatformIcons";
import {
  ArrowLeft,
  Share2,
  Calendar,
  Eye,
  CheckCircle2,
  FileDown,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export function generateStaticParams() {
  return initialCampaigns.map((c) => ({
    slug: c.slug,
  }));
}

export default function CampaignDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = getCampaignBySlug(params.slug);

  if (!campaign) {
    notFound();
  }

  const leaderboard = getLeaderboard(campaign.id);
  const isBudgetPublic = campaign.budgetVisibility === "public" && campaign.totalBudget > 0;
  const budgetPercentage = isBudgetPublic
    ? Math.min(100, Math.round((campaign.allocatedBudget / campaign.totalBudget) * 100))
    : 0;

  const statusMap = {
    active: { label: "Active", dotColor: "bg-success", canJoin: true },
    upcoming: { label: "Upcoming", dotColor: "bg-warning", canJoin: false },
    paused: { label: "Paused by Team", dotColor: "bg-text-subtle", canJoin: false },
    budget_exhausted: { label: "Budget Exhausted", dotColor: "bg-warning", canJoin: false },
    completed: { label: "Completed", dotColor: "bg-text-subtle", canJoin: false },
    cancelled: { label: "Cancelled", dotColor: "bg-danger", canJoin: false },
    archived: { label: "Archived", dotColor: "bg-text-subtle", canJoin: false },
  }[campaign.status];

  return (
    <div className="py-8 pb-24">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-mono text-text-subtle">
          <Link href="/campaigns" className="hover:text-text flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Campaigns</span>
          </Link>
          <span>/</span>
          <span className="text-text truncate max-w-md">{campaign.title}</span>
        </div>

        {/* 21:9 Cinematic Header Media Banner */}
        <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-border bg-surface-2 mb-8">
          <img
            src={campaign.coverImage}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />

          {/* Banner bottom info */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg border border-border bg-surface-1 p-1 shadow-lg shrink-0">
                <img
                  src={campaign.brandLogo}
                  alt={campaign.brandName}
                  className="h-full w-full rounded-md object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-text-muted uppercase">
                    {campaign.brandName} • {campaign.brandCategory}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-sm bg-surface-2 px-2 py-0.5 text-[11px] font-mono text-text border border-border">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusMap.dotColor}`} />
                    <span>{statusMap.label}</span>
                  </div>
                </div>
                <h1 className="mt-1 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-text">
                  {campaign.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-md bg-surface-1/80 backdrop-blur-md px-3 py-1.5 border border-border text-text-muted">
                {campaign.platforms.map((p) => (
                  <PlatformIcon key={p} platform={p} className="w-4 h-4" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Main Content + Sticky Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Summary */}
            <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
              <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-accent">
                Overview & Objective
              </h2>
              <p className="text-base text-text leading-relaxed">
                {campaign.description}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono text-text-subtle">
                <span className="rounded bg-surface-2 px-2.5 py-1 border border-border">
                  Target: {campaign.brief.targetAudience.join(", ")}
                </span>
                <span className="rounded bg-surface-2 px-2.5 py-1 border border-border">
                  Timezone: {campaign.timeZone}
                </span>
              </div>
            </div>

            {/* Campaign Brief */}
            <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-5">
              <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-accent">
                Creative Brief & Talking Points
              </h2>
              <div className="rounded-md border border-border/80 bg-surface-2 p-4 text-sm text-text-muted leading-relaxed">
                <span className="font-semibold text-text block mb-1">Core Narrative:</span>
                {campaign.brief.coreNarrative}
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-text-subtle uppercase block">
                  Required Talking Points
                </span>
                <ul className="space-y-2">
                  {campaign.brief.talkingPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-text">
                      <span className="text-accent font-mono text-xs font-bold mt-0.5">
                        0{i + 1}
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Downloadable Assets */}
              {campaign.brief.assets.length > 0 && (
                <div className="pt-4 border-t border-border space-y-3">
                  <span className="text-xs font-mono text-text-subtle uppercase block">
                    Downloadable Campaign Assets
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {campaign.brief.assets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center justify-between rounded-md border border-border bg-surface-2 p-3 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <FileDown className="w-4 h-4 text-accent shrink-0" />
                          <span className="font-medium text-text truncate">{asset.title}</span>
                        </div>
                        <span className="font-mono text-text-subtle shrink-0">{asset.sizeText}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Rules and Eligibility: Two-Column Definition Layout */}
            <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-5">
              <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-accent">
                Rules & Eligibility Criteria
              </h2>
              <p className="text-xs text-text-muted">
                Read all requirements before publishing content. View verification occurs after a 48-hour fraud prevention window.
              </p>

              <div className="divide-y divide-border/60">
                {campaign.rules.map((rule) => (
                  <div key={rule.id} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <span className="text-xs font-mono font-medium text-text-muted">
                      {rule.title}
                    </span>
                    <span className="sm:col-span-2 text-sm text-text leading-relaxed">
                      {rule.detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Leaderboard */}
            {campaign.leaderboardEnabled && (
              <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border">
                  <div>
                    <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-accent">
                      Verified Campaign Leaderboard
                    </h2>
                    <span className="text-xs text-text-subtle">
                      Ranked by verified organic views. Audited by Collabefy.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>Updated 2 hours ago</span>
                  </div>
                </div>

                {leaderboard.length === 0 ? (
                  <div className="py-8 text-center text-xs font-mono text-text-subtle">
                    No verified clips recorded yet for this sprint.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-border text-text-subtle">
                          <th className="pb-3 font-medium">Rank</th>
                          <th className="pb-3 font-medium">Creator</th>
                          <th className="pb-3 font-medium text-right">Verified Views</th>
                          <th className="pb-3 font-medium text-right">Clips</th>
                          <th className="pb-3 font-medium text-right">Reward Earned</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {leaderboard.map((entry) => (
                          <tr key={entry.id} className="hover:bg-surface-2/40 transition-colors">
                            <td className="py-3 font-bold text-accent">#{entry.rank}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <img
                                  src={entry.avatarUrl}
                                  alt={entry.creatorName}
                                  className="w-5 h-5 rounded-full object-cover"
                                />
                                <span className="text-text font-sans font-medium">
                                  {entry.handle}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 text-right font-medium text-text tabular-nums">
                              {formatNumber(entry.verifiedViews)}
                            </td>
                            <td className="py-3 text-right text-text-muted tabular-nums">
                              {entry.approvedPosts}
                            </td>
                            <td className="py-3 text-right font-semibold text-accent tabular-nums">
                              {formatCurrency(entry.rewardEarned)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Campaign Updates Timeline */}
            {campaign.updates && campaign.updates.length > 0 && (
              <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
                <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-accent">
                  Campaign Updates & Changelog
                </h2>
                <div className="space-y-4">
                  {campaign.updates.map((up) => (
                    <div key={up.id} className="border-l-2 border-accent pl-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-text">
                          {up.title}
                        </span>
                        <span className="text-[10px] font-mono text-text-subtle">
                          {formatDate(up.date)}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {up.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            {/* Primary Action & Rate Card */}
            <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-6 shadow-xl">
              <div>
                <span className="text-xs font-mono text-text-subtle uppercase">
                  Verified Reward Rate
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono text-accent tabular-nums">
                    {formatCurrency(campaign.rewardRate, campaign.currency)}
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    per 1k views
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-text-subtle leading-tight">
                  Rewards depend on campaign rules and verified performance. Rates are not guaranteed earnings.
                </p>
              </div>

              {/* Budget Progress */}
              {isBudgetPublic && (
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-text-subtle">Pool Claimed</span>
                    <span className="text-text tabular-nums">
                      {formatCurrency(campaign.allocatedBudget)} / {formatCurrency(campaign.totalBudget)} ({budgetPercentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${budgetPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Stats 2x2 grid */}
              <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <span className="text-text-subtle block">Verified Views</span>
                  <span className="text-sm font-semibold text-text tabular-nums">
                    {formatNumber(campaign.verifiedViews)}
                  </span>
                </div>
                <div>
                  <span className="text-text-subtle block">Approved Clips</span>
                  <span className="text-sm font-semibold text-text tabular-nums">
                    {campaign.approvedClips}
                  </span>
                </div>
                <div>
                  <span className="text-text-subtle block">Active Creators</span>
                  <span className="text-sm font-semibold text-text tabular-nums">
                    {campaign.activeCreators}
                  </span>
                </div>
                <div>
                  <span className="text-text-subtle block">Time Remaining</span>
                  <span className="text-sm font-semibold text-text tabular-nums">
                    {formatDaysRemaining(campaign.endDate)}
                  </span>
                </div>
              </div>

              {/* Primary Join Action */}
              <div className="pt-2">
                {statusMap.canJoin ? (
                  <a
                    href={campaign.discordInviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-ink hover:opacity-95 transition-opacity shadow-sm"
                  >
                    <PlatformIcon platform="discord" className="w-4 h-4" />
                    <span>Join {campaign.discordChannelName}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-md bg-surface-3 px-4 py-3 text-sm font-medium text-text-subtle cursor-not-allowed border border-border"
                  >
                    Campaign {statusMap.label}
                  </button>
                )}
              </div>
            </div>

            {/* Step-by-Step Onboarding Card */}
            <div className="rounded-lg border border-border bg-surface-1 p-5 space-y-3">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-text">
                Next Steps after Joining Discord
              </span>
              <ol className="space-y-2.5 text-xs text-text-muted list-decimal list-inside">
                <li className="leading-relaxed">
                  Enter <code className="font-mono text-accent">{campaign.discordChannelName}</code>.
                </li>
                <li className="leading-relaxed">
                  Review the pinned prompt, creative assets, and talking points.
                </li>
                <li className="leading-relaxed">
                  Record and publish your vertical video with required tags.
                </li>
                <li className="leading-relaxed">
                  Submit link via the bot command <code className="font-mono text-accent">/submit</code> for 48h view auditing.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

