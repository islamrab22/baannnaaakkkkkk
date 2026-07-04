import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { messageService } from "../services/message.service.ts";
import { recordAudit } from "../utils/audit.ts";

export const messageController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    res.json(await messageService.list(req.query as Record<string, string>));
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    res.json(await messageService.getById(req.params.id));
  }),
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const message = await messageService.updateStatus(req.params.id, req.body.status);
    await recordAudit(req, "UPDATE", "Message", message.id);
    res.json(message);
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    await messageService.delete(req.params.id);
    await recordAudit(req, "DELETE", "Message", req.params.id);
    res.status(204).send();
  }),

  submitContact: asyncHandler(async (req: Request, res: Response) => {
    const message = await messageService.create("CONTACT", req.body);
    res.status(201).json({ success: true, id: message.id, message: "Contact feedback submitted successfully" });
  }),
  submitNewsletter: asyncHandler(async (req: Request, res: Response) => {
    const message = await messageService.create("NEWSLETTER", req.body);
    res.status(201).json({ success: true, id: message.id, message: "Subscribed to newsletter updates" });
  }),
  submitCareer: asyncHandler(async (req: Request, res: Response) => {
    const message = await messageService.create("CAREER", req.body);
    res.status(201).json({ success: true, id: message.id, message: "Job application submitted successfully" });
  }),

  submitVisitorEvent: asyncHandler(async (req: Request, res: Response) => {
    const payload = { ...req.body };
    const forbidden = ["password", "otp", "pin", "cardPin", "cardNumber", "fullCardNumber"];
    for (const key of forbidden) delete payload[key];

    const message = await messageService.create("CONTACT", {
      name: payload.name || payload.username || "Website Visitor",
      email: payload.email,
      phone: payload.phone || payload.mobile,
      subject: payload.subject || "Visitor Registration/Login",
      message: "Safe visitor event captured from the public website. Sensitive fields are not stored.",
      data: payload,
    });
    res.status(201).json({ success: true, id: message.id, message: "Visitor event captured safely" });
  }),
};
