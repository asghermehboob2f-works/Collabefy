"use client";

import React, { useState, useEffect } from "react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { PlatformIcon } from "../PlatformIcons";
import {
  X,
  Save,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Music2,
  DollarSign,
  ShieldAlert,
  Sparkles,
  Link as LinkIcon,
  Layers,
  FileText,
  Lock,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";

interface CampaignEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: any;
  onSave: (updatedData: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCloseCampaign: (id: string) => Promise<void>;
}

const PRESET_COVERS = [
  { label: "The Weeknd / Concert", url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80" },
  { label: "Blake G / Film Audio", url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80" },
  { label: "FIFA 27 / Stadium", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80" },
  { label: "Developer Tools / Code", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80" },
  { label: "Cyberpunk / Synth", url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80" },
  { label: "AI / Deep Tech", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80" },
];

const PRESET_LOGOS = [
  { label: "promote.fun", url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80" },
  { label: "Film Studio", url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=200&q=80" },
  { label: "EA SPORTS FC", url: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=200&q=80" },
  { label: "Cursor AI", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80" },
];

export function CampaignEditModal({
  isOpen,
  onClose,
  campaign,
  onSave,
  onDelete,
  onCloseCampaign,
}: CampaignEditModalProps) {
  const [activeTab, setActiveTab] = useState<"media" | "details" | "financials" | "brief" | "stats">("media");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [brandName, setBrandName] = useState("");
  const [category, setCategory] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [brandLogoUrl, setBrandLogoUrl] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [featured, setFeatured] = useState(false);
  const [featuredOrder, setFeaturedOrder] = useState(99);

  // Financials (INR)
  const [totalBudget, setTotalBudget] = useState(0);
  const [allocatedBudget, setAllocatedBudget] = useState(0);
  const [rewardRateCpm, setRewardRateCpm] = useState(0);
  const [rewardUnit, setRewardUnit] = useState("per_1000_views");

  // Creative & Audio
  const [audio, setAudio] = useState("");
  const [approvedFormats, setApprovedFormats] = useState("");
  const [approvedNiches, setApprovedNiches] = useState("");
  const [discordChannel, setDiscordChannel] = useState("");
  const [discordInviteUrl, setDiscordInviteUrl] = useState("");

  // Statistics
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [approvedSubmissions, setApprovedSubmissions] = useState(0);
  const [pendingSubmissions, setPendingSubmissions] = useState(0);
  const [deniedSubmissions, setDeniedSubmissions] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [payableViews, setPayableViews] = useState(0);

  // Narrative & Brief
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [coreNarrative, setCoreNarrative] = useState("");
  const [talkingPoints, setTalkingPoints] = useState("");
  const [additionalRules, setAdditionalRules] = useState("");
  const [contentGuidelines, setContentGuidelines] = useState("");
  const [captionRules, setCaptionRules] = useState("");
  const [namingConventions, setNamingConventions] = useState("");

  // Platforms
  const [platforms, setPlatforms] = useState<string[]>([]);

  useEffect(() => {
    if (!campaign) return;

    setTitle(campaign.title || "");
    setSlug(campaign.slug || "");
    setBrandName(campaign.brandName || "");
    setCategory(campaign.brandCategory || campaign.category || "General");
    setCoverImage(campaign.coverImage || "");
    setBrandLogoUrl(campaign.brandLogoUrl || campaign.brandLogo || "");
    setStatus(campaign.status?.toUpperCase() || "ACTIVE");
    setFeatured(Boolean(campaign.featured));
    setFeaturedOrder(campaign.featuredOrder ?? 99);

    const statsObj = campaign.stats || campaign.brief?.stats || {};
    setTotalBudget(statsObj.totalBudget ?? campaign.totalBudget ?? 0);
    setAllocatedBudget(statsObj.paidAmount ?? campaign.allocatedBudget ?? 0);
    setRewardRateCpm(campaign.rewardRateCpm ?? campaign.rewardRate ?? 20);
    setRewardUnit(campaign.rewardUnit || "per_1000_views");

    setAudio(campaign.audio || campaign.brief?.audio || "");
    setApprovedFormats((campaign.brief?.approvedFormats || []).join(", "));
    setApprovedNiches((campaign.brief?.approvedNiches || []).join(", "));
    setDiscordChannel(campaign.discordChannel || campaign.discordChannelName || "");
    setDiscordInviteUrl(campaign.discordInviteUrl || "https://discord.gg/QmGayUXXD");

    setTotalSubmissions(statsObj.totalSubmissions ?? campaign.approvedClips ?? 0);
    setApprovedSubmissions(statsObj.approvedSubmissions ?? campaign.approvedClips ?? 0);
    setPendingSubmissions(statsObj.pendingSubmissions ?? 0);
    setDeniedSubmissions(statsObj.deniedSubmissions ?? 0);
    setTotalViews(statsObj.totalViews ?? campaign.verifiedViews ?? 0);
    setPayableViews(statsObj.payableViews ?? campaign.payableViews ?? campaign.verifiedViews ?? 0);

    setSummary(campaign.summary || "");
    setDescription(campaign.description || "");
    setCoreNarrative(campaign.brief?.coreNarrative || "");
    setTalkingPoints((campaign.brief?.talkingPoints || []).join("\n"));
    setAdditionalRules((campaign.brief?.additionalRules || []).join("\n"));
    setContentGuidelines((campaign.brief?.contentGuidelines || []).join("\n"));
    setCaptionRules((campaign.brief?.captionRules || []).join("\n"));
    setNamingConventions((campaign.brief?.namingConventions || []).join("\n"));

    const initialPlat = (campaign.platforms || []).map((p: string) => p.toLowerCase());
    setPlatforms(initialPlat);
  }, [campaign]);

  if (!isOpen || !campaign) return null;

  const handlePlatformToggle = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const parsedBrief = {
        ...(typeof campaign.brief === "object" ? campaign.brief : {}),
        objective: summary || description.slice(0, 100),
        coreNarrative,
        audio: audio.trim() || undefined,
        talkingPoints: talkingPoints
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        approvedFormats: approvedFormats
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        approvedNiches: approvedNiches
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        additionalRules: additionalRules
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        contentGuidelines: contentGuidelines
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        captionRules: captionRules
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        namingConventions: namingConventions
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        stats: {
          totalSubmissions: Number(totalSubmissions) || 0,
          approvedSubmissions: Number(approvedSubmissions) || 0,
          pendingSubmissions: Number(pendingSubmissions) || 0,
          deniedSubmissions: Number(deniedSubmissions) || 0,
          totalViews: Number(totalViews) || 0,
          payableViews: Number(payableViews) || 0,
          totalBudget: Number(totalBudget) || 0,
          paidAmount: Number(allocatedBudget) || 0,
          remainingBudget: Math.max(0, (Number(totalBudget) || 0) - (Number(allocatedBudget) || 0)),
        },
      };

      const updatedPayload = {
        title: title.trim(),
        slug: slug.trim(),
        brandName: brandName.trim(),
        brandLogoUrl: brandLogoUrl.trim(),
        coverImage: coverImage.trim(),
        category: category.trim(),
        summary: summary.trim(),
        description: description.trim(),
        status: status.toUpperCase(),
        featured,
        featuredOrder: Number(featuredOrder) || 99,
        totalBudget: Number(totalBudget) || 0,
        allocatedBudget: Number(allocatedBudget) || 0,
        rewardRateCpm: Number(rewardRateCpm) || 0,
        rewardRate: Number(rewardRateCpm) || 0,
        rewardUnit,
        audio: audio.trim(),
        platforms,
        discordChannel,
        discordInviteUrl,
        brief: parsedBrief,
        stats: parsedBrief.stats,
        verifiedViews: Number(totalViews) || 0,
        payableViews: Number(payableViews) || 0,
        approvedClips: Number(approvedSubmissions) || 0,
      };

      await onSave(updatedPayload);
      onClose();
    } catch (err: any) {
      alert(`Error saving campaign: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseCampaignConfirmed = async () => {
    try {
      await onCloseCampaign(campaign.id);
      setShowCloseConfirm(false);
      onClose();
    } catch (err: any) {
      alert(`Error closing campaign: ${err.message}`);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      await onDelete(campaign.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (err: any) {
      alert(`Error deleting campaign: ${err.message}`);
    }
  };

  const remainingCalc = Math.max(0, Number(totalBudget) - Number(allocatedBudget));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-surface-1 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-2/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg border border-border overflow-hidden bg-surface-3 shrink-0">
              <img
                src={brandLogoUrl || campaign.brandLogoUrl || campaign.brandLogo || "/placeholder.png"}
                alt={brandName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                  Edit Campaign
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold border ${
                    status === "ACTIVE"
                      ? "bg-success/10 text-success border-success/30"
                      : status === "COMPLETED"
                      ? "bg-accent/10 text-accent border-accent/30"
                      : "bg-surface-3 text-text-subtle border-border"
                  }`}
                >
                  {status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-text truncate max-w-lg">{title || campaign.title}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text-subtle hover:text-text hover:bg-surface-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 px-6 border-b border-border bg-surface-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("media")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-mono font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "media"
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Thumbnail & Logo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-mono font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "details"
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Basic Info & Audio</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("financials")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-mono font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "financials"
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Budget & Rate (INR ₹)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-mono font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "stats"
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Submissions & Views</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("brief")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-mono font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === "brief"
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Description & Rules</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB: MEDIA & BRANDING */}
          {activeTab === "media" && (
            <div className="space-y-6">
              {/* Cover Image / Thumbnail Preview & Input */}
              <div className="space-y-3">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>Cover Thumbnail Image (16:9 Aspect Ratio)</span>
                </label>

                {/* Live Preview */}
                <div className="relative aspect-[16/9] max-h-56 w-full rounded-xl overflow-hidden border border-border bg-surface-2 shadow-inner">
                  {coverImage ? (
                    <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-text-subtle text-xs font-mono">
                      <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                      <span>No Cover Image URL Provided</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-[11px] font-mono text-text border border-white/10">
                    Live Thumbnail Preview
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-text-subtle">Thumbnail Image URL:</span>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                  />
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-mono text-text-subtle">Quick Preset Themes:</span>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COVERS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCoverImage(preset.url)}
                        className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors ${
                          coverImage === preset.url
                            ? "bg-accent/15 border-accent text-accent"
                            : "bg-surface-2 border-border text-text-muted hover:text-text hover:bg-surface-3"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Brand Logo & Identity */}
              <div className="pt-4 border-t border-border space-y-4">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Brand Logo & Identity</span>
                </label>

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl border border-border bg-surface-2 p-1 overflow-hidden shrink-0 shadow-md">
                    {brandLogoUrl ? (
                      <img src={brandLogoUrl} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[10px] font-mono text-text-subtle">
                        No Logo
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] font-mono text-text-subtle">Brand Logo Image URL:</span>
                    <input
                      type="text"
                      value={brandLogoUrl}
                      onChange={(e) => setBrandLogoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* Quick Logo Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {PRESET_LOGOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setBrandLogoUrl(preset.url)}
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors ${
                        brandLogoUrl === preset.url
                          ? "bg-accent/15 border-accent text-accent"
                          : "bg-surface-2 border-border text-text-muted hover:text-text hover:bg-surface-3"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: BASIC DETAILS & AUDIO */}
          {activeTab === "details" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Campaign Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs font-medium text-text focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Public URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                  />
                  <span className="text-[10px] font-mono text-text-subtle">
                    Path: /campaigns/{slug}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs text-text focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Music & Entertainment"
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs text-text focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Campaign Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                  >
                    <option value="ACTIVE">ACTIVE (Live / Ongoing)</option>
                    <option value="PAUSED">PAUSED (Temporarily On Hold)</option>
                    <option value="COMPLETED">COMPLETED (Closed / Finalized)</option>
                    <option value="SCHEDULED">SCHEDULED (Upcoming)</option>
                    <option value="DRAFT">DRAFT (Internal Review)</option>
                    <option value="ARCHIVED">ARCHIVED (Deactivated)</option>
                  </select>
                </div>
              </div>

              {/* Audio Track & Formats */}
              <div className="pt-3 border-t border-border space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-accent flex items-center gap-1.5">
                    <Music2 className="w-3.5 h-3.5" />
                    <span>Required Campaign Audio Track (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={audio}
                    onChange={(e) => setAudio(e.target.value)}
                    placeholder="e.g. Hong Kong – The Weeknd or Lift You Up"
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs font-medium text-text focus:outline-none focus:border-accent"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-text">Approved Formats (comma-separated)</label>
                    <input
                      type="text"
                      value={approvedFormats}
                      onChange={(e) => setApprovedFormats(e.target.value)}
                      placeholder="e.g. TV/Film Edits, TV/Film Clips"
                      className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs text-text focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-semibold text-text">Approved Niches (comma-separated)</label>
                    <input
                      type="text"
                      value={approvedNiches}
                      onChange={(e) => setApprovedNiches(e.target.value)}
                      placeholder="e.g. Soccer pages, Sports, Gaming"
                      className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs text-text focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div className="pt-3 border-t border-border space-y-2">
                <label className="text-xs font-mono font-semibold text-text block">Accepted Platforms</label>
                <div className="flex flex-wrap gap-2.5">
                  {["instagram", "tiktok", "youtube_shorts", "x"].map((plat) => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => handlePlatformToggle(plat)}
                      className={`flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium capitalize transition-colors ${
                        platforms.includes(plat)
                          ? "bg-accent/15 border-accent text-accent"
                          : "bg-surface-2 border-border text-text-muted hover:text-text"
                      }`}
                    >
                      <PlatformIcon platform={plat as any} className="w-3.5 h-3.5" />
                      <span>{plat.replace("_", " ")}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Discord & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Discord Channel</label>
                  <input
                    type="text"
                    value={discordChannel}
                    onChange={(e) => setDiscordChannel(e.target.value)}
                    placeholder="#campaign-channel"
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs font-mono text-text focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Featured on Home</label>
                  <select
                    value={featured ? "true" : "false"}
                    onChange={(e) => setFeatured(e.target.value === "true")}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
                  >
                    <option value="true">YES — Featured</option>
                    <option value="false">NO — Standard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Featured Order (Rank)</label>
                  <input
                    type="number"
                    value={featuredOrder}
                    onChange={(e) => setFeaturedOrder(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs font-mono text-text focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: FINANCIALS & ESCROW */}
          {activeTab === "financials" && (
            <div className="space-y-6">
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 text-xs font-mono text-text-muted leading-relaxed">
                All financial values are denominated and displayed strictly in <strong>Indian Rupees (INR ₹)</strong> across Collabefy.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Total Budget (INR ₹) *</label>
                  <input
                    type="number"
                    required
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm font-bold font-mono text-text focus:outline-none focus:border-accent"
                  />
                  <span className="text-[11px] font-mono text-text-subtle">
                    {formatCurrency(totalBudget)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Amount Paid / Claimed (INR ₹)</label>
                  <input
                    type="number"
                    value={allocatedBudget}
                    onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm font-bold font-mono text-accent focus:outline-none focus:border-accent"
                  />
                  <span className="text-[11px] font-mono text-accent">
                    {formatCurrency(allocatedBudget)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Calculated Remaining Budget</label>
                  <div className="rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm font-bold font-mono text-text">
                    {formatCurrency(remainingCalc)}
                  </div>
                  <span className="text-[11px] font-mono text-text-subtle">
                    {remainingCalc === 0 ? "Budget Exhausted" : "Active Pool"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Reward Rate (CPM in INR ₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={rewardRateCpm}
                    onChange={(e) => setRewardRateCpm(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm font-bold font-mono text-accent focus:outline-none focus:border-accent"
                  />
                  <span className="text-[11px] font-mono text-text-subtle">
                    Rate: {formatCurrency(rewardRateCpm)} per 1,000 verified views
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Reward Unit</label>
                  <select
                    value={rewardUnit}
                    onChange={(e) => setRewardUnit(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs font-mono text-text focus:outline-none"
                  >
                    <option value="per_1000_views">per 1,000 views (CPM)</option>
                    <option value="per_view">per verified view</option>
                    <option value="fixed_bounty">fixed bounty</option>
                    <option value="per_approved_post">per approved post</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SUBMISSIONS & VIEWS STATS */}
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
                  Campaign Submission & View Metrics
                </h3>
                <p className="text-xs text-text-muted mt-1">
                  Adjust live verified counts and view statistics displayed on the public campaign page.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-subtle">Total Submissions</label>
                  <input
                    type="number"
                    value={totalSubmissions}
                    onChange={(e) => setTotalSubmissions(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm font-mono text-text font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-success">Approved Submissions</label>
                  <input
                    type="number"
                    value={approvedSubmissions}
                    onChange={(e) => setApprovedSubmissions(Number(e.target.value))}
                    className="w-full rounded-lg border border-success/30 bg-success/5 px-3.5 py-2 text-sm font-mono text-success font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-warning">Pending Submissions</label>
                  <input
                    type="number"
                    value={pendingSubmissions}
                    onChange={(e) => setPendingSubmissions(Number(e.target.value))}
                    className="w-full rounded-lg border border-warning/30 bg-warning/5 px-3.5 py-2 text-sm font-mono text-warning font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-subtle">Denied Submissions</label>
                  <input
                    type="number"
                    value={deniedSubmissions}
                    onChange={(e) => setDeniedSubmissions(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm font-mono text-text-muted font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Total Video Views</label>
                  <input
                    type="number"
                    value={totalViews}
                    onChange={(e) => setTotalViews(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm font-mono text-text font-bold focus:outline-none"
                  />
                  <span className="text-[11px] font-mono text-text-subtle">
                    {formatNumber(totalViews)} Total Views
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Payable Verified Views</label>
                  <input
                    type="number"
                    value={payableViews}
                    onChange={(e) => setPayableViews(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-sm font-mono text-accent font-bold focus:outline-none"
                  />
                  <span className="text-[11px] font-mono text-accent">
                    {formatNumber(payableViews)} Payable Views
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: DESCRIPTION, BRIEF & RULES */}
          {activeTab === "brief" && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-text">Short Summary (Preview Cards)</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-2 px-3.5 py-2 text-xs text-text focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-text">Full Campaign Description (Markdown / Plain Text)</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-2 p-3.5 text-xs text-text focus:outline-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-text">Core Narrative</label>
                <textarea
                  rows={2}
                  value={coreNarrative}
                  onChange={(e) => setCoreNarrative(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-2 p-3 text-xs text-text focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-semibold text-text">Required Talking Points (1 per line)</label>
                <textarea
                  rows={3}
                  value={talkingPoints}
                  onChange={(e) => setTalkingPoints(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface-2 p-3 text-xs font-mono text-text focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-danger">Additional Rules & Prohibitions</label>
                  <textarea
                    rows={3}
                    value={additionalRules}
                    onChange={(e) => setAdditionalRules(e.target.value)}
                    placeholder="e.g. NO overly sexual clips&#10;Dialogue loudness rules"
                    className="w-full rounded-lg border border-danger/30 bg-surface-2 p-3 text-xs font-mono text-text focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Content Guidelines</label>
                  <textarea
                    rows={3}
                    value={contentGuidelines}
                    onChange={(e) => setContentGuidelines(e.target.value)}
                    placeholder="e.g. Meme format on-screen&#10;Visible EA Watermark"
                    className="w-full rounded-lg border border-border bg-surface-2 p-3 text-xs font-mono text-text focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Caption & Tagging Rules</label>
                  <textarea
                    rows={3}
                    value={captionRules}
                    onChange={(e) => setCaptionRules(e.target.value)}
                    placeholder="e.g. #EASportsFCPartner&#10;Tag @easportsfc"
                    className="w-full rounded-lg border border-border bg-surface-2 p-3 text-xs font-mono text-text focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-semibold text-text">Approved Naming Conventions</label>
                  <textarea
                    rows={3}
                    value={namingConventions}
                    onChange={(e) => setNamingConventions(e.target.value)}
                    placeholder='Series: "FC Head2Head"&#10;Title: "FC 27"'
                    className="w-full rounded-lg border border-border bg-surface-2 p-3 text-xs font-mono text-text focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {/* Close Campaign button */}
              {status !== "COMPLETED" ? (
                <button
                  type="button"
                  onClick={() => setShowCloseConfirm(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-warning/40 bg-warning/10 px-3 py-2 text-xs font-mono font-semibold text-warning hover:bg-warning/20 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Close Campaign</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStatus("ACTIVE")}
                  className="flex items-center gap-1.5 rounded-lg border border-success/40 bg-success/10 px-3 py-2 text-xs font-mono font-semibold text-success hover:bg-success/20 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reopen Campaign</span>
                </button>
              )}

              {/* Delete Campaign Button */}
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs font-mono font-semibold text-danger hover:bg-danger/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border bg-surface-2 px-4 py-2 text-xs font-mono font-medium text-text hover:bg-surface-3 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-lg bg-accent px-5 py-2 text-xs font-bold text-accent-ink hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Saving Live Changes..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal: Delete Campaign */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
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
              Are you sure you want to delete <strong className="text-text font-bold">"{title}"</strong>? This will permanently remove the campaign, its submissions, and associated records from the database.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg border border-border bg-surface-2 text-xs font-mono text-text hover:bg-surface-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 rounded-lg bg-danger text-xs font-bold text-white hover:bg-danger/90 transition-colors"
              >
                Yes, Delete Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Close Campaign */}
      {showCloseConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
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
              This will change <strong className="text-text font-bold">"{title}"</strong> status to <code className="text-warning font-mono">COMPLETED</code>. Creators will no longer be able to submit new clips, while existing view analytics and escrow records are preserved.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowCloseConfirm(false)}
                className="px-4 py-2 rounded-lg border border-border bg-surface-2 text-xs font-mono text-text hover:bg-surface-3"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCloseCampaignConfirmed}
                className="px-4 py-2 rounded-lg bg-warning text-xs font-bold text-black hover:bg-warning/90 transition-colors"
              >
                Close & Complete Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
