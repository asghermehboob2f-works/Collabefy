import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { config } from "./config/env.js";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { generalRateLimiter } from "./middleware/rateLimiter.js";

export function createApp(): Express {
  const app = express();

  // 1. Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Let reverse-proxy / Next.js handle frontend CSP if needed
      crossOriginEmbedderPolicy: false,
    })
  );

  // 2. CORS configuration for production & local dev
  const allowedOrigins = [
    config.frontendUrl,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
          return callback(null, true);
        }
        return callback(new Error("CORS policy violation"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  // 3. Body & Cookie Parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser());

  // 4. Request Logging in Development
  if (config.nodeEnv === "development") {
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
  }

  // 5. Rate limiting
  app.use("/api/v1", generalRateLimiter);

  // 6. Mount API v1 router
  app.use("/api/v1", apiRouter);

  // 7. Root ping
  app.get("/", (req, res) => {
    res.json({
      name: "Collabefy Production API",
      status: "online",
      documentation: "/api/v1/health",
      version: "1.0.0",
    });
  });

  // 8. 404 handler for unknown routes
  app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: "ROUTE_NOT_FOUND",
        message: `The endpoint ${req.method} ${req.originalUrl} does not exist on this server`,
      },
    });
  });

  // 9. Centralized Error Handler
  app.use(errorHandler);

  return app;
}
