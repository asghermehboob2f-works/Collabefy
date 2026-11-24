import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "INR"): string {
  const isWhole = amount % 1 === 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toLocaleString();
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatDaysRemaining(endDateStr: string): string {
  const diffMs = new Date(endDateStr).getTime() - new Date().getTime();
  if (diffMs <= 0) return "Ended";
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) {
    return `${days}d ${hours}h left`;
  }
  return `${hours}h remaining`;
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

import type { Campaign, PlatformType, CampaignRule, CampaignAsset } from "@/types";

export function normalizeCampaign(c: any): Campaign {
  if (!c) {
    throw new Error("normalizeCampaign received null or undefined");
  }

  let briefObj: any = {};
  if (typeof c.brief === "string") {
    try {
      briefObj = JSON.parse(c.brief || "{}");
    } catch {
      briefObj = {};
    }
  } else if (typeof c.brief === "object" && c.brief !== null) {
    briefObj = c.brief;
  }

  let rawRules: any[] = [];
  if (typeof c.rules === "string") {
    try {
      rawRules = JSON.parse(c.rules || "[]");
    } catch {
      rawRules = [];
    }
  } else if (Array.isArray(c.rules)) {
    rawRules = c.rules;
  }

  const normalizedRules: CampaignRule[] = rawRules.map((r: any, idx: number) => {
    if (typeof r === "string") {
      const parts = r.split(":");
      return {
        id: `rule-${idx + 1}`,
        category: "format",
        title: parts.length > 1 ? parts[0].trim() : `Rule #${idx + 1}`,
        detail: parts.length > 1 ? parts.slice(1).join(":").trim() : r.trim(),
      };
    }
    return {
      id: r.id || `rule-${idx + 1}`,
      category: r.category || "format",
      title: r.title || `Rule #${idx + 1}`,
      detail: r.detail || r.description || "",
    };
  });

  let rawPlatforms: any[] = [];
  if (typeof c.platforms === "string") {
    try {
      rawPlatforms = JSON.parse(c.platforms || "[]");
    } catch {
      rawPlatforms = [];
    }
  } else if (Array.isArray(c.platforms)) {
    rawPlatforms = c.platforms;
  }

  const normalizedPlatforms: PlatformType[] = rawPlatforms.map((p: any) => {
    const s = String(p).toLowerCase().replace(/ /g, "_").replace(/-/g, "_");
    if (s.includes("tiktok")) return "tiktok";
    if (s.includes("youtube")) return "youtube_shorts";
    if (s.includes("reels") || s.includes("instagram_reels")) return "instagram_reels";
    if (s === "instagram") return "instagram";
    if (s === "x" || s.includes("twitter")) return "x";
    return "tiktok";
  });

  const rawStatus = (c.status || "active").toLowerCase();
  const validStatus = ["active", "upcoming", "paused", "budget_exhausted", "completed", "cancelled", "archived"].includes(rawStatus)
    ? rawStatus
    : "active";

  const totalBudget = Number(c.totalBudget) || 0;
  const allocatedBudget = Number(c.allocatedBudget) || 0;
  const rewardRate = Number(c.rewardRateCpm ?? c.rewardRate ?? 20);
  const verifiedViews = Number(c.verifiedViews ?? briefObj?.stats?.totalViews ?? 0);
  const approvedClips = Number(c.approvedClips ?? briefObj?.stats?.approvedSubmissions ?? 0);
  const activeCreators = Number(c.activeCreators ?? 0);

  return {
    id: c.id || `camp-${c.slug || Date.now()}`,
    title: c.title || "Untitled Campaign",
    slug: c.slug || "campaign",
    brandName: c.brandName || "Brand",
    brandCategory: c.category || c.brandCategory || "Developer Tools",
    summary: c.summary || c.description?.slice(0, 160) || "Performance campaign.",
    description: c.description || c.summary || "Performance campaign description.",
    campaignType: (c.category?.toLowerCase().includes("music") || c.category?.toLowerCase().includes("ugc"))
      ? "ugc"
      : "short_form_clipping",
    coverImage: c.coverImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    brandLogo: c.brandLogoUrl || c.brandLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    status: validStatus as any,
    currency: c.currency || "USD",
    totalBudget,
    allocatedBudget,
    budgetVisibility: (c.budgetVisibility as any) || "public",
    rewardRate,
    rewardUnit: (c.rewardUnit as any) || "per_1000_views",
    rewardVisibility: (c.rewardVisibility as any) || "public",
    platforms: normalizedPlatforms.length > 0 ? normalizedPlatforms : ["tiktok", "youtube_shorts"],
    applicationRequired: Boolean(c.applicationRequired),
    featured: Boolean(c.featured),
    featuredOrder: Number(c.featuredOrder) || 99,
    startDate: c.startDate ? new Date(c.startDate).toISOString() : new Date().toISOString(),
    endDate: c.endDate ? new Date(c.endDate).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    timeZone: c.timeZone || "UTC",
    verifiedViews,
    payableViews: Number(c.payableViews ?? verifiedViews),
    approvedClips,
    activeCreators,
    discordInviteUrl: c.discordInviteUrl || "https://discord.gg/QmGayUXXD",
    discordChannelName: c.discordChannel || c.discordChannelName || "#campaign",
    externalAppUrl: c.externalAppUrl,
    leaderboardEnabled: c.leaderboardEnabled ?? true,
    audio: c.audio || briefObj?.audio,
    stats: c.stats || briefObj?.stats || {
      totalSubmissions: approvedClips,
      approvedSubmissions: approvedClips,
      pendingSubmissions: 0,
      deniedSubmissions: 0,
      totalViews: verifiedViews,
      payableViews: verifiedViews,
      totalBudget,
      paidAmount: allocatedBudget,
      remainingBudget: Math.max(0, totalBudget - allocatedBudget),
    },
    brief: {
      objective: briefObj?.objective || c.summary || "Promote campaign on short-form platforms.",
      targetAudience: Array.isArray(briefObj?.targetAudience) ? briefObj.targetAudience : ["Short-form viewers", "Tech enthusiasts"],
      coreNarrative: briefObj?.coreNarrative || c.description || "Engage audience with authentic performance clips.",
      talkingPoints: Array.isArray(briefObj?.talkingPoints) ? briefObj.talkingPoints : ["Key features", "Clear demonstration", "Link in bio"],
      assets: (Array.isArray(briefObj?.assets) ? briefObj.assets : []) as CampaignAsset[],
      audio: c.audio || briefObj?.audio,
    },
    rules: normalizedRules.length > 0 ? normalizedRules : [
      { id: "r1", category: "format", title: "Accepted Video Formats", detail: "9:16 vertical video only, 30s to 90s length." },
      { id: "r2", category: "hashtag", title: "Required Mentions & Tags", detail: "Include official campaign hashtag and pin link in comments." },
    ],
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  };
}

