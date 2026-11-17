import { prisma } from "../database/prisma.js";
import { Request } from "express";

interface AuditLogParams {
  adminId: string;
  action: string;
  targetResource: string;
  targetId?: string;
  previousValue?: any;
  newValue?: any;
  req?: Request;
  status?: string;
}

export async function logAdminActivity(params: AuditLogParams): Promise<void> {
  try {
    const ipAddress = params.req
      ? ((params.req.headers["x-forwarded-for"] as string) || params.req.socket.remoteAddress || "internal")
      : "internal";
    const userAgent = params.req ? params.req.headers["user-agent"] || "unknown" : "internal";

    await prisma.adminAuditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        targetResource: params.targetResource,
        targetId: params.targetId,
        previousValue: params.previousValue ? JSON.stringify(params.previousValue) : null,
        newValue: params.newValue ? JSON.stringify(params.newValue) : null,
        ipAddress,
        userAgent,
        status: params.status || "SUCCESS",
      },
    });
  } catch (err) {
    console.error("[AUDIT LOG ERROR] Failed to record admin audit entry:", err);
  }
}
