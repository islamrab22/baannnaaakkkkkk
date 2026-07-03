import type { Request } from "express";
import { prisma } from "../config/prisma.ts";
import { logger } from "../config/logger.ts";

export async function recordAudit(req: Request, action: string, entity: string, entityId?: string, meta?: Record<string, unknown>) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id,
        action,
        entity,
        entityId,
        meta: meta ? JSON.parse(JSON.stringify(meta)) : undefined,
        ip: req.ip,
      },
    });
  } catch (err) {
    logger.warn("Failed to record audit log", { action, entity, entityId, err: err instanceof Error ? err.message : err });
  }
}
