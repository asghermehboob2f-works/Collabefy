"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Hash,
  Search,
  RefreshCw,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertTriangle,
  History,
  GitCompare,
  ExternalLink,
  Trash2,
  Save,
  Copy,
  Check,
  ChevronRight,
  Filter,
  ShieldAlert,
  ArrowUpDown,
  FileSpreadsheet,
  FileCode,
} from "lucide-react";
import { apiGet, apiPatch, apiDelete } from "@/lib/api-client";

interface DiscordSubmissionVersion {
  id: string;
  submissionId: string;
  versionNumber: number;
  discordUsername: string;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  otherPlatform: string | null;
  otherPlatformUrl: string | null;
  additionalInfo: string | null;
  ipAddress: string | null;
  createdAt: string;
}

interface DiscordSubmission {
  id: string;
  discordUsername: string;
  normalizedDiscord: string;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  otherPlatform: string | null;
  otherPlatformUrl: string | null;
  additionalInfo: string | null;
  currentVersion: number;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  adminNotes: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  ipAddress: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    versions: number;
  };
  versions?: DiscordSubmissionVersion[];
}

export default function AdminDiscordSubmissionsPage() {
  const [submissions, setSubmissions] = useState<DiscordSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Detail Modal / Review Drawer State
  const [selectedSubmission, setSelectedSubmission] = useState<DiscordSubmission | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Version Comparison State
  const [compareVersionA, setCompareVersionA] = useState<number | null>(null);
  const [compareVersionB, setCompareVersionB] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "diff">("overview");

  // Delete State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status Action Flash Notification
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        status: statusFilter,
        search,
        sortBy,
      });

      const res = await apiGet<{
        success: boolean;
        data: DiscordSubmission[];
        pagination: { totalCount: number; totalPages: number; page: number };
      }>(`/api/v1/submissions/discord/admin/all?${params.toString()}`);

      if (res?.data) {
        setSubmissions(res.data);
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalCount(res.pagination?.totalCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch Discord submissions:", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search, sortBy]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Open Detailed Review Modal
  const handleOpenDetail = async (id: string) => {
    try {
      setModalLoading(true);
      setActiveTab("overview");
      const res = await apiGet<{ success: boolean; data: DiscordSubmission }>(
        `/api/v1/submissions/discord/admin/${id}`
      );
      if (res?.data) {
        setSelectedSubmission(res.data);
        setAdminNotesInput(res.data.adminNotes || "");
        if (res.data.versions && res.data.versions.length >= 2) {
          setCompareVersionA(res.data.versions[1].versionNumber);
          setCompareVersionB(res.data.versions[0].versionNumber);
        } else if (res.data.versions && res.data.versions.length === 1) {
          setCompareVersionA(res.data.versions[0].versionNumber);
          setCompareVersionB(res.data.versions[0].versionNumber);
        }
      }
    } catch (err: any) {
      alert("Failed to load submission details: " + err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Status Change
  const handleStatusChange = async (newStatus: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED") => {
    if (!selectedSubmission) return;
    try {
      setIsUpdatingStatus(true);
      const res = await apiPatch<{ success: boolean; data: DiscordSubmission; message: string }>(
        `/api/v1/submissions/discord/admin/${selectedSubmission.id}/review`,
        {
          status: newStatus,
          adminNotes: adminNotesInput,
        }
      );
      if (res?.data) {
        setSelectedSubmission(res.data);
        setSubmissions((prev) =>
          prev.map((s) => (s.id === selectedSubmission.id ? { ...s, status: newStatus, adminNotes: adminNotesInput } : s))
        );
        setActionSuccess(`Status changed to ${newStatus}`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err: any) {
      alert("Failed to update status: " + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Save Internal Admin Notes
  const handleSaveNotes = async () => {
    if (!selectedSubmission) return;
    try {
      setIsSavingNotes(true);
      const res = await apiPatch<{ success: boolean; data: DiscordSubmission }>(
        `/api/v1/submissions/discord/admin/${selectedSubmission.id}/review`,
        {
          status: selectedSubmission.status,
          adminNotes: adminNotesInput,
        }
      );
      if (res?.data) {
        setSelectedSubmission((prev) => (prev ? { ...prev, adminNotes: adminNotesInput } : null));
        setSubmissions((prev) =>
          prev.map((s) => (s.id === selectedSubmission.id ? { ...s, adminNotes: adminNotesInput } : s))
        );
        setActionSuccess("Internal notes saved securely to database.");
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch (err: any) {
      alert("Failed to save notes: " + err.message);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Delete Submission
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await apiDelete(`/api/v1/submissions/discord/admin/${id}`);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
      setDeleteConfirmId(null);
      setTotalCount((c) => Math.max(0, c - 1));
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Export handlers
  const handleExport = (format: "csv" | "json") => {
    const token = typeof window !== "undefined" ? localStorage.getItem("collabefy_admin_token") || "" : "";
    const url = `/api/v1/submissions/discord/admin/export?format=${format}&token=${encodeURIComponent(token)}`;
    window.open(url, "_blank");
  };

  // Render Status Badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3" />
            Under Review
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  // Helper for computing version differences
  const getVersionDiff = () => {
    if (!selectedSubmission?.versions) return [];
    const vA = selectedSubmission.versions.find((v) => v.versionNumber === compareVersionA);
    const vB = selectedSubmission.versions.find((v) => v.versionNumber === compareVersionB);
    if (!vA || !vB) return [];

    const fields: { key: keyof DiscordSubmissionVersion; label: string }[] = [
      { key: "discordUsername", label: "Discord Username" },
      { key: "instagramUrl", label: "Instagram URL" },
      { key: "youtubeUrl", label: "YouTube Channel" },
      { key: "tiktokUrl", label: "TikTok Profile" },
      { key: "otherPlatform", label: "Other Platform Name" },
      { key: "otherPlatformUrl", label: "Other Platform URL" },
      { key: "additionalInfo", label: "Creator Pitch & Notes" },
    ];

    return fields.map((f) => {
      const valA = (vA[f.key] as string) || "";
      const valB = (vB[f.key] as string) || "";
      let diffType: "ADDED" | "REMOVED" | "MODIFIED" | "UNCHANGED" = "UNCHANGED";

      if (!valA && valB) diffType = "ADDED";
      else if (valA && !valB) diffType = "REMOVED";
      else if (valA !== valB) diffType = "MODIFIED";

      return {
        label: f.label,
        valA,
        valB,
        diffType,
      };
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-md bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/30">
              <Hash className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              Discord Creator Submissions
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-2 text-text-subtle border border-border">
              {totalCount} Total
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1 max-w-2xl">
            Intake channel for community creators applying via direct Discord invite link.
            Submissions maintain isolated identities, sequential revision history, and admin review notes.
          </p>
        </div>

        {/* Global Export Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-surface-2 border border-border text-xs font-medium text-text hover:bg-surface-3 transition-colors shadow-sm"
            title="Download CSV export"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => handleExport("json")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-surface-2 border border-border text-xs font-medium text-text hover:bg-surface-3 transition-colors shadow-sm"
            title="Download JSON export"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-surface-1 p-3.5 rounded-xl border border-border">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
          <input
            type="text"
            placeholder="Search Discord username, social handle, or URL..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 bg-surface-2 border border-border rounded-lg text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-accent"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="md:col-span-4 flex items-center gap-1 bg-surface-2 p-1 rounded-lg border border-border/60 overflow-x-auto">
          {["ALL", "PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? "bg-surface-1 text-accent shadow-sm font-semibold border border-border"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {st === "ALL" ? "All" : st.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Sort By */}
        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="w-full py-2 px-2.5 bg-surface-2 border border-border rounded-lg text-xs text-text focus:outline-none focus:border-accent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="username">Username A-Z</option>
            <option value="version">Highest Version</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>

        {/* Refresh */}
        <div className="md:col-span-1 flex justify-end">
          <button
            onClick={() => fetchSubmissions()}
            disabled={loading}
            className="w-full flex items-center justify-center p-2 rounded-lg bg-surface-2 border border-border text-text hover:bg-surface-3 transition-colors disabled:opacity-50"
            title="Refresh submissions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-accent" : "text-text-subtle"}`} />
          </button>
        </div>
      </div>

      {/* Main Submissions Table */}
      <div className="rounded-xl border border-border bg-surface-1 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center">
            <RefreshCw className="w-6 h-6 animate-spin text-accent mx-auto mb-2" />
            <p className="text-xs text-text-subtle font-mono">Loading Discord submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center mx-auto text-text-subtle">
              <Hash className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-text">No Discord submissions match your criteria</p>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Share the direct URL <code className="text-accent bg-surface-2 px-1.5 py-0.5 rounded">/discord-submissions</code> in your Discord server for creators to apply.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-surface-2/60 text-text-subtle font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Discord Identity</th>
                  <th className="py-3 px-4 font-semibold">Version</th>
                  <th className="py-3 px-4 font-semibold">Linked Platforms</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Submitted / Updated</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-surface-2/40 transition-colors">
                    {/* Discord Username */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center text-[#5865F2] font-mono font-bold text-xs shrink-0">
                          #
                        </div>
                        <div>
                          <div className="font-semibold text-text flex items-center gap-1.5">
                            <span>{sub.discordUsername}</span>
                            <button
                              onClick={() => copyToClipboard(sub.discordUsername, sub.id)}
                              className="text-text-subtle hover:text-accent transition-colors"
                              title="Copy username"
                            >
                              {copiedField === sub.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          <span className="text-[10px] font-mono text-text-subtle">
                            id: @{sub.normalizedDiscord}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Version */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-2 text-text font-semibold border border-border">
                        <History className="w-3 h-3 text-accent" />
                        v{sub.currentVersion}
                      </span>
                    </td>

                    {/* Social Media Links */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {sub.instagramUrl && (
                          <a
                            href={sub.instagramUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded bg-pink-500/10 text-pink-400 border border-pink-500/20 text-[10px] font-medium flex items-center gap-1 hover:underline"
                          >
                            <span>IG</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {sub.youtubeUrl && (
                          <a
                            href={sub.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-medium flex items-center gap-1 hover:underline"
                          >
                            <span>YT</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {sub.tiktokUrl && (
                          <a
                            href={sub.tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-medium flex items-center gap-1 hover:underline"
                          >
                            <span>TikTok</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {sub.otherPlatform && sub.otherPlatformUrl && (
                          <a
                            href={sub.otherPlatformUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded bg-surface-3 text-text-muted border border-border text-[10px] font-medium flex items-center gap-1 hover:underline"
                          >
                            <span>{sub.otherPlatform}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {!sub.instagramUrl && !sub.youtubeUrl && !sub.tiktokUrl && !sub.otherPlatformUrl && (
                          <span className="text-[11px] text-text-subtle italic">None provided</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">{getStatusBadge(sub.status)}</td>

                    {/* Submitted / Updated Date */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-text-subtle">
                      <div>{new Date(sub.updatedAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-text-muted">
                        {new Date(sub.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(sub.id)}
                          className="px-2.5 py-1.5 rounded-md bg-accent/10 border border-accent/20 text-accent font-medium text-xs hover:bg-accent/20 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(sub.id)}
                          className="p-1.5 rounded-md bg-surface-2 border border-border text-text-subtle hover:text-danger hover:border-danger/30 transition-colors"
                          title="Delete submission"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-3.5 border-t border-border bg-surface-2/40 flex items-center justify-between text-xs">
            <span className="text-text-subtle font-mono">
              Page {page} of {totalPages} ({totalCount} items)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-surface-2 border border-border text-text hover:bg-surface-3 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded bg-surface-2 border border-border text-text hover:bg-surface-3 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAILED INSPECTION, REVIEW & DIFF MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-4xl bg-surface-1 border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-border bg-surface-2/70 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/30 flex items-center justify-center text-[#5865F2] font-mono font-bold text-sm">
                  #
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-text">
                      {selectedSubmission.discordUsername}
                    </h3>
                    <span className="text-xs font-mono text-text-subtle">
                      (v{selectedSubmission.currentVersion})
                    </span>
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                  <p className="text-[11px] font-mono text-text-subtle">
                    Normalized: @{selectedSubmission.normalizedDiscord} • ID: {selectedSubmission.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg bg-surface-2 hover:bg-surface-3 border border-border text-text-subtle hover:text-text transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 px-5 py-2.5 border-b border-border bg-surface-2/30 shrink-0 text-xs">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  activeTab === "overview"
                    ? "bg-accent/10 text-accent font-semibold border border-accent/20"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Overview & Review
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === "history"
                    ? "bg-accent/10 text-accent font-semibold border border-accent/20"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Version History ({selectedSubmission.versions?.length || 1})</span>
              </button>
              <button
                onClick={() => setActiveTab("diff")}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === "diff"
                    ? "bg-accent/10 text-accent font-semibold border border-accent/20"
                    : "text-text-muted hover:text-text"
                }`}
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Version Diff Comparison</span>
              </button>
            </div>

            {/* Notification alert */}
            {actionSuccess && (
              <div className="m-4 mb-0 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Modal Body Area */}
            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {/* TAB 1: OVERVIEW & REVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Grid of Profile Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Social Media Details Card */}
                    <div className="p-4 rounded-xl border border-border bg-surface-2/40 space-y-3">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-subtle">
                        Submitted Social Profiles
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-1 border border-border">
                          <span className="text-text-subtle font-mono">Instagram:</span>
                          {selectedSubmission.instagramUrl ? (
                            <a
                              href={selectedSubmission.instagramUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline flex items-center gap-1 truncate max-w-[200px]"
                            >
                              <span className="truncate">{selectedSubmission.instagramUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-text-subtle italic">Not provided</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-1 border border-border">
                          <span className="text-text-subtle font-mono">YouTube:</span>
                          {selectedSubmission.youtubeUrl ? (
                            <a
                              href={selectedSubmission.youtubeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline flex items-center gap-1 truncate max-w-[200px]"
                            >
                              <span className="truncate">{selectedSubmission.youtubeUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-text-subtle italic">Not provided</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-1 border border-border">
                          <span className="text-text-subtle font-mono">TikTok:</span>
                          {selectedSubmission.tiktokUrl ? (
                            <a
                              href={selectedSubmission.tiktokUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:underline flex items-center gap-1 truncate max-w-[200px]"
                            >
                              <span className="truncate">{selectedSubmission.tiktokUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-text-subtle italic">Not provided</span>
                          )}
                        </div>

                        {selectedSubmission.otherPlatform && (
                          <div className="flex items-center justify-between p-2 rounded-lg bg-surface-1 border border-border">
                            <span className="text-text-subtle font-mono">
                              {selectedSubmission.otherPlatform}:
                            </span>
                            {selectedSubmission.otherPlatformUrl ? (
                              <a
                                href={selectedSubmission.otherPlatformUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline flex items-center gap-1 truncate max-w-[200px]"
                              >
                                <span className="truncate">{selectedSubmission.otherPlatformUrl}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            ) : (
                              <span className="text-text-subtle italic">Not provided</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Metadata Card */}
                    <div className="p-4 rounded-xl border border-border bg-surface-2/40 space-y-3">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-subtle">
                        Submission Provenance & Audit
                      </h4>
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-text-subtle">First Submitted:</span>
                          <span className="text-text">
                            {new Date(selectedSubmission.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-text-subtle">Latest Revision:</span>
                          <span className="text-text">
                            {new Date(selectedSubmission.updatedAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-text-subtle">Remote IP Address:</span>
                          <span className="text-accent">
                            {selectedSubmission.ipAddress || "Proxy/Protected"}
                          </span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-border/50">
                          <span className="text-text-subtle">Total Revisions:</span>
                          <span className="text-text font-bold">
                            {selectedSubmission.currentVersion} versions
                          </span>
                        </div>
                        {selectedSubmission.reviewedBy && (
                          <div className="flex justify-between py-1 border-b border-border/50">
                            <span className="text-text-subtle">Last Staff Reviewer:</span>
                            <span className="text-text font-semibold">{selectedSubmission.reviewedBy}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Creator Pitch / Additional Information */}
                  {selectedSubmission.additionalInfo && (
                    <div className="p-4 rounded-xl border border-border bg-surface-2/20 space-y-2">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text-subtle">
                        Creator Pitch & Additional Notes
                      </h4>
                      <p className="text-xs text-text leading-relaxed whitespace-pre-line bg-surface-1 p-3 rounded-lg border border-border/60">
                        {selectedSubmission.additionalInfo}
                      </p>
                    </div>
                  )}

                  {/* Administrative Action Controls */}
                  <div className="p-4 rounded-xl border border-border bg-surface-2/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-text">
                        Administrative Decision & Status Control
                      </h4>
                      <span className="text-[10px] font-mono text-text-subtle">
                        Current: <strong className="text-accent">{selectedSubmission.status}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => handleStatusChange("APPROVED")}
                        disabled={isUpdatingStatus || selectedSubmission.status === "APPROVED"}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 disabled:opacity-40 text-xs font-semibold transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange("UNDER_REVIEW")}
                        disabled={isUpdatingStatus || selectedSubmission.status === "UNDER_REVIEW"}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 disabled:opacity-40 text-xs font-semibold transition-all"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Under Review</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange("REJECTED")}
                        disabled={isUpdatingStatus || selectedSubmission.status === "REJECTED"}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 disabled:opacity-40 text-xs font-semibold transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleStatusChange("PENDING")}
                        disabled={isUpdatingStatus || selectedSubmission.status === "PENDING"}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 disabled:opacity-40 text-xs font-semibold transition-all"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Reset Pending</span>
                      </button>
                    </div>

                    {/* Internal Admin Notes (Hidden from creators) */}
                    <div className="space-y-2 pt-2 border-t border-border/60">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-text flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 text-accent" />
                          <span>Internal Administrative Notes</span>
                        </label>
                        <span className="text-[10px] font-mono text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                          CONFIDENTIAL • Hidden from creators
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={adminNotesInput}
                        onChange={(e) => setAdminNotesInput(e.target.value)}
                        placeholder="Add internal notes regarding this creator (e.g. audience check results, discord interaction history, reason for rejection/approval)..."
                        className="w-full p-3 bg-surface-1 border border-border rounded-lg text-xs text-text placeholder:text-text-subtle focus:outline-none focus:border-accent"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveNotes}
                          disabled={isSavingNotes}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-ink text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-opacity"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{isSavingNotes ? "Saving Notes..." : "Save Internal Notes"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VERSION HISTORY LIST */}
              {activeTab === "history" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-text">Revision History Log</h4>
                      <p className="text-[11px] text-text-muted">
                        Every resubmission by the creator creates a permanent historical snapshot.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("diff")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-accent/10 border border-accent/20 text-accent text-xs font-medium hover:bg-accent/20"
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>Compare Versions</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedSubmission.versions?.map((ver) => (
                      <div
                        key={ver.id}
                        className={`p-4 rounded-xl border text-xs ${
                          ver.versionNumber === selectedSubmission.currentVersion
                            ? "border-accent/40 bg-accent/5"
                            : "border-border bg-surface-2/40"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-accent px-2 py-0.5 rounded bg-surface-1 border border-border">
                              Version {ver.versionNumber}
                            </span>
                            {ver.versionNumber === selectedSubmission.currentVersion && (
                              <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                                (Active Version)
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-text-subtle">
                            {new Date(ver.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-text-subtle">Username:</span>{" "}
                            <span className="font-semibold text-text">{ver.discordUsername}</span>
                          </div>
                          <div>
                            <span className="text-text-subtle">IP Address:</span>{" "}
                            <span className="font-mono text-text">{ver.ipAddress || "Unknown"}</span>
                          </div>
                          {ver.instagramUrl && (
                            <div className="truncate">
                              <span className="text-text-subtle">IG:</span>{" "}
                              <a href={ver.instagramUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                                {ver.instagramUrl}
                              </a>
                            </div>
                          )}
                          {ver.youtubeUrl && (
                            <div className="truncate">
                              <span className="text-text-subtle">YT:</span>{" "}
                              <a href={ver.youtubeUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                                {ver.youtubeUrl}
                              </a>
                            </div>
                          )}
                          {ver.tiktokUrl && (
                            <div className="truncate">
                              <span className="text-text-subtle">TikTok:</span>{" "}
                              <a href={ver.tiktokUrl} target="_blank" rel="noreferrer" className="text-accent underline">
                                {ver.tiktokUrl}
                              </a>
                            </div>
                          )}
                        </div>

                        {ver.additionalInfo && (
                          <div className="mt-2 pt-2 border-t border-border/50 text-[11px] text-text-muted">
                            <span className="text-text-subtle font-mono">Pitch:</span> {ver.additionalInfo}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: VERSION DIFF COMPARISON TOOL */}
              {activeTab === "diff" && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-text">Interactive Version Diff Comparison</h4>
                    <p className="text-[11px] text-text-muted">
                      Select two revisions to inspect added, updated, or removed social media profiles.
                    </p>
                  </div>

                  {/* Revision Selector Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-surface-2 rounded-xl border border-border">
                    <div>
                      <label className="text-[11px] font-mono font-semibold text-text-subtle block mb-1">
                        Base Version (Older):
                      </label>
                      <select
                        value={compareVersionA || ""}
                        onChange={(e) => setCompareVersionA(Number(e.target.value))}
                        className="w-full p-2 bg-surface-1 border border-border rounded-lg text-xs text-text focus:outline-none focus:border-accent"
                      >
                        {selectedSubmission.versions?.map((v) => (
                          <option key={v.id} value={v.versionNumber}>
                            Version {v.versionNumber} — {new Date(v.createdAt).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono font-semibold text-text-subtle block mb-1">
                        Comparison Target (Newer):
                      </label>
                      <select
                        value={compareVersionB || ""}
                        onChange={(e) => setCompareVersionB(Number(e.target.value))}
                        className="w-full p-2 bg-surface-1 border border-border rounded-lg text-xs text-text focus:outline-none focus:border-accent"
                      >
                        {selectedSubmission.versions?.map((v) => (
                          <option key={v.id} value={v.versionNumber}>
                            Version {v.versionNumber} — {new Date(v.createdAt).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Diff Comparison Table */}
                  <div className="rounded-xl border border-border overflow-hidden bg-surface-1">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-surface-2/60 border-b border-border text-[11px] font-mono text-text-subtle">
                          <th className="p-3">Field</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Version {compareVersionA}</th>
                          <th className="p-3">Version {compareVersionB}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {getVersionDiff().map((diff, idx) => (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              diff.diffType === "MODIFIED"
                                ? "bg-amber-500/5"
                                : diff.diffType === "ADDED"
                                ? "bg-emerald-500/5"
                                : diff.diffType === "REMOVED"
                                ? "bg-red-500/5"
                                : "hover:bg-surface-2/30"
                            }`}
                          >
                            <td className="p-3 font-semibold text-text">{diff.label}</td>
                            <td className="p-3">
                              {diff.diffType === "ADDED" && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  + ADDED
                                </span>
                              )}
                              {diff.diffType === "REMOVED" && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                  - REMOVED
                                </span>
                              )}
                              {diff.diffType === "MODIFIED" && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  MODIFIED
                                </span>
                              )}
                              {diff.diffType === "UNCHANGED" && (
                                <span className="text-[10px] font-mono text-text-subtle">
                                  Unchanged
                                </span>
                              )}
                            </td>
                            <td className="p-3 font-mono text-[11px] text-text-muted break-all">
                              {diff.valA || <span className="text-text-subtle italic">(empty)</span>}
                            </td>
                            <td className="p-3 font-mono text-[11px] text-text font-medium break-all">
                              {diff.valB || <span className="text-text-subtle italic">(empty)</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-surface-2/50 flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-text-subtle">
                Audit Trail ID: {selectedSubmission.id}
              </span>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-lg bg-surface-2 border border-border text-xs font-semibold text-text hover:bg-surface-3 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-1 border border-danger/30 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-danger">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base text-text">Confirm Permanent Deletion</h3>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Are you sure you want to delete this Discord submission? This action will permanently
              purge the submission record and all associated revision versions from the database.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-md bg-surface-2 border border-border text-xs font-medium text-text hover:bg-surface-3"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-md bg-danger text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
