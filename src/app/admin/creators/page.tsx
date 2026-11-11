"use client";

import React, { useState } from "react";
import { sampleCreators } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { PlatformIcon } from "@/components/PlatformIcons";
import { ShieldCheck, Search, Check, AlertCircle } from "lucide-react";

export default function AdminCreatorsPage() {
  const [creators, setCreators] = useState([...sampleCreators]);
  const [search, setSearch] = useState("");

  const filtered = creators.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            User Management
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text">
            Creator Directory ({creators.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Review creator profiles, social verification status, and historical performance metrics.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="w-3.5 h-3.5 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by creator name or handle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-md border border-border bg-surface-1 py-1.5 pl-9 pr-3 text-xs text-text placeholder:text-text-subtle focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-surface-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-text-subtle">
                <th className="py-3 px-4 font-medium">Creator</th>
                <th className="py-3 px-4 font-medium">Role</th>
                <th className="py-3 px-4 font-medium">Channels</th>
                <th className="py-3 px-4 font-medium text-right">Audited Views</th>
                <th className="py-3 px-4 font-medium text-right">Total Distributed</th>
                <th className="py-3 px-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-surface-2/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.avatarUrl}
                        alt={c.name}
                        className="w-8 h-8 rounded-full object-cover border border-border"
                      />
                      <div>
                        <div className="font-sans font-semibold text-text">{c.name}</div>
                        <div className="text-[11px] text-text-subtle">@{c.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 capitalize text-text-muted">{c.role}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {c.socialAccounts.map((sa) => (
                        <div
                          key={sa.id}
                          className="flex items-center gap-1 text-[11px] text-text-muted border border-border bg-surface-2 px-1.5 py-0.5 rounded"
                          title={`${sa.platform} - ${sa.status}`}
                        >
                          <PlatformIcon platform={sa.platform} className="w-3 h-3" />
                          <span>{sa.handle}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-text tabular-nums">
                    {formatNumber(c.totalVerifiedViews)}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-accent tabular-nums">
                    {formatCurrency(c.totalEarnings)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-success text-[10px] font-mono bg-success/10 border border-success/20 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

