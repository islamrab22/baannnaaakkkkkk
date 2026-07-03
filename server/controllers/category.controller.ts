import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { categoryService } from "../services/category.service.ts";
import { recordAudit } from "../utils/audit.ts";

export const categoryController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    res.json(await categoryService.list(req.query as Record<string, string>));
  }),
  listAll: asyncHandler(async (_req: Request, res: Response) => {
    res.json(await categoryService.listAll());
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    res.json(await categoryService.getById(req.params.id));
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.create(req.body);
    await recordAudit(req, "CREATE", "Category", category.id);
    res.status(201).json(category);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryService.update(req.params.id, req.body);
    await recordAudit(req, "UPDATE", "Category", category.id);
    res.json(category);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await categoryService.delete(req.params.id);
    await recordAudit(req, "DELETE", "Category", req.params.id);
    res.status(204).send();
  }),
};
