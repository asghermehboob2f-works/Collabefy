import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("collabefy_admin_token")?.value || request.cookies.get("collabefy_access")?.value;
    const token = authHeader || (cookieToken ? `Bearer ${cookieToken}` : undefined);

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/campaigns/admin/${params.id}`, {
      headers: {
        ...(token ? { Authorization: token } : {}),
      },
      cache: "no-store",
    });

    const json = await backendRes.json().catch(() => ({}));

    if (backendRes.ok) {
      return NextResponse.json(json);
    }

    return NextResponse.json(
      { error: json?.error?.message || "Failed to fetch campaign" },
      { status: backendRes.status || 404 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("collabefy_admin_token")?.value || request.cookies.get("collabefy_access")?.value;
    const token = authHeader || (cookieToken ? `Bearer ${cookieToken}` : undefined);

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/campaigns/admin/${params.id}`, {
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
        message: "Campaign updated successfully",
        data: json.data,
      });
    }

    return NextResponse.json(
      { error: json?.error?.message || "Failed to update campaign in database" },
      { status: backendRes.status || 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const cookieToken = request.cookies.get("collabefy_admin_token")?.value || request.cookies.get("collabefy_access")?.value;
    const token = authHeader || (cookieToken ? `Bearer ${cookieToken}` : undefined);

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/campaigns/admin/${params.id}`, {
      method: "DELETE",
      headers: {
        ...(token ? { Authorization: token } : {}),
      },
    });

    const json = await backendRes.json().catch(() => ({}));

    if (backendRes.ok) {
      return NextResponse.json({
        success: true,
        message: "Campaign permanently deleted",
        data: json.data,
      });
    }

    return NextResponse.json(
      { error: json?.error?.message || "Failed to delete campaign from database" },
      { status: backendRes.status || 400 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
