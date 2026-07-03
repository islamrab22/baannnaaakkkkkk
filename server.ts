import "dotenv/config";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createApp } from "./server/app.ts";
import { env, isProduction } from "./server/config/env.ts";
import { logger } from "./server/config/logger.ts";

async function startServer() {
  const app = createApp();

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    logger.info("Vite development middleware mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    const express = (await import("express")).default;
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    logger.info("Production build static server initialized.");
  }

  app.listen(env.PORT, "0.0.0.0", () => {
    logger.info(`Server listening on http://localhost:${env.PORT}`);
  });
}

startServer().catch((err) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});
