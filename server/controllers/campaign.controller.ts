import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { campaignService } from "../services/campaign.service.ts";
import { recordAudit } from "../utils/audit.ts";

export const campaignController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    res.json(await campaignService.list(req.query as Record<string, string>));
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    res.json(await campaignService.getById(req.params.id));
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const campaign = await campaignService.create(req.body);
    await recordAudit(req, "CREATE", "Campaign", campaign.id);
    res.status(201).json(campaign);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const campaign = await campaignService.update(req.params.id, req.body);
    await recordAudit(req, "UPDATE", "Campaign", campaign.id);
    res.json(campaign);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await campaignService.delete(req.params.id);
    await recordAudit(req, "DELETE", "Campaign", req.params.id);
    res.status(204).send();
  }),
  publicList: asyncHandler(async (req: Request, res: Response) => {
    const segment = (req.query.category as string) === "business" ? "BUSINESS" : "PERSONAL";
    res.json(await campaignService.listPublic(segment));
  }),
};
