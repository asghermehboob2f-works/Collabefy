import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload",
        details: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
    });
    return;
  }

  // Known application error
  const statusCode = err.statusCode || 500;
  const isServerFault = statusCode >= 500;

  if (isServerFault) {
    // Log server faults securely without exposing stack trace to clients
    console.error(`[CRITICAL ERROR] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || (isServerFault ? "INTERNAL_SERVER_ERROR" : "BAD_REQUEST"),
      message: isServerFault && process.env.NODE_ENV === "production"
        ? "An internal server error occurred. Please contact support if the issue persists."
        : err.message || "An unexpected error occurred",
      details: err.details,
    },
  });
}
