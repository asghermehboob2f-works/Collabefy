import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");
    const cookieToken =
      request.cookies.get("collabefy_admin_token")?.value ||
      request.cookies.get("collabefy_access")?.value;
    const token = authHeader || (cookieToken ? `Bearer ${cookieToken}` : undefined);

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/submissions/admin/${params.id}/review`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });

    const json = await backendRes.json().catch(() => ({}));

    if (backendRes.ok) {
      return NextResponse.json({
        success: true,
        message: `Submission ${params.id} updated`,
        data: json.data,
      });
    }

    return NextResponse.json(
      { error: json?.error?.message || "Failed to update submission" },
      { status: backendRes.status || 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
