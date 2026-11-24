import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import {
  discordSubmissionSchema,
  reviewDiscordSubmissionSchema,
} from "../validators/discordSubmission.validator.js";
import { logAdminActivity } from "../middleware/auditLogger.js";

// Normalize Discord username for matching
export function normalizeDiscordUsername(username: string): string {
  return username
    .trim()
    .toLowerCase()
    .replace(/^@+/, "");
}

// 1. Public: Submit or Update Discord Creator Submission (Versioned)
export async function submitDiscord(req: Request, res: Response): Promise<void> {
  const data = discordSubmissionSchema.parse(req.body);
  const normalized = normalizeDiscordUsername(data.discordUsername);
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "client-ip";

  // Check if a submission already exists for this normalized Discord identity
  const existing = await prisma.discordSubmission.findUnique({
    where: { normalizedDiscord: normalized },
    include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } },
  });

  if (existing) {
    const nextVersion = existing.currentVersion + 1;

    // Transaction to create new version snapshot and update latest fields
    const updated = await prisma.$transaction(async (tx) => {
      // 1. Snapshot the new submission into versions history
      await tx.discordSubmissionVersion.create({
        data: {
          submissionId: existing.id,
          versionNumber: nextVersion,
          discordUsername: data.discordUsername.trim(),
          instagramUrl: data.instagramUrl?.trim() || null,
          youtubeUrl: data.youtubeUrl?.trim() || null,
          tiktokUrl: data.tiktokUrl?.trim() || null,
          otherPlatform: data.otherPlatform?.trim() || null,
          otherPlatformUrl: data.otherPlatformUrl?.trim() || null,
          additionalInfo: data.additionalInfo?.trim() || null,
          ipAddress: ip,
        },
      });

      // 2. Update the parent submission with current active details
      return await tx.discordSubmission.update({
        where: { id: existing.id },
        data: {
          discordUsername: data.discordUsername.trim(),
          instagramUrl: data.instagramUrl?.trim() || null,
          youtubeUrl: data.youtubeUrl?.trim() || null,
          tiktokUrl: data.tiktokUrl?.trim() || null,
          otherPlatform: data.otherPlatform?.trim() || null,
          otherPlatformUrl: data.otherPlatformUrl?.trim() || null,
          additionalInfo: data.additionalInfo?.trim() || null,
          currentVersion: nextVersion,
          status: "PENDING", // Resets to pending review on new version
          ipAddress: ip,
        },
      });
    });

    res.status(200).json({
      success: true,
      message: `Submission updated successfully! Version ${nextVersion} recorded.`,
      data: {
        id: updated.id,
        discordUsername: updated.discordUsername,
        currentVersion: updated.currentVersion,
        status: updated.status,
        isUpdate: true,
      },
    });
    return;
  }

  // Create brand new Discord submission (Version 1)
  const created = await prisma.$transaction(async (tx) => {
    const parent = await tx.discordSubmission.create({
      data: {
        discordUsername: data.discordUsername.trim(),
        normalizedDiscord: normalized,
        instagramUrl: data.instagramUrl?.trim() || null,
        youtubeUrl: data.youtubeUrl?.trim() || null,
        tiktokUrl: data.tiktokUrl?.trim() || null,
        otherPlatform: data.otherPlatform?.trim() || null,
        otherPlatformUrl: data.otherPlatformUrl?.trim() || null,
        additionalInfo: data.additionalInfo?.trim() || null,
        currentVersion: 1,
        status: "PENDING",
        ipAddress: ip,
      },
    });

    await tx.discordSubmissionVersion.create({
      data: {
        submissionId: parent.id,
        versionNumber: 1,
        discordUsername: data.discordUsername.trim(),
        instagramUrl: data.instagramUrl?.trim() || null,
        youtubeUrl: data.youtubeUrl?.trim() || null,
        tiktokUrl: data.tiktokUrl?.trim() || null,
        otherPlatform: data.otherPlatform?.trim() || null,
        otherPlatformUrl: data.otherPlatformUrl?.trim() || null,
        additionalInfo: data.additionalInfo?.trim() || null,
        ipAddress: ip,
      },
    });

    return parent;
  });

  res.status(201).json({
    success: true,
    message: "Discord creator profile submitted successfully!",
    data: {
      id: created.id,
      discordUsername: created.discordUsername,
      currentVersion: 1,
      status: created.status,
      isUpdate: false,
    },
  });
}

