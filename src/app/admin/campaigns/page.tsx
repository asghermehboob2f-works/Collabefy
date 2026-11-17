"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDaysRemaining } from "@/lib/utils";
import { apiGet, apiPatch, apiPost } from "@/lib/api-client";
import {
  PlusCircle,
  Search,
  Pause,
  Play,
  Copy,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

export default function AdminCampaignsManagement() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await apiGet<{ success: boolean; data: any[] }>("/api/v1/campaigns/admin/all");
      if (res?.data) {
        setCampaigns(res.data);
      }
    } catch (err) {
      console.error("Failed to load campaigns from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filtered = campaigns.filter((c) => {
    const matchSearch =
      (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.brandName || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || c.status?.toUpperCase() === statusFilter.toUpperCase();
    return matchSearch && matchStatus;
  });

  const toggleStatus = async (id: string, newStatus: string) => {
    try {
      await apiPatch(`/api/v1/campaigns/admin/${id}/status`, { status: newStatus });
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
      );
    } catch (err: any) {
      alert(`Failed to update campaign status: ${err.message}`);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await apiPost<{ success: boolean; data: any }>(`/api/v1/campaigns/admin/${id}/duplicate`);
      if (res?.data) {
        setCampaigns((prev) => [res.data, ...prev]);
        alert("Campaign duplicated successfully as DRAFT");
      }
    } catch (err: any) {
      alert(`Failed to duplicate campaign: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
            CMS & Database Management
          </span>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text">
            Campaigns ({campaigns.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Publish, edit, pause, and adjust escrow reward pools and Discord routing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCampaigns}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/campaigns/new"
            className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Campaign</span>
          </Link>
        </div>
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
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="PAUSED">PAUSED</option>
            <option value="DRAFT">DRAFT</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ARCHIVED">ARCHIVED</option>
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs font-mono text-text-subtle">
                    {loading ? "Loading campaigns from backend..." : "No campaigns match your filter."}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-2/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-sans font-semibold text-text max-w-xs truncate">
                        {c.title}
                      </div>
                      <div className="text-[11px] text-text-subtle mt-0.5 truncate">
                        {c.discordChannel || "#campaign"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text-muted">{c.brandName}</td>
                    <td className="py-3 px-4 font-semibold text-accent tabular-nums">
                      {formatCurrency(c.rewardRateCpm || c.rewardRate || 20)}
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      <div>
                        {formatCurrency(c.allocatedBudget || 0)} / {formatCurrency(c.totalBudget)}
                      </div>
                      <div className="text-[10px] text-text-subtle">
                        {Math.round(((c.allocatedBudget || 0) / (c.totalBudget || 1)) * 100)}% allocated
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono capitalize ${
                          c.status === "ACTIVE"
                            ? "bg-success/10 text-success border border-success/20"
                            : c.status === "SCHEDULED"
                            ? "bg-warning/10 text-warning border border-warning/20"
                            : c.status === "PAUSED"
                            ? "bg-danger/10 text-danger border border-danger/20"
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
                        {c.status === "ACTIVE" ? (
                          <button
                            onClick={() => toggleStatus(c.id, "PAUSED")}
                            className="p-1 rounded text-text-subtle hover:text-warning hover:bg-surface-2"
                            title="Pause campaign"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => toggleStatus(c.id, "ACTIVE")}
                            className="p-1 rounded text-text-subtle hover:text-success hover:bg-surface-2"
                            title="Activate campaign"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDuplicate(c.id)}
                          className="p-1 rounded text-text-subtle hover:text-text hover:bg-surface-2"
                          title="Duplicate Campaign"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
