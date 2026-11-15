"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { sampleCreators, initialCampaigns } from "@/lib/data";
import { formatCurrency, formatNumber, formatDate } from "@/lib/utils";
import { PlatformIcon } from "@/components/PlatformIcons";
import {
  ShieldCheck,
  Plus,
  Check,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { PlatformType } from "@/types";

export default function ProfilePage() {
  const creator = sampleCreators[0];
  const [activeTab, setActiveTab] = useState<"submissions" | "earnings" | "settings">("submissions");
  const [bio, setBio] = useState(creator.bio);
  const [socials, setSocials] = useState(creator.socialAccounts);
  const [saved, setSaved] = useState(false);

  // Submissions state
  const [submissions, setSubmissions] = useState<any[]>([
    {
      id: "sub-101",
      campaignTitle: "Cursor AI — Next-Gen Code Editor Launch",
      campaignSlug: "cursor-ai-launch",
      platform: "tiktok",
      contentUrl: "https://www.tiktok.com/@alex_builds/video/729104829104",
      submittedAt: "2026-11-10T14:20:00Z",
      status: "verified",
      viewsVerified: 148200,
      rewardEarned: 3260.4,
      payoutStatus: "settled",
    },
    {
      id: "sub-102",
      campaignTitle: "Cursor AI — Next-Gen Code Editor Launch",
      campaignSlug: "cursor-ai-launch",
      platform: "youtube_shorts",
      contentUrl: "https://youtube.com/shorts/k920aLkm2",
      submittedAt: "2026-11-12T09:15:00Z",
      status: "reviewing",
      viewsVerified: 32400,
      rewardEarned: 712.8,
      payoutStatus: "pending_audit",
    },
    {
      id: "sub-103",
      campaignTitle: "Perplexity AI — Deep Research Mode",
      campaignSlug: "perplexity-deep-research",
      platform: "tiktok",
      contentUrl: "https://www.tiktok.com/@alex_builds/video/73019283921",
      submittedAt: "2026-11-05T18:00:00Z",
      status: "paid",
      viewsVerified: 201800,
      rewardEarned: 4439.6,
      payoutStatus: "settled",
    },
  ]);

  // Read any newly created local submissions from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("collabefy_submissions") || "[]");
        if (stored.length > 0) {
          setSubmissions((prev) => [...stored, ...prev]);
        }
      } catch {}
    }
  }, []);

  const totalEarned = submissions.reduce((acc, s) => acc + (s.rewardEarned || 0), 0);
  const totalViews = submissions.reduce((acc, s) => acc + (s.viewsVerified || 0), 0);

  // New social field
  const [newPlatform, setNewPlatform] = useState<PlatformType>("tiktok");
  const [newHandle, setNewHandle] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAddSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHandle || !newUrl) return;
    setSocials([
      ...socials,
      {
        id: `sa-${Date.now()}`,
        platform: newPlatform,
        handle: newHandle,
        profileUrl: newUrl,
        status: "unverified",
        verificationMethod: "manual_link",
        connectedAt: new Date().toISOString(),
      },
    ]);
    setNewHandle("");
    setNewUrl("");
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="py-12 md:py-16">
      <div className="container-fluid">
        {/* Creator Header Profile Card */}
        <div className="rounded-xl border border-border bg-surface-1 p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <img
                src={creator.avatarUrl}
                alt={creator.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-border shadow-md"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold text-text">{creator.name}</h1>
                  <span className="rounded bg-accent/10 border border-accent/20 px-2 py-0.5 text-xs font-mono text-accent font-semibold">
                    CREATOR
                  </span>
                </div>
                <div className="text-xs font-mono text-text-subtle mt-1">
                  @{creator.username} • {creator.email}
                </div>
                <p className="text-xs text-text-muted mt-2 max-w-xl leading-relaxed">{bio}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/campaigns"
                className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity"
              >
                <span>Browse Campaigns</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-border/80">
            <div className="rounded-lg border border-border/60 bg-surface-2 p-3.5">
              <span className="text-[11px] font-mono text-text-subtle uppercase">Total Verified Views</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-text tabular-nums mt-1 block">
                {formatNumber(totalViews)}
              </span>
            </div>
            <div className="rounded-lg border border-border/60 bg-surface-2 p-3.5">
              <span className="text-[11px] font-mono text-text-subtle uppercase">Total Earnings</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-accent tabular-nums mt-1 block">
                {formatCurrency(totalEarned)}
              </span>
            </div>
            <div className="rounded-lg border border-border/60 bg-surface-2 p-3.5">
              <span className="text-[11px] font-mono text-text-subtle uppercase">Campaign Submissions</span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-text tabular-nums mt-1 block">
                {submissions.length}
              </span>
            </div>
            <div className="rounded-lg border border-border/60 bg-surface-2 p-3.5">
              <span className="text-[11px] font-mono text-text-subtle uppercase">Payout Status</span>
              <span className="text-sm font-mono text-success flex items-center gap-1.5 mt-2 font-semibold">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>Weekly Direct Pay Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-border mb-8">
          <button
            onClick={() => setActiveTab("submissions")}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "submissions"
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            My Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setActiveTab("earnings")}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "earnings"
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Earnings & Payouts
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "settings"
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Profile & Channels
          </button>
        </div>

        {/* Tab 1: Submissions */}
        {activeTab === "submissions" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-text">Content Submissions & Audit Status</h3>
                  <span className="text-xs text-text-subtle">
                    Audited by Collabefy view verification algorithm 48 hours post-publication.
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-border text-text-subtle bg-surface-2/40">
                      <th className="py-3 px-4 font-medium">Campaign</th>
                      <th className="py-3 px-4 font-medium">Platform</th>
                      <th className="py-3 px-4 font-medium">Submitted</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium text-right">Verified Views</th>
                      <th className="py-3 px-4 font-medium text-right">Reward Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-surface-2/30 transition-colors">
                        <td className="py-3.5 px-4 font-sans">
                          <Link
                            href={`/campaigns/${sub.campaignSlug || "cursor-ai-launch"}`}
                            className="font-semibold text-text hover:text-accent transition-colors block"
                          >
                            {sub.campaignTitle}
                          </Link>
                          <a
                            href={sub.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-mono text-text-subtle hover:text-text flex items-center gap-1 mt-0.5 truncate max-w-xs"
                          >
                            <span>{sub.contentUrl}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 capitalize text-text">
                            <PlatformIcon platform={sub.platform} className="w-3.5 h-3.5" />
                            <span>{sub.platform.replace("_", " ")}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-text-subtle">{formatDate(sub.submittedAt)}</td>
                        <td className="py-3.5 px-4">
                          {sub.status === "verified" || sub.status === "paid" ? (
                            <span className="inline-flex items-center gap-1 rounded bg-success/10 text-success border border-success/20 px-2 py-0.5 text-[10px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{sub.status === "paid" ? "Paid Out" : "Verified"}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded bg-warning/10 text-warning border border-warning/20 px-2 py-0.5 text-[10px] font-semibold">
                              <Clock className="w-3 h-3" />
                              <span>In Audit Window</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right font-medium text-text tabular-nums">
                          {formatNumber(sub.viewsVerified)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-accent tabular-nums">
                          {formatCurrency(sub.rewardEarned)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Earnings & Payouts */}
        {activeTab === "earnings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-2">
                <span className="text-xs font-mono text-text-subtle uppercase">Settled Lifetime Earnings</span>
                <div className="text-3xl font-bold font-mono text-accent tabular-nums">
                  {formatCurrency(totalEarned)}
                </div>
                <p className="text-xs text-text-muted pt-2">Disbursed to primary verified bank account.</p>
              </div>

              <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-2">
                <span className="text-xs font-mono text-text-subtle uppercase">Pending Audit Volume</span>
                <div className="text-3xl font-bold font-mono text-warning tabular-nums">
                  {formatCurrency(712.8)}
                </div>
                <p className="text-xs text-text-muted pt-2">Scheduled for disbursement on upcoming Friday settlement.</p>
              </div>

              <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-2">
                <span className="text-xs font-mono text-text-subtle uppercase">Payout Method</span>
                <div className="flex items-center gap-2 pt-1">
                  <span className="rounded bg-surface-2 border border-border px-2 py-1 text-xs font-mono text-text font-medium">
                    Stripe Direct (•••• 4920)
                  </span>
                  <span className="text-xs text-success font-mono font-semibold">Active</span>
                </div>
                <p className="text-xs text-text-muted pt-2">Automatic ACH & wire distribution.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Settings & Channels */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-3xl">
            {/* Bio */}
            <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                  Creator Profile Details
                </span>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 rounded-md bg-accent px-4 py-1.5 text-xs font-semibold text-accent-ink hover:opacity-95 transition-opacity"
                >
                  {saved ? <Check className="w-3.5 h-3.5" /> : null}
                  <span>{saved ? "Saved" : "Save Changes"}</span>
                </button>
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle block mb-1.5">Bio Narrative</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface-2 p-3 text-sm text-text placeholder:text-text-subtle focus:border-accent focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Social channels */}
            <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-5">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent block">
                Connected Creator Social Channels
              </span>

              <div className="space-y-3">
                {socials.map((sa) => (
                  <div
                    key={sa.id}
                    className="flex items-center justify-between rounded-md border border-border bg-surface-2 p-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={sa.platform} className="w-4 h-4 text-text" />
                      <div>
                        <span className="font-semibold text-text">{sa.handle}</span>
                        <a
                          href={sa.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-subtle hover:text-accent flex items-center gap-1 text-[11px] font-mono mt-0.5"
                        >
                          <span>{sa.profileUrl}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {sa.status === "verified" ? (
                        <span className="inline-flex items-center gap-1 rounded bg-success/10 text-success border border-success/20 px-2 py-0.5 font-mono text-[10px]">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified OAuth</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-surface-3 text-text-subtle border border-border px-2 py-0.5 font-mono text-[10px]">
                          <span>Linked Channel</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add form */}
              <form onSubmit={handleAddSocial} className="pt-4 border-t border-border space-y-3">
                <span className="text-xs font-mono text-text-subtle uppercase block">Link Additional Channel</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as PlatformType)}
                    className="rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
                  >
                    <option value="tiktok">TikTok</option>
                    <option value="youtube_shorts">YouTube Shorts</option>
                    <option value="instagram_reels">Instagram Reels</option>
                    <option value="x">X / Twitter</option>
                  </select>
                  <input
                    type="text"
                    placeholder="@handle"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    className="rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text placeholder:text-text-subtle focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text placeholder:text-text-subtle focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-md bg-surface-2 border border-border px-3.5 py-2 text-xs font-medium text-text hover:bg-surface-3 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-accent" />
                  <span>Connect Channel</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
