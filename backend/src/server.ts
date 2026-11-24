import { createApp } from "./app.js";
import { config } from "./config/env.js";
import { prisma } from "./database/prisma.js";

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`===============================================`);
  console.log(`🚀 Collabefy Production API Server Running`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🌐 Port:        http://localhost:${config.port}`);
  console.log(`🔗 API Base:    http://localhost:${config.port}/api/v1`);
  console.log(`💚 Health:      http://localhost:${config.port}/api/v1/health`);
  console.log(`===============================================`);
});

server.on("error", (err: any) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ [PORT CONFLICT] Port ${config.port} is already in use by another process.`);
    console.error(`👉 Close the process currently occupying port ${config.port} or restart your terminal.`);
  } else {
    console.error(`\n❌ Server listener error:`, err);
  }
});

process.on("uncaughtException", (err) => {
  console.error("\n💥 [CRITICAL] Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("\n💥 [CRITICAL] Unhandled Promise Rejection:", reason);
});

// Graceful shutdown handling
const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];

signals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n🛑 Received ${signal}. Gracefully shutting down Collabefy API...`);
    server.close(async () => {
      console.log("🔒 HTTP server closed.");
      await prisma.$disconnect();
      console.log("💾 Database connections terminated.");
      process.exit(0);
    });
  });
});
