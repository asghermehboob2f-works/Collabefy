import React from "react";
import Link from "next/link";
import { Campaign } from "@/types";
import { formatCurrency, formatDaysRemaining } from "@/lib/utils";
import { PlatformIcon } from "./PlatformIcons";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const isBudgetPublic = campaign.budgetVisibility === "public" && campaign.totalBudget > 0;
  const budgetPercentage = isBudgetPublic
    ? Math.min(100, Math.round((campaign.allocatedBudget / campaign.totalBudget) * 100))
    : 0;

  const statusConfig = {
    active: { label: "Active", dotColor: "bg-success" },
    upcoming: { label: "Upcoming", dotColor: "bg-warning" },
    paused: { label: "Paused", dotColor: "bg-text-subtle" },
    budget_exhausted: { label: "Budget Claimed", dotColor: "bg-warning" },
    completed: { label: "Completed", dotColor: "bg-text-subtle" },
    cancelled: { label: "Cancelled", dotColor: "bg-danger" },
    archived: { label: "Archived", dotColor: "bg-text-subtle" },
  }[campaign.status] || { label: campaign.status, dotColor: "bg-text-subtle" };

  const rateUnitText = {
    per_1000_views: "per 1,000 verified views",
    per_view: "per verified view",
    fixed_bounty: "fixed bounty per clip",
    per_approved_post: "per approved post",
  }[campaign.rewardUnit];

  return (
    <Link
      href={`/campaigns/${campaign.slug}`}
      className="group flex flex-col rounded-lg border border-border bg-surface-1 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* 16:9 Cover Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface-2">
        <img
          src={campaign.coverImage}
          alt={campaign.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-102"
        />
        {/* Subtle bottom gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent opacity-90" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 rounded-sm bg-bg/80 backdrop-blur-md px-2.5 py-1 text-xs font-mono font-medium text-text border border-border">
            <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`} />
            <span>{statusConfig.label}</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-sm bg-bg/80 backdrop-blur-md px-2 py-1 text-text-muted border border-border">
            {campaign.platforms.map((p) => (
              <PlatformIcon key={p} platform={p} className="w-3.5 h-3.5" />
            ))}
          </div>
        </div>

        {/* Overlapping Brand Logo */}
        <div className="absolute -bottom-3 left-4 h-9 w-9 overflow-hidden rounded-md border border-border bg-surface-2 p-0.5 shadow-md">
          <img
            src={campaign.brandLogo}
            alt={campaign.brandName}
            className="h-full w-full rounded-[4px] object-cover"
          />
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-4 pt-5">
        <div className="text-xs font-medium text-text-subtle uppercase tracking-wider mb-1">
          {campaign.brandName} • {campaign.brandCategory}
        </div>

        <h3 className="text-base font-semibold text-text line-clamp-2 leading-snug group-hover:text-accent transition-colors">
          {campaign.title}
        </h3>

        <p className="mt-1.5 text-xs text-text-muted line-clamp-2 leading-relaxed">
          {campaign.summary}
        </p>

        {/* Reward hero rate block */}
        <div className="mt-4 pt-3 border-t border-border/60">
          <div className="text-xs text-text-subtle font-mono">Verified Reward Rate</div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-accent tabular-nums">
              {formatCurrency(campaign.rewardRate, campaign.currency)}
            </span>
            <span className="text-xs text-text-muted font-mono">{rateUnitText}</span>
          </div>
        </div>

        {/* Budget Allocation Bar (if public) */}
        {isBudgetPublic && (
          <div className="mt-3">
            <div className="flex justify-between text-[11px] font-mono text-text-subtle mb-1">
              <span>Pool Allocated</span>
              <span>
                {formatCurrency(campaign.allocatedBudget, campaign.currency)} /{" "}
                {formatCurrency(campaign.totalBudget, campaign.currency)} ({budgetPercentage}%)
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer Meta Row */}
        <div className="mt-auto pt-4 flex items-center justify-between text-xs font-mono text-text-subtle">
          <span>{formatDaysRemaining(campaign.endDate)}</span>
          {campaign.applicationRequired && (
            <span className="rounded-[4px] border border-border bg-surface-2 px-1.5 py-0.5 text-[10px] text-text-muted">
              Application Required
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

