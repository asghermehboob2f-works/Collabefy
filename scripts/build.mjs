// scripts/build.mjs
// Thread-safe production builder for Next.js on resource-constrained containers (cgroups / shared hosting)

import { spawn, execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const backendDir = path.resolve(rootDir, "backend");

console.log("\x1b[36m%s\x1b[0m", "==========================================================");
console.log("\x1b[32m%s\x1b[0m", "   COLLABEFY PRODUCTION BUILD (BACKEND + FRONTEND)        ");
console.log("\x1b[36m%s\x1b[0m", "==========================================================");
console.log("  Threads: Rayon=1, Libuv=1 (Cgroup safe)");
console.log("  Memory:  Max 1536MB");
console.log("\x1b[36m%s\x1b[0m", "==========================================================\n");

// 1. Build Backend API Server
console.log("⚙️  [1/2] Compiling Backend TypeScript (backend/dist)...");
try {
  execSync("node node_modules/typescript/bin/tsc -p tsconfig.json", {
    cwd: backendDir,
    stdio: "inherit",
  });
  console.log("✅ Backend compiled successfully.\n");
} catch (err) {
  console.error("❌ Backend TypeScript compilation failed.");
  process.exit(1);
}

// 2. Build Next.js Frontend
console.log("🏗️  [2/2] Building Next.js Frontend...");
// Force single-thread parallelism so SWC / Rayon never exceeds container PID/thread limits
const env = {
  ...process.env,
  NODE_ENV: "production",
  RAYON_NUM_THREADS: "1",
  UV_THREADPOOL_SIZE: "1",
  NEXT_TELEMETRY_DISABLED: "1",
  NODE_OPTIONS: `${process.env.NODE_OPTIONS || ""} --max-old-space-size=1536`.trim(),
};

const buildProcess = spawn("node", ["node_modules/next/dist/bin/next", "build"], {
  cwd: rootDir,
  stdio: "inherit",
  env,
});

buildProcess.on("close", (code) => {
  if (code === 0) {
    console.log("\n\x1b[32m%s\x1b[0m", "✅ Next.js production build completed successfully!");
    process.exit(0);
  } else {
    console.error(`\n\x1b[31m❌ Build failed with exit code ${code}\x1b[0m`);
    process.exit(code ?? 1);
  }
});
