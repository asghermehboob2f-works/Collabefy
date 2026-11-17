import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { logAdminActivity } from "../middleware/auditLogger.js";

// Overview metrics for the Admin Dashboard
export async function getAdminOverview(req: Request, res: Response): Promise<void> {
  // 1. Campaigns stats
  const activeCampaignsCount = await prisma.campaign.count({ where: { status: "ACTIVE" } });
  const totalCampaignsCount = await prisma.campaign.count();

  // 2. Verified views sum and allocations
  const verifiedSubmissions = await prisma.contentSubmission.aggregate({
    where: { status: "VERIFIED" },
    _sum: { verifiedViews: true, rewardAmount: true },
    _count: { id: true },
  });

  const campaigns = await prisma.campaign.findMany({
    select: { totalBudget: true, allocatedBudget: true },
  });
  const totalEscrowBudget = campaigns.reduce((acc, c) => acc + c.totalBudget, 0);

  // 3. User counts
  const creatorCount = await prisma.user.count({ where: { role: "CREATOR" } });
  const brandCount = await prisma.user.count({ where: { role: "BRAND" } });

  // 4. Pending review queues
  const pendingSubmissionsCount = await prisma.contentSubmission.count({ where: { status: "PENDING" } });
  const pendingWithdrawalsCount = await prisma.withdrawalRequest.count({ where: { status: "PENDING" } });
  const openTicketsCount = await prisma.supportTicket.count({ where: { status: "OPEN" } });

  // 5. Recent Submissions
  const recentSubmissions = await prisma.contentSubmission.findMany({
    take: 5,
    orderBy: { submittedAt: "desc" },
    include: {
      campaign: { select: { title: true, rewardRateCpm: true } },
      creator: { select: { creatorProfile: { select: { displayName: true, handle: true } } } },
    },
  });

  // 6. Recent Audit Logs
  const recentAuditLogs = await prisma.adminAuditLog.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      admin: { select: { email: true, role: true } },
    },
  });

  res.json({
    success: true,
    data: {
      metrics: {
        activeCampaignsCount,
        totalCampaignsCount,
        totalVerifiedViews: verifiedSubmissions._sum.verifiedViews || 0,
        totalRewardedUsd: verifiedSubmissions._sum.rewardAmount || 0,
        totalEscrowBudget,
        creatorCount,
        brandCount,
        pendingSubmissionsCount,
        pendingWithdrawalsCount,
        openTicketsCount,
      },
      recentSubmissions,
      recentAuditLogs,
    },
  });
}

// Platform Settings
export async function getPlatformSettings(req: Request, res: Response): Promise<void> {
  const settings = await prisma.platformSetting.findMany({
    orderBy: { key: "asc" },
  });

  res.json({ success: true, data: settings });
}

export async function updatePlatformSettings(req: Request, res: Response): Promise<void> {
  const settingsObj = req.body; // e.g. { platform_fee_percent: "12", min_withdrawal_usd: "50" }

  const updatedSettings: any[] = [];

  for (const [key, value] of Object.entries(settingsObj)) {
    if (typeof value === "string" || typeof value === "number") {
      const updated = await prisma.platformSetting.upsert({
        where: { key },
        update: { value: String(value), updatedBy: req.user?.userId },
        create: { key, value: String(value), updatedBy: req.user?.userId },
      });
      updatedSettings.push(updated);
    }
  }

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: "PLATFORM_SETTINGS_UPDATE",
      targetResource: "PLATFORM_SETTINGS",
      newValue: settingsObj,
      req,
    });
  }

  res.json({ success: true, data: updatedSettings });
}

// Audit Logs
export async function getAdminAuditLogs(req: Request, res: Response): Promise<void> {
  const { action, targetResource, page = "1", limit = "20" } = req.query;

  const pageNum = parseInt(page as string, 10) || 1;
  const pageSize = parseInt(limit as string, 10) || 20;

  const where: any = {};
  if (action && typeof action === "string" && action !== "ALL") {
    where.action = { contains: action };
  }
  if (targetResource && typeof targetResource === "string" && targetResource !== "ALL") {
    where.targetResource = targetResource;
  }

  const [total, logs] = await Promise.all([
    prisma.adminAuditLog.count({ where }),
    prisma.adminAuditLog.findMany({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        admin: {
          select: {
            email: true,
            role: true,
            adminProfile: { select: { department: true } },
          },
        },
      },
    }),
  ]);

  res.json({
    success: true,
    data: {
      logs,
      pagination: {
        total,
        page: pageNum,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    },
  });
}
