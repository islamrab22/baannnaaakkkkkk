import { z } from "zod";
import { contentStatusEnum } from "./product.validators.ts";

export const createNewsSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  descAr: z.string().min(1),
  descEn: z.string().min(1),
  contentAr: z.string().min(1),
  contentEn: z.string().min(1),
  image: z.string().url().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  status: contentStatusEnum.default("DRAFT"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const updateNewsSchema = createNewsSchema.partial();

export const newsQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  status: contentStatusEnum.optional(),
  categoryId: z.string().uuid().optional(),
});
