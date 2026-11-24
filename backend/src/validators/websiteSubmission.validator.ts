import { z } from "zod";

const urlOrEmpty = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      try {
        const parsed = new URL(val.startsWith("http") ? val : `https://${val}`);
        return Boolean(parsed.hostname);
      } catch {
        return false;
      }
    },
    { message: "Must be a valid URL" }
  )
  .optional()
  .or(z.literal(""));

export const websiteSubmissionSchema = z.object({
  instagramUrl: urlOrEmpty,
  youtubeUrl: urlOrEmpty,
  tiktokUrl: urlOrEmpty,
  otherPlatform: z.string().trim().max(50).optional().or(z.literal("")),
  otherPlatformUrl: urlOrEmpty,
  category: z.string().trim().max(60).optional().or(z.literal("")),
  bio: z.string().trim().max(1000).optional().or(z.literal("")),
  portfolioUrl: urlOrEmpty,
});

export const reviewWebsiteSubmissionSchema = z.object({
  status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"]),
  adminNotes: z.string().trim().max(2000).optional().or(z.literal("")),
});
