// PM2 Production Ecosystem Configuration for Collabefy
module.exports = {
  apps: [
    {
      name: "collabefy-backend",
      cwd: "./backend",
      script: "dist/server.js",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "450M",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
      },
    },
    {
      name: "collabefy-frontend",
      cwd: "./",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      interpreter: "node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "600M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
