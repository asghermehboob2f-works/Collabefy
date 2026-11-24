"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Campaign, LeaderboardEntry } from "@/types";
import { formatCurrency, formatDaysRemaining, formatNumber } from "@/lib/utils";
import { PlatformIcon } from "./PlatformIcons";
import { CampaignApplyModal } from "./CampaignApplyModal";
import {
  ArrowLeft,
  Music2,
  CheckCircle2,
  Clock,
  XCircle,
  FileDown,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
  Layers,
  AlertTriangle,
  Info,
  Check,
} from "lucide-react";

export function CampaignDetailView({
  campaign,
  leaderboard,
}: {
  campaign: Campaign;
  leaderboard: LeaderboardEntry[];
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "rules" | "leaderboard">("overview");

  const isBudgetPublic = campaign.budgetVisibility === "public" && campaign.totalBudget > 0;
  const stats = campaign.stats || {};
  const totalBudget = stats.totalBudget ?? campaign.totalBudget ?? 0;
  const paidAmount = stats.paidAmount ?? campaign.allocatedBudget ?? 0;
  const remainingBudget = stats.remainingBudget ?? Math.max(0, totalBudget - paidAmount);

  const budgetPercentage =
    totalBudget > 0 ? Math.min(100, Math.round((paidAmount / totalBudget) * 100)) : 0;

  const totalSubmissions = stats.totalSubmissions ?? campaign.approvedClips ?? 0;
  const approvedSubmissions = stats.approvedSubmissions ?? campaign.approvedClips ?? 0;
  const pendingSubmissions = stats.pendingSubmissions ?? 0;
  const deniedSubmissions = stats.deniedSubmissions ?? 0;

  const totalViews = stats.totalViews ?? campaign.verifiedViews ?? 0;
  const payableViews = stats.payableViews ?? campaign.payableViews ?? campaign.verifiedViews ?? 0;

  const statusMap = {
    draft: { label: "DRAFT", dotColor: "bg-text-subtle", canJoin: false },
    active: { label: "LIVE", dotColor: "bg-success", canJoin: true },
    upcoming: { label: "UPCOMING", dotColor: "bg-warning", canJoin: false },
    paused: { label: "PAUSED", dotColor: "bg-text-subtle", canJoin: false },
    budget_exhausted: { label: "BUDGET CLAIMED", dotColor: "bg-warning", canJoin: false },
    completed: { label: "COMPLETED", dotColor: "bg-text-subtle", canJoin: false },
    cancelled: { label: "CANCELLED", dotColor: "bg-danger", canJoin: false },
    archived: { label: "ARCHIVED", dotColor: "bg-text-subtle", canJoin: false },
  }[campaign.status] || { label: "LIVE", dotColor: "bg-success", canJoin: true };

  const audioTrack = campaign.audio || campaign.brief?.audio;

  return (
    <div className="py-6 sm:py-8 pb-24">
      <div className="container-fluid">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-xs font-mono text-text-subtle">
          <Link href="/campaigns" className="hover:text-text flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Campaigns</span>
          </Link>
          <span>/</span>
          <span className="text-text truncate max-w-md font-medium">{campaign.title}</span>
        </div>

        {/* 21:9 Cinematic Header Media Banner */}
        <div className="relative aspect-[21/9] min-h-[220px] max-h-[380px] w-full rounded-2xl overflow-hidden border border-border bg-surface-2 mb-8 shadow-xl">
          <img
            src={campaign.coverImage}
            alt={campaign.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />

          {/* Banner bottom info */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl border border-border/80 bg-surface-1 p-1 shadow-2xl shrink-0 backdrop-blur-md">
                <img
                  src={campaign.brandLogo}
                  alt={campaign.brandName}
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-text-muted uppercase tracking-wider">
                    {campaign.brandName} • {campaign.brandCategory}
                  </span>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-1/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-mono font-bold text-accent border border-accent/20 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span>{statusMap.label}</span>
                  </div>
                </div>
                <h1 className="mt-1 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-text">
                  {campaign.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-end">
              <div className="flex items-center gap-2 rounded-lg bg-surface-1/90 backdrop-blur-md px-3.5 py-1.5 border border-border text-text shadow-sm">
                <span className="text-xs font-mono text-text-subtle mr-1">Platforms:</span>
                {campaign.platforms.map((p) => (
                  <PlatformIcon key={p} platform={p} className="w-4 h-4" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tabs Navigation */}
        <div className="flex items-center gap-2 border-b border-border mb-8 overflow-x-auto pb-px">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "border-accent text-accent bg-accent/5 rounded-t-lg"
                : "border-transparent text-text-muted hover:text-text hover:border-border"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("rules")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "rules"
                ? "border-accent text-accent bg-accent/5 rounded-t-lg"
                : "border-transparent text-text-muted hover:text-text hover:border-border"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Rules & Guidelines</span>
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "leaderboard"
                ? "border-accent text-accent bg-accent/5 rounded-t-lg"
                : "border-transparent text-text-muted hover:text-text hover:border-border"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Leaderboard</span>
            {leaderboard.length > 0 && (
              <span className="ml-1 rounded-full bg-surface-2 px-2 py-0.5 text-xs font-mono text-text-muted border border-border">
                {leaderboard.length}
              </span>
            )}
          </button>
        </div>

        {/* Main Content Grid: Main Area (8 cols) + Sticky Right Sidebar (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Audio Asset Pill (If Present) */}
                {audioTrack && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4 sm:p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center shrink-0">
                        <Music2 className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-accent font-bold">
                          Required Campaign Audio Track
                        </div>
                        <div className="text-base font-semibold text-text mt-0.5">
                          {audioTrack}
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-md bg-surface-1 px-3 py-1.5 text-xs font-mono font-medium text-text border border-border">
                      <Check className="w-3.5 h-3.5 text-success" />
                      <span>Sync Mandatory</span>
                    </div>
                  </div>
                )}

                {/* Campaign Description */}
                <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4 shadow-sm">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                    Campaign Description
                  </h2>
                  <div className="text-base text-text leading-relaxed whitespace-pre-line">
                    {campaign.description}
                  </div>
                </div>

                {/* CAMPAIGN STATISTICS SECTION (Overview Section) */}
                <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-6 shadow-sm">
                  <div>
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                      Campaign Statistics & Performance
                    </h2>
                    <p className="text-xs text-text-muted mt-1">
                      Audited submission metrics and escrow distribution status.
                    </p>
                  </div>

                  {/* 4-Grid Submission Statistics */}
                  <div>
                    <span className="text-[11px] font-mono uppercase text-text-subtle font-semibold block mb-2.5">
                      Submissions Status
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="rounded-lg border border-border bg-surface-2 p-3.5">
                        <span className="text-[11px] font-mono text-text-subtle block">Total Submissions</span>
                        <span className="text-xl sm:text-2xl font-bold font-mono text-text mt-1 block">
                          {formatNumber(totalSubmissions)}
                        </span>
                      </div>
                      <div className="rounded-lg border border-success/30 bg-success/5 p-3.5">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                          <span className="text-[11px] font-mono text-success block">Approved</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold font-mono text-success mt-1 block">
                          {formatNumber(approvedSubmissions)}
                        </span>
                      </div>
                      <div className="rounded-lg border border-warning/30 bg-warning/5 p-3.5">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-warning" />
                          <span className="text-[11px] font-mono text-warning block">Pending</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold font-mono text-warning mt-1 block">
                          {formatNumber(pendingSubmissions)}
                        </span>
                      </div>
                      <div className="rounded-lg border border-border bg-surface-2/60 p-3.5">
                        <div className="flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-text-subtle" />
                          <span className="text-[11px] font-mono text-text-subtle block">Denied</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold font-mono text-text-muted mt-1 block">
                          {formatNumber(deniedSubmissions)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3-Grid Financial / Budget Statistics (INR Currency) */}
                  <div className="pt-2 border-t border-border/60">
                    <span className="text-[11px] font-mono uppercase text-text-subtle font-semibold block mb-2.5">
                      Escrow Budget Pool (INR)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-lg border border-border bg-surface-2 p-3.5">
                        <span className="text-[11px] font-mono text-text-subtle block">Total Budget</span>
                        <span className="text-xl font-bold font-mono text-text mt-1 block">
                          {formatCurrency(totalBudget)}
                        </span>
                      </div>
                      <div className="rounded-lg border border-accent/30 bg-accent/5 p-3.5">
                        <span className="text-[11px] font-mono text-accent block">Amount Paid</span>
                        <span className="text-xl font-bold font-mono text-accent mt-1 block">
                          {formatCurrency(paidAmount)}
                        </span>
                      </div>
                      <div className="rounded-lg border border-border bg-surface-2 p-3.5">
                        <span className="text-[11px] font-mono text-text-subtle block">Remaining Budget</span>
                        <span className="text-xl font-bold font-mono text-text mt-1 block">
                          {formatCurrency(remainingBudget)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Approved Content Formats (If Present) */}
                {campaign.brief?.approvedFormats && campaign.brief.approvedFormats.length > 0 && (
                  <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4 shadow-sm">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                      Approved Content Formats
                    </h2>
                    <div className="flex flex-wrap gap-2.5">
                      {campaign.brief.approvedFormats.map((format, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 rounded-lg bg-surface-2 border border-border px-3.5 py-2 text-sm font-semibold text-text"
                        >
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          <span>{format}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Approved Niches (If Present) */}
                {campaign.brief?.approvedNiches && campaign.brief.approvedNiches.length > 0 && (
                  <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4 shadow-sm">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                      Approved Niches
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {campaign.brief.approvedNiches.map((niche, i) => (
                        <div
                          key={i}
                          className="rounded-lg bg-surface-2 border border-border p-3 text-center text-xs font-mono font-medium text-text"
                        >
                          {niche}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Creative Brief & Talking Points (If Present) */}
                {campaign.brief?.talkingPoints && campaign.brief.talkingPoints.length > 0 && (
                  <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-5 shadow-sm">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                      Creative Brief & Talking Points
                    </h2>
                    {campaign.brief.coreNarrative && (
                      <div className="rounded-lg border border-border/80 bg-surface-2 p-4 text-sm text-text-muted leading-relaxed">
                        <span className="font-bold text-text block mb-1">Core Narrative:</span>
                        {campaign.brief.coreNarrative}
                      </div>
                    )}
                    <ul className="space-y-2.5">
                      {campaign.brief.talkingPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-text">
                          <span className="text-accent font-mono text-xs font-bold mt-0.5 shrink-0">
                            0{i + 1}
                          </span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Downloadable Assets */}
                {campaign.brief?.assets && campaign.brief.assets.length > 0 && (
                  <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4 shadow-sm">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                      Campaign Assets & Media Stems
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {campaign.brief.assets.map((asset) => (
                        <div
                          key={asset.id}
                          className="flex items-center justify-between rounded-lg border border-border bg-surface-2 p-3.5 text-xs"
                        >
                          <div className="flex items-center gap-2.5 truncate pr-2">
                            <FileDown className="w-4 h-4 text-accent shrink-0" />
                            <span className="font-semibold text-text truncate">{asset.title}</span>
                          </div>
                          <span className="font-mono text-text-subtle shrink-0">{asset.sizeText}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: RULES */}
            {activeTab === "rules" && (
              <div className="space-y-8">
                {/* Additional Rules / Specific Prohibitions */}
                {campaign.brief?.additionalRules && campaign.brief.additionalRules.length > 0 && (
                  <div className="rounded-xl border border-danger/30 bg-danger/5 p-6 space-y-3">
                    <div className="flex items-center gap-2 text-danger">
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                      <h3 className="text-sm font-mono font-bold uppercase tracking-wider">
                        Important Campaign Rules
                      </h3>
                    </div>
                    <ul className="space-y-2 pt-1 text-sm text-text">
                      {campaign.brief.additionalRules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-danger font-bold">•</span>
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Content Guidelines */}
                {campaign.brief?.contentGuidelines && campaign.brief.contentGuidelines.length > 0 && (
                  <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4 shadow-sm">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                      Content Guidelines
                    </h3>
                    <ul className="space-y-3">
                      {campaign.brief.contentGuidelines.map((guideline, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-text">
                          <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Caption Rules */}
                {campaign.brief?.captionRules && campaign.brief.captionRules.length > 0 && (
                  <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4 shadow-sm">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                      Caption & Tagging Rules
                    </h3>
                    <ul className="space-y-3">
                      {campaign.brief.captionRules.map((cRule, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-text">
                          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{cRule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Approved Naming Conventions */}
                {campaign.brief?.namingConventions && campaign.brief.namingConventions.length > 0 && (
                  <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-3 shadow-sm">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                      Approved Title & Series Naming
                    </h3>
                    <p className="text-xs text-text-muted">
                      When writing about the series, franchise, and/or title, use only these options:
                    </p>
                    <div className="space-y-2 pt-1 font-mono text-xs">
                      {campaign.brief.namingConventions.map((nameOpt, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg bg-surface-2 border border-border px-3.5 py-2 text-text font-medium"
                        >
                          {nameOpt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Standard Rules & Eligibility Table */}
                <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-5 shadow-sm">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                    Rules & Eligibility Criteria
                  </h3>
                  <p className="text-xs text-text-muted">
                    Read all requirements before publishing content. View verification occurs after a 48-hour fraud prevention window.
                  </p>

                  <div className="divide-y divide-border/60">
                    {campaign.rules.map((rule) => (
                      <div key={rule.id} className="py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <span className="text-xs font-mono font-semibold text-text-muted">
                          {rule.title}
                        </span>
                        <span className="sm:col-span-2 text-sm text-text leading-relaxed">
                          {rule.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LEADERBOARD */}
            {activeTab === "leaderboard" && (
              <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
                  <div>
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                      Verified Campaign Leaderboard
                    </h2>
                    <span className="text-xs text-text-subtle">
                      Ranked by verified organic views. Audited by Collabefy.
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>Audited 48h Post-Post</span>
                  </div>
                </div>

                {leaderboard.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <Sparkles className="w-8 h-8 text-text-subtle mx-auto opacity-40" />
                    <p className="text-sm font-mono text-text-muted">
                      No verified submissions recorded yet for this campaign sprint.
                    </p>
                    <p className="text-xs text-text-subtle">
                      Submissions are audited within 48h of publication. Be among the first creators to submit and claim the escrow pool!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead>
                        <tr className="border-b border-border text-text-subtle">
                          <th className="pb-3 font-medium">Rank</th>
                          <th className="pb-3 font-medium">Creator</th>
                          <th className="pb-3 font-medium text-right">Verified Views</th>
                          <th className="pb-3 font-medium text-right">Approved Clips</th>
                          <th className="pb-3 font-medium text-right">Reward Earned (INR)</th>
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
                                  className="w-6 h-6 rounded-full object-cover"
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
          </div>

          {/* Sticky Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            {/* Primary Action Card */}
            <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-6 shadow-xl">
              {/* Campaign Cover Thumbnail with Status Badge */}
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border bg-surface-2">
                <img
                  src={campaign.coverImage}
                  alt={campaign.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-bg/90 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-mono font-bold text-accent border border-accent/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span>{statusMap.label}</span>
                </div>
              </div>

              {/* Verified Reward Rate in INR */}
              <div>
                <span className="text-xs font-mono text-text-subtle uppercase">
                  Verified Reward Rate
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold font-mono text-accent tabular-nums">
                    {formatCurrency(campaign.rewardRate)}
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    per 1k views
                  </span>
                </div>
                <p className="mt-2 text-[11px] text-text-subtle leading-tight">
                  Audited payout issued on verified payable views according to campaign rules.
                </p>
              </div>

              {/* Budget Progress Meter */}
              {isBudgetPublic && (
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-text-subtle">Pool Claimed</span>
                    <span className="text-text font-medium tabular-nums">
                      {formatCurrency(paidAmount)} / {formatCurrency(totalBudget)} ({budgetPercentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${budgetPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-text-subtle pt-0.5">
                    <span>Remaining: {formatCurrency(remainingBudget)}</span>
                  </div>
                </div>
              )}

              {/* Specs Grid */}
              <div className="pt-4 border-t border-border grid grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <span className="text-text-subtle block">Total Views</span>
                  <span className="text-sm font-bold text-text tabular-nums">
                    {formatNumber(totalViews)}
                  </span>
                </div>
                <div>
                  <span className="text-text-subtle block">Payable Views</span>
                  <span className="text-sm font-bold text-text tabular-nums">
                    {formatNumber(payableViews)}
                  </span>
                </div>
                <div>
                  <span className="text-text-subtle block">Total Submissions</span>
                  <span className="text-sm font-bold text-text tabular-nums">
                    {formatNumber(totalSubmissions)}
                  </span>
                </div>
                <div>
                  <span className="text-text-subtle block">Time Remaining</span>
                  <span className="text-sm font-bold text-text tabular-nums">
                    {formatDaysRemaining(campaign.endDate)}
                  </span>
                </div>
              </div>

              {/* Accepted Platforms */}
              <div className="pt-4 border-t border-border space-y-2">
                <span className="text-xs font-mono text-text-subtle uppercase block">
                  Accepted Platforms
                </span>
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms.map((platform) => (
                    <div
                      key={platform}
                      className="flex items-center gap-1.5 rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-text border border-border"
                    >
                      <PlatformIcon platform={platform} className="w-3.5 h-3.5 text-accent" />
                      <span className="capitalize">{platform.replace("_", " ")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Primary Action Button: Opens CampaignApplyModal */}
              <div className="pt-2 space-y-2.5">
                {statusMap.canJoin ? (
                  <>
                    <CampaignApplyModal
                      campaignId={campaign.id}
                      campaignTitle={campaign.title}
                      rewardRate={campaign.rewardRate}
                      platforms={campaign.platforms}
                    />

                    <a
                      href={campaign.discordInviteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-xs font-semibold text-text hover:bg-surface-3 transition-colors"
                    >
                      <PlatformIcon platform="discord" className="w-4 h-4" />
                      <span>Join Discord Channel</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-text-subtle" />
                    </a>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-lg bg-surface-3 px-4 py-3 text-sm font-medium text-text-subtle cursor-not-allowed border border-border"
                  >
                    Campaign {statusMap.label}
                  </button>
                )}
              </div>
            </div>

            {/* Step-by-Step Onboarding Guide */}
            <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-3 shadow-sm">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-text">
                How It Works
              </span>
              <ol className="space-y-2.5 text-xs text-text-muted list-decimal list-inside">
                <li className="leading-relaxed">
                  Review the campaign brief, audio track, and rules.
                </li>
                <li className="leading-relaxed">
                  Record and publish your short-form video on accepted platforms.
                </li>
                <li className="leading-relaxed">
                  Click <strong className="text-text">Join Campaign</strong> above and submit your live video link.
                </li>
                <li className="leading-relaxed">
                  Our bot verifies views 48 hours post-publication for fraud protection and credits your wallet.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
