import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid id format"),
});

export const paginationQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
});
