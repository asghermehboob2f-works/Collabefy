import { NextRequest, NextResponse } from "next/server";
import { updateCampaign, deleteCampaign, getCampaigns } from "@/lib/data";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || "http://localhost:4000";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("authorization");

    // 1. Forward to backend Express database
    let backendData: any = null;
    try {
      const backendRes = await fetch(`${BACKEND_URL}/api/v1/campaigns/admin/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
      });
      if (backendRes.ok) {
        const json = await backendRes.json();
        backendData = json.data;
      }
    } catch {}

    // 2. Sync to in-memory store
    const updated = updateCampaign(params.id, body);

    return NextResponse.json({
      success: true,
      message: "Campaign updated successfully",
      data: backendData || updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");

    // 1. Forward to backend Express database
    try {
      await fetch(`${BACKEND_URL}/api/v1/campaigns/admin/${params.id}`, {
        method: "DELETE",
        headers: {
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
      });
    } catch {}

    // 2. Remove from local store
    deleteCampaign(params.id);

    return NextResponse.json({
      success: true,
      message: "Campaign permanently deleted",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
