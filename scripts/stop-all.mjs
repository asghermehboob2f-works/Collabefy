// scripts/stop-all.mjs
// Cross-platform utility to safely stop running Collabefy instances (Port 3000 & Port 4000)

import { execSync } from "node:child_process";

export function freePort(port) {
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

console.log("🛑 Terminating existing Collabefy processes on ports 3000 and 4000...");
freePort(3000);
freePort(4000);

if (process.platform !== "win32") {
  try { execSync("pm2 stop all 2>/dev/null || true"); } catch {}
  try { execSync("pkill -f 'dist/server.js' 2>/dev/null || true"); } catch {}
  try { execSync("pkill -f 'next start' 2>/dev/null || true"); } catch {}
}

console.log("✅ Ports 3000 and 4000 successfully freed.\n");
