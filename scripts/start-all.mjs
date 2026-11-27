// scripts/start-all.mjs
// Single command production orchestrator for Collabefy (Backend Port 4000 + Frontend Port 3000)

import { spawn, execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const backendDir = path.resolve(rootDir, "backend");

function freePort(port) {
  try {
    if (process.platform === "win32") {
      const stdout = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
      const lines = stdout.trim().split(/\r?\n/);
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== "0" && pid !== String(process.pid)) {
          try { execSync(`taskkill /F /PID ${pid} 2>nul`); } catch {}
        }
      }
    } else {
      try { execSync(`fuser -k ${port}/tcp 2>/dev/null || true`); } catch {}
      try { execSync(`lsof -t -i:${port} | xargs -r kill -9 2>/dev/null || true`); } catch {}
    }
  } catch {}
}

// Clean any stale listeners on ports 3000 and 4000 before startup
freePort(3000);
freePort(4000);

console.log("\x1b[36m%s\x1b[0m", "==========================================================");
console.log("\x1b[32m%s\x1b[0m", "   COLLABEFY PRODUCTION ENVIRONMENT STARTING              ");
console.log("\x1b[36m%s\x1b[0m", "==========================================================");
console.log("  Frontend: http://localhost:3000 (Proxy target)");
console.log("  Backend:  http://localhost:4000/api/v1");
console.log("\x1b[36m%s\x1b[0m", "==========================================================\n");

function runProcess(name, cmd, args, cwd, colorCode) {
  const p = spawn(cmd, args, {
    cwd,
    shell: true,
    env: { ...process.env, NODE_ENV: "production", FORCE_COLOR: "1" },
  });

  const prefix = `\x1b[${colorCode}m[${name}]\x1b[0m `;

  p.stdout?.on("data", (data) => {
    const lines = data.toString().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${prefix}${line}`);
      }
    }
  });

  p.stderr?.on("data", (data) => {
    const lines = data.toString().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim()) {
        console.error(`${prefix}${line}`);
      }
    }
  });

  p.on("close", (code) => {
    console.log(`${prefix}Process exited with code ${code}`);
  });

  return p;
}

// 1. Start Backend on Port 4000
const backend = runProcess(
  "BACKEND:4000",
  "node",
  ["dist/server.js"],
  backendDir,
  "33"
);

// 2. Start Frontend on Port 3000
const frontend = runProcess(
  "FRONTEND:3000",
  "node",
  ["node_modules/next/dist/bin/next", "start", "-p", "3000"],
  rootDir,
  "32"
);

// Clean shutdown handling
let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log("\n\x1b[31m%s\x1b[0m", "🛑 Shutting down Collabefy production servers...");
  try { backend?.kill("SIGTERM"); } catch {}
  try { frontend?.kill("SIGTERM"); } catch {}
  setTimeout(() => process.exit(0), 1000);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
