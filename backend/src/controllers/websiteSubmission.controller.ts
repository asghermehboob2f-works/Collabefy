import { Request, Response, NextFunction } from "express";
import { prisma } from "../database/prisma.js";
import {
  websiteSubmissionSchema,
  reviewWebsiteSubmissionSchema,
} from "../validators/websiteSubmission.validator.js";
import { logAdminActivity } from "../middleware/auditLogger.js";

// 1. Creator: Submit or Update Own Website Creator Profile (Versioned)
export async function submitWebsiteCreatorProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    return;
  }

  const data = websiteSubmissionSchema.parse(req.body);
  const userId = req.user.userId;

  // Check if a submission exists for this user
  const existing = await prisma.websiteSubmission.findUnique({
    where: { userId },
  });

  if (existing) {
    const nextVersion = existing.currentVersion + 1;

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Create historical version record
      await tx.websiteSubmissionVersion.create({
        data: {
          submissionId: existing.id,
          versionNumber: nextVersion,
          instagramUrl: data.instagramUrl?.trim() || null,
          youtubeUrl: data.youtubeUrl?.trim() || null,
          tiktokUrl: data.tiktokUrl?.trim() || null,
          otherPlatform: data.otherPlatform?.trim() || null,
          otherPlatformUrl: data.otherPlatformUrl?.trim() || null,
          category: data.category?.trim() || null,
          bio: data.bio?.trim() || null,
          portfolioUrl: data.portfolioUrl?.trim() || null,
        },
      });

      // 2. Update active current submission record
      return await tx.websiteSubmission.update({
        where: { id: existing.id },
        data: {
          instagramUrl: data.instagramUrl?.trim() || null,
          youtubeUrl: data.youtubeUrl?.trim() || null,
          tiktokUrl: data.tiktokUrl?.trim() || null,
          otherPlatform: data.otherPlatform?.trim() || null,
          otherPlatformUrl: data.otherPlatformUrl?.trim() || null,
          category: data.category?.trim() || null,
          bio: data.bio?.trim() || null,
          portfolioUrl: data.portfolioUrl?.trim() || null,
          currentVersion: nextVersion,
          status: "PENDING", // Resets to pending upon updated profile
        },
        include: {
          versions: { orderBy: { versionNumber: "desc" } },
        },
      });
    });

    res.status(200).json({
      success: true,
      message: `Profile submission updated. Version ${nextVersion} saved.`,
      data: updated,
    });
    return;
  }

  // Brand new Website Submission (Version 1)
  const created = await prisma.$transaction(async (tx) => {
    const parent = await tx.websiteSubmission.create({
      data: {
        userId,
        instagramUrl: data.instagramUrl?.trim() || null,
        youtubeUrl: data.youtubeUrl?.trim() || null,
        tiktokUrl: data.tiktokUrl?.trim() || null,
        otherPlatform: data.otherPlatform?.trim() || null,
        otherPlatformUrl: data.otherPlatformUrl?.trim() || null,
        category: data.category?.trim() || null,
        bio: data.bio?.trim() || null,
        portfolioUrl: data.portfolioUrl?.trim() || null,
        currentVersion: 1,
        status: "PENDING",
      },
    });

    await tx.websiteSubmissionVersion.create({
      data: {
        submissionId: parent.id,
        versionNumber: 1,
        instagramUrl: data.instagramUrl?.trim() || null,
        youtubeUrl: data.youtubeUrl?.trim() || null,
        tiktokUrl: data.tiktokUrl?.trim() || null,
        otherPlatform: data.otherPlatform?.trim() || null,
        otherPlatformUrl: data.otherPlatformUrl?.trim() || null,
        category: data.category?.trim() || null,
        bio: data.bio?.trim() || null,
        portfolioUrl: data.portfolioUrl?.trim() || null,
      },
    });

    return parent;
  });

  const full = await prisma.websiteSubmission.findUnique({
    where: { id: created.id },
    include: { versions: { orderBy: { versionNumber: "desc" } } },
  });

  res.status(201).json({
    success: true,
    message: "Creator profile submitted successfully!",
    data: full,
  });
  } catch (err) {
    next(err);
  }
}

