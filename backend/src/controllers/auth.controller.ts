import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { prisma } from "../database/prisma.js";
import { config } from "../config/env.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { registerSchema, loginSchema, updateProfileSchema } from "../validators/auth.validator.js";
import { logAdminActivity } from "../middleware/auditLogger.js";

export async function register(req: Request, res: Response): Promise<void> {
  const data = registerSchema.parse(req.body);

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase() },
  });

  if (existingUser) {
    res.status(400).json({
      success: false,
      error: { code: "EMAIL_EXISTS", message: "An account with this email already exists" },
    });
    return;
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role,
      status: "ACTIVE",
      creatorProfile:
        data.role === "CREATOR"
          ? {
              create: {
                displayName: data.displayName || data.email.split("@")[0],
                handle: data.handle || data.email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, ""),
              },
            }
          : undefined,
      brandProfile:
        data.role === "BRAND"
          ? {
              create: {
                companyName: data.companyName || "My Brand",
              },
            }
          : undefined,
    },
    include: {
      creatorProfile: true,
      brandProfile: true,
      adminProfile: true,
    },
  });

  const payload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const { token: refreshToken, hash: refreshHash } = generateRefreshToken(payload);

  // Store refresh token in DB
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: refreshHash,
      expiresAt,
      ipAddress: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
    },
  });

  setAuthCookies(res, accessToken, refreshToken);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        creatorProfile: user.creatorProfile,
        brandProfile: user.brandProfile,
        adminProfile: user.adminProfile,
      },
      accessToken,
    },
  });
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const cleanEmail = email.trim().replace(/^["']|["']$/g, "").toLowerCase();
    const cleanEnvEmail = config.adminEmail.trim().replace(/^["']|["']$/g, "").toLowerCase();
    const cleanEnvPass = config.adminPassword.trim().replace(/^["']|["']$/g, "");

    const isEnvAdmin =
      (cleanEmail === cleanEnvEmail ||
        cleanEmail === "admin" ||
        cleanEmail === (process.env.ADMIN_ID || "").toLowerCase()) &&
      password === cleanEnvPass;

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        creatorProfile: true,
        brandProfile: true,
        adminProfile: true,
      },
    });

    if (!user && isEnvAdmin) {
      const passwordHash = await hashPassword(password);
      user = await prisma.user.create({
        data: {
          email: config.adminEmail.toLowerCase(),
          passwordHash,
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          isEmailVerified: true,
          adminProfile: {
            create: {
              department: "Executive Management",
              permissions: JSON.stringify(["*"]),
            },
          },
        },
        include: {
          creatorProfile: true,
          brandProfile: true,
          adminProfile: true,
        },
      });
    }

    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      });
      return;
    }

    if (user.status === "SUSPENDED") {
      res.status(403).json({
        success: false,
        error: { code: "ACCOUNT_SUSPENDED", message: "This account has been suspended" },
      });
      return;
    }

    let isPasswordValid = isEnvAdmin && (user.role === "SUPER_ADMIN" || user.role === "ADMIN");
    if (!isPasswordValid) {
      isPasswordValid = await comparePassword(password, user.passwordHash);
    }

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      });
      return;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const { token: refreshToken, hash: refreshHash } = generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshHash,
        expiresAt,
        ipAddress: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
        userAgent: req.headers["user-agent"],
      },
    });

    setAuthCookies(res, accessToken, refreshToken);

    if (user.role.includes("ADMIN") || user.role === "SUPER_ADMIN") {
      await logAdminActivity({
        adminId: user.id,
        action: "ADMIN_LOGIN",
        targetResource: "AUTH",
        targetId: user.id,
        req,
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          status: user.status,
          creatorProfile: user.creatorProfile,
          brandProfile: user.brandProfile,
          adminProfile: user.adminProfile,
        },
        accessToken,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies?.collabefy_refresh || req.body?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({
      success: false,
      error: { code: "NO_REFRESH_TOKEN", message: "No refresh token provided" },
    });
    return;
  }

  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    clearAuthCookies(res);
    res.status(401).json({
      success: false,
      error: { code: "INVALID_REFRESH_TOKEN", message: "Refresh token expired or invalid" },
    });
    return;
  }

  const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash: hash },
    include: { user: true },
  });

  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
    clearAuthCookies(res);
    res.status(401).json({
      success: false,
      error: { code: "REFRESH_TOKEN_REVOKED", message: "Session expired or revoked" },
    });
    return;
  }

  // Revoke old token and issue new pair (rotation)
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  const newPayload = { userId: storedToken.user.id, email: storedToken.user.email, role: storedToken.user.role };
  const newAccessToken = generateAccessToken(newPayload);
  const { token: newRefreshToken, hash: newRefreshHash } = generateRefreshToken(newPayload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await prisma.refreshToken.create({
    data: {
      userId: storedToken.user.id,
      tokenHash: newRefreshHash,
      expiresAt,
      ipAddress: (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"],
    },
  });

  setAuthCookies(res, newAccessToken, newRefreshToken);

  res.json({
    success: true,
    data: {
      accessToken: newAccessToken,
    },
  });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies?.collabefy_refresh;
  if (refreshToken) {
    const hash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hash },
      data: { revokedAt: new Date() },
    });
  }

  clearAuthCookies(res);

  res.json({
    success: true,
    message: "Logged out successfully",
  });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Not authenticated" },
    });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    include: {
      creatorProfile: true,
      brandProfile: true,
      adminProfile: true,
    },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      error: { code: "USER_NOT_FOUND", message: "User not found" },
    });
    return;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        lastLoginAt: user.lastLoginAt,
        creatorProfile: user.creatorProfile,
        brandProfile: user.brandProfile,
        adminProfile: user.adminProfile,
      },
    },
  });
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  const data = updateProfileSchema.parse(req.body);

  if (req.user.role === "CREATOR") {
    const updated = await prisma.creatorProfile.update({
      where: { userId: req.user.userId },
      data: {
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        walletAddress: data.walletAddress,
        stripeAccountId: data.stripeAccountId,
        socialAccounts: data.socialAccounts,
        portfolioLinks: data.portfolioLinks,
      },
    });
    res.json({ success: true, data: updated });
    return;
  }

  if (req.user.role === "BRAND") {
    const updated = await prisma.brandProfile.update({
      where: { userId: req.user.userId },
      data: {
        companyName: data.companyName,
        logoUrl: data.logoUrl,
        website: data.website,
        industry: data.industry,
      },
    });
    res.json({ success: true, data: updated });
    return;
  }

  res.json({ success: true, message: "Profile updated" });
}
