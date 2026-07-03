import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { newsService } from "../services/news.service.ts";
import { recordAudit } from "../utils/audit.ts";

export const newsController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    res.json(await newsService.list(req.query as Record<string, string>));
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    res.json(await newsService.getById(req.params.id));
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const article = await newsService.create(req.body);
    await recordAudit(req, "CREATE", "News", article.id, { slug: article.slug });
    res.status(201).json(article);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const article = await newsService.update(req.params.id, req.body);
    await recordAudit(req, "UPDATE", "News", article.id);
    res.json(article);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await newsService.delete(req.params.id);
    await recordAudit(req, "DELETE", "News", req.params.id);
    res.status(204).send();
  }),
  publicList: asyncHandler(async (_req: Request, res: Response) => {
    res.json(await newsService.listPublic());
  }),
  publicGetBySlug: asyncHandler(async (req: Request, res: Response) => {
    res.json(await newsService.getBySlug(req.params.slug));
  }),
};
