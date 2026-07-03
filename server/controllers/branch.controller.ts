import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { branchService } from "../services/branch.service.ts";
import { recordAudit } from "../utils/audit.ts";

export const branchController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    res.json(await branchService.list(req.query as Record<string, string>));
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    res.json(await branchService.getById(req.params.id));
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const branch = await branchService.create(req.body);
    await recordAudit(req, "CREATE", "Branch", branch.id);
    res.status(201).json(branch);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const branch = await branchService.update(req.params.id, req.body);
    await recordAudit(req, "UPDATE", "Branch", branch.id);
    res.json(branch);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await branchService.delete(req.params.id);
    await recordAudit(req, "DELETE", "Branch", req.params.id);
    res.status(204).send();
  }),
  publicList: asyncHandler(async (_req: Request, res: Response) => {
    res.json(await branchService.listAll());
  }),
};
