import React from "react";
import { PlatformStats } from "@/types";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

export function StatsBar({ stats }: { stats: PlatformStats }) {
  return (
    <div className="w-full border-y border-border bg-surface-1/40 backdrop-blur-sm">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {/* Ongoing Campaigns */}
          <div className="flex flex-col md:px-6 first:pl-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-2xl sm:text-3xl font-bold font-mono text-text tabular-nums">
                {stats.ongoingCampaigns}
              </span>
            </div>
            <span className="text-xs text-text-muted mt-1">Ongoing Campaigns</span>
            <span className="text-[10px] font-mono text-text-subtle mt-0.5">Active & verified</span>
          </div>

          {/* Verified Views */}
          <div className="flex flex-col pt-4 md:pt-0 md:px-6">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-text tabular-nums">
              {formatCompactNumber(stats.totalVerifiedViews)}
            </span>
            <span className="text-xs text-text-muted mt-1">Verified Views</span>
            <span className="text-[10px] font-mono text-text-subtle mt-0.5">Tracked across platforms</span>
          </div>

          {/* Creator Rewards Paid */}
          <div className="flex flex-col pt-4 md:pt-0 md:px-6">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-accent tabular-nums">
              {formatCurrency(stats.totalRewardsPaid)}
            </span>
            <span className="text-xs text-text-muted mt-1">Rewards Paid</span>
            <span className="text-[10px] font-mono text-text-subtle mt-0.5">Distributed to creators</span>
          </div>

          {/* Active Creators */}
          <div className="flex flex-col pt-4 md:pt-0 md:px-6 last:pr-0">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-text tabular-nums">
              {stats.activeCreators.toLocaleString()}
            </span>
            <span className="text-xs text-text-muted mt-1">Active Creators</span>
            <span className="text-[10px] font-mono text-text-subtle mt-0.5">Producing verified clips</span>
          </div>
        </div>
      </div>
    </div>
  );
}

