"use client";

import React, { useState } from "react";
import Link from "next/link";
import { apiPost } from "@/lib/api-client";
import { PlatformType, RewardUnit, CampaignStatus } from "@/types";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { CampaignPreviewModal } from "@/components/admin/CampaignPreviewModal";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Sparkles,
  Layers,
  FileText,
  Radio,
  Eye,
  FileCheck,
} from "lucide-react";

const CATEGORIES = [
  "Developer Tools & Cloud",
  "AI & Machine Learning",
  "Productivity & SaaS",
  "Gaming & Esports",
  "Music & Entertainment",
  "FinTech & Crypto",
  "Creator Economy",
  "Consumer Hardware",
];

const PLATFORMS: { id: PlatformType; label: string }[] = [
  { id: "tiktok", label: "TikTok" },
  { id: "youtube_shorts", label: "YouTube Shorts" },
  { id: "instagram_reels", label: "Instagram Reels" },
  { id: "x", label: "X (Twitter)" },
];

export default function NewCampaignPage() {
  const [submitted, setSubmitted] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [brandLogoUrl, setBrandLogoUrl] = useState("");
  const [status, setStatus] = useState<CampaignStatus>("active");
  const [totalBudget, setTotalBudget] = useState(10000);
  const [rewardRateCpm, setRewardRateCpm] = useState(20.0);
  const [rewardUnit, setRewardUnit] = useState<RewardUnit>("per_1000_views");
  const [platforms, setPlatforms] = useState<PlatformType[]>(["tiktok", "youtube_shorts"]);
  const [minFollowers, setMinFollowers] = useState(1000);
  const [featured, setFeatured] = useState(true);
  const [featuredOrder, setFeaturedOrder] = useState(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [discordChannel, setDiscordChannel] = useState("#campaign-general");
  const [discordInviteUrl, setDiscordInviteUrl] = useState("https://discord.gg/QmGayUXXD");
  const [audio, setAudio] = useState("");

  // Brief
  const [objective, setObjective] = useState("");
  const [coreNarrative, setCoreNarrative] = useState("");
  const [targetAudienceInput, setTargetAudienceInput] = useState("Tech Enthusiasts, Short-form Creators, Developers");
  const [talkingPoints, setTalkingPoints] = useState<string[]>([
    "Highlight real speed and smooth workflow",
    "Show authentic developer usage",
    "Include link in bio and campaign hashtag",
  ]);
  const [newTalkingPoint, setNewTalkingPoint] = useState("");

  // Rules
  const [rules, setRules] = useState<Array<{ title: string; detail: string }>>([
    { title: "Video Format", detail: "9:16 vertical short-form video (30 to 90 seconds in duration)." },
    { title: "Required Disclosures", detail: "Include official campaign hashtag in caption and pinned comment." },
    { title: "Audited Views", detail: "Payouts are computed exclusively on 48h verified organic views." },
  ]);
  const [newRuleTitle, setNewRuleTitle] = useState("");
  const [newRuleDetail, setNewRuleDetail] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(autoSlug);
  };

  const handlePlatformToggle = (plat: PlatformType) => {
    setPlatforms((prev) =>
      prev.includes(plat) ? prev.filter((p) => p !== plat) : [...prev, plat]
    );
  };

  const handleAddTalkingPoint = () => {
    if (!newTalkingPoint.trim()) return;
    setTalkingPoints([...talkingPoints, newTalkingPoint.trim()]);
    setNewTalkingPoint("");
  };

  const handleRemoveTalkingPoint = (idx: number) => {
    setTalkingPoints(talkingPoints.filter((_, i) => i !== idx));
  };

  const handleAddRule = () => {
    if (!newRuleTitle.trim() || !newRuleDetail.trim()) return;
    setRules([...rules, { title: newRuleTitle.trim(), detail: newRuleDetail.trim() }]);
    setNewRuleTitle("");
    setNewRuleDetail("");
  };

  const handleRemoveRule = (idx: number) => {
    setRules(rules.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent, overrideStatus?: CampaignStatus | string) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (platforms.length === 0) {
      setErrorMessage("Please select at least one eligible content platform.");
      setIsSubmitting(false);
      return;
    }

    try {
      const audiences = targetAudienceInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const resolvedStatus = overrideStatus || status;

      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        brandName: brandName.trim(),
        brandLogoUrl: brandLogoUrl || undefined,
        coverImage: coverImage || undefined,
        summary: summary.trim() || description.slice(0, 150),
        description: description.trim() || summary.trim(),
        category,
        tags: [category, ...audiences.slice(0, 2)],
        totalBudget: Number(totalBudget),
        allocatedBudget: 0,
        rewardRateCpm: Number(rewardRateCpm),
        rewardUnit,
        status: resolvedStatus.toUpperCase() as any,
        startDate: startDate ? new Date(startDate).toISOString() : undefined,
        endDate: endDate ? new Date(endDate).toISOString() : undefined,
        platforms: platforms.map((p) => {
          if (p === "tiktok") return "TikTok";
          if (p === "youtube_shorts") return "YouTube Shorts";
          if (p === "instagram_reels") return "Instagram Reels";
          return "X (Twitter)";
        }),
        formats: ["9:16 vertical"],
        minFollowers: Number(minFollowers) || 0,
        audio: audio.trim() || undefined,
        brief: {
          objective: objective.trim() || summary.trim(),
          coreNarrative: coreNarrative.trim() || description.trim(),
          targetAudience: audiences,
          talkingPoints,
          audio: audio.trim() || undefined,
          assets: [],
        },
        rules: rules.map((r) => `${r.title}: ${r.detail}`),
        discordChannel: discordChannel.trim(),
        featured,
        featuredOrder: Number(featuredOrder) || 1,
      };

      const res = await apiPost<{ success: boolean; data: any }>("/api/v1/campaigns/admin", payload);

      if (res?.data) {
        setCreatedSlug(res.data.slug);
        setSubmitted(true);
      } else {
        throw new Error("Invalid response received from server");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to publish campaign to database.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns"
            className="p-2 rounded-md border border-border bg-surface-2 text-text-subtle hover:text-text hover:bg-surface-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-text">Create Production Campaign</h1>
            <p className="text-xs text-text-muted mt-0.5">
              Launch a genuine database-backed campaign with media assets, rates, escrow, and Discord channel binding.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 hover:bg-surface-3 px-3.5 py-2 text-xs font-mono font-semibold text-text transition-colors self-start sm:self-auto"
        >
          <Eye className="w-4 h-4 text-accent" />
          <span>Live Visual Preview</span>
        </button>
      </div>

      {submitted ? (
        <div className="rounded-xl border border-border bg-surface-1 p-12 text-center space-y-5 shadow-lg">
          <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center mx-auto text-accent shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">Campaign Successfully Published</h2>
            <p className="text-xs text-text-muted max-w-md mx-auto mt-1 leading-relaxed">
              The campaign has been written to the persistent database and is now live across the homepage, directory, and creator interfaces.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href={`/campaigns/${createdSlug}`}
              target="_blank"
              className="rounded-md bg-accent px-5 py-2.5 text-xs font-semibold text-accent-ink hover:opacity-95 shadow transition-opacity"
            >
              View Public Campaign Page
            </Link>
            <Link
              href="/admin/campaigns"
              className="rounded-md border border-border bg-surface-2 px-5 py-2.5 text-xs font-medium text-text hover:bg-surface-3 transition-colors"
            >
              Return to Campaign List
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-lg border border-danger/40 bg-danger/10 p-4 text-xs text-danger font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Brand & Campaign Identity */}
          <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-text uppercase tracking-wider font-mono">
                1. Campaign & Brand Identity
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Cursor AI — Next-Gen Code Editor Launch"
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Public URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="cursor-ai-launch"
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Brand / Sponsor Name *
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Anysphere / Cursor"
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Industry / Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Short Summary (Card Preview) *
              </label>
              <input
                type="text"
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="One sentence value proposition displayed on directory cards..."
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Full Description *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="In-depth explanation of the sponsorship, product features, and creator opportunity..."
                className="w-full rounded-md border border-border bg-surface-2 p-3 text-xs text-text focus:outline-none focus:border-accent resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Media & Visual Assets */}
          <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Layers className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-text uppercase tracking-wider font-mono">
                2. Visual Media Uploads
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ImageUploadField
                label="Brand Logo"
                value={brandLogoUrl}
                onChange={setBrandLogoUrl}
                aspectRatio="square"
                helperText="Square 1:1 format (e.g. 200x200px)"
              />

              <ImageUploadField
                label="Campaign Cover / Banner"
                value={coverImage}
                onChange={setCoverImage}
                aspectRatio="video"
                helperText="High-res 16:9 banner for cards and header"
              />
            </div>
          </div>

          {/* Section 3: Financials, Rates & Escrow */}
          <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <DollarSign className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-text uppercase tracking-wider font-mono">
                3. Financial Model & Budget Allocation
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  CPM Reward Rate (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-subtle">$</span>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={rewardRateCpm}
                    onChange={(e) => setRewardRateCpm(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-md border border-border bg-surface-2 pl-7 pr-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                  />
                </div>
                <span className="text-[10px] text-text-muted font-mono mt-1 block">Paid per 1,000 verified organic views</span>
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Reward Model Unit
                </label>
                <select
                  value={rewardUnit}
                  onChange={(e) => setRewardUnit(e.target.value as RewardUnit)}
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                >
                  <option value="per_1000_views">Per 1,000 Verified Views</option>
                  <option value="per_view">Per Verified View</option>
                  <option value="fixed_bounty">Fixed Bounty Per Clip</option>
                  <option value="per_approved_post">Per Approved Post</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Total Escrow Pool (USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-text-subtle">$</span>
                  <input
                    type="number"
                    min="100"
                    required
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(parseInt(e.target.value) || 0)}
                    className="w-full rounded-md border border-border bg-surface-2 pl-7 pr-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                  />
                </div>
                <span className="text-[10px] text-text-muted font-mono mt-1 block">Maximum total payout pool</span>
              </div>
            </div>
          </div>

          {/* Section 4: Platforms, Timing & Eligibility */}
          <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <Calendar className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-text uppercase tracking-wider font-mono">
                4. Platforms, Timing & Clearance
              </h2>
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-2">
                Eligible Social Platforms *
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((plat) => {
                  const isSelected = platforms.includes(plat.id);
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => handlePlatformToggle(plat.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all border ${
                        isSelected
                          ? "bg-accent text-accent-ink border-accent font-semibold shadow-sm"
                          : "bg-surface-2 text-text-muted border-border hover:bg-surface-3 hover:text-text"
                      }`}
                    >
                      {isSelected ? `✓ ${plat.label}` : `+ ${plat.label}`}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Minimum Followers
                </label>
                <input
                  type="number"
                  min="0"
                  value={minFollowers}
                  onChange={(e) => setMinFollowers(parseInt(e.target.value) || 0)}
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Discord Channel Name
                </label>
                <input
                  type="text"
                  value={discordChannel}
                  onChange={(e) => setDiscordChannel(e.target.value)}
                  placeholder="#campaign-sponsor"
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Discord Invite URL
                </label>
                <input
                  type="url"
                  value={discordInviteUrl}
                  onChange={(e) => setDiscordInviteUrl(e.target.value)}
                  placeholder="https://discord.gg/..."
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Audio Track / Sound Link (Optional)
              </label>
              <input
                type="text"
                value={audio}
                onChange={(e) => setAudio(e.target.value)}
                placeholder="e.g. Hong Kong — The Weeknd (Sound Link)"
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                  className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                >
                  <option value="active">ACTIVE (Live for submissions)</option>
                  <option value="draft">DRAFT (Hidden from public)</option>
                  <option value="upcoming">UPCOMING (Countdown mode)</option>
                  <option value="paused">PAUSED (Submissions stopped)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-border bg-surface-2 text-accent focus:ring-accent"
                />
                <label htmlFor="featured" className="text-xs font-medium text-text cursor-pointer">
                  Featured on Homepage
                </label>
              </div>

              {featured && (
                <div>
                  <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                    Featured Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={featuredOrder}
                    onChange={(e) => setFeaturedOrder(parseInt(e.target.value) || 1)}
                    className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Creator Brief & Narrative */}
          <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-border pb-3">
              <FileText className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold text-text uppercase tracking-wider font-mono">
                5. Creator Brief & Guidelines
              </h2>
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Campaign Objective
              </label>
              <input
                type="text"
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="e.g. Demonstrate real-world speed and code completions..."
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Core Narrative
              </label>
              <textarea
                rows={2}
                value={coreNarrative}
                onChange={(e) => setCoreNarrative(e.target.value)}
                placeholder="The creative story or angle creators should take in their clips..."
                className="w-full rounded-md border border-border bg-surface-2 p-3 text-xs text-text focus:outline-none focus:border-accent resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-text-subtle uppercase block mb-1">
                Target Audience (Comma-separated)
              </label>
              <input
                type="text"
                value={targetAudienceInput}
                onChange={(e) => setTargetAudienceInput(e.target.value)}
                placeholder="Fullstack Engineers, TypeScript Developers, Tech Content Creators"
                className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
              />
            </div>

            {/* Talking Points List */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-text-subtle uppercase block">
                Key Talking Points ({talkingPoints.length})
              </label>
              <div className="space-y-2">
                {talkingPoints.map((tp, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-md bg-surface-2 border border-border px-3 py-1.5 text-xs text-text">
                    <span className="font-mono text-text-subtle shrink-0">#{idx + 1}</span>
                    <span className="flex-1">{tp}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTalkingPoint(idx)}
                      className="text-text-subtle hover:text-danger p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newTalkingPoint}
                  onChange={(e) => setNewTalkingPoint(e.target.value)}
                  placeholder="Add another talking point..."
                  className="flex-1 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs text-text focus:outline-none focus:border-accent"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTalkingPoint();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTalkingPoint}
                  className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-mono text-text hover:bg-surface-3 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-accent" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Rules List */}
            <div className="space-y-2 pt-2 border-t border-border">
              <label className="text-xs font-mono text-text-subtle uppercase block">
                Campaign Rules & Guidelines ({rules.length})
              </label>
              <div className="space-y-2">
                {rules.map((rule, idx) => (
                  <div key={idx} className="rounded-md bg-surface-2 border border-border p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-text">{rule.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(idx)}
                        className="text-text-subtle hover:text-danger p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">{rule.detail}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-md border border-border bg-surface-2/60 p-3 space-y-2 pt-2">
                <span className="text-[11px] font-mono text-text-subtle block">New Rule / Requirement</span>
                <input
                  type="text"
                  value={newRuleTitle}
                  onChange={(e) => setNewRuleTitle(e.target.value)}
                  placeholder="Rule Title (e.g. Audio Track Usage)"
                  className="w-full rounded-md border border-border bg-surface-1 px-3 py-1.5 text-xs text-text focus:outline-none focus:border-accent"
                />
                <textarea
                  rows={2}
                  value={newRuleDetail}
                  onChange={(e) => setNewRuleDetail(e.target.value)}
                  placeholder="Detailed rule instruction..."
                  className="w-full rounded-md border border-border bg-surface-1 p-2 text-xs text-text focus:outline-none focus:border-accent resize-none"
                />
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs font-mono text-text hover:bg-surface-3 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-accent" />
                  <span>Add Rule</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="rounded-md border border-border bg-surface-2 px-4 py-2.5 text-xs font-mono font-medium text-text hover:bg-surface-3 transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-3.5 h-3.5 text-accent" />
              <span>Preview Visuals</span>
            </button>

            <div className="flex items-center justify-end gap-3">
              <Link
                href="/admin/campaigns"
                className="rounded-md border border-border bg-surface-2 px-4 py-2.5 text-xs font-medium text-text hover:bg-surface-3 transition-colors text-center"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "draft")}
                disabled={isSubmitting}
                className="rounded-md border border-accent/40 bg-accent/10 px-5 py-2.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Save as Draft</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-accent px-6 py-2.5 text-xs font-semibold text-accent-ink hover:opacity-95 shadow transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-accent-ink border-t-transparent animate-spin" />
                    <span>Publishing to Database...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Publish Campaign</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Visual Preview Modal */}
      {showPreview && (
        <CampaignPreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          campaign={{
            title: title || "New Campaign Title",
            slug: slug || "new-campaign",
            brandName: brandName || "Brand Name",
            brandCategory: category || "General",
            summary: summary || description.slice(0, 140),
            description: description || summary,
            coverImage: coverImage || "/placeholder.png",
            brandLogo: brandLogoUrl || "/placeholder.png",
            status,
            rewardRate: Number(rewardRateCpm) || 20,
            rewardRateCpm: Number(rewardRateCpm) || 20,
            totalBudget: Number(totalBudget) || 10000,
            allocatedBudget: 0,
            platforms,
            audio,
            brief: {
              objective,
              coreNarrative,
              audio,
              talkingPoints,
            },
            rules,
          }}
        />
      )}
    </div>
  );
}
