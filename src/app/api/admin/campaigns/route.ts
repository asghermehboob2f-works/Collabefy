import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("collabefy_admin_token")?.value || request.cookies.get("collabefy_access")?.value;
    const token = authHeader || (cookieToken ? `Bearer ${cookieToken}` : undefined);

    const { searchParams } = new URL(request.url);
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/campaigns/admin/all?${searchParams.toString()}`, {
      headers: {
        ...(token ? { Authorization: token } : {}),
      },
      cache: "no-store",
    }).catch(() => null);

    if (backendRes && backendRes.ok) {
      const json = await backendRes.json();
      if (Array.isArray(json.data)) {
        return NextResponse.json({ success: true, data: json.data, totalCount: json.totalCount ?? json.data.length });
      }
    }
  } catch (err: any) {
    console.error("[ADMIN CAMPAIGNS API ERROR]", err);
  }

  return NextResponse.json({ success: false, data: [], error: "Unable to retrieve campaigns from backend" }, { status: 503 });
}
