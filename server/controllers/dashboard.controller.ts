import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { dashboardService } from "../services/dashboard.service.ts";

export const dashboardController = {
  stats: asyncHandler(async (_req: Request, res: Response) => {
    res.json(await dashboardService.getStats());
  }),
};
