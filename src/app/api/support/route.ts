import { NextRequest, NextResponse } from "next/server";
import { supportTicketSchema, checkRateLimit, rateLimitResponse } from "@/lib/security";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "client-ip";
  const limit = checkRateLimit(`support-${ip}`, 10, 60 * 1000);
  if (!limit.allowed) {
    return rateLimitResponse(limit.resetInMs);
  }

  try {
    const body = await request.json();
    const validated = supportTicketSchema.parse(body);

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/support/inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      return NextResponse.json(data, { status: 201 });
    }

    const errData = await backendRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: errData.error?.message || "Failed to submit support ticket to database" },
      { status: backendRes.status || 500 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: "Validation Error", details: err.errors || err.message },
      { status: 400 }
    );
  }
}
