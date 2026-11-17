import jwt from "jsonwebtoken";
import { Response } from "express";
import crypto from "crypto";
import { config } from "../config/env.js";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtAccessSecret, {
    expiresIn: "15m",
  });
}

export function generateRefreshToken(payload: TokenPayload): { token: string; hash: string } {
  const token = jwt.sign(payload, config.jwtRefreshSecret, {
    expiresIn: "7d",
  });
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.jwtAccessSecret) as TokenPayload;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as TokenPayload;
  } catch {
    return null;
  }
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken?: string): void {
  const isProduction = config.isProduction;

  res.cookie("collabefy_access", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: config.cookieDomain,
    maxAge: 15 * 60 * 1000, // 15 mins
    path: "/",
  });

  if (refreshToken) {
    res.cookie("collabefy_refresh", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      domain: config.cookieDomain,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });
  }
}

export function clearAuthCookies(res: Response): void {
  const isProduction = config.isProduction;

  res.clearCookie("collabefy_access", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: config.cookieDomain,
    path: "/",
  });

  res.clearCookie("collabefy_refresh", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    domain: config.cookieDomain,
    path: "/",
  });
}
