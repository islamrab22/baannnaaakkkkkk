import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { userService } from "../services/user.service.ts";
import { recordAudit } from "../utils/audit.ts";
import { ApiError } from "../utils/ApiError.ts";

export const userController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    res.json(await userService.list(req.query as Record<string, string>));
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    res.json(await userService.getById(req.params.id));
  }),
  create: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.create(req.body);
    await recordAudit(req, "CREATE", "User", user.id);
    res.status(201).json(user);
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.update(req.params.id, req.body);
    await recordAudit(req, "UPDATE", "User", user.id);
    res.json(user);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    await userService.delete(req.params.id, req.user.id);
    await recordAudit(req, "DELETE", "User", req.params.id);
    res.status(204).send();
  }),
};
