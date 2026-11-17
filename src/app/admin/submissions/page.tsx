"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { PlatformIcon } from "@/components/PlatformIcons";
import { PlatformType } from "@/types";
import { apiGet, apiPatch } from "@/lib/api-client";
import {
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  RefreshCw,
} from "lucide-react";

interface SubmissionItem {
  id: string;
  creatorId: string;
  creator?: {
    email: string;
    creatorProfile?: {
      displayName: string;
      handle: string;
    };
  };
  campaign?: {
    title: string;
    brandName: string;
    rewardRateCpm: number;
    slug?: string;
  };
  platform: string;
  contentUrl: string;
  submittedAt: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | "FLAGGED";
  reportedViews: number;
  verifiedViews: number;
  rewardAmount: number;
  rejectionReason?: string;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await apiGet<{ success: boolean; data: SubmissionItem[] }>("/api/v1/submissions/admin/all");
      if (res?.data) {
        setSubmissions(res.data);
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleApprove = async (id: string, customViews?: number) => {
    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;
    const views = customViews !== undefined ? customViews : (sub.verifiedViews || sub.reportedViews);

    try {
      setActionInProgress(id);
      const res = await apiPatch<{ success: boolean; data: any }>(`/api/v1/submissions/admin/${id}/review`, {
        status: "VERIFIED",
        verifiedViews: views,
        auditNotes: `Manually verified ${views.toLocaleString()} views by admin.`,
      });

      if (res?.data) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...res.data, status: "VERIFIED" } : s))
        );
      }
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!reasonInput.trim()) return;

    try {
      setActionInProgress(id);
      const res = await apiPatch<{ success: boolean; data: any }>(`/api/v1/submissions/admin/${id}/review`, {
        status: "REJECTED",
        rejectionReason: reasonInput.trim(),
        auditNotes: reasonInput.trim(),
      });

      if (res?.data) {
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, ...res.data, status: "REJECTED" } : s))
        );
      }
      setRejectingId(null);
      setReasonInput("");
    } catch (err: any) {
      alert(`Rejection failed: ${err.message}`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleUpdateViews = (id: string, views: number) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const rate = s.campaign?.rewardRateCpm || 20;
          return {
            ...s,
            verifiedViews: views,
            rewardAmount: (views / 1000) * rate,
          };
        }
        return s;
      })
    );
  };

  const filtered = submissions.filter((s) => {
    const creatorName = s.creator?.creatorProfile?.displayName || "";
    const creatorHandle = s.creator?.creatorProfile?.handle || s.creator?.email || "";
    const campaignTitle = s.campaign?.title || "";

    const matchesSearch =
      creatorName.toLowerCase().includes(search.toLowerCase()) ||
      creatorHandle.toLowerCase().includes(search.toLowerCase()) ||
      campaignTitle.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "ALL" || s.status.toUpperCase() === filterStatus.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Moderation & Audits
            </span>
            {pendingCount > 0 && (
              <span className="rounded bg-warning/20 border border-warning/30 px-2 py-0.5 text-[11px] font-mono text-warning font-semibold">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-text">
            Creator Submissions ({submissions.length})
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            Inspect published creator content, audit organic view counts, and confirm or reject reward claims.
          </p>
        </div>

        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text hover:bg-surface-3 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="w-3.5 h-3.5 text-text-subtle absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search creator, handle, or campaign..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-1 py-1.5 pl-9 pr-3 text-xs text-text placeholder:text-text-subtle focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          {["ALL", "PENDING", "VERIFIED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded px-3 py-1 text-xs font-mono capitalize transition-colors ${
                filterStatus === st
                  ? "bg-surface-3 text-accent border border-accent/30 font-semibold"
                  : "bg-surface-1 text-text-muted border border-border hover:text-text"
              }`}
            >
              {st.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-surface-1 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border bg-surface-2/40 text-text-subtle">
                <th className="py-3 px-4 font-medium">Creator</th>
                <th className="py-3 px-4 font-medium">Campaign & Content</th>
                <th className="py-3 px-4 font-medium">Platform</th>
                <th className="py-3 px-4 font-medium text-right">Audited Views</th>
                <th className="py-3 px-4 font-medium text-right">Calculated Reward</th>
                <th className="py-3 px-4 font-medium text-right">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs font-mono text-text-subtle">
                    {loading ? "Loading submissions from database..." : "No submissions found."}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const creatorDisplayName = s.creator?.creatorProfile?.displayName || "Creator";
                  const creatorHandle = s.creator?.creatorProfile?.handle ? `@${s.creator.creatorProfile.handle}` : s.creator?.email || "creator";
                  const campaignTitle = s.campaign?.title || "Campaign";
                  const platformKey = s.platform.toLowerCase().replace(/ /g, "_") as PlatformType;

                  return (
                    <tr key={s.id} className="hover:bg-surface-2/20 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-sans font-semibold text-text">{creatorDisplayName}</div>
                        <div className="text-[11px] text-text-subtle">{creatorHandle}</div>
                      </td>

                      <td className="py-3 px-4 font-sans">
                        <span className="font-medium text-text block text-xs">
                          {campaignTitle}
                        </span>
                        <a
                          href={s.contentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-mono text-text-subtle hover:text-accent flex items-center gap-1 mt-0.5 truncate max-w-xs"
                        >
                          <span>{s.contentUrl}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                        {s.rejectionReason && (
                          <div className="text-[11px] text-danger mt-1 italic font-sans">
                            Reason: {s.rejectionReason}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 capitalize text-text">
                          <PlatformIcon platform={platformKey} className="w-3.5 h-3.5" />
                          <span>{s.platform}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {s.status === "PENDING" ? (
                          <input
                            type="number"
                            value={s.verifiedViews || s.reportedViews || 0}
                            onChange={(e) => handleUpdateViews(s.id, parseInt(e.target.value) || 0)}
                            className="w-24 rounded border border-border bg-surface-2 px-2 py-1 text-right text-xs font-mono text-text focus:outline-none"
                          />
                        ) : (
                          <span className="font-semibold text-text tabular-nums">{formatNumber(s.verifiedViews || s.reportedViews)}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-accent tabular-nums">
                        {formatCurrency(s.rewardAmount || 0)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {s.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(s.id)}
                              disabled={actionInProgress === s.id}
                              className="flex items-center gap-1 rounded bg-success/20 border border-success/30 px-2.5 py-1 text-[11px] font-semibold text-success hover:bg-success/30 transition-colors disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{actionInProgress === s.id ? "Processing..." : "Approve"}</span>
                            </button>
                            <button
                              onClick={() => setRejectingId(s.id)}
                              disabled={actionInProgress === s.id}
                              className="flex items-center gap-1 rounded bg-danger/20 border border-danger/30 px-2.5 py-1 text-[11px] font-semibold text-danger hover:bg-danger/30 transition-colors disabled:opacity-50"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : s.status === "VERIFIED" ? (
                          <span className="inline-flex items-center gap-1 text-success text-[11px] font-semibold font-mono bg-success/10 border border-success/20 px-2 py-0.5 rounded">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved & Audited</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-danger text-[11px] font-semibold font-mono bg-danger/10 border border-danger/20 px-2 py-0.5 rounded">
                            <XCircle className="w-3 h-3" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface-1 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-semibold text-text">Record Rejection Reason</h3>
            <p className="text-xs text-text-muted">
              Specify why this submission was rejected. This will be recorded in the audit trail and visible to the creator.
            </p>
            <textarea
              rows={3}
              value={reasonInput}
              onChange={(e) => setReasonInput(e.target.value)}
              placeholder="e.g. Missing required campaign hashtags, non-compliant format, or failed fraud audit..."
              className="w-full rounded-md border border-border bg-surface-2 p-3 text-xs text-text placeholder:text-text-subtle focus:outline-none resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setRejectingId(null);
                  setReasonInput("");
                }}
                className="rounded px-3 py-1.5 text-xs text-text-muted hover:text-text"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingId)}
                disabled={actionInProgress === rejectingId}
                className="rounded bg-danger px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {actionInProgress === rejectingId ? "Saving..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
