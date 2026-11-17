import { NextRequest, NextResponse } from "next/server";
import { getCampaigns } from "@/lib/data";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/campaigns/admin/all`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      cache: "no-store",
    }).catch(() => null);

    if (backendRes && backendRes.ok) {
      const json = await backendRes.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return NextResponse.json({ success: true, data: json.data });
      }
    }
  } catch {}

  // Fallback to internal data store
  const localCampaigns = getCampaigns();
  const formatted = localCampaigns.map((c) => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    brandName: c.brandName,
    brandLogoUrl: c.brandLogo,
    coverImage: c.coverImage,
    summary: c.summary,
    description: c.description,
    category: c.brandCategory,
    status: c.status?.toUpperCase(),
    totalBudget: c.totalBudget,
    allocatedBudget: c.allocatedBudget,
    rewardRateCpm: c.rewardRate,
    rewardRate: c.rewardRate,
    rewardUnit: c.rewardUnit,
    platforms: c.platforms,
    featured: c.featured,
    featuredOrder: c.featuredOrder,
    discordChannel: c.discordChannelName,
    discordInviteUrl: c.discordInviteUrl,
    audio: c.audio,
    brief: c.brief,
    rules: c.rules,
    stats: c.stats,
    verifiedViews: c.verifiedViews,
    payableViews: c.payableViews,
    approvedClips: c.approvedClips,
    activeCreators: c.activeCreators,
    endDate: c.endDate,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  return NextResponse.json({ success: true, data: formatted });
}
