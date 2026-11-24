"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiGet, apiPost } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import { PlatformIcon } from "@/components/PlatformIcons";
import {
  CheckCircle2,
  AlertCircle,
  History,
  Send,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Clock,
  Layers,
  Globe,
  Sparkles,
  ArrowRight,
  User,
} from "lucide-react";

interface SubmissionVersion {
  id: string;
  versionNumber: number;
  instagramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  otherPlatform?: string;
  otherPlatformUrl?: string;
  category?: string;
  bio?: string;
  portfolioUrl?: string;
  submittedAt: string;
}

interface WebsiteSubmissionData {
  id: string;
  userId: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  otherPlatform?: string;
  otherPlatformUrl?: string;
  category?: string;
  bio?: string;
  portfolioUrl?: string;
  status: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  currentVersion: number;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  versions?: SubmissionVersion[];
}

export default function WebsiteSubmissionDashboardPage() {
  const [submission, setSubmission] = useState<WebsiteSubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  // Form inputs
  const [formData, setFormData] = useState({
    instagramUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
    otherPlatform: "",
    otherPlatformUrl: "",
    category: "Developer Tools & AI",
    bio: "",
    portfolioUrl: "",
  });

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      // Verify login
      const meRes = await apiGet<{ success: boolean; data: { user: any } }>("/api/v1/auth/me").catch(() => null);
      if (!meRes?.data?.user) {
        if (typeof window !== "undefined") {
          window.location.href = "/login?redirect=/submissions/dashboard";
        }
        return;
      }

      const res = await apiGet<{ success: boolean; data: WebsiteSubmissionData | null }>(
        "/api/v1/submissions/website/me"
      );

      if (res?.data) {
        setSubmission(res.data);
        setFormData({
          instagramUrl: res.data.instagramUrl || "",
          youtubeUrl: res.data.youtubeUrl || "",
          tiktokUrl: res.data.tiktokUrl || "",
          otherPlatform: res.data.otherPlatform || "",
          otherPlatformUrl: res.data.otherPlatformUrl || "",
          category: res.data.category || "Developer Tools & AI",
          bio: res.data.bio || "",
          portfolioUrl: res.data.portfolioUrl || "",
        });
      } else {
        setShowEditForm(true); // Open form if first-time submitter
      }
    } catch (err: any) {
      console.error("Failed to load creator submission:", err);
      setErrorMessage("Server is busy please open a ticket 🎟️ from support section");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmission();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const hasLink =
      Boolean(formData.instagramUrl.trim()) ||
      Boolean(formData.youtubeUrl.trim()) ||
      Boolean(formData.tiktokUrl.trim()) ||
      Boolean(formData.otherPlatformUrl.trim()) ||
      Boolean(formData.portfolioUrl.trim());

    if (!hasLink) {
      setErrorMessage("Please provide at least one active profile URL or portfolio link.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiPost<{ success: boolean; message: string; data: WebsiteSubmissionData }>(
        "/api/v1/submissions/website/me",
        {
          ...formData,
        }
      );

      if (res?.data) {
        setSubmission(res.data);
        setSuccessMessage(res.message || "Creator submission saved successfully!");
        setShowEditForm(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Server is busy please open a ticket 🎟️ from support section");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center min-h-[70vh]">
        <div className="flex items-center gap-3 text-xs font-mono text-text-subtle">
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
          <span>Loading creator submission portal...</span>
        </div>
      </div>
    );
  }

  const statusConfig = {
    PENDING: { label: "PENDING REVIEW", color: "text-warning bg-warning/10 border-warning/30" },
    UNDER_REVIEW: { label: "UNDER MODERATION", color: "text-accent bg-accent/10 border-accent/30" },
    APPROVED: { label: "APPROVED CREATOR", color: "text-success bg-success/10 border-success/30" },
    REJECTED: { label: "REVISION REQUESTED", color: "text-danger bg-danger/10 border-danger/30" },
  }[submission?.status || "PENDING"];

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
              Creator Portal
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-text">
              Website Creator Submissions
            </h1>
            <p className="mt-1.5 text-xs text-text-muted">
              Manage your verified social handles, niche category, and track moderation approval across version updates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-semibold text-text hover:bg-surface-3 transition-colors"
            >
              Back to Profile
            </Link>
            {submission && !showEditForm && (
              <button
                type="button"
                onClick={() => setShowEditForm(true)}
                className="rounded-md bg-accent px-4 py-1.5 text-xs font-semibold text-accent-ink hover:opacity-95 shadow transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update Submission</span>
              </button>
            )}
          </div>
        </div>

        {/* Success / Error Banners */}
        {successMessage && (
          <div className="rounded-lg border border-accent/40 bg-accent/10 p-4 flex items-center gap-3 text-xs text-accent font-mono">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 flex items-start gap-3 text-xs text-danger font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div>{errorMessage}</div>
              {errorMessage.includes("ticket") && (
                <div className="pt-1">
                  <a
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-[11px] underline text-danger hover:text-white transition-colors"
                  >
                    <span>Open support / contact page &rarr;</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current Active Submission Card */}
        {submission && !showEditForm && (
          <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-mono font-bold ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
                <span className="text-xs font-mono text-text-muted">
                  Version <span className="text-text font-bold">v{submission.currentVersion}</span>
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-text-subtle">
                <span>Submitted: {formatDate(submission.createdAt)}</span>
                <span>Updated: {formatDate(submission.updatedAt)}</span>
              </div>
            </div>

            {/* Social Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {submission.tiktokUrl && (
                <a
                  href={submission.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border bg-surface-2 p-3 flex items-center justify-between text-xs hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <PlatformIcon platform="tiktok" className="w-4 h-4 shrink-0 text-text" />
                    <span className="font-mono text-text truncate">TikTok</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-text-subtle shrink-0 ml-2" />
                </a>
              )}

              {submission.youtubeUrl && (
                <a
                  href={submission.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border bg-surface-2 p-3 flex items-center justify-between text-xs hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <PlatformIcon platform="youtube_shorts" className="w-4 h-4 shrink-0 text-danger" />
                    <span className="font-mono text-text truncate">YouTube</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-text-subtle shrink-0 ml-2" />
                </a>
              )}

              {submission.instagramUrl && (
                <a
                  href={submission.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border bg-surface-2 p-3 flex items-center justify-between text-xs hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <PlatformIcon platform="instagram" className="w-4 h-4 shrink-0 text-accent" />
                    <span className="font-mono text-text truncate">Instagram</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-text-subtle shrink-0 ml-2" />
                </a>
              )}

              {submission.otherPlatform && submission.otherPlatformUrl && (
                <a
                  href={submission.otherPlatformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border bg-surface-2 p-3 flex items-center justify-between text-xs hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Globe className="w-4 h-4 shrink-0 text-accent" />
                    <span className="font-mono text-text truncate">{submission.otherPlatform}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-text-subtle shrink-0 ml-2" />
                </a>
              )}

              {submission.portfolioUrl && (
                <a
                  href={submission.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-border bg-surface-2 p-3 flex items-center justify-between text-xs hover:border-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Sparkles className="w-4 h-4 shrink-0 text-accent" />
                    <span className="font-mono text-text truncate">Portfolio Site</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-text-subtle shrink-0 ml-2" />
                </a>
              )}
            </div>

            {/* Category & Bio */}
            <div className="space-y-3 pt-2 border-t border-border">
              {submission.category && (
                <div className="text-xs">
                  <span className="font-mono text-text-subtle">Primary Niche: </span>
                  <span className="font-semibold text-text">{submission.category}</span>
                </div>
              )}
              {submission.bio && (
                <div className="text-xs text-text-muted leading-relaxed bg-surface-2/60 p-3.5 rounded-lg border border-border">
                  {submission.bio}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submission / Edit Form */}
        {(showEditForm || !submission) && (
          <div className="rounded-xl border border-border bg-surface-1 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-text flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>{submission ? `Update Submission (Version ${submission.currentVersion + 1})` : "Submit Creator Profile"}</span>
              </h2>
              {submission && (
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="text-xs font-mono text-text-subtle hover:text-text"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Niche Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text-subtle uppercase block">
                  Primary Content Niche / Genre
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text focus:border-accent focus:outline-none"
                >
                  <option value="Developer Tools & AI">Developer Tools & AI</option>
                  <option value="Productivity & SaaS">Productivity & SaaS</option>
                  <option value="Gaming & Esports">Gaming & Esports</option>
                  <option value="Consumer Tech & Hardware">Consumer Tech & Hardware</option>
                  <option value="Finance & Crypto">Finance & Crypto</option>
                  <option value="Education & How-To">Education & How-To</option>
                  <option value="Lifestyle & Entertainment">Lifestyle & Entertainment</option>
                </select>
              </div>

              {/* Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                    <PlatformIcon platform="tiktok" className="w-3.5 h-3.5" />
                    <span>TikTok Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.tiktokUrl}
                    onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                    placeholder="https://tiktok.com/@handle"
                    className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                    <PlatformIcon platform="youtube_shorts" className="w-3.5 h-3.5 text-danger" />
                    <span>YouTube Channel URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/@handle"
                    className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                    <PlatformIcon platform="instagram" className="w-3.5 h-3.5 text-accent" />
                    <span>Instagram Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/handle"
                    className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span>Portfolio / Website Link</span>
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://yourportfolio.dev"
                    className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Other Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted">Other Platform Name</label>
                  <input
                    type="text"
                    value={formData.otherPlatform}
                    onChange={(e) => setFormData({ ...formData, otherPlatform: e.target.value })}
                    placeholder="e.g. X, Twitch, Substack"
                    className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted">Corresponding Profile URL</label>
                  <input
                    type="url"
                    value={formData.otherPlatformUrl}
                    onChange={(e) => setFormData({ ...formData, otherPlatformUrl: e.target.value })}
                    placeholder="https://x.com/handle"
                    className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Bio & Pitch */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text-subtle uppercase block">
                  Creator Bio & Audience Pitch
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Outline your content focus, typical video hooks, average viewer engagement rate..."
                  className="w-full rounded-md border border-border bg-surface-2 p-3 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-2.5 text-xs font-semibold text-accent-ink hover:opacity-95 shadow transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-accent-ink border-t-transparent animate-spin" />
                    <span>Saving Version...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{submission ? "Save & Create New Version" : "Submit Creator Profile"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Version History Section */}
        {submission?.versions && submission.versions.length > 0 && (
          <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <History className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-text">
                Submission Version History ({submission.versions.length} {submission.versions.length === 1 ? "Version" : "Versions"})
              </h3>
            </div>

            <div className="space-y-3">
              {submission.versions.map((ver) => (
                <div
                  key={ver.id}
                  className={`rounded-lg border p-4 space-y-2 transition-all ${
                    ver.versionNumber === submission.currentVersion
                      ? "border-accent/40 bg-surface-2/70"
                      : "border-border/60 bg-surface-2/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-text">v{ver.versionNumber}</span>
                      {ver.versionNumber === submission.currentVersion && (
                        <span className="rounded bg-accent/20 px-1.5 py-0.2 text-[10px] font-mono text-accent font-semibold">
                          CURRENT ACTIVE
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-text-subtle">
                      Recorded: {formatDate(ver.submittedAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono">
                    {ver.tiktokUrl && (
                      <span className="rounded bg-surface-3 px-2 py-0.5 text-text-muted truncate max-w-[200px]">
                        TikTok: {ver.tiktokUrl}
                      </span>
                    )}
                    {ver.youtubeUrl && (
                      <span className="rounded bg-surface-3 px-2 py-0.5 text-text-muted truncate max-w-[200px]">
                        YouTube: {ver.youtubeUrl}
                      </span>
                    )}
                    {ver.instagramUrl && (
                      <span className="rounded bg-surface-3 px-2 py-0.5 text-text-muted truncate max-w-[200px]">
                        Instagram: {ver.instagramUrl}
                      </span>
                    )}
                    {ver.otherPlatform && (
                      <span className="rounded bg-surface-3 px-2 py-0.5 text-text-muted truncate max-w-[200px]">
                        {ver.otherPlatform}: {ver.otherPlatformUrl}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