// 2. Admin: Get all Discord Submissions with pagination, filtering & search
export async function getAdminDiscordSubmissions(req: Request, res: Response): Promise<void> {
  const { page = "1", limit = "15", search = "", status = "ALL", sortBy = "newest" } = req.query;

  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit as string) || 15));
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};
  if (status && status !== "ALL") {
    where.status = status;
  }
  if (search && typeof search === "string" && search.trim() !== "") {
    const q = search.trim().toLowerCase();
    where.OR = [
      { discordUsername: { contains: q } },
      { normalizedDiscord: { contains: q } },
      { instagramUrl: { contains: q } },
      { youtubeUrl: { contains: q } },
      { tiktokUrl: { contains: q } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "oldest") orderBy = { createdAt: "asc" };
  else if (sortBy === "username") orderBy = { discordUsername: "asc" };
  else if (sortBy === "version") orderBy = { currentVersion: "desc" };
  else if (sortBy === "updated") orderBy = { updatedAt: "desc" };

  const [totalCount, submissions] = await Promise.all([
    prisma.discordSubmission.count({ where }),
    prisma.discordSubmission.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: {
        _count: { select: { versions: true } },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / limitNum));

  res.json({
    success: true,
    data: submissions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalCount,
      totalPages,
      hasMore: pageNum < totalPages,
    },
  });
}

// 3. Admin: Get Single Discord Submission with Full Version History
export async function getAdminDiscordSubmissionById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const submission = await prisma.discordSubmission.findUnique({
    where: { id },
    include: {
      versions: {
        orderBy: { versionNumber: "desc" },
      },
    },
  });

  if (!submission) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Discord submission not found" } });
    return;
  }

  res.json({ success: true, data: submission });
}

// 4. Admin: Update Status and Notes
export async function updateAdminDiscordSubmission(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const data = reviewDiscordSubmissionSchema.parse(req.body);

  const existing = await prisma.discordSubmission.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Discord submission not found" } });
    return;
  }

  const updated = await prisma.discordSubmission.update({
    where: { id },
    data: {
      status: data.status,
      adminNotes: data.adminNotes !== undefined ? data.adminNotes : existing.adminNotes,
      reviewedBy: req.user?.userId || "admin",
      reviewedAt: new Date(),
    },
    include: {
      versions: { orderBy: { versionNumber: "desc" } },
    },
  });

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: "UPDATE_DISCORD_SUBMISSION",
      targetResource: "DISCORD_SUBMISSION",
      targetId: id,
      previousValue: { status: existing.status, adminNotes: existing.adminNotes },
      newValue: { status: data.status, adminNotes: data.adminNotes },
      req,
    });
  }

  res.json({
    success: true,
    message: "Submission status updated successfully",
    data: updated,
  });
}

// 5. Admin: Delete Discord Submission (Atomic cascade)
export async function deleteAdminDiscordSubmission(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.discordSubmission.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Discord submission not found" } });
    return;
  }

  await prisma.discordSubmission.delete({ where: { id } });

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: "DELETE_DISCORD_SUBMISSION",
      targetResource: "DISCORD_SUBMISSION",
      targetId: id,
      previousValue: existing,
      req,
    });
  }

  res.json({ success: true, message: "Discord submission deleted successfully" });
}

// 6. Admin: Export All Discord Submissions (CSV or JSON)
export async function exportAdminDiscordSubmissions(req: Request, res: Response): Promise<void> {
  const format = (req.query.format as string) || "json";

  const submissions = await prisma.discordSubmission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      versions: {
        orderBy: { versionNumber: "asc" },
      },
    },
  });

  if (format === "csv") {
    const headers = [
      "ID",
      "Discord Username",
      "Normalized Handle",
      "Current Version",
      "Status",
      "Instagram URL",
      "YouTube URL",
      "TikTok URL",
      "Other Platform",
      "Other Platform URL",
      "Additional Info",
      "Admin Notes",
      "IP Address",
      "Created At",
      "Updated At",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = submissions.map((s) => [
      escapeCsv(s.id),
      escapeCsv(s.discordUsername),
      escapeCsv(s.normalizedDiscord),
      escapeCsv(s.currentVersion),
      escapeCsv(s.status),
      escapeCsv(s.instagramUrl),
      escapeCsv(s.youtubeUrl),
      escapeCsv(s.tiktokUrl),
      escapeCsv(s.otherPlatform),
      escapeCsv(s.otherPlatformUrl),
      escapeCsv(s.additionalInfo),
      escapeCsv(s.adminNotes),
      escapeCsv(s.ipAddress),
      escapeCsv(s.createdAt.toISOString()),
      escapeCsv(s.updatedAt.toISOString()),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="discord-submissions-${Date.now()}.csv"`);
    res.status(200).send(csvContent);
    return;
  }

  res.json({
    success: true,
    data: submissions,
    exportedAt: new Date().toISOString(),
    totalCount: submissions.length,
  });
}
