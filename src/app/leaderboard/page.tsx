import React from "react";
import { getAllLeaderboards } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ShieldCheck, Trophy, Sparkles } from "lucide-react";

export default function LeaderboardsPage() {
  const allEntries = getAllLeaderboards();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            Performance Ledger
          </div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-text">
            Creator Leaderboards
          </h1>
          <p className="mt-2 text-sm text-text-muted leading-relaxed">
            Verified performance across all active Collabefy campaigns. Views are recorded only after 48-hour fraud prevention and retention auditing.
          </p>
        </div>

        {/* Leaderboard Table Container */}
        <div className="rounded-lg border border-border bg-surface-1 overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm font-mono font-semibold text-text">
                Top Performing Creators — All Campaigns
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-text-muted">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
              <span>Verified figures only</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-text-subtle bg-surface-2/40">
                  <th className="py-3 px-6 font-medium">Rank</th>
                  <th className="py-3 px-6 font-medium">Creator</th>
                  <th className="py-3 px-6 font-medium text-right">Verified Views</th>
                  <th className="py-3 px-6 font-medium text-right">Approved Clips</th>
                  <th className="py-3 px-6 font-medium text-right">Total Distributed</th>
                  <th className="py-3 px-6 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {allEntries.map((entry, idx) => (
                  <tr key={entry.id} className="hover:bg-surface-2/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-accent">
                      {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatarUrl}
                          alt={entry.creatorName}
                          className="w-7 h-7 rounded-full object-cover border border-border"
                        />
                        <div>
                          <div className="text-text font-sans font-medium text-sm">
                            {entry.creatorName}
                          </div>
                          <div className="text-[11px] text-text-subtle font-mono">
                            {entry.handle}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-medium text-text text-sm tabular-nums">
                      {formatNumber(entry.verifiedViews)}
                    </td>
                    <td className="py-4 px-6 text-right text-text-muted tabular-nums">
                      {entry.approvedPosts}
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-accent text-sm tabular-nums">
                      {formatCurrency(entry.rewardEarned)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1 rounded bg-success/10 text-success border border-success/20 px-2 py-0.5 text-[10px] font-mono">
                        Audited
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

