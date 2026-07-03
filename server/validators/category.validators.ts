import { z } from "zod";

export const categoryTypeEnum = z.enum(["PRODUCT", "NEWS"]);

export const createCategorySchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  type: categoryTypeEnum.default("PRODUCT"),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  type: categoryTypeEnum.optional(),
});
