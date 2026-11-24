import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { submissionCreateSchema, submissionReviewSchema } from "../validators/submission.validator.js";
import { logAdminActivity } from "../middleware/auditLogger.js";

// Creator: Submit clip for verification
export async function createSubmission(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  const data = submissionCreateSchema.parse(req.body);

  const campaign = await prisma.campaign.findFirst({
    where: {
      OR: [
        { id: data.campaignId },
        { slug: data.campaignId },
      ],
    },
  });

  if (!campaign) {
    res.status(404).json({ success: false, error: { code: "CAMPAIGN_NOT_FOUND", message: "Campaign not found" } });
    return;
  }

  if (campaign.status !== "ACTIVE") {
    res.status(400).json({
      success: false,
      error: { code: "CAMPAIGN_INACTIVE", message: "Campaign is not accepting new submissions" },
    });
    return;
  }

  const submission = await prisma.contentSubmission.create({
    data: {
      campaignId: campaign.id,
      creatorId: req.user.userId,
      platform: data.platform,
      contentUrl: data.contentUrl,
      reportedViews: data.reportedViews || 0,
      status: "PENDING",
    },
    include: {
      campaign: {
        select: {
          title: true,
          rewardRateCpm: true,
        },
      },
    },
  });

  res.status(201).json({ success: true, data: submission });
}

// Creator: Get own submissions
export async function getMySubmissions(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  const submissions = await prisma.contentSubmission.findMany({
    where: { creatorId: req.user.userId },
    orderBy: { submittedAt: "desc" },
    include: {
      campaign: {
        select: {
          title: true,
          rewardRateCpm: true,
          slug: true,
        },
      },
    },
  });

  res.json({ success: true, data: submissions });
}

// Admin: List submissions with filters
export async function getAdminSubmissions(req: Request, res: Response): Promise<void> {
  const { status, campaignId, platform } = req.query;

  const where: any = {};
  if (status && typeof status === "string" && status !== "ALL") {
    where.status = status;
  }
  if (campaignId && typeof campaignId === "string" && campaignId !== "ALL") {
    where.campaignId = campaignId;
  }
  if (platform && typeof platform === "string" && platform !== "ALL") {
    where.platform = platform;
  }

  const submissions = await prisma.contentSubmission.findMany({
    where,
    orderBy: { submittedAt: "desc" },
    include: {
      campaign: {
        select: {
          title: true,
          rewardRateCpm: true,
          brandName: true,
        },
      },
      creator: {
        select: {
          id: true,
          email: true,
          creatorProfile: {
            select: {
              displayName: true,
              handle: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  res.json({ success: true, data: submissions });
}

// Admin: Review submission (Verified, Rejected, Flagged)
export async function reviewSubmission(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const data = submissionReviewSchema.parse(req.body);

  const submission = await prisma.contentSubmission.findUnique({
    where: { id },
    include: {
      campaign: true,
      creator: {
        include: { creatorProfile: true },
      },
    },
  });

  if (!submission) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Submission not found" } });
    return;
  }

  const previousStatus = submission.status;

  if (data.status === "VERIFIED") {
    const verifiedViews = data.verifiedViews !== undefined ? data.verifiedViews : submission.reportedViews;
    const rewardRate = submission.campaign.rewardRateCpm;
    const rewardAmount = Math.round(((verifiedViews / 1000) * rewardRate) * 100) / 100;

    // Use Prisma Transaction to ensure financial consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update submission
      const updatedSubmission = await tx.contentSubmission.update({
        where: { id },
        data: {
          status: "VERIFIED",
          verifiedViews,
          rewardAmount,
          auditNotes: data.auditNotes || "Audited and verified views.",
          reviewedBy: req.user?.userId || "SYSTEM",
          verifiedAt: new Date(),
        },
      });

      // 2. Fetch current balance
      const currentBalance = submission.creator.creatorProfile?.totalEarnings || 0;
      const newBalance = currentBalance + rewardAmount;

      // 3. Create Ledger entry
      const ledgerEntry = await tx.earningsLedger.create({
        data: {
          creatorId: submission.creatorId,
          submissionId: submission.id,
          campaignId: submission.campaignId,
          amount: rewardAmount,
          type: "REWARD_CREDIT",
          balanceAfter: newBalance,
          referenceId: `LEDGER-VERIFY-${submission.id}`,
          description: `Reward for ${verifiedViews.toLocaleString()} verified views on ${submission.campaign.title} (@ $${rewardRate}/1k CPM)`,
        },
      });

      // 4. Update Creator Profile
      await tx.creatorProfile.update({
        where: { userId: submission.creatorId },
        data: {
          totalEarnings: { increment: rewardAmount },
          totalViews: { increment: verifiedViews },
        },
      });

      // 5. Update Campaign allocated budget
      await tx.campaign.update({
        where: { id: submission.campaignId },
        data: {
          allocatedBudget: { increment: rewardAmount },
        },
      });

      // 6. Notify creator
      await tx.notification.create({
        data: {
          userId: submission.creatorId,
          title: "Submission Verified & Paid",
          message: `Your submission for ${submission.campaign.title} was verified for ${verifiedViews.toLocaleString()} views. $${rewardAmount.toFixed(2)} credited to your balance.`,
          type: "PAYMENT",
          link: "/dashboard/earnings",
        },
      });

      return { updatedSubmission, ledgerEntry };
    });

    if (req.user) {
      await logAdminActivity({
        adminId: req.user.userId,
        action: "SUBMISSION_VERIFIED",
        targetResource: "CONTENT_SUBMISSION",
        targetId: id,
        previousValue: { status: previousStatus },
        newValue: { status: "VERIFIED", rewardAmount, verifiedViews },
        req,
      });
    }

    res.json({ success: true, data: result.updatedSubmission });
    return;
  }

  // If rejected or flagged
  const updatedSubmission = await prisma.contentSubmission.update({
    where: { id },
    data: {
      status: data.status,
      rejectionReason: data.rejectionReason,
      auditNotes: data.auditNotes,
      reviewedBy: req.user?.userId || "SYSTEM",
    },
  });

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: `SUBMISSION_${data.status}`,
      targetResource: "CONTENT_SUBMISSION",
      targetId: id,
      previousValue: { status: previousStatus },
      newValue: { status: data.status, rejectionReason: data.rejectionReason },
      req,
    });
  }

  res.json({ success: true, data: updatedSubmission });
}
