import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { logAdminActivity } from "../middleware/auditLogger.js";

export async function getAdminCreators(req: Request, res: Response): Promise<void> {
  const { search, status, verified } = req.query;

  const where: any = {
    role: "CREATOR",
  };

  if (status && typeof status === "string" && status !== "ALL") {
    where.status = status;
  }

  if (verified && typeof verified === "string" && verified !== "ALL") {
    where.creatorProfile = {
      isVerified: verified === "true",
    };
  }

  if (search && typeof search === "string" && search.trim() !== "") {
    where.OR = [
      { email: { contains: search.trim() } },
      { creatorProfile: { displayName: { contains: search.trim() } } },
      { creatorProfile: { handle: { contains: search.trim() } } },
    ];
  }

  const creators = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      status: true,
      createdAt: true,
      lastLoginAt: true,
      creatorProfile: true,
      _count: {
        select: {
          submissions: true,
          applications: true,
        },
      },
    },
  });

  res.json({ success: true, data: creators });
}

export async function getAdminCreatorDetail(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const creator = await prisma.user.findUnique({
    where: { id },
    include: {
      creatorProfile: true,
      submissions: {
        orderBy: { submittedAt: "desc" },
        include: { campaign: { select: { title: true, rewardRateCpm: true } } },
      },
      applications: {
        include: { campaign: { select: { title: true } } },
      },
      ledgerEntries: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
      withdrawals: {
        orderBy: { requestedAt: "desc" },
      },
    },
  });

  if (!creator) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Creator not found" } });
    return;
  }

  res.json({ success: true, data: creator });
}

export async function updateCreatorStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status, isVerified } = req.body;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { creatorProfile: true },
  });

  if (!user) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Creator not found" } });
    return;
  }

  const previousValue = { status: user.status, isVerified: user.creatorProfile?.isVerified };

  if (status) {
    await prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  if (isVerified !== undefined && user.creatorProfile) {
    await prisma.creatorProfile.update({
      where: { userId: id },
      data: { isVerified: Boolean(isVerified) },
    });
  }

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: "CREATOR_STATUS_UPDATE",
      targetResource: "USER",
      targetId: id,
      previousValue,
      newValue: { status, isVerified },
      req,
    });
  }

  res.json({ success: true, message: "Creator status updated" });
}
