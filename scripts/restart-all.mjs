// scripts/restart-all.mjs
// Gracefully stops and restarts Collabefy production services without port conflicts

import { execSync, spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

console.log("\x1b[36m%s\x1b[0m", "==========================================================");
console.log("\x1b[32m%s\x1b[0m", "   COLLABEFY PRODUCTION SERVICE RESTART                   ");
console.log("\x1b[36m%s\x1b[0m", "==========================================================");

// 1. Stop existing processes and free ports
try {
  execSync("node scripts/stop-all.mjs", { cwd: rootDir, stdio: "inherit" });
} catch {}

// Wait 1 second for TCP sockets to finish closing
await new Promise((resolve) => setTimeout(resolve, 1000));

// 2. Check if PM2 is used
let pm2Restarted = false;
if (process.platform !== "win32") {
  try {
    const pm2List = execSync("pm2 jlist 2>/dev/null", { encoding: "utf8" });
    const apps = JSON.parse(pm2List);
    if (Array.isArray(apps) && apps.length > 0) {
      console.log("🚀 Reloading services via PM2...");
      execSync("pm2 reload ecosystem.config.cjs || pm2 restart ecosystem.config.cjs", {
        cwd: rootDir,
        stdio: "inherit",
      });
      pm2Restarted = true;
    }
  } catch {}
}

// 3. Fallback to start-all.mjs
if (!pm2Restarted) {
  console.log("🚀 Spawning production orchestrator via scripts/start-all.mjs...");
  const p = spawn("node", ["scripts/start-all.mjs"], {
    cwd: rootDir,
    detached: true,
    stdio: "inherit",
  });
  p.unref();
  console.log("\x1b[32m%s\x1b[0m", "✅ Collabefy services started in background.");
  process.exit(0);
}
