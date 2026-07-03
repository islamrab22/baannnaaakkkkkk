import { z } from "zod";

export const messageTypeEnum = z.enum(["CONTACT", "NEWSLETTER", "LOAN_INQUIRY", "CARD_INQUIRY", "CAREER"]);
export const messageStatusEnum = z.enum(["NEW", "READ", "ARCHIVED"]);

export const createContactMessageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export const createNewsletterSchema = z.object({
  email: z.string().email(),
});

export const createCareerMessageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  position: z.string().min(1),
  resumeFile: z.string().optional(),
});

export const updateMessageSchema = z.object({
  status: messageStatusEnum,
});

export const messageQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  type: messageTypeEnum.optional(),
  status: messageStatusEnum.optional(),
});
