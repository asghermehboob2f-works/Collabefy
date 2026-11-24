import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/security";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/campaigns?${searchParams.toString()}`, {
      cache: "no-store",
    });
    if (backendRes.ok) {
      const json = await backendRes.json();
      return NextResponse.json({
        success: true,
        data: json.data || [],
        count: json.data?.length || 0,
        pagination: json.pagination,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn("[CAMPAIGNS API BACKEND FETCH ERROR]", err);
  }

  return NextResponse.json(
    {
      success: false,
      data: [],
      count: 0,
      error: "Campaigns service temporarily unavailable",
      timestamp: new Date().toISOString(),
    },
    { status: 503 }
  );
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "client-ip";
  const limit = checkRateLimit(`campaign-create-${ip}`, 10, 60 * 1000);
  if (!limit.allowed) {
    return rateLimitResponse(limit.resetInMs);
  }

  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("collabefy_admin_token")?.value || request.cookies.get("collabefy_access")?.value;
    const token = authHeader || (cookieToken ? `Bearer ${cookieToken}` : undefined);

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/campaigns/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });

    const json = await backendRes.json().catch(() => ({}));

    if (backendRes.ok) {
      return NextResponse.json({ success: true, data: json.data }, { status: 201 });
    }

    return NextResponse.json(
      { error: json?.error?.message || "Failed to create campaign" },
      { status: backendRes.status || 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Invalid payload" }, { status: 400 });
  }
}
