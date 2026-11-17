import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { logAdminActivity } from "../middleware/auditLogger.js";
import { z } from "zod";

const withdrawalSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  paymentMethod: z.enum(["STRIPE", "USDC", "BANK_WIRE"]).default("STRIPE"),
  destinationDetails: z.string().min(3, "Destination account details required"),
});

const withdrawalReviewSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "PROCESSED", "FAILED"]),
  transactionReference: z.string().optional(),
  failureReason: z.string().optional(),
});

// Creator: Get balance and ledger history
export async function getCreatorBalance(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: req.user.userId },
  });

  const ledger = await prisma.earningsLedger.findMany({
    where: { creatorId: req.user.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const withdrawals = await prisma.withdrawalRequest.findMany({
    where: { creatorId: req.user.userId },
    orderBy: { requestedAt: "desc" },
    take: 20,
  });

  res.json({
    success: true,
    data: {
      totalEarnings: profile?.totalEarnings || 0,
      totalViews: profile?.totalViews || 0,
      ledger,
      withdrawals,
    },
  });
}

// Creator: Request withdrawal
export async function requestWithdrawal(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  const data = withdrawalSchema.parse(req.body);

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId: req.user.userId },
  });

  if (!profile || profile.totalEarnings < data.amount) {
    res.status(400).json({
      success: false,
      error: { code: "INSUFFICIENT_FUNDS", message: "Insufficient earnings balance for this withdrawal" },
    });
    return;
  }

  const minSetting = await prisma.platformSetting.findUnique({ where: { key: "min_withdrawal_usd" } });
  const minAmount = minSetting ? parseFloat(minSetting.value) : 50;

  if (data.amount < minAmount) {
    res.status(400).json({
      success: false,
      error: { code: "BELOW_MINIMUM", message: `Minimum withdrawal amount is $${minAmount}` },
    });
    return;
  }

  const withdrawal = await prisma.withdrawalRequest.create({
    data: {
      creatorId: req.user.userId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      destinationDetails: data.destinationDetails,
      status: "PENDING",
    },
  });

  res.status(201).json({ success: true, data: withdrawal });
}

// Admin: Financial Overview Metrics
export async function getAdminFinanceOverview(req: Request, res: Response): Promise<void> {
  const campaigns = await prisma.campaign.findMany({
    select: { totalBudget: true, allocatedBudget: true },
  });

  const totalEscrowPools = campaigns.reduce((acc, c) => acc + c.totalBudget, 0);
  const totalAllocatedEarnings = campaigns.reduce((acc, c) => acc + c.allocatedBudget, 0);

  const pendingWithdrawals = await prisma.withdrawalRequest.aggregate({
    where: { status: "PENDING" },
    _sum: { amount: true },
    _count: { id: true },
  });

  const processedWithdrawals = await prisma.withdrawalRequest.aggregate({
    where: { status: "PROCESSED" },
    _sum: { amount: true },
    _count: { id: true },
  });

  res.json({
    success: true,
    data: {
      totalEscrowPools,
      totalAllocatedEarnings,
      remainingUnclaimedEscrow: totalEscrowPools - totalAllocatedEarnings,
      pendingWithdrawalsSum: pendingWithdrawals._sum.amount || 0,
      pendingWithdrawalsCount: pendingWithdrawals._count.id || 0,
      totalPaidOutUsd: processedWithdrawals._sum.amount || 0,
      totalProcessedWithdrawalsCount: processedWithdrawals._count.id || 0,
    },
  });
}

// Admin: List all withdrawals
export async function getAdminWithdrawals(req: Request, res: Response): Promise<void> {
  const { status } = req.query;

  const where: any = {};
  if (status && typeof status === "string" && status !== "ALL") {
    where.status = status;
  }

  const withdrawals = await prisma.withdrawalRequest.findMany({
    where,
    orderBy: { requestedAt: "desc" },
    include: {
      creator: {
        select: {
          id: true,
          email: true,
          creatorProfile: {
            select: { displayName: true, handle: true, totalEarnings: true },
          },
        },
      },
    },
  });

  res.json({ success: true, data: withdrawals });
}

// Admin: Review/Process Withdrawal
export async function reviewWithdrawal(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const data = withdrawalReviewSchema.parse(req.body);

  const withdrawal = await prisma.withdrawalRequest.findUnique({
    where: { id },
    include: { creator: { include: { creatorProfile: true } } },
  });

  if (!withdrawal) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Withdrawal not found" } });
    return;
  }

  const previousStatus = withdrawal.status;

  if (data.status === "PROCESSED" || data.status === "APPROVED") {
    await prisma.$transaction(async (tx) => {
      // Deduct balance
      const currentBalance = withdrawal.creator.creatorProfile?.totalEarnings || 0;
      const newBalance = Math.max(0, currentBalance - withdrawal.amount);

      await tx.creatorProfile.update({
        where: { userId: withdrawal.creatorId },
        data: { totalEarnings: newBalance },
      });

      // Create ledger debit entry
      await tx.earningsLedger.create({
        data: {
          creatorId: withdrawal.creatorId,
          amount: -withdrawal.amount,
          type: "WITHDRAWAL_DEBIT",
          balanceAfter: newBalance,
          referenceId: `WITHDRAW-${withdrawal.id}`,
          description: `Payout via ${withdrawal.paymentMethod}: Ref ${data.transactionReference || "SETTLED"}`,
        },
      });

      // Update withdrawal request
      await tx.withdrawalRequest.update({
        where: { id },
        data: {
          status: data.status,
          transactionReference: data.transactionReference,
          approvedBy: req.user?.userId || "ADMIN",
          processedAt: new Date(),
        },
      });

      // Notify user
      await tx.notification.create({
        data: {
          userId: withdrawal.creatorId,
          title: "Withdrawal Disbursed",
          message: `Your withdrawal of $${withdrawal.amount.toFixed(2)} has been processed via ${withdrawal.paymentMethod}. Ref: ${data.transactionReference || "PROCESSED"}`,
          type: "PAYMENT",
          link: "/dashboard/earnings",
        },
      });
    });
  } else {
    // If rejected or failed
    await prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status: data.status,
        failureReason: data.failureReason,
        approvedBy: req.user?.userId || "ADMIN",
      },
    });

    await prisma.notification.create({
      data: {
        userId: withdrawal.creatorId,
        title: "Withdrawal Not Processed",
        message: `Your withdrawal request for $${withdrawal.amount.toFixed(2)} was not processed: ${data.failureReason || "Reason not specified"}`,
        type: "PAYMENT",
        link: "/dashboard/earnings",
      },
    });
  }

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: `WITHDRAWAL_${data.status}`,
      targetResource: "WITHDRAWAL_REQUEST",
      targetId: id,
      previousValue: { status: previousStatus },
      newValue: { status: data.status, transactionReference: data.transactionReference },
      req,
    });
  }

  res.json({ success: true, message: `Withdrawal status updated to ${data.status}` });
}

// Admin: Global Ledger History
export async function getAdminLedger(req: Request, res: Response): Promise<void> {
  const { type, creatorId } = req.query;

  const where: any = {};
  if (type && typeof type === "string" && type !== "ALL") {
    where.type = type;
  }
  if (creatorId && typeof creatorId === "string") {
    where.creatorId = creatorId;
  }

  const ledger = await prisma.earningsLedger.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      creator: {
        select: {
          email: true,
          creatorProfile: { select: { displayName: true, handle: true } },
        },
      },
      campaign: {
        select: { title: true },
      },
    },
  });

  res.json({ success: true, data: ledger });
}
