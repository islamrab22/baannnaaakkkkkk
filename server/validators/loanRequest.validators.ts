import { z } from "zod";

export const requestStatusEnum = z.enum(["PENDING", "CONTACTED", "APPROVED", "REJECTED"]);

export const createLoanRequestSchema = z.object({
  loanType: z.string().min(1),
  name: z.string().min(2),
  phone: z.string().min(3),
  email: z.string().email().optional(),
  preferredBranch: z.string().optional(),
  amount: z.coerce.number().positive().optional(),
});

export const updateLoanRequestSchema = z.object({
  status: requestStatusEnum.optional(),
  notes: z.string().optional(),
});

export const loanRequestQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  status: requestStatusEnum.optional(),
});
