"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlatformIcon } from "./PlatformIcons";
import { PlatformType } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2, Send, X, AlertCircle, LogIn, UserPlus } from "lucide-react";

interface CampaignApplyModalProps {
  campaignId: string;
  campaignTitle: string;
  rewardRate: number;
  platforms: PlatformType[];
}

export function CampaignApplyModal({
  campaignId,
  campaignTitle,
  rewardRate,
  platforms,
}: CampaignApplyModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState<PlatformType>(platforms[0] || "tiktok");
  const [contentUrl, setContentUrl] = useState("");
  const [creatorHandle, setCreatorHandle] = useState("");
  const [estimatedViews, setEstimatedViews] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("collabefy_token") || localStorage.getItem("collabefy_admin_token");
      setIsLoggedIn(Boolean(token));
      const storedEmail = localStorage.getItem("collabefy_email");
      try {
        const storedUser = JSON.parse(localStorage.getItem("collabefy_user") || "{}");
        if (storedUser.creatorProfile?.handle) {
          setCreatorHandle(`@${storedUser.creatorProfile.handle}`);
        } else if (storedEmail) {
          setCreatorHandle(`@${storedEmail.split("@")[0]}`);
        }
      } catch {}
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = typeof window !== "undefined"
      ? localStorage.getItem("collabefy_token") || localStorage.getItem("collabefy_admin_token")
      : null;

    if (!token) {
      setError("Please sign in or register to submit content and receive performance rewards.");
      return;
    }

    if (!contentUrl.trim() || !creatorHandle.trim()) {
      setError("Please provide your social handle and published video link.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaignId,
          platform,
          contentUrl: contentUrl.trim(),
          creatorHandle: creatorHandle.trim(),
          estimatedViews: parseInt(estimatedViews) || 0,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to submit content to database.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Submission failed. Please verify that your account is active.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setIsSuccess(false);
          setError(null);
        }}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-semibold text-accent-ink hover:opacity-95 transition-all shadow-sm"
      >
        <Send className="w-4 h-4" />
        <span>Submit Content for Review</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-xl border border-border bg-surface-1 p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-medium text-accent uppercase">
                  Submission Portal
                </span>
                <h3 className="text-lg font-semibold text-text mt-0.5">
                  Submit Content: {campaignTitle}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md p-1.5 text-text-subtle hover:text-text hover:bg-surface-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isSuccess ? (
              <div className="rounded-lg border border-border bg-surface-2 p-6 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-base font-semibold text-text">Content Submitted to Database</h4>
                <p className="text-xs text-text-muted leading-relaxed max-w-xs mx-auto">
                  Your clip is recorded and queued for the 48-hour organic view audit. Once verified by our administrators, earnings (
                  {formatCurrency(rewardRate)}/1k views) will be automatically credited to your creator balance.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/profile"
                    className="rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 shadow"
                  >
                    View in Creator Workspace
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-md border border-border bg-surface-1 px-4 py-2 text-xs font-medium text-text hover:bg-surface-3"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : !isLoggedIn ? (
              <div className="rounded-lg border border-border bg-surface-2 p-6 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-3 text-text-muted">
                  <LogIn className="w-6 h-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-semibold text-text">Creator Sign-In Required</h4>
                  <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
                    To ensure view audits are attributed to your account and earnings can be withdrawn, please sign in or register before submitting.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <Link
                    href={`/login?redirect=/campaigns`}
                    className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 shadow"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-1.5 rounded-md border border-border bg-surface-1 px-4 py-2 text-xs font-medium text-text hover:bg-surface-3"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Creator Account</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/10 p-3 text-xs text-danger font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Platform select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-subtle uppercase">
                    Publishing Platform
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {platforms.map((p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`flex items-center justify-center gap-1.5 rounded-md border p-2 text-xs font-medium capitalize transition-colors ${
                          platform === p
                            ? "border-accent bg-accent/10 text-accent font-semibold"
                            : "border-border bg-surface-2 text-text-muted hover:text-text"
                        }`}
                      >
                        <PlatformIcon platform={p} className="w-3.5 h-3.5" />
                        <span>{p.replace("_", " ")}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Social handle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-subtle uppercase">
                    Your Creator Handle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@yourhandle"
                    value={creatorHandle}
                    onChange={(e) => setCreatorHandle(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Published Video URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-subtle uppercase">
                    Published Content / Post URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.tiktok.com/@handle/video/..."
                    value={contentUrl}
                    onChange={(e) => setContentUrl(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Current Views (estimate) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-subtle uppercase">
                    Current View Count (at time of submission)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 15000"
                    value={estimatedViews}
                    onChange={(e) => setEstimatedViews(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-md border border-border bg-surface-2 px-4 py-2 text-xs font-medium text-text hover:bg-surface-3 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 rounded-md bg-accent px-5 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity disabled:opacity-50 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Submitting to Database..." : "Submit for 48h Audit"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
