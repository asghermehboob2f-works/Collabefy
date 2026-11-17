import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/security";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed, resetInMs } = checkRateLimit(`admin:login:${ip}`, 10, 15 * 60 * 1000);
  if (!allowed) return rateLimitResponse(resetInMs);

  let body: { email?: string; password?: string; securityKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email = "", password = "" } = body;

  try {
    // Authenticate with the real backend API
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        { error: data?.error?.message || "Invalid credentials. Access denied." },
        { status: backendRes.status || 401 }
      );
    }

    const user = data.data.user;
    const token = data.data.accessToken;

    const allowedAdminRoles = ["SUPER_ADMIN", "ADMIN", "CAMPAIGN_MANAGER", "FINANCE_MANAGER", "SUPPORT_MANAGER"];
    if (!allowedAdminRoles.includes(user.role)) {
      return NextResponse.json(
        { error: "Access denied. Account does not have administrative clearance." },
        { status: 403 }
      );
    }

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        department: user.adminProfile?.department || "Platform Staff",
      },
    });

    // Set secure cookies
    response.cookies.set("collabefy_role", user.role.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60,
      path: "/",
    });

    response.cookies.set("collabefy_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[ADMIN LOGIN ERROR]", err);
    return NextResponse.json(
      { error: "Authentication service unavailable. Please check backend connection." },
      { status: 503 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("collabefy_role");
  response.cookies.delete("collabefy_admin_token");
  return response;
}
