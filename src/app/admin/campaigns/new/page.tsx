"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createCampaign } from "@/lib/data";
import { PlatformType, CampaignType, RewardUnit, CampaignStatus } from "@/types";
import { ArrowLeft, Save, Eye, CheckCircle2 } from "lucide-react";

export default function NewCampaignPage() {
  const [submitted, setSubmitted] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    brandName: "",
    brandCategory: "Developer Tools",
    summary: "",
    description: "",
    campaignType: "developer_tools" as CampaignType,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    status: "active" as CampaignStatus,
    currency: "USD",
    totalBudget: 25000,
    allocatedBudget: 0,
    budgetVisibility: "public" as const,
    rewardRate: 20.0,
    rewardUnit: "per_1000_views" as RewardUnit,
    rewardVisibility: "public" as const,
    platforms: ["tiktok", "youtube_shorts"] as PlatformType[],
    applicationRequired: false,
    featured: true,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    timeZone: "UTC",
    verifiedViews: 0,
    approvedClips: 0,
    activeCreators: 0,
    discordInviteUrl: "https://discord.gg/collabefy",
    discordChannelName: "#campaign-new",
    leaderboardEnabled: true,
    brief: {
      objective: "Demonstrate developer speed and clean user experience.",
      targetAudience: ["Fullstack engineers", "Tech creators"],
      coreNarrative: "Show real-world workflow with clear code diffs.",
      talkingPoints: ["Fast onboarding", "TypeScript native", "Built for developers"],
      assets: [],
    },
    rules: [
      {
        id: "r1",
        category: "format" as const,
        title: "Accepted Video Formats",
        detail: "9:16 vertical video only, 30s to 90s length.",
      },
      {
        id: "r2",
        category: "hashtag" as const,
        title: "Required Mentions & Tags",
        detail: "Include official campaign hashtag and pin link in comments.",
      },
    ],
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setForm({ ...form, title, slug });
  };

  const handlePlatformToggle = (platform: PlatformType) => {
    setForm((prev) => {
      const exists = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: exists ? prev.platforms.filter((p) => p !== platform) : [...prev.platforms, platform],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const camp = createCampaign(form);
    setCreatedSlug(camp.slug);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns"
            className="p-1.5 rounded-md border border-border bg-surface-2 text-text-subtle hover:text-text"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text">Create New Campaign</h1>
            <p className="text-xs text-text-muted">
              Configure rates, escrow allocation, brief, rules, and Discord channel routing.
            </p>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className="rounded-lg border border-border bg-surface-1 p-10 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-accent mx-auto" />
          <h2 className="text-lg font-semibold text-text">Campaign Successfully Published</h2>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            The campaign is now live in the database and visible in the public directory and homepage.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href={`/campaigns/${createdSlug}`}
              target="_blank"
              className="rounded-md bg-accent px-4 py-2 text-xs font-semibold text-accent-ink hover:opacity-95"
            >
              View Public Page
            </Link>
            <Link
              href="/admin/campaigns"
              className="rounded-md border border-border bg-surface-2 px-4 py-2 text-xs font-medium text-text hover:bg-surface-3"
            >
              Return to Campaigns List
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent block">
              1. Basic Information
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. NextJS 15 Conf Launch"
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  URL Slug (Auto-generated) *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Brand / Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  placeholder="e.g. Vercel"
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Brand Category
                </label>
                <input
                  type="text"
                  value={form.brandCategory}
                  onChange={(e) => setForm({ ...form, brandCategory: e.target.value })}
                  placeholder="e.g. Developer Tools & Cloud"
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Short Summary (Card preview)
              </label>
              <input
                type="text"
                required
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                placeholder="One sentence description shown on campaign cards..."
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Full Description
              </label>
              <textarea
                rows={3}
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Comprehensive campaign background..."
                className="w-full rounded-md border border-border bg-surface-2 p-3 text-xs text-text focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Rates, Budget & Escrow */}
          <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent block">
              2. Budget & Verified Rates
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Reward Rate (USD) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={form.rewardRate}
                  onChange={(e) => setForm({ ...form, rewardRate: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Reward Unit
                </label>
                <select
                  value={form.rewardUnit}
                  onChange={(e) => setForm({ ...form, rewardUnit: e.target.value as RewardUnit })}
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
                >
                  <option value="per_1000_views">Per 1,000 Verified Views</option>
                  <option value="per_view">Per Verified View</option>
                  <option value="fixed_bounty">Fixed Bounty Per Clip</option>
                  <option value="per_approved_post">Per Approved Post</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Total Budget Pool (USD) *
                </label>
                <input
                  type="number"
                  required
                  value={form.totalBudget}
                  onChange={(e) => setForm({ ...form, totalBudget: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Publishing Platforms & Discord Links */}
          <div className="rounded-lg border border-border bg-surface-1 p-6 space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent block">
              3. Platforms & Discord Routing
            </span>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-2">
                Accepted Content Platforms
              </label>
              <div className="flex flex-wrap gap-2">
                {(["tiktok", "youtube_shorts", "instagram_reels", "x"] as PlatformType[]).map((p) => {
                  const selected = form.platforms.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePlatformToggle(p)}
                      className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                        selected
                          ? "bg-accent text-accent-ink font-semibold"
                          : "bg-surface-2 text-text-muted border border-border"
                      }`}
                    >
                      {p.replace("_", " ").toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Discord Channel Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.discordChannelName}
                  onChange={(e) => setForm({ ...form, discordChannelName: e.target.value })}
                  placeholder="#campaign-brand"
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Discord Invitation URL *
                </label>
                <input
                  type="url"
                  required
                  value={form.discordInviteUrl}
                  onChange={(e) => setForm({ ...form, discordInviteUrl: e.target.value })}
                  placeholder="https://discord.gg/..."
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link
              href="/admin/campaigns"
              className="px-4 py-2 rounded-md border border-border bg-surface-2 text-xs font-medium text-text hover:bg-surface-3"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-md bg-accent px-5 py-2 text-xs font-semibold text-accent-ink hover:opacity-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Publish Campaign</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

