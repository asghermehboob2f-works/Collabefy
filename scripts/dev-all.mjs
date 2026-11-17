// scripts/dev-all.mjs
// Single command orchestrator for Collabefy Full-Stack (Frontend + Backend)

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const backendDir = path.resolve(rootDir, "backend");

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";

console.log("\x1b[36m%s\x1b[0m", "==========================================================");
console.log("\x1b[32m%s\x1b[0m", "   COLLABEFY FULL-STACK DEVELOPMENT ENVIRONMENT           ");
console.log("\x1b[36m%s\x1b[0m", "==========================================================");
console.log("  Frontend: http://localhost:3000");
console.log("  Backend:  http://localhost:4000/api/v1");
console.log("  Admin:    http://localhost:3000/admin");
console.log("\x1b[36m%s\x1b[0m", "==========================================================\n");

function runProcess(name, cmd, args, cwd, colorCode) {
  const p = spawn(cmd, args, {
    cwd,
    shell: true,
    env: { ...process.env, FORCE_COLOR: "1" },
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
const backend = runProcess("BACKEND:4000", npmCmd, ["run", "dev"], backendDir, "33"); // Yellow

// 2. Start Frontend on Port 3000 after 1 second delay
let frontend;
setTimeout(() => {
  frontend = runProcess("FRONTEND:3000", npmCmd, ["run", "dev:frontend"], rootDir, "32"); // Green
}, 1000);

// Handle clean shutdown on Ctrl+C (SIGINT) / SIGTERM
let shuttingDown = false;
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log("\n\x1b[31m%s\x1b[0m", "🛑 Shutting down Collabefy full-stack servers...");

  if (isWindows) {
    if (backend && backend.pid) {
      try { spawn("taskkill", ["/pid", backend.pid.toString(), "/T", "/F"]); } catch {}
    }
    if (frontend && frontend.pid) {
      try { spawn("taskkill", ["/pid", frontend.pid.toString(), "/T", "/F"]); } catch {}
    }
  } else {
    try { backend?.kill("SIGTERM"); } catch {}
    try { frontend?.kill("SIGTERM"); } catch {}
  }

  setTimeout(() => process.exit(0), 1000);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
