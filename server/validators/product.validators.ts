import { z } from "zod";

export const productGroupEnum = z.enum(["ACCOUNT", "LOAN", "CARD", "ELECTRONIC_SERVICE", "TRANSFER"]);
export const segmentEnum = z.enum(["PERSONAL", "BUSINESS"]);
export const contentStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const createProductSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens"),
  group: productGroupEnum,
  segment: segmentEnum.default("PERSONAL"),
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  taglineAr: z.string().min(1),
  taglineEn: z.string().min(1),
  descAr: z.string().min(1),
  descEn: z.string().min(1),
  bulletsAr: z.array(z.string()).default([]),
  bulletsEn: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
  icon: z.string().optional(),
  categoryId: z.string().uuid().optional().nullable(),
  status: contentStatusEnum.default("DRAFT"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  group: productGroupEnum.optional(),
  segment: segmentEnum.optional(),
  status: contentStatusEnum.optional(),
});
