import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { loanRequestService } from "../services/loanRequest.service.ts";
import { recordAudit } from "../utils/audit.ts";

export const loanRequestController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    res.json(await loanRequestService.list(req.query as Record<string, string>));
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    res.json(await loanRequestService.getById(req.params.id));
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const request = await loanRequestService.update(req.params.id, req.body);
    await recordAudit(req, "UPDATE", "LoanRequest", request.id);
    res.json(request);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await loanRequestService.delete(req.params.id);
    await recordAudit(req, "DELETE", "LoanRequest", req.params.id);
    res.status(204).send();
  }),
  submit: asyncHandler(async (req: Request, res: Response) => {
    const request = await loanRequestService.create(req.body);
    res.status(201).json({ success: true, id: request.id, message: "Loan inquiry registered successfully" });
  }),
};
