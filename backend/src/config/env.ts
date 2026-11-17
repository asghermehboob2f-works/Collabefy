import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "4000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: process.env.DATABASE_URL || "file:./dev.db",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "default_jwt_access_secret_collabefy_2026",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret_collabefy_2026",
  jwtAccessExpiresIn: "15m",
  jwtRefreshExpiresIn: "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
};
