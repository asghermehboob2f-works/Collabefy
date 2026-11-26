#!/bin/bash
set -e

echo "🚀 [Collabefy] Starting deployment..."

# Ensure NVM / Node environment is loaded if using NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd "$(dirname "$0")"

# 1. Pull latest code from GitHub
echo "📥 Pulling latest code from origin main..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing root dependencies..."
npm install --no-audit

echo "⚙️ Setting up backend dependencies and database..."
cd backend
npm install --no-audit
node node_modules/prisma/build/index.js generate
node node_modules/prisma/build/index.js db push
node node_modules/typescript/bin/tsc
cd ..

# 3. Build Next.js frontend
echo "🏗️ Building Next.js frontend..."
node node_modules/next/dist/bin/next build

# 4. Restart / Reload PM2 services if active
if command -v pm2 &> /dev/null; then
  echo "🔄 Reloading PM2 processes..."
  pm2 reload all || pm2 restart all || true
fi

echo "✅ [Collabefy] Deployment completed successfully!"
