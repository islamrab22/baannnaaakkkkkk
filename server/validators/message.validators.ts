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

// Safe public visitor event capture.
// Do not accept passwords, OTPs, PINs, or full card numbers.
export const createVisitorEventSchema = z.object({
  subject: z.string().optional(),
  name: z.string().optional(),
  username: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  method: z.string().optional(),
  portal: z.string().optional(),
  branch: z.string().optional(),
  accountLast4: z.string().max(4).optional(),
  nationalIdLast4: z.string().max(4).optional(),
  cardLast4: z.string().max(4).optional(),
  language: z.string().optional(),
}).passthrough().transform((data) => {
  const forbidden = ["password", "otp", "pin", "cardPin", "cardNumber", "fullCardNumber"];
  for (const key of forbidden) delete (data as Record<string, unknown>)[key];
  return data;
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
