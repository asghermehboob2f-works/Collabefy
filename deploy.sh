#!/bin/bash
set -e

echo "🚀 [Collabefy] Starting deployment..."

# Ensure NVM / Node environment is loaded
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "$(dirname "$0")"

# 1. Pull latest code from GitHub
echo "📥 Pulling latest code from origin main..."
git pull origin main

# 2. Deploy .htaccess, index.php, and root package.json to parent web directory (/)
echo "🌐 Ensuring root launcher and reverse proxy are active in web root..."
cp -f .htaccess ../.htaccess 2>/dev/null || true
cp -f index.php ../index.php 2>/dev/null || true

# Create fallback root launcher in ~ so MilesWeb's Node.js runner can start from /
cat << 'EOF' > ../package.json
{
  "name": "collabefy-root-launcher",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "node Collabefy/scripts/start-all.mjs"
  }
}
EOF

# 3. Install dependencies
echo "📦 Installing root dependencies..."
npm install --no-audit

echo "⚙️ Setting up backend dependencies and database..."
cd backend
npm install --no-audit
node node_modules/prisma/build/index.js generate
node node_modules/prisma/build/index.js db push
node node_modules/typescript/bin/tsc
cd ..

# 4. Build Next.js frontend (Thread-safe for shared hosting cgroups)
echo "🏗️ Building Next.js frontend..."
export RAYON_NUM_THREADS=1
export UV_THREADPOOL_SIZE=1
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=1536"
node scripts/build.mjs

# 5. Restart Collabefy services cleanly without port collisions
echo "🔄 Restarting Collabefy services..."
npm run restart

echo "✅ [Collabefy] Deployment completed successfully!"
