import { z } from "zod";
import { NextResponse } from "next/server";

// Rate limiting in-memory store
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * In-memory sliding rate limiter.
 * @param key unique identifier (e.g. IP or user ID + action)
 * @param maxRequests maximum allowed requests per window
 * @param windowMs window size in milliseconds
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 30,
  windowMs: number = 60 * 1000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetInMs: windowMs };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetInMs: Math.max(0, record.resetAt - now) };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count, resetInMs: record.resetAt - now };
}

/**
 * Rate limit response helper (HTTP 429 Too Many Requests)
 */
export function rateLimitResponse(resetInMs: number) {
  return NextResponse.json(
    {
      error: "Too Many Requests",
      message: `Rate limit exceeded. Please retry after ${Math.ceil(resetInMs / 1000)} seconds.`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": Math.ceil(resetInMs / 1000).toString(),
      },
    }
  );
}

// Zod Validation Schemas
export const submissionSchema = z.object({
  campaignId: z.string().min(1, "Campaign ID is required"),
  platform: z.enum(["tiktok", "youtube_shorts", "instagram_reels", "x"]),
  contentUrl: z.string().url("Must be a valid published URL"),
  creatorHandle: z.string().min(2, "Creator handle must be at least 2 characters"),
  estimatedViews: z.number().int().nonnegative().optional(),
});

export const supportTicketSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Must be a valid email address"),
  inquiryType: z.enum(["creator_support", "brand_campaign"]),
  category: z.string().optional(),
  subject: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export const campaignCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  slug: z.string().min(3).max(120),
  brandName: z.string().min(2).max(60),
  brandCategory: z.string().min(2),
  summary: z.string().min(10).max(300),
  description: z.string().min(20).max(2000),
  totalBudget: z.number().positive("Budget must be greater than zero"),
  rewardRate: z.number().positive("Reward rate must be greater than zero"),
  platforms: z.array(z.string()).min(1, "At least one platform is required"),
  startDate: z.string(),
  endDate: z.string(),
  discordInviteUrl: z.string().url().optional(),
  discordChannelName: z.string().optional(),
});
