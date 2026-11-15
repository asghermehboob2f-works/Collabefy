import { NextRequest, NextResponse } from "next/server";
import { submissionSchema, checkRateLimit, rateLimitResponse } from "@/lib/security";
import { getCampaigns } from "@/lib/data";

// Shared server submissions store
let serverSubmissions: any[] = [
  {
    id: "sub-1",
    creatorName: "Alex Rivers",
    creatorHandle: "@alex_builds",
    campaignId: "camp-01",
    campaignTitle: "Cursor AI — Next-Gen Code Editor Launch",
    platform: "tiktok",
    contentUrl: "https://www.tiktok.com/@alex_builds/video/729104829104",
    submittedAt: "2026-11-13T10:30:00Z",
    status: "verified",
    estimatedViews: 148200,
    viewsVerified: 148200,
    rewardRateCpm: 22.0,
    rewardEarned: 3260.4,
  },
  {
    id: "sub-2",
    creatorName: "Maya Lin",
    creatorHandle: "@codewithmaya",
    campaignId: "camp-01",
    campaignTitle: "Cursor AI — Next-Gen Code Editor Launch",
    platform: "youtube_shorts",
    contentUrl: "https://youtube.com/shorts/k920aLkm2",
    submittedAt: "2026-11-12T16:45:00Z",
    status: "pending",
    estimatedViews: 112400,
    viewsVerified: 112400,
    rewardRateCpm: 22.0,
    rewardEarned: 2472.8,
  },
];

export async function GET() {
  return NextResponse.json({
    data: serverSubmissions,
    count: serverSubmissions.length,
  });
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "client-ip";
  const limit = checkRateLimit(`submission-${ip}`, 15, 60 * 1000);
  if (!limit.allowed) {
    return rateLimitResponse(limit.resetInMs);
  }

  try {
    const body = await request.json();
    const validated = submissionSchema.parse(body);

    const allCampaigns = getCampaigns();
    const camp = allCampaigns.find((c) => c.id === validated.campaignId || c.slug === validated.campaignId);

    const newSub = {
      id: `sub-${Date.now()}`,
      creatorName: validated.creatorHandle.replace("@", ""),
      creatorHandle: validated.creatorHandle.startsWith("@") ? validated.creatorHandle : `@${validated.creatorHandle}`,
      campaignId: camp?.id || validated.campaignId,
      campaignTitle: camp?.title || "Campaign",
      platform: validated.platform,
      contentUrl: validated.contentUrl,
      submittedAt: new Date().toISOString(),
      status: "pending",
      estimatedViews: validated.estimatedViews || 0,
      viewsVerified: validated.estimatedViews || 0,
      rewardRateCpm: camp?.rewardRate || 20.0,
      rewardEarned: 0,
    };

    serverSubmissions.unshift(newSub);

    return NextResponse.json(
      {
        success: true,
        message: "Content successfully submitted for 48h view audit.",
        data: newSub,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Invalid submission data", details: err.errors || err.message },
      { status: 400 }
    );
  }
}

