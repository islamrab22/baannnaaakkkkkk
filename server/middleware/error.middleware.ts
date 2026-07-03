import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.ts";
import { logger } from "../config/logger.ts";
import { isProduction } from "../config/env.ts";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: {
        message: "Validation failed",
        details: err.flatten().fieldErrors,
      },
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: { message: `A record with this ${(err.meta?.target as string[])?.join(", ") ?? "value"} already exists.` } });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: { message: "Resource not found" } });
    }
  }

  if (err instanceof ApiError) {
    if (err.statusCode >= 500) logger.error(err.message, { stack: err.stack, path: req.originalUrl });
    return res.status(err.statusCode).json({ error: { message: err.message, details: err.details } });
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  logger.error("Unhandled error", { message, path: req.originalUrl, stack: err instanceof Error ? err.stack : undefined });

  res.status(500).json({
    error: {
      message: isProduction ? "Internal server error" : message,
    },
  });
}
