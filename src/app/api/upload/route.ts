import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { checkRateLimit, rateLimitResponse } from "@/lib/security";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "client-ip";
  const limit = checkRateLimit(`upload-${ip}`, 25, 60 * 1000);
  if (!limit.allowed) {
    return rateLimitResponse(limit.resetInMs);
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided in form data" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: ${file.type}. Allowed types: JPEG, PNG, WebP, GIF, SVG.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds 5MB limit. Actual size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate safe, collision-resistant filename
    const ext = EXTENSION_MAP[file.type] || path.extname(file.name) || ".jpg";
    const randomHex = crypto.randomBytes(8).toString("hex");
    const safeFilename = `upload_${Date.now()}_${randomHex}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, safeFilename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFilename}`;

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename: safeFilename,
        size: file.size,
        mimeType: file.type,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[UPLOAD_ERROR]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
