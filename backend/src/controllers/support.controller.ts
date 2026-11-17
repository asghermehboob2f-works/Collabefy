import { Request, Response } from "express";
import { prisma } from "../database/prisma.js";
import { logAdminActivity } from "../middleware/auditLogger.js";
import { z } from "zod";

const createTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.enum(["GENERAL", "CAMPAIGN", "FINANCIAL", "ACCOUNT", "VERIFICATION"]).default("GENERAL"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).default("MEDIUM"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const addMessageSchema = z.object({
  message: z.string().min(1, "Message content is required"),
  isInternal: z.boolean().default(false),
});

export async function createTicket(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  const data = createTicketSchema.parse(req.body);

  const ticket = await prisma.supportTicket.create({
    data: {
      userId: req.user.userId,
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      status: "OPEN",
      messages: {
        create: {
          senderId: req.user.userId,
          message: data.message,
        },
      },
    },
    include: {
      messages: true,
    },
  });

  res.status(201).json({ success: true, data: ticket });
}

export async function getTickets(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  const isAdmin = req.user.role.includes("ADMIN") || req.user.role === "SUPER_ADMIN" || req.user.role === "SUPPORT_MANAGER";
  const { status, priority, category } = req.query;

  const where: any = isAdmin ? {} : { userId: req.user.userId };

  if (status && typeof status === "string" && status !== "ALL") {
    where.status = status;
  }
  if (priority && typeof priority === "string" && priority !== "ALL") {
    where.priority = priority;
  }
  if (category && typeof category === "string" && category !== "ALL") {
    where.category = category;
  }

  const tickets = await prisma.supportTicket.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      user: {
        select: {
          email: true,
          role: true,
          creatorProfile: { select: { displayName: true } },
          brandProfile: { select: { companyName: true } },
        },
      },
      _count: { select: { messages: true } },
    },
  });

  res.json({ success: true, data: tickets });
}

export async function getTicketById(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  const { id } = req.params;
  const isAdmin = req.user.role.includes("ADMIN") || req.user.role === "SUPER_ADMIN" || req.user.role === "SUPPORT_MANAGER";

  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          email: true,
          role: true,
          creatorProfile: { select: { displayName: true } },
          brandProfile: { select: { companyName: true } },
        },
      },
      messages: {
        where: isAdmin ? {} : { isInternal: false },
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: {
              email: true,
              role: true,
              creatorProfile: { select: { displayName: true } },
            },
          },
        },
      },
    },
  });

  if (!ticket) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Ticket not found" } });
    return;
  }

  if (!isAdmin && ticket.userId !== req.user.userId) {
    res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return;
  }

  res.json({ success: true, data: ticket });
}

export async function addMessage(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } });
    return;
  }

  const { id } = req.params;
  const data = addMessageSchema.parse(req.body);
  const isAdmin = req.user.role.includes("ADMIN") || req.user.role === "SUPER_ADMIN" || req.user.role === "SUPPORT_MANAGER";

  const ticket = await prisma.supportTicket.findUnique({ where: { id } });
  if (!ticket) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Ticket not found" } });
    return;
  }

  if (!isAdmin && ticket.userId !== req.user.userId) {
    res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Access denied" } });
    return;
  }

  const message = await prisma.supportMessage.create({
    data: {
      ticketId: id,
      senderId: req.user.userId,
      message: data.message,
      isInternal: isAdmin ? Boolean(data.isInternal) : false,
    },
  });

  // Update ticket timestamp & status
  await prisma.supportTicket.update({
    where: { id },
    data: {
      status: isAdmin ? "WAITING_USER" : "IN_PROGRESS",
      updatedAt: new Date(),
    },
  });

  res.status(201).json({ success: true, data: message });
}

export async function updateTicketStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status, priority, assignedAgentId } = req.body;

  const previous = await prisma.supportTicket.findUnique({ where: { id } });
  if (!previous) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Ticket not found" } });
    return;
  }

  const updated = await prisma.supportTicket.update({
    where: { id },
    data: {
      status,
      priority,
      assignedAgentId,
    },
  });

  if (req.user) {
    await logAdminActivity({
      adminId: req.user.userId,
      action: "TICKET_UPDATE",
      targetResource: "SUPPORT_TICKET",
      targetId: id,
      previousValue: previous,
      newValue: updated,
      req,
    });
  }

  res.json({ success: true, data: updated });
}
