import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import apiRoutes from "./routes/index.ts";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.ts";
import { globalRateLimiter } from "./middleware/rateLimit.middleware.ts";
import { env, isProduction } from "./config/env.ts";
import { logger } from "./config/logger.ts";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: isProduction ? undefined : false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );

  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
    })
  );

  app.use(
    morgan(isProduction ? "combined" : "dev", {
      stream: { write: (message: string) => logger.info(message.trim()) },
    })
  );

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(cookieParser(env.COOKIE_SECRET));
  app.use(globalRateLimiter);

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api", apiRoutes);

  app.use("/api", notFoundHandler);
  app.use(errorHandler);

  return app;
}
