import { z } from "zod";

export const submissionCreateSchema = z.object({
  campaignId: z.string().min(1, "Campaign ID is required"),
  platform: z.enum(["TikTok", "YouTube Shorts", "Instagram Reels"]),
  contentUrl: z.string().url("Valid video URL is required"),
  reportedViews: z.number().int().nonnegative().default(0),
});

export const submissionReviewSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED", "FLAGGED", "VERIFYING"]),
  verifiedViews: z.number().int().nonnegative().optional(),
  rejectionReason: z.string().optional(),
  auditNotes: z.string().optional(),
});
