import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { settingsService } from "../services/settings.service.ts";
import { recordAudit } from "../utils/audit.ts";

export const settingsController = {
  get: asyncHandler(async (_req: Request, res: Response) => {
    res.json(await settingsService.get());
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const settings = await settingsService.update(req.body);
    await recordAudit(req, "UPDATE", "Settings", settings.id);
    res.json(settings);
  }),
};
