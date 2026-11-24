"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatCurrency, formatDaysRemaining, formatNumber, formatDate } from "@/lib/utils";
import { apiGet, apiPatch, apiPost, apiDelete } from "@/lib/api-client";
import { CampaignEditModal } from "@/components/admin/CampaignEditModal";
import { CampaignPreviewModal } from "@/components/admin/CampaignPreviewModal";
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
  Eye,
  AlertCircle,
  SlidersHorizontal,
  Calendar,
  Layers,
  Archive,
  ArrowUpDown,
} from "lucide-react";

export default function AdminCampaignsManagement() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest_rate" | "total_budget" | "title">("newest");

  // Modals & Action States
  const [editingCampaign, setEditingCampaign] = useState<any | null>(null);
  const [previewingCampaign, setPreviewingCampaign] = useState<any | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<any | null>(null);
  const [closingCampaign, setClosingCampaign] = useState<any | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  // Non-blocking toast notification
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await apiGet<{ success: boolean; data: any[] }>("/api/v1/campaigns/admin/all");
      if (res?.data && Array.isArray(res.data)) {
        setCampaigns(res.data);
      } else {
        setCampaigns([]);
      }
    } catch (err: any) {
      console.warn("Failed to fetch campaigns from backend:", err);
      showToast(err.message || "Failed to load campaigns from database", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Filter & Sort logic
  const filteredAndSorted = useMemo(() => {
    let list = campaigns.filter((c) => {
      const matchSearch =
        (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.brandName || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.slug || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.category || "").toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || c.status?.toUpperCase() === statusFilter.toUpperCase();
      return matchSearch && matchStatus;
    });

    if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "highest_rate") {
      list.sort((a, b) => (b.rewardRateCpm ?? b.rewardRate ?? 0) - (a.rewardRateCpm ?? a.rewardRate ?? 0));
    } else if (sortBy === "total_budget") {
      list.sort((a, b) => (b.totalBudget ?? 0) - (a.totalBudget ?? 0));
    } else if (sortBy === "title") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else {
      // Newest first default
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [campaigns, search, statusFilter, sortBy]);

  // Toggle status: ACTIVE / PAUSED / COMPLETED / DRAFT / ARCHIVED
  const toggleStatus = async (id: string, newStatus: string) => {
    setActionInProgress(id);
    try {
      await apiPatch(`/api/v1/campaigns/admin/${id}/status`, { status: newStatus });
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id || c.slug === id ? { ...c, status: newStatus } : c))
      );
      showToast(`Campaign status updated to ${newStatus}`);
    } catch (err: any) {
      showToast(err.message || "Failed to update campaign status", "error");
    } finally {
      setActionInProgress(null);
    }
  };

  // Duplicate campaign
  const handleDuplicate = async (id: string) => {
    setActionInProgress(id);
    try {
      const res = await apiPost<{ success: boolean; data: any }>(`/api/v1/campaigns/admin/${id}/duplicate`);
      if (res?.data) {
        setCampaigns((prev) => [res.data, ...prev]);
        showToast(`Campaign "${res.data.title}" duplicated as DRAFT.`);
      }
    } catch (err: any) {
      showToast(err.message || "Failed to duplicate campaign", "error");
    } finally {
      setActionInProgress(null);
    }
  };

  // Save campaign updates (from modal)
  const handleSaveCampaign = async (updatedData: any) => {
    if (!editingCampaign) return;
    const id = editingCampaign.id;

    try {
      const res = await apiPatch<{ success: boolean; data: any }>(`/api/v1/campaigns/admin/${id}`, updatedData);
      const saved = res?.data || updatedData;

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === id || c.slug === editingCampaign.slug
            ? { ...c, ...updatedData, ...saved }
            : c
        )
      );
      setEditingCampaign(null);
      showToast("Campaign changes saved to database.");
      // Refresh list to ensure aggregate synchronization
      fetchCampaigns();
    } catch (err: any) {
      showToast(err.message || "Failed to persist campaign changes", "error");
      throw err;
    }
  };

  // Close campaign (mark as COMPLETED)
  const handleCloseCampaignConfirmed = async () => {
    if (!closingCampaign) return;
    await toggleStatus(closingCampaign.id, "COMPLETED");
    setClosingCampaign(null);
  };

  // Delete campaign permanently
  const handleDeleteCampaignConfirmed = async () => {
    if (!deletingCampaign) return;
    const id = deletingCampaign.id;
    setActionInProgress(id);

    try {
      await apiDelete(`/api/v1/campaigns/admin/${id}`);
      setCampaigns((prev) => prev.filter((c) => c.id !== id && c.slug !== id));
      setDeletingCampaign(null);
      showToast("Campaign permanently deleted from database.");
    } catch (err: any) {
      showToast(err.message || "Failed to delete campaign", "error");
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-mono shadow-2xl transition-all ${
            toast.type === "success"
              ? "bg-surface-1 border-accent text-accent"
              : "bg-surface-1 border-danger text-danger"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Platform CMS & Escrow Management
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-text">
            Campaigns ({campaigns.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Manage creator sponsorships, update rates, toggle status, review media assets, or close campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCampaigns}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors disabled:opacity-50"
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

      {/* Filters, Search & Sorting Controls */}
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

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-text-subtle">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-border bg-surface-1 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
            >
              <option value="ALL">All Statuses ({campaigns.length})</option>
              <option value="ACTIVE">ACTIVE (Published)</option>
              <option value="PAUSED">PAUSED</option>
              <option value="COMPLETED">COMPLETED (Closed)</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="DRAFT">DRAFT (Unpublished)</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono text-text-subtle">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-border bg-surface-1 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest_rate">Highest Rate</option>
              <option value="total_budget">Highest Escrow</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
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
                <th className="py-3.5 px-4 font-semibold">Created / Timeline</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                /* Skeleton rows while loading */
                [1, 2, 3, 4].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="w-16 h-10 rounded bg-surface-2" /></td>
                    <td className="py-4 px-4 space-y-1.5"><div className="h-3.5 w-32 rounded bg-surface-2" /><div className="h-2.5 w-20 rounded bg-surface-2" /></td>
                    <td className="py-4 px-4"><div className="h-3 w-20 rounded bg-surface-2" /></td>
                    <td className="py-4 px-4"><div className="h-3 w-16 rounded bg-surface-2" /></td>
                    <td className="py-4 px-4"><div className="h-3 w-24 rounded bg-surface-2" /></td>
                    <td className="py-4 px-4"><div className="h-4 w-16 rounded bg-surface-2" /></td>
                    <td className="py-4 px-4"><div className="h-3 w-20 rounded bg-surface-2" /></td>
                    <td className="py-4 px-4 text-right"><div className="h-6 w-24 rounded bg-surface-2 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs font-mono text-text-subtle">
                    No campaigns found matching "{search}".
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((c) => {
                  const rateVal = c.rewardRateCpm ?? c.rewardRate ?? 20;
                  const totalB = c.totalBudget ?? c.stats?.totalBudget ?? 0;
                  const allocB = c.allocatedBudget ?? c.stats?.paidAmount ?? 0;
                  const budgetPercent = totalB > 0 ? Math.min(100, Math.round((allocB / totalB) * 100)) : 0;
                  const audioTrack = c.audio || c.brief?.audio;
                  const isBusy = actionInProgress === c.id;

                  return (
                    <tr key={c.id || c.slug} className={`hover:bg-surface-2/30 transition-colors ${isBusy ? "opacity-50" : ""}`}>
                      {/* Thumbnail Column */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => setPreviewingCampaign(c)}
                          className="relative w-16 h-10 sm:w-20 sm:h-12 rounded-lg border border-border overflow-hidden bg-surface-2 cursor-pointer group shadow-sm shrink-0"
                          title="Click to preview campaign visual"
                        >
                          <img
                            src={c.coverImage || "/placeholder.png"}
                            alt={c.title}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          />
                          <div className="absolute bottom-1 left-1 w-4 h-4 rounded border border-black/50 overflow-hidden bg-black/60 shadow">
                            <img
                              src={c.brandLogoUrl || c.brandLogo || "/placeholder.png"}
                              alt={c.brandName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Title & Audio */}
                      <td className="py-3 px-4">
                        <div
                          onClick={() => setEditingCampaign(c)}
                          className="font-sans font-bold text-text hover:text-accent cursor-pointer transition-colors max-w-xs truncate"
                          title="Click to edit campaign details"
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

                      {/* Brand */}
                      <td className="py-3 px-4 text-text-muted">{c.brandName}</td>

                      {/* Rate per 1k */}
                      <td className="py-3 px-4 font-bold text-accent tabular-nums">
                        {formatCurrency(rateVal)}
                      </td>

                      {/* Budget */}
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

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase border ${
                            c.status === "ACTIVE"
                              ? "bg-success/10 text-success border-success/30"
                              : c.status === "COMPLETED"
                              ? "bg-accent/10 text-accent border-accent/30"
                              : c.status === "PAUSED"
                              ? "bg-warning/10 text-warning border-warning/30"
                              : c.status === "DRAFT"
                              ? "bg-surface-3 text-text-subtle border-border"
                              : "bg-surface-2 text-text-subtle border-border"
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

                      {/* Timeline & Creation Date */}
                      <td className="py-3 px-4 text-text-subtle tabular-nums space-y-0.5">
                        <div className="text-text font-medium">{formatDaysRemaining(c.endDate)}</div>
                        <div className="text-[10px] text-text-subtle">
                          Created: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. Preview Modal */}
                          <button
                            onClick={() => setPreviewingCampaign(c)}
                            className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
                            title="Preview Campaign Visual"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. Edit Campaign */}
                          <button
                            onClick={() => setEditingCampaign(c)}
                            className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
                            title="Edit Campaign Details"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. Status Action: Publish / Pause / Resume */}
                          {c.status === "ACTIVE" && (
                            <button
                              onClick={() => toggleStatus(c.id, "PAUSED")}
                              disabled={isBusy}
                              className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-warning hover:border-warning/40 transition-colors"
                              title="Pause campaign"
                            >
                              <Pause className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {c.status === "PAUSED" && (
                            <button
                              onClick={() => toggleStatus(c.id, "ACTIVE")}
                              disabled={isBusy}
                              className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-success hover:border-success/40 transition-colors"
                              title="Resume / Activate campaign"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {c.status === "DRAFT" && (
                            <button
                              onClick={() => toggleStatus(c.id, "ACTIVE")}
                              disabled={isBusy}
                              className="p-1.5 rounded-md border border-success/40 bg-success/10 text-success hover:bg-success/20 transition-colors"
                              title="Publish Campaign (Make Active)"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {c.status === "COMPLETED" && (
                            <button
                              onClick={() => toggleStatus(c.id, "ACTIVE")}
                              disabled={isBusy}
                              className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-success hover:border-success/40 transition-colors"
                              title="Reopen Campaign"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* 4. Close Campaign */}
                          {c.status === "ACTIVE" && (
                            <button
                              onClick={() => setClosingCampaign(c)}
                              disabled={isBusy}
                              className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-accent hover:border-accent/40 transition-colors"
                              title="Close Campaign (Mark as Completed)"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* 5. Duplicate */}
                          <button
                            onClick={() => handleDuplicate(c.id)}
                            disabled={isBusy}
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

                          {/* 7. Delete */}
                          <button
                            onClick={() => setDeletingCampaign(c)}
                            disabled={isBusy}
                            className="p-1.5 rounded-md border border-border bg-surface-2 text-text-muted hover:text-danger hover:border-danger/40 transition-colors"
                            title="Permanently Delete Campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <CampaignEditModal
          isOpen={Boolean(editingCampaign)}
          onClose={() => setEditingCampaign(null)}
          campaign={editingCampaign}
          onSave={handleSaveCampaign}
          onDelete={async (id) => {
            setEditingCampaign(null);
            setDeletingCampaign({ id, title: editingCampaign.title });
          }}
          onCloseCampaign={async (id) => {
            setEditingCampaign(null);
            setClosingCampaign({ id, title: editingCampaign.title });
          }}
        />
      )}

      {/* Preview Campaign Modal */}
      {previewingCampaign && (
        <CampaignPreviewModal
          isOpen={Boolean(previewingCampaign)}
          onClose={() => setPreviewingCampaign(null)}
          campaign={previewingCampaign}
        />
      )}

      {/* Accessible Confirmation Modal: Delete */}
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
              Are you sure you want to delete <strong className="text-text font-bold">"{deletingCampaign.title}"</strong>? This will permanently delete the campaign and its submissions from the persistent database.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingCampaign(null)}
                className="px-4 py-2 rounded-lg border border-border bg-surface-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCampaignConfirmed}
                className="px-4 py-2 rounded-lg bg-danger text-xs font-bold text-white hover:bg-danger/90 transition-colors"
              >
                Yes, Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accessible Confirmation Modal: Close Campaign */}
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
              This will transition <strong className="text-text font-bold">"{closingCampaign.title}"</strong> to <code className="text-warning font-mono">COMPLETED</code> status. Creators will no longer be able to submit new video entries, while historical view analytics and escrow settlements are locked.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setClosingCampaign(null)}
                className="px-4 py-2 rounded-lg border border-border bg-surface-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCloseCampaignConfirmed}
                className="px-4 py-2 rounded-lg bg-warning text-xs font-bold text-black hover:bg-warning/90 transition-colors"
              >
                Close & Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
