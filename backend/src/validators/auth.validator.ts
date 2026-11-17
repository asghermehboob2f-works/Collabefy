import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["CREATOR", "BRAND"]).default("CREATOR"),
  displayName: z.string().min(2, "Name must be at least 2 characters").optional(),
  handle: z.string().min(2, "Handle must be at least 2 characters").optional(),
  companyName: z.string().min(2, "Company name must be at least 2 characters").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  walletAddress: z.string().optional(),
  stripeAccountId: z.string().optional(),
  socialAccounts: z.string().optional(),
  portfolioLinks: z.string().optional(),
  companyName: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().optional(),
});
