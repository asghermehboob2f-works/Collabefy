import React from "react";
import Link from "next/link";
import { Campaign } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { PlatformIcon } from "./PlatformIcons";
import { ArrowUpRight } from "lucide-react";

export function HeroPreviewStack({ campaigns }: { campaigns: Campaign[] }) {
  if (!campaigns || campaigns.length === 0) return null;

  const topCampaign = campaigns[0];
  const secondCampaign = campaigns[1] || campaigns[0];

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Background card offset */}
      {secondCampaign && (
        <div className="absolute top-6 -right-3 sm:-right-4 w-full rounded-lg border border-border/60 bg-surface-2/60 p-4 opacity-40 blur-[0.5px] scale-95 pointer-events-none hidden sm:block">
          <div className="flex items-center justify-between text-xs font-mono text-text-subtle">
            <span>{secondCampaign.brandName}</span>
            <span>{formatCurrency(secondCampaign.rewardRate)} / 1k views</span>
          </div>
          <div className="mt-2 text-sm font-semibold text-text truncate">
            {secondCampaign.title}
          </div>
        </div>
      )}

      {/* Main interactive showcase card */}
      <Link
        href={`/campaigns/${topCampaign.slug}`}
        className="group relative block rounded-lg border border-border bg-surface-1 p-5 shadow-2xl transition-all duration-300 hover:border-accent hover:-translate-y-1"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-mono text-text-muted">Featured Live Campaign</span>
          </div>
          <div className="flex items-center gap-1.5 text-text-subtle">
            {topCampaign.platforms.map((p) => (
              <PlatformIcon key={p} platform={p} className="w-3.5 h-3.5" />
            ))}
          </div>
        </div>

        {/* Cover image thumbnail */}
        <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-md bg-surface-2 border border-border">
          <img
            src={topCampaign.coverImage}
            alt={topCampaign.title}
            className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-1/90 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <span className="text-xs font-mono text-text bg-bg/80 backdrop-blur-md px-2 py-0.5 rounded border border-border">
              {topCampaign.brandName}
            </span>
            <div className="flex items-center gap-1 text-xs font-semibold text-accent bg-bg/80 backdrop-blur-md px-2.5 py-1 rounded border border-border">
              <span>View Brief</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-4">
          <h3 className="text-base font-semibold text-text group-hover:text-accent transition-colors">
            {topCampaign.title}
          </h3>
          <p className="mt-1 text-xs text-text-muted line-clamp-2">
            {topCampaign.summary}
          </p>
        </div>

        {/* Rate & allocation row */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between font-mono">
          <div>
            <div className="text-[11px] text-text-subtle">Verified Rate</div>
            <div className="text-lg font-bold text-accent tabular-nums">
              {formatCurrency(topCampaign.rewardRate)} <span className="text-xs font-normal text-text-muted">/ 1k views</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-text-subtle">Pool Claimed</div>
            <div className="text-xs text-text font-medium tabular-nums">
              {formatCurrency(topCampaign.allocatedBudget)} / {formatCurrency(topCampaign.totalBudget)}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

