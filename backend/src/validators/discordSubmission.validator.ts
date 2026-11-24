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

export const discordSubmissionSchema = z.object({
  discordUsername: z
    .string()
    .trim()
    .min(2, "Discord username must be at least 2 characters")
    .max(37, "Discord username cannot exceed 37 characters")
    .regex(/^[^@#:]{2,32}(#\d{4})?$/, "Please enter a valid Discord username (e.g. username or username#1234)"),
  instagramUrl: urlOrEmpty,
  youtubeUrl: urlOrEmpty,
  tiktokUrl: urlOrEmpty,
  otherPlatform: z.string().trim().max(50).optional().or(z.literal("")),
  otherPlatformUrl: urlOrEmpty,
  additionalInfo: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const reviewDiscordSubmissionSchema = z.object({
  status: z.enum(["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"]),
  adminNotes: z.string().trim().max(2000).optional().or(z.literal("")),
});
