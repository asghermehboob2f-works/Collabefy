"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { PlatformIcon } from "@/components/PlatformIcons";
import { PlatformType } from "@/types";
import { CheckCircle2, XCircle, ExternalLink, ShieldCheck, Clock, Search, AlertCircle, FileCheck } from "lucide-react";

interface SubmissionItem {
  id: string;
  creatorName: string;
  creatorHandle: string;
  campaignTitle: string;
  campaignSlug: string;
  platform: PlatformType;
  contentUrl: string;
  submittedAt: string;
  status: "pending" | "verified" | "rejected";
  estimatedViews: number;
  verifiedViews: number;
  rewardRateCpm: number;
  rewardAmount: number;
  rejectionReason?: string;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([
    {
      id: "sub-1",
      creatorName: "Alex Rivers",
      creatorHandle: "@alex_builds",
      campaignTitle: "Cursor AI — Next-Gen Code Editor Launch",
      campaignSlug: "cursor-ai-launch",
      platform: "tiktok",
      contentUrl: "https://www.tiktok.com/@alex_builds/video/729104829104",
      submittedAt: "2026-11-13T10:30:00Z",
      status: "pending",
      estimatedViews: 148200,
      verifiedViews: 148200,
      rewardRateCpm: 22.0,
      rewardAmount: 3260.4,
    },
    {
      id: "sub-2",
      creatorName: "Maya Lin",
      creatorHandle: "@codewithmaya",
      campaignTitle: "Cursor AI — Next-Gen Code Editor Launch",
      campaignSlug: "cursor-ai-launch",
      platform: "youtube_shorts",
      contentUrl: "https://youtube.com/shorts/k920aLkm2",
      submittedAt: "2026-11-12T16:45:00Z",
      status: "pending",
      estimatedViews: 112400,
      verifiedViews: 112400,
      rewardRateCpm: 22.0,
      rewardAmount: 2472.8,
    },
    {
      id: "sub-3",
      creatorName: "Kevin Vance",
      creatorHandle: "@dev_kevin",
      campaignTitle: "Perplexity AI — Deep Research Mode",
      campaignSlug: "perplexity-deep-research",
      platform: "instagram_reels",
      contentUrl: "https://instagram.com/reels/DA9218201",
      submittedAt: "2026-11-11T14:10:00Z",
      status: "verified",
      estimatedViews: 94800,
      verifiedViews: 94800,
      rewardRateCpm: 22.0,
      rewardAmount: 2085.6,
    },
    {
      id: "sub-4",
      creatorName: "Samira Patel",
      creatorHandle: "@tech_sam",
      campaignTitle: "Arc Browser — Windows Release & Spaces",
      campaignSlug: "arc-browser-windows",
      platform: "tiktok",
      contentUrl: "https://www.tiktok.com/@tech_sam/video/83910284920",
      submittedAt: "2026-11-10T12:00:00Z",
      status: "rejected",
      estimatedViews: 15000,
      verifiedViews: 0,
      rewardRateCpm: 18.0,
      rewardAmount: 0,
      rejectionReason: "Content did not include the required #ArcBrowser hashtag in caption.",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState("");

  const handleApprove = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const reward = (s.verifiedViews / 1000) * s.rewardRateCpm;
          return {
            ...s,
            status: "verified",
            rewardAmount: reward,
          };
        }
        return s;
      })
    );
  };

  const handleReject = (id: string) => {
    if (!reasonInput.trim()) return;
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            status: "rejected",
            rejectionReason: reasonInput,
            rewardAmount: 0,
          };
        }
        return s;
      })
    );
    setRejectingId(null);
    setReasonInput("");
  };

  const handleUpdateViews = (id: string, views: number) => {
    setSubmissions((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const reward = (views / 1000) * s.rewardRateCpm;
          return {
            ...s,
            verifiedViews: views,
            rewardAmount: reward,
          };
        }
        return s;
      })
    );
  };

  const filtered = submissions.filter((s) => {
    const matchesSearch =
      s.creatorName.toLowerCase().includes(search.toLowerCase()) ||
      s.creatorHandle.toLowerCase().includes(search.toLowerCase()) ||
      s.campaignTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

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
          {["all", "pending", "verified", "rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`rounded px-3 py-1 text-xs font-mono capitalize transition-colors ${
                filterStatus === st
                  ? "bg-surface-3 text-accent border border-accent/30 font-semibold"
                  : "bg-surface-1 text-text-muted border border-border hover:text-text"
              }`}
            >
              {st}
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
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-surface-2/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-sans font-semibold text-text">{s.creatorName}</div>
                    <div className="text-[11px] text-text-subtle">{s.creatorHandle}</div>
                  </td>

                  <td className="py-3 px-4 font-sans">
                    <Link
                      href={`/campaigns/${s.campaignSlug}`}
                      target="_blank"
                      className="font-medium text-text hover:text-accent transition-colors block text-xs"
                    >
                      {s.campaignTitle}
                    </Link>
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
                      <div className="text-[11px] text-danger mt-1 italic">
                        Reason: {s.rejectionReason}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 capitalize text-text">
                      <PlatformIcon platform={s.platform} className="w-3.5 h-3.5" />
                      <span>{s.platform.replace("_", " ")}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    {s.status === "pending" ? (
                      <input
                        type="number"
                        value={s.verifiedViews}
                        onChange={(e) => handleUpdateViews(s.id, parseInt(e.target.value) || 0)}
                        className="w-24 rounded border border-border bg-surface-2 px-2 py-1 text-right text-xs font-mono text-text focus:outline-none"
                      />
                    ) : (
                      <span className="font-semibold text-text tabular-nums">{formatNumber(s.verifiedViews)}</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-accent tabular-nums">
                    {formatCurrency(s.rewardAmount)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {s.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(s.id)}
                          className="flex items-center gap-1 rounded bg-success/20 border border-success/30 px-2.5 py-1 text-[11px] font-semibold text-success hover:bg-success/30 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => setRejectingId(s.id)}
                          className="flex items-center gap-1 rounded bg-danger/20 border border-danger/30 px-2.5 py-1 text-[11px] font-semibold text-danger hover:bg-danger/30 transition-colors"
                        >
                          <XCircle className="w-3 h-3" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : s.status === "verified" ? (
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
              ))}
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
              placeholder="e.g. Missing required campaign hashtags, duplicate URL, or non-compliant video format..."
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
                className="rounded bg-danger px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
