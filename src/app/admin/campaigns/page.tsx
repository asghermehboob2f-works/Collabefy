"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDaysRemaining, formatNumber } from "@/lib/utils";
import { apiGet, apiPatch, apiPost, apiDelete } from "@/lib/api-client";
import { initialCampaigns } from "@/lib/data";
import { CampaignEditModal } from "@/components/admin/CampaignEditModal";
import { PlatformIcon } from "@/components/PlatformIcons";
import {
  PlusCircle,
  Search,
  Pause,
  Play,
  Copy,
  ExternalLink,
  RefreshCw,
  Edit,
  Trash2,
  Lock,
  RotateCcw,
  Sparkles,
  Music2,
  CheckCircle2,
} from "lucide-react";

export default function AdminCampaignsManagement() {
  // Initialize with initialCampaigns so table is NEVER empty while loading
  const [campaigns, setCampaigns] = useState<any[]>(() => {
    return initialCampaigns.map((c) => ({
      ...c,
      status: c.status?.toUpperCase() || "ACTIVE",
      rewardRateCpm: c.rewardRate,
      category: c.brandCategory,
      brandLogoUrl: c.brandLogo,
    }));
  });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<any | null>(null);
  const [closingCampaign, setClosingCampaign] = useState<any | null>(null);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      // Try backend Express API first
      let res: any = null;
      try {
        res = await apiGet<{ success: boolean; data: any[] }>("/api/v1/campaigns/admin/all");
      } catch {}

      // If backend was unreachable or empty, try internal admin route
      if (!res?.data || res.data.length === 0) {
        try {
          res = await apiGet<{ success: boolean; data: any[] }>("/api/admin/campaigns");
        } catch {}
      }

      if (res?.data && res.data.length > 0) {
        setCampaigns(res.data);
      }
    } catch (err) {
      console.warn("Using local campaigns store:", err);
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
      (c.brandName || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.slug || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || c.status?.toUpperCase() === statusFilter.toUpperCase();
    return matchSearch && matchStatus;
  });

  // Toggle status: ACTIVE / PAUSED / COMPLETED
  const toggleStatus = async (id: string, newStatus: string) => {
    try {
      // 1. Try backend
      try {
        await apiPatch(`/api/v1/campaigns/admin/${id}/status`, { status: newStatus });
      } catch {}

      // 2. Try Next.js admin route
      try {
        await apiPatch(`/api/admin/campaigns/${id}`, { status: newStatus });
      } catch {}

      setCampaigns((prev) =>
        prev.map((c) => (c.id === id || c.slug === id ? { ...c, status: newStatus } : c))
      );
    } catch (err: any) {
      alert(`Failed to update campaign status: ${err.message}`);
    }
  };

  // Duplicate campaign
  const handleDuplicate = async (id: string) => {
    try {
      let duplicated: any = null;
      try {
        const res = await apiPost<{ success: boolean; data: any }>(`/api/v1/campaigns/admin/${id}/duplicate`);
        if (res?.data) duplicated = res.data;
      } catch {}

      if (!duplicated) {
        const target = campaigns.find((c) => c.id === id || c.slug === id);
        if (target) {
          duplicated = {
            ...target,
            id: `camp-${Date.now()}`,
            title: `${target.title} (Copy)`,
            slug: `${target.slug}-copy-${Math.floor(Math.random() * 1000)}`,
            status: "DRAFT",
            allocatedBudget: 0,
            createdAt: new Date().toISOString(),
          };
        }
      }

      if (duplicated) {
        setCampaigns((prev) => [duplicated, ...prev]);
        alert(`Campaign "${duplicated.title}" duplicated successfully as DRAFT.`);
      }
    } catch (err: any) {
      alert(`Failed to duplicate campaign: ${err.message}`);
    }
  };

  // Save campaign updates (from modal)
  const handleSaveCampaign = async (updatedData: any) => {
    if (!editingCampaign) return;
    const id = editingCampaign.id;

    // 1. Send update to backend Express API
    try {
      await apiPatch(`/api/v1/campaigns/admin/${id}`, updatedData);
    } catch {}

    // 2. Also send to Next.js API route to update local memory & SSG store
    try {
      await apiPatch(`/api/admin/campaigns/${id}`, updatedData);
    } catch {}

    // 3. Immediately update client state
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id || c.slug === editingCampaign.slug
          ? { ...c, ...updatedData }
          : c
      )
    );
  };

  // Close campaign (mark as COMPLETED)
  const handleCloseCampaign = async (id: string) => {
    await toggleStatus(id, "COMPLETED");
    setClosingCampaign(null);
  };

  // Delete campaign permanently
  const handleDeleteCampaign = async (id: string) => {
    try {
      // 1. Delete on backend Express API
      try {
        await apiDelete(`/api/v1/campaigns/admin/${id}`);
      } catch {}

      // 2. Delete on Next.js API route
      try {
        await apiDelete(`/api/admin/campaigns/${id}`);
      } catch {}

      // 3. Remove from client state
      setCampaigns((prev) => prev.filter((c) => c.id !== id && c.slug !== id));
      setDeletingCampaign(null);
    } catch (err: any) {
      alert(`Failed to delete campaign: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              CMS & Database Management
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-text">
            Campaigns ({campaigns.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Edit ongoing campaigns, update thumbnails and logos, close campaigns, or adjust escrow pools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCampaigns}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/admin/campaigns/new"
            className="flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Campaign</span>
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="w-3.5 h-3.5 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, brand, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-1 py-2 pl-9 pr-3 text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-subtle">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface-1 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
          >
            <option value="ALL">All Statuses ({campaigns.length})</option>
            <option value="ACTIVE">ACTIVE (Live / Ongoing)</option>
            <option value="PAUSED">PAUSED</option>
            <option value="COMPLETED">COMPLETED (Closed)</option>
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="DRAFT">DRAFT</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-surface-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border bg-surface-2/60 text-text-subtle">
                <th className="py-3.5 px-4 font-semibold">Thumbnail</th>
                <th className="py-3.5 px-4 font-semibold">Campaign & Audio</th>
                <th className="py-3.5 px-4 font-semibold">Brand</th>
                <th className="py-3.5 px-4 font-semibold">Rate / 1k (INR)</th>
                <th className="py-3.5 px-4 font-semibold">Budget Claimed</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Timeline</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs font-mono text-text-subtle">
                    {loading ? "Refreshing live campaigns..." : "No campaigns match your filter."}
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const rateVal = c.rewardRateCpm ?? c.rewardRate ?? 20;
                  const totalB = c.totalBudget ?? c.stats?.totalBudget ?? 0;
                  const allocB = c.allocatedBudget ?? c.stats?.paidAmount ?? 0;
                  const budgetPercent = totalB > 0 ? Math.min(100, Math.round((allocB / totalB) * 100)) : 0;
                  const audioTrack = c.audio || c.brief?.audio;

                  return (
                    <tr key={c.id || c.slug} className="hover:bg-surface-2/30 transition-colors">
                      {/* Thumbnail Preview Column */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => setEditingCampaign(c)}
                          className="relative w-16 h-10 sm:w-20 sm:h-12 rounded-lg border border-border overflow-hidden bg-surface-2 cursor-pointer group shadow-sm shrink-0"
                          title="Click to edit campaign & thumbnail"
                        >
                          <img
                            src={c.coverImage || "/placeholder.png"}
                            alt={c.title}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          {/* Overlapping Brand Logo Avatar */}
                          <div className="absolute bottom-1 left-1 w-4 h-4 rounded border border-black/50 overflow-hidden bg-black/60 shadow">
                            <img
                              src={c.brandLogoUrl || c.brandLogo || "/placeholder.png"}
                              alt={c.brandName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Campaign Title & Audio */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => setEditingCampaign(c)}
                          className="font-sans font-bold text-text hover:text-accent cursor-pointer transition-colors max-w-xs truncate"
                          title="Click to edit"
                        >
                          {c.title}
                        </div>
                        {audioTrack ? (
                          <div className="flex items-center gap-1 text-[11px] text-accent mt-0.5 truncate max-w-xs">
                            <Music2 className="w-3 h-3 shrink-0" />
                            <span className="truncate">{audioTrack}</span>
                          </div>
                        ) : (
                          <div className="text-[11px] text-text-subtle mt-0.5 truncate max-w-xs">
                            {c.category || c.brandCategory || "General"}
                          </div>
                        )}
                      </td>

                      {/* Brand Name */}
                      <td className="py-3 px-4 text-text-muted">{c.brandName}</td>

                      {/* Verified Rate per 1k views */}
                      <td className="py-3 px-4 font-bold text-accent tabular-nums">
                        {formatCurrency(rateVal)}
                      </td>

                      {/* Budget Claimed */}
                      <td className="py-3 px-4 tabular-nums">
                        <div className="font-semibold text-text">
                          {formatCurrency(allocB)} / {formatCurrency(totalB)}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-16 h-1.5 rounded-full bg-surface-3 overflow-hidden">
                            <div className="h-full bg-accent rounded-full" style={{ width: `${budgetPercent}%` }} />
                          </div>
                          <span className="text-[10px] text-text-subtle">{budgetPercent}%</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                            c.status === "ACTIVE"
                              ? "bg-success/10 text-success border-success/30"
                              : c.status === "COMPLETED"
                              ? "bg-accent/10 text-accent border-accent/30"
                              : c.status === "PAUSED"
                              ? "bg-warning/10 text-warning border-warning/30"
                              : "bg-surface-3 text-text-subtle border-border"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              c.status === "ACTIVE"
                                ? "bg-success"
                                : c.status === "COMPLETED"
                                ? "bg-accent"
                                : c.status === "PAUSED"
                                ? "bg-warning"
                                : "bg-text-subtle"
                            }`}
                          />
                          <span>{c.status}</span>
                        </span>
                      </td>

                      {/* Timeline */}
                      <td className="py-3 px-4 text-text-subtle tabular-nums">
                        {formatDaysRemaining(c.endDate)}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. Edit Campaign */}
                          <button
                            onClick={() => setEditingCampaign(c)}
                            className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
                            title="Edit Campaign & Media"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. Pause / Resume */}
                          {c.status === "ACTIVE" ? (
                            <button
                              onClick={() => toggleStatus(c.id, "PAUSED")}
                              className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-warning hover:border-warning/40 transition-colors"
                              title="Pause campaign"
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleStatus(c.id, "ACTIVE")}
                              className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-success hover:border-success/40 transition-colors"
                              title="Resume / Activate campaign"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* 3. Close Campaign */}
                          {c.status !== "COMPLETED" ? (
                            <button
                              onClick={() => setClosingCampaign(c)}
                              className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
                              title="Close Campaign (Mark as Completed)"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleStatus(c.id, "ACTIVE")}
                              className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-success hover:border-success/40 transition-colors"
                              title="Reopen Campaign"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* 4. Delete Campaign */}
                          <button
                            onClick={() => setDeletingCampaign(c)}
                            className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-danger hover:border-danger/40 transition-colors"
                            title="Permanently Delete Campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          {/* 5. Duplicate */}
                          <button
                            onClick={() => handleDuplicate(c.id)}
                            className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-text hover:border-border transition-colors"
                            title="Duplicate Campaign"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* 6. View Public Page */}
                          <Link
                            href={`/campaigns/${c.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-text hover:border-border transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comprehensive Edit Campaign Modal */}
      {editingCampaign && (
        <CampaignEditModal
          isOpen={Boolean(editingCampaign)}
          onClose={() => setEditingCampaign(null)}
          campaign={editingCampaign}
          onSave={handleSaveCampaign}
          onDelete={handleDeleteCampaign}
          onCloseCampaign={handleCloseCampaign}
        />
      )}

      {/* Quick Row Close Campaign Confirmation Dialog */}
      {closingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-warning/40 bg-surface-1 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-warning">
              <div className="p-2 rounded-xl bg-warning/10 border border-warning/30">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text">Close Campaign?</h3>
                <span className="text-xs font-mono text-warning font-semibold">Mark as COMPLETED</span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Are you sure you want to close <strong className="text-text font-bold">"{closingCampaign.title}"</strong>? Creators will no longer be able to submit new video entries, but existing analytics and escrow payouts remain intact.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setClosingCampaign(null)}
                className="px-4 py-2 rounded-lg border border-border bg-surface-2 text-xs font-mono text-text hover:bg-surface-3"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCloseCampaign(closingCampaign.id)}
                className="px-4 py-2 rounded-lg bg-warning text-xs font-bold text-black hover:bg-warning/90 transition-colors"
              >
                Close & Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Row Delete Campaign Confirmation Dialog */}
      {deletingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-danger/40 bg-surface-1 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-danger">
              <div className="p-2 rounded-xl bg-danger/10 border border-danger/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text">Permanently Delete Campaign?</h3>
                <span className="text-xs font-mono text-danger font-semibold">Irreversible Action</span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-text font-bold">"{deletingCampaign.title}"</strong>? This will permanently delete the campaign and its applications from the database.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setDeletingCampaign(null)}
                className="px-4 py-2 rounded-lg border border-border bg-surface-2 text-xs font-mono text-text hover:bg-surface-3"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCampaign(deletingCampaign.id)}
                className="px-4 py-2 rounded-lg bg-danger text-xs font-bold text-white hover:bg-danger/90 transition-colors"
              >
                Yes, Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
