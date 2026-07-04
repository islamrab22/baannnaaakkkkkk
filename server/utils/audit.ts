import type { Request } from "express";
import { prisma } from "../config/prisma.ts";
import { logger } from "../config/logger.ts";
import { sendTelegramNotification, formatTelegramMessage } from "../config/telegram.ts";

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

  void sendTelegramNotification(
    formatTelegramMessage(`🔧 نشاط إداري: ${action} ${entity}`, {
      "بواسطة": req.user?.email,
      "الدور": req.user?.role,
      "معرّف العنصر": entityId,
      ...(meta ? Object.fromEntries(Object.entries(meta).map(([k, v]) => [k, typeof v === "object" ? JSON.stringify(v) : String(v)])) : {}),
    })
  );
}
