import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, verifiedViews, rejectionReason } = body;

    return NextResponse.json({
      success: true,
      message: `Submission ${params.id} updated to ${status}`,
      updated: {
        id: params.id,
        status,
        verifiedViews,
        rejectionReason,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

