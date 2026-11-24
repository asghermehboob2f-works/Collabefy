"use client";

import React, { useState } from "react";
import { siteConfig } from "@/site.config";
import {
  CheckCircle2,
  AlertCircle,
  Send,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Globe,
  Plus,
  ArrowRight,
} from "lucide-react";
import { PlatformIcon } from "@/components/PlatformIcons";

export default function DiscordSubmissionsPage() {
  const [formData, setFormData] = useState({
    discordUsername: "",
    instagramUrl: "",
    youtubeUrl: "",
    tiktokUrl: "",
    otherPlatform: "",
    otherPlatformUrl: "",
    additionalInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    version: number;
    isUpdate: boolean;
    discordUsername: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const discordTrimmed = formData.discordUsername.trim();
    if (!discordTrimmed) {
      setErrorMessage("Please provide your Discord username.");
      return;
    }

    // Require at least one social media link
    const hasSocialLink =
      Boolean(formData.instagramUrl.trim()) ||
      Boolean(formData.youtubeUrl.trim()) ||
      Boolean(formData.tiktokUrl.trim()) ||
      Boolean(formData.otherPlatformUrl.trim());

    if (!hasSocialLink) {
      setErrorMessage("Please provide at least one social media profile URL (Instagram, YouTube, TikTok, or Other).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/v1/submissions/discord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discordUsername: discordTrimmed,
          instagramUrl: formData.instagramUrl.trim(),
          youtubeUrl: formData.youtubeUrl.trim(),
          tiktokUrl: formData.tiktokUrl.trim(),
          otherPlatform: formData.otherPlatform.trim(),
          otherPlatformUrl: formData.otherPlatformUrl.trim(),
          additionalInfo: formData.additionalInfo.trim(),
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status >= 500) {
          throw new Error("Server is busy please open a ticket 🎟️ from support section");
        }

        const errorDetail =
          json?.error?.details?.map((d: any) => d.message).join(". ") ||
          json?.error?.message ||
          json?.error ||
          json?.message;

        throw new Error(errorDetail || "Server is busy please open a ticket 🎟️ from support section");
      }

      setSubmissionResult({
        success: true,
        message: json.message || "Creator profile submitted successfully!",
        version: json.data?.currentVersion || 1,
        isUpdate: json.data?.isUpdate || false,
        discordUsername: json.data?.discordUsername || discordTrimmed,
      });
    } catch (err: any) {
      if (
        !err?.message ||
        err.message.includes("fetch") ||
        err.message.includes("network") ||
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError") ||
        err.message.includes("Server is busy")
      ) {
        setErrorMessage("Server is busy please open a ticket 🎟️ from support section");
      } else {
        setErrorMessage(err.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForResubmit = () => {
    setSubmissionResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="py-12 sm:py-20 min-h-[90vh]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-mono text-accent">
            <PlatformIcon platform="discord" className="w-3.5 h-3.5" />
            <span>Direct Community Channel</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text">
            Submissions
          </h1>
          <p className="text-sm text-text-muted max-w-lg mx-auto leading-relaxed">
            Submit your creator profile and active social channels for verification. Once approved, you'll be assigned eligible campaign roles directly inside our Discord server.
          </p>
        </div>

        {/* Confirmation Screen */}
        {submissionResult ? (
          <div className="rounded-xl border border-accent/40 bg-surface-1 p-8 sm:p-10 text-center space-y-6 shadow-xl animate-fade-in">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent border border-accent/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="inline-block rounded bg-accent/20 px-2.5 py-0.5 text-xs font-mono text-accent font-semibold uppercase tracking-wider">
                Version {submissionResult.version} {submissionResult.isUpdate ? "Updated" : "Created"}
              </span>
              <h2 className="text-2xl font-bold text-text">Submission Received</h2>
              <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
                Thank you! Your submission for{" "}
                <span className="font-mono text-text font-semibold">@{submissionResult.discordUsername}</span> has been
                safely recorded in our verification queue.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-surface-2 p-4 text-left text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-text-subtle">
                <span>Verification Status:</span>
                <span className="text-warning font-semibold">PENDING REVIEW</span>
              </div>
              <div className="flex items-center justify-between text-text-subtle">
                <span>Recorded Version:</span>
                <span className="text-text font-semibold">v{submissionResult.version}</span>
              </div>
              <div className="flex items-center justify-between text-text-subtle">
                <span>Audit Period:</span>
                <span className="text-text">Within 24 Hours</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={handleResetForResubmit}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface-2 px-5 py-2.5 text-xs font-semibold text-text hover:bg-surface-3 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update Submission Info</span>
              </button>
              <a
                href={siteConfig.links.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-xs font-semibold text-accent-ink hover:opacity-95 shadow transition-all"
              >
                <PlatformIcon platform="discord" className="w-3.5 h-3.5" />
                <span>Return to Discord</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <div className="rounded-xl border border-border bg-surface-1 p-6 sm:p-8 space-y-6 shadow-xl">
            {errorMessage && (
              <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 flex items-start gap-3 text-xs text-danger font-mono leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div>{errorMessage}</div>
                  {errorMessage.includes("ticket") && (
                    <div className="pt-1">
                      <a
                        href="/contact"
                        className="inline-flex items-center gap-1.5 text-[11px] underline text-danger hover:text-white transition-colors"
                      >
                        <span>Open support / contact page</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Discord Identity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-semibold uppercase tracking-wider text-text flex items-center gap-1.5">
                    <PlatformIcon platform="discord" className="w-4 h-4 text-accent" />
                    <span>Discord Username</span>
                    <span className="text-danger">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-text-subtle">e.g. dev_alex or alex#1234</span>
                </div>
                <input
                  type="text"
                  required
                  value={formData.discordUsername}
                  onChange={(e) => setFormData({ ...formData, discordUsername: e.target.value })}
                  placeholder="your_discord_handle"
                  className="w-full rounded-md border border-border bg-surface-2 px-4 py-3 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
                />
                <p className="text-[11px] text-text-subtle">
                  Enter your exact Discord username. If updating, use the same username to automatically preserve and version your history.
                </p>
              </div>

              {/* Social Channels Section */}
              <div className="pt-2 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-text">
                    Creator Channels & Social Links
                  </h3>
                  <span className="text-[11px] font-mono text-accent">At least 1 required</span>
                </div>

                {/* TikTok */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                    <PlatformIcon platform="tiktok" className="w-3.5 h-3.5 text-text" />
                    <span>TikTok Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.tiktokUrl}
                    onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                    placeholder="https://www.tiktok.com/@yourhandle"
                    className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
                  />
                </div>

                {/* YouTube */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                    <PlatformIcon platform="youtube_shorts" className="w-3.5 h-3.5 text-danger" />
                    <span>YouTube Channel / Shorts URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/@yourchannel"
                    className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                    <PlatformIcon platform="instagram" className="w-3.5 h-3.5 text-accent" />
                    <span>Instagram Profile URL</span>
                  </label>
                  <input
                    type="url"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://www.instagram.com/yourhandle"
                    className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
                  />
                </div>

                {/* Other Platform */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-text-muted flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-text-subtle" />
                      <span>Other Platform Name</span>
                    </label>
                    <input
                      type="text"
                      value={formData.otherPlatform}
                      onChange={(e) => setFormData({ ...formData, otherPlatform: e.target.value })}
                      placeholder="e.g. Twitch, X, Kick"
                      className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-text-muted">
                      Corresponding URL
                    </label>
                    <input
                      type="url"
                      value={formData.otherPlatformUrl}
                      onChange={(e) => setFormData({ ...formData, otherPlatformUrl: e.target.value })}
                      placeholder="https://x.com/yourhandle"
                      className="w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="pt-2 border-t border-border space-y-1.5">
                <label className="text-xs font-mono text-text-subtle uppercase block">
                  Additional Creator Information (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  placeholder="Share your primary content niche (e.g. Dev Tools, AI, Gaming), audience demographics, or portfolio links..."
                  className="w-full rounded-md border border-border bg-surface-2 p-3 text-xs text-text placeholder:text-text-subtle focus:border-accent focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-xs font-semibold text-accent-ink hover:opacity-95 shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-accent-ink border-t-transparent animate-spin" />
                      <span>Recording Submission...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Creator Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
