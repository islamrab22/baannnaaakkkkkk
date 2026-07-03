import { z } from "zod";
import { requestStatusEnum } from "./loanRequest.validators.ts";

export const createCardRequestSchema = z.object({
  cardType: z.string().min(1),
  name: z.string().min(2),
  phone: z.string().min(3),
  email: z.string().email().optional(),
});

export const updateCardRequestSchema = z.object({
  status: requestStatusEnum.optional(),
  notes: z.string().optional(),
});

export const cardRequestQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  status: requestStatusEnum.optional(),
});
