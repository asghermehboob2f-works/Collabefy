import { NextRequest, NextResponse } from "next/server";
import { getCampaigns, createCampaign } from "@/lib/data";
import { campaignCreateSchema, checkRateLimit, rateLimitResponse } from "@/lib/security";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/campaigns?${searchParams.toString()}`, {
      cache: "no-store",
    });
    if (backendRes.ok) {
      const json = await backendRes.json();
      return NextResponse.json({
        data: json.data,
        count: json.data?.length || 0,
        timestamp: new Date().toISOString(),
      });
    }
  } catch {}

  const status = searchParams.get("status") || "all";
  const platform = searchParams.get("platform") || "all";
  const search = searchParams.get("search") || "";
  const sortBy = (searchParams.get("sortBy") as any) || "newest";

  const campaigns = getCampaigns({
    status,
    platform,
    search,
    sortBy,
  });

  return NextResponse.json({
    data: campaigns,
    count: campaigns.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "client-ip";
  const limit = checkRateLimit(`campaign-create-${ip}`, 10, 60 * 1000);
  if (!limit.allowed) {
    return rateLimitResponse(limit.resetInMs);
  }

  try {
    const body = await request.json();
    const validated = campaignCreateSchema.parse(body);

    const newCampaign = createCampaign({
      ...validated,
      campaignType: "developer_tools",
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
      brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
      status: "active",
      currency: "USD",
      allocatedBudget: 0,
      budgetVisibility: "public",
      rewardUnit: "per_1000_views",
      rewardVisibility: "public",
      platforms: validated.platforms as any,
      applicationRequired: false,
      featured: true,
      timeZone: "UTC",
      verifiedViews: 0,
      approvedClips: 0,
      activeCreators: 0,
      discordInviteUrl: validated.discordInviteUrl || "https://discord.gg/QmGayUXXD",
      discordChannelName: validated.discordChannelName || "#campaign-general",
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
          category: "format",
          title: "Accepted Video Formats",
          detail: "9:16 vertical video only, 30s to 90s length.",
        },
        {
          id: "r2",
          category: "hashtag",
          title: "Required Mentions & Tags",
          detail: "Include official campaign hashtag and pin link in comments.",
        },
      ],
    });

    return NextResponse.json({ success: true, data: newCampaign }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Validation Error", details: err.errors || err.message },
      { status: 400 }
    );
  }
}

