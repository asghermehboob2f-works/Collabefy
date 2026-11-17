import { z } from "zod";

export const campaignCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and dashes").optional(),
  brandName: z.string().min(2, "Brand name required"),
  brandLogoUrl: z.string().url().optional().or(z.literal("")),
  coverImage: z.string().url().optional().or(z.literal("")),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(2, "Category required"),
  tags: z.array(z.string()).default([]),
  totalBudget: z.number().positive("Total budget must be greater than 0"),
  rewardRateCpm: z.number().positive("Reward rate CPM must be greater than 0"),
  status: z.enum(["DRAFT", "SCHEDULED", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"]).default("DRAFT"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  platforms: z.array(z.string()).default(["TikTok", "Instagram Reels", "YouTube Shorts"]),
  minFollowers: z.number().nonnegative().default(0),
  formats: z.array(z.string()).default(["9:16 vertical"]),
  allowedCountries: z.array(z.string()).default(["ALL"]),
  brief: z.record(z.any()).default({}),
  rules: z.array(z.string()).default([]),
  discordChannel: z.string().optional(),
  featured: z.boolean().default(false),
  featuredOrder: z.number().default(99),
});

export const campaignUpdateSchema = campaignCreateSchema.partial();
