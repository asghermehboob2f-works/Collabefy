import { Request, Response, NextFunction } from "express";

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = "Too many requests. Please try again later." } = options;
  const requests = new Map<string, number[]>();

  // Cleanup old records periodically
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    requests.forEach((timestamps, ip) => {
      const validTimestamps = timestamps.filter((t) => now - t < windowMs);
      if (validTimestamps.length === 0) {
        requests.delete(ip);
      } else {
        requests.set(ip, validTimestamps);
      }
    });
  }, windowMs);
  cleanupTimer.unref(); // Allow Node process to exit cleanly without keeping event loop alive

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    const userTimestamps = requests.get(ip) || [];
    const validTimestamps = userTimestamps.filter((t) => now - t < windowMs);

    if (validTimestamps.length >= maxRequests) {
      res.status(429).json({
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message,
        },
      });
      return;
    }

    validTimestamps.push(now);
    requests.set(ip, validTimestamps);
    next();
  };
}

// Strict limiter for authentication attempts (e.g. 10 attempts per 15 mins)
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 15,
  message: "Too many authentication attempts. Please try again after 15 minutes.",
});

// General API limiter (e.g. 120 requests per minute)
export const generalRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 120,
  message: "Rate limit exceeded. Please throttle your requests.",
});
