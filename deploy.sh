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

# 2. Deploy .htaccess and index.php reverse proxy to web root and parent directory
echo "🌐 Ensuring reverse proxy (.htaccess & index.php) is active in web root..."
cp -f .htaccess ../.htaccess 2>/dev/null || true
cp -f index.php ../index.php 2>/dev/null || true

if [ -d ../public_html ]; then
  cp -f .htaccess ../public_html/.htaccess 2>/dev/null || true
  cp -f index.php ../public_html/index.php 2>/dev/null || true
fi

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

# 4. Build Next.js frontend
echo "🏗️ Building Next.js frontend..."
node node_modules/next/dist/bin/next build

# 5. Restart / Reload PM2 services using ecosystem.config.cjs
if command -v pm2 &> /dev/null; then
  echo "🔄 Reloading PM2 processes..."
  pm2 reload ecosystem.config.cjs 2>/dev/null || pm2 restart ecosystem.config.cjs 2>/dev/null || pm2 start ecosystem.config.cjs
  pm2 save 2>/dev/null || true
fi

echo "✅ [Collabefy] Deployment completed successfully!"