// 2. Creator: Get My Submission Details & Versions
export async function getMyWebsiteSubmission(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Authentication required" } });
    return;
  }

  const submission = await prisma.websiteSubmission.findUnique({
    where: { userId: req.user.userId },
    include: {
      versions: {
        orderBy: { versionNumber: "desc" },
      },
    },
  });

  res.json({
    success: true,
    data: submission, // returns null if no submission yet, frontend handles clean empty state
  });
}

// 3. Admin: Get all Website Submissions with pagination, filtering & search
export async function getAdminWebsiteSubmissions(req: Request, res: Response): Promise<void> {
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
      { user: { username: { contains: q } } },
      { user: { email: { contains: q } } },
      { category: { contains: q } },
      { instagramUrl: { contains: q } },
      { youtubeUrl: { contains: q } },
      { tiktokUrl: { contains: q } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "oldest") orderBy = { createdAt: "asc" };
  else if (sortBy === "version") orderBy = { currentVersion: "desc" };
  else if (sortBy === "updated") orderBy = { updatedAt: "desc" };

  const [totalCount, submissions] = await Promise.all([
    prisma.websiteSubmission.count({ where }),
    prisma.websiteSubmission.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
          },
        },
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

// 4. Admin: Get Single Website Submission with User & Full Versions History
export async function getAdminWebsiteSubmissionById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const submission = await prisma.websiteSubmission.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
        },
      },
      versions: {
        orderBy: { versionNumber: "desc" },
      },
    },
  });

  if (!submission) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Website submission not found" } });
    return;
  }

  res.json({ success: true, data: submission });
}

// 5. Admin: Update Review Status & Admin Notes
export async function updateAdminWebsiteSubmission(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const data = reviewWebsiteSubmissionSchema.parse(req.body);

  const existing = await prisma.websiteSubmission.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Website submission not found" } });
    return;
  }

  const updated = await prisma.websiteSubmission.update({
    where: { id },
    data: {
      status: data.status,
      adminNotes: data.adminNotes !== undefined ? data.adminNotes : existing.adminNotes,
      reviewedBy: req.user?.userId || "admin",
      reviewedAt: new Date(),
    },
    include: {
      user: { select: { id: true, username: true, email: true } },
      versions: { orderBy: { versionNumber: "desc" } },
    },
  });

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: "UPDATE_WEBSITE_SUBMISSION",
      targetResource: "WEBSITE_SUBMISSION",
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

// 6. Admin: Delete Website Submission (Atomic cascade)
export async function deleteAdminWebsiteSubmission(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.websiteSubmission.findUnique({ where: { id } });
  if (!existing) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Website submission not found" } });
    return;
  }

  await prisma.websiteSubmission.delete({ where: { id } });

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: "DELETE_WEBSITE_SUBMISSION",
      targetResource: "WEBSITE_SUBMISSION",
      targetId: id,
      previousValue: existing,
      req,
    });
  }

  res.json({ success: true, message: "Website submission deleted successfully" });
}

// 7. Admin: Export All Website Submissions (CSV or JSON)
export async function exportAdminWebsiteSubmissions(req: Request, res: Response): Promise<void> {
  const format = (req.query.format as string) || "json";

  const submissions = await prisma.websiteSubmission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, username: true, email: true } },
      versions: { orderBy: { versionNumber: "asc" } },
    },
  });

  if (format === "csv") {
    const headers = [
      "ID",
      "User ID",
      "Username",
      "Email",
      "Current Version",
      "Status",
      "Category",
      "Bio",
      "Portfolio URL",
      "Instagram URL",
      "YouTube URL",
      "TikTok URL",
      "Other Platform",
      "Other Platform URL",
      "Admin Notes",
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
      escapeCsv(s.userId),
      escapeCsv(s.user?.username),
      escapeCsv(s.user?.email),
      escapeCsv(s.currentVersion),
      escapeCsv(s.status),
      escapeCsv(s.category),
      escapeCsv(s.bio),
      escapeCsv(s.portfolioUrl),
      escapeCsv(s.instagramUrl),
      escapeCsv(s.youtubeUrl),
      escapeCsv(s.tiktokUrl),
      escapeCsv(s.otherPlatform),
      escapeCsv(s.otherPlatformUrl),
      escapeCsv(s.adminNotes),
      escapeCsv(s.createdAt.toISOString()),
      escapeCsv(s.updatedAt.toISOString()),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="website-submissions-${Date.now()}.csv"`);
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
