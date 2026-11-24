import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username may only contain letters, numbers, underscores, and hyphens")
    .optional(),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  passwordConfirmation: z.string().optional(),
  role: z.enum(["CREATOR", "BRAND"]).default("CREATOR"),
  displayName: z.string().min(2, "Name must be at least 2 characters").optional(),
  handle: z.string().min(2, "Handle must be at least 2 characters").optional(),
  companyName: z.string().min(2, "Company name must be at least 2 characters").optional(),
});

export const loginSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().optional(),
    password: z.string().min(1, "Password is required"),
  })
  .refine((data) => Boolean(data.username || data.email), {
    message: "Username or Email is required",
    path: ["username"],
  });

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).optional(),
  avatarUrl: z.string().optional(),
  bio: z.string().max(500).optional(),
  walletAddress: z.string().optional(),
  stripeAccountId: z.string().optional(),
  socialAccounts: z.string().optional(),
  portfolioLinks: z.string().optional(),
  companyName: z.string().optional(),
  logoUrl: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().optional(),
});
