import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { cardRequestService } from "../services/cardRequest.service.ts";
import { recordAudit } from "../utils/audit.ts";

export const cardRequestController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    res.json(await cardRequestService.list(req.query as Record<string, string>));
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    res.json(await cardRequestService.getById(req.params.id));
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const request = await cardRequestService.update(req.params.id, req.body);
    await recordAudit(req, "UPDATE", "CardRequest", request.id);
    res.json(request);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await cardRequestService.delete(req.params.id);
    await recordAudit(req, "DELETE", "CardRequest", req.params.id);
    res.status(204).send();
  }),
  submit: asyncHandler(async (req: Request, res: Response) => {
    const request = await cardRequestService.create(req.body);
    res.status(201).json({ success: true, id: request.id, message: "Card request logged successfully" });
  }),
};
