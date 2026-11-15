import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "collabefy-api",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: "operational",
    verificationBot: "connected",
  });
}

