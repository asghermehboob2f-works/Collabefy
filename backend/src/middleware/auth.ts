import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "../utils/jwt.js";
import { prisma } from "../database/prisma.js";

export interface AuthenticatedUser extends TokenPayload {
  status: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token =
    req.cookies?.collabefy_access ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.substring(7)
      : null);

  if (!token) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication token missing or invalid",
      },
    });
    return;
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      error: {
        code: "TOKEN_EXPIRED",
        message: "Your session has expired. Please sign in again.",
      },
    });
    return;
  }

  // Verify user still exists and is ACTIVE
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true, status: true },
  });

  if (!user) {
    res.status(401).json({
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "The authenticated account no longer exists.",
      },
    });
    return;
  }

  if (user.status === "SUSPENDED") {
    res.status(403).json({
      success: false,
      error: {
        code: "ACCOUNT_SUSPENDED",
        message: "This account has been suspended. Please contact platform support.",
      },
    });
    return;
  }

  req.user = {
    userId: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  next();
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token =
    req.cookies?.collabefy_access ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.substring(7)
      : null);

  if (!token) {
    return next();
  }

  const payload = verifyAccessToken(token);
  if (payload) {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, status: true },
    });
    if (user && user.status !== "SUSPENDED") {
      req.user = {
        userId: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      };
    }
  }

  next();
}
