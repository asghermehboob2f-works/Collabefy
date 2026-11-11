"use client";

import React, { useState } from "react";
import Link from "next/link";
import { initialCampaigns } from "@/lib/data";
import { Campaign, CampaignStatus } from "@/types";
import { formatCurrency, formatDaysRemaining, formatDate } from "@/lib/utils";
import {
  PlusCircle,
  Search,
  Pause,
  Play,
  CheckCircle,
  Archive,
  ExternalLink,
  Edit,
} from "lucide-react";

export default function AdminCampaignsManagement() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([...initialCampaigns]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.brandName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleStatus = (id: string, newStatus: CampaignStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            CMS Management
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text">
            Campaigns ({campaigns.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Publish, edit, pause, and adjust reward pools and Discord routing.
          </p>
        </div>

        <Link
          href="/admin/campaigns/new"
          className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create New Campaign</span>
        </Link>
      </div>

      {/* Filters & Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="w-3.5 h-3.5 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter by title or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-1 py-1.5 pl-9 pr-3 text-xs text-text placeholder:text-text-subtle focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-subtle">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-border bg-surface-1 px-3 py-1.5 text-xs font-mono text-text focus:outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="upcoming">Upcoming</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-border bg-surface-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-text-subtle">
                <th className="py-3 px-4 font-medium">Campaign</th>
                <th className="py-3 px-4 font-medium">Brand</th>
                <th className="py-3 px-4 font-medium">Rate / 1k</th>
                <th className="py-3 px-4 font-medium">Budget Claimed</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Timeline</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-surface-2/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-sans font-semibold text-text max-w-xs truncate">
                      {c.title}
                    </div>
                    <div className="text-[11px] text-text-subtle mt-0.5 truncate">
                      {c.discordChannelName}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-text-muted">{c.brandName}</td>
                  <td className="py-3 px-4 font-semibold text-accent tabular-nums">
                    {formatCurrency(c.rewardRate)}
                  </td>
                  <td className="py-3 px-4 tabular-nums">
                    <div>
                      {formatCurrency(c.allocatedBudget)} / {formatCurrency(c.totalBudget)}
                    </div>
                    <div className="text-[10px] text-text-subtle">
                      {Math.round((c.allocatedBudget / (c.totalBudget || 1)) * 100)}% allocated
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                        c.status === "active"
                          ? "bg-success/10 text-success border border-success/20"
                          : c.status === "upcoming"
                          ? "bg-warning/10 text-warning border border-warning/20"
                          : "bg-surface-3 text-text-subtle border border-border"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-subtle tabular-nums">
                    {formatDaysRemaining(c.endDate)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {c.status === "active" ? (
                        <button
                          onClick={() => toggleStatus(c.id, "paused")}
                          className="p-1 rounded text-text-subtle hover:text-warning hover:bg-surface-2"
                          title="Pause campaign"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleStatus(c.id, "active")}
                          className="p-1 rounded text-text-subtle hover:text-success hover:bg-surface-2"
                          title="Resume/Activate campaign"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <Link
                        href={`/campaigns/${c.slug}`}
                        target="_blank"
                        className="p-1 rounded text-text-subtle hover:text-text hover:bg-surface-2"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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

