import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { logAdminActivity } from "../middleware/auditLogger.js";

// Public: Get CMS content by key
export async function getPublicCms(req: Request, res: Response): Promise<void> {
  const { key } = req.params;

  const content = await prisma.websiteContent.findUnique({
    where: { key },
  });

  if (!content) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "CMS key not found" } });
    return;
  }

  res.json({
    success: true,
    data: {
      ...content,
      content: JSON.parse(content.content),
    },
  });
}

// Admin: Get all CMS content
export async function getAdminCms(req: Request, res: Response): Promise<void> {
  const contents = await prisma.websiteContent.findMany({
    orderBy: { key: "asc" },
  });

  res.json({
    success: true,
    data: contents.map((c) => ({
      ...c,
      content: JSON.parse(c.content),
    })),
  });
}

// Admin: Update CMS content
export async function updateAdminCms(req: Request, res: Response): Promise<void> {
  const { key } = req.params;
  const { content, isPublished } = req.body;

  const existing = await prisma.websiteContent.findUnique({ where: { key } });

  const contentString = typeof content === "string" ? content : JSON.stringify(content);

  const updated = await prisma.websiteContent.upsert({
    where: { key },
    update: {
      content: contentString,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : undefined,
      version: existing ? existing.version + 1 : 1,
      updatedBy: req.user?.userId,
    },
    create: {
      key,
      section: req.body.section || "GENERAL",
      content: contentString,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      updatedBy: req.user?.userId,
    },
  });

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: "CMS_UPDATE",
      targetResource: "WEBSITE_CONTENT",
      targetId: key,
      previousValue: existing?.content,
      newValue: contentString,
      req,
    });
  }

  res.json({
    success: true,
    data: {
      ...updated,
      content: JSON.parse(updated.content),
    },
  });
}
