import { NextRequest, NextResponse } from "next/server";
import { submissionSchema, checkRateLimit, rateLimitResponse } from "@/lib/security";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/submissions/admin/all`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      return NextResponse.json({
        data: json.data,
        count: json.data?.length || 0,
      });
    }
  } catch (err) {
    console.warn("Backend submissions fetch failed:", err);
  }

  return NextResponse.json({ data: [], count: 0 });
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

    // Call backend API
    const authCookie = request.cookies.get("collabefy_access")?.value;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authCookie) {
      headers["Authorization"] = `Bearer ${authCookie}`;
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/submissions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        campaignId: validated.campaignId,
        platform: validated.platform === "youtube_shorts" ? "YouTube Shorts" : validated.platform === "instagram_reels" ? "Instagram Reels" : "TikTok",
        contentUrl: validated.contentUrl,
        reportedViews: validated.estimatedViews || 0,
      }),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(
        {
          success: true,
          message: "Content successfully submitted for 48h view audit.",
          data: data.data,
        },
        { status: 201 }
      );
    }

    const errData = await backendRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: errData.error?.message || "Failed to submit content to database." },
      { status: backendRes.status }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Invalid submission data", details: err.errors || err.message },
      { status: 400 }
    );
  }
}
