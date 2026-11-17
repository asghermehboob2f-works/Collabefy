"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Campaign, CreatorActivityItem } from "@/types";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import { PlatformIcon } from "./PlatformIcons";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

interface HeroProductConsoleProps {
  campaigns: Campaign[];
  activities?: CreatorActivityItem[];
}

const VIEW_TIERS = [25000, 50000, 100000, 250000];

export function HeroProductConsole({ campaigns, activities = [] }: HeroProductConsoleProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [selectedViews, setSelectedViews] = useState(50000);

  if (!campaigns || campaigns.length === 0) return null;

  const currentCampaign = campaigns[selectedIdx] || campaigns[0];

  // Budget allocation percentage
  const budgetPercentage =
    currentCampaign.totalBudget > 0
      ? Math.min(100, Math.round((currentCampaign.allocatedBudget / currentCampaign.totalBudget) * 100))
      : 0;

  // Calculate estimated earnings based on selected views and current campaign rate
  const estimatedEarnings = (selectedViews / 1000) * currentCampaign.rewardRate;

  // Filter activities for current campaign or fallback to top activities
  const campaignActivities = activities.filter(
    (act) => act.campaignSlug === currentCampaign.slug
  );
  const recentActivities = campaignActivities.length > 0 ? campaignActivities.slice(0, 2) : activities.slice(0, 2);

  return (
    <div className="w-full rounded-xl border border-border bg-surface-1 shadow-2xl p-5 sm:p-6 lg:p-7 space-y-6">
      {/* Console Top Header & Campaign Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="text-[11px] font-mono font-medium tracking-wider text-text-subtle uppercase">
              Live Verified Sponsorship
            </span>
          </div>
          <div className="text-sm font-semibold text-text mt-0.5">
            {currentCampaign.brandName} • <span className="text-text-muted font-normal">{currentCampaign.brandCategory}</span>
          </div>
        </div>

        {/* Campaign segmented switcher */}
        <div className="inline-flex items-center rounded-lg bg-surface-2 p-1 border border-border text-xs font-mono w-full sm:w-auto overflow-x-auto scrollbar-none">
          {campaigns.slice(0, 3).map((camp, idx) => {
            const isSelected = idx === selectedIdx;
            return (
              <button
                key={camp.id}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`rounded-md px-3 py-1.5 transition-colors whitespace-nowrap ${
                  isSelected
                    ? "bg-surface-3 text-text font-semibold shadow-xs"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <span>{camp.brandName}</span>
                <span className="ml-1.5 text-[10px] text-accent tabular-nums">
                  {formatCurrency(camp.rewardRate)}/1k
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Campaign Overview Block */}
      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-semibold text-text">
          {currentCampaign.title}
        </h3>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-2">
          {currentCampaign.summary}
        </p>
      </div>

      {/* Key Financial Parameters */}
      <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-surface-2/40 border border-border">
        <div>
          <div className="text-[11px] font-mono text-text-subtle uppercase tracking-wider">
            Verified CPM Rate
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-accent tabular-nums">
              {formatCurrency(currentCampaign.rewardRate)}
            </span>
            <span className="text-xs font-mono text-text-muted">/ 1,000 views</span>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-mono text-text-subtle uppercase tracking-wider">
            Escrow Budget Pool
          </div>
          <div className="mt-1 text-sm sm:text-base font-semibold font-mono text-text tabular-nums">
            {formatCurrency(currentCampaign.allocatedBudget)}{" "}
            <span className="text-xs font-normal text-text-subtle">
              / {formatCurrency(currentCampaign.totalBudget)}
            </span>
          </div>
          {/* Subtle 2px budget meter */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Creator Earnings Calculator */}
      <div className="p-4 rounded-lg bg-surface-2/30 border border-border space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-text-subtle uppercase tracking-wider text-[11px]">
            Earnings Simulator at {formatCurrency(currentCampaign.rewardRate)} CPM
          </span>
          <span className="text-[11px] text-text-muted">
            Audited 48h Post-Publish
          </span>
        </div>

        {/* View Tier Presets */}
        <div className="grid grid-cols-4 gap-2">
          {VIEW_TIERS.map((tier) => {
            const isSelected = selectedViews === tier;
            return (
              <button
                key={tier}
                type="button"
                onClick={() => setSelectedViews(tier)}
                className={`rounded-md py-1.5 px-2 text-xs font-mono font-medium transition-all text-center border ${
                  isSelected
                    ? "bg-accent text-accent-ink border-accent font-semibold"
                    : "bg-surface-2 text-text-muted border-border hover:text-text hover:bg-surface-3"
                }`}
              >
                {formatCompactNumber(tier)}
              </button>
            );
          })}
        </div>

        {/* Dynamic Calculated Output */}
        <div className="pt-2 flex items-center justify-between border-t border-border/60">
          <div>
            <div className="text-[11px] font-mono text-text-subtle">
              Estimated Disbursal ({formatCompactNumber(selectedViews)} views)
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-text tabular-nums mt-0.5">
              {formatCurrency(estimatedEarnings)}
            </div>
          </div>
          <div className="text-right text-[11px] font-mono text-text-subtle">
            <div className="flex items-center gap-1 text-success justify-end">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Escrow Guaranteed</span>
            </div>
            <div className="mt-0.5 text-text-muted">Disbursed via Stripe / USDC</div>
          </div>
        </div>
      </div>

      {/* Recent Audited Settlements (Real Ledger Proof) */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-mono font-medium text-text-subtle uppercase tracking-wider">
          Recent Audited Settlements for this Sprint
        </div>
        <div className="space-y-2">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-2.5 rounded-md bg-surface-2/20 border border-border/60 text-xs font-mono"
            >
              <div className="flex items-center gap-2.5">
                <PlatformIcon platform={act.platform} className="w-3.5 h-3.5 text-text-subtle shrink-0" />
                <span className="font-semibold text-text">{act.creatorHandle}</span>
                <span className="text-[11px] text-text-subtle hidden sm:inline">
                  • {formatCompactNumber(act.verifiedViews)} verified views
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-accent tabular-nums">
                  +{formatCurrency(act.rewardEarned)}
                </span>
                <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-muted border border-border">
                  Paid
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Console Bottom Action Bar */}
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-text-subtle">
          <span>Eligible Formats:</span>
          <span className="text-text font-medium">9:16 Vertical Video (30–90s)</span>
        </div>

        <Link
          href={`/campaigns/${currentCampaign.slug}`}
          className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline decoration-accent/40 transition-colors"
        >
          <span>View Full Campaign Brief &amp; Assets</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
