import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("collabefy_admin_token")?.value || request.cookies.get("collabefy_access")?.value;
    const token = authHeader || (cookieToken ? `Bearer ${cookieToken}` : undefined);

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/campaigns/${params.slug}`, {
      headers: {
        ...(token ? { Authorization: token } : {}),
      },
      cache: "no-store",
    });

    if (backendRes.ok) {
      const json = await backendRes.json();
      return NextResponse.json({ success: true, data: json.data });
    }

    if (backendRes.status === 404) {
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }
  } catch (err: any) {
    console.warn("[CAMPAIGN DETAIL API ERROR]", err);
  }

  return NextResponse.json({ success: false, error: "Campaign service unavailable" }, { status: 503 });
}
