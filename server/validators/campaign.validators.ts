import { z } from "zod";
import { contentStatusEnum, segmentEnum } from "./product.validators.ts";

export const createCampaignSchema = z.object({
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  descAr: z.string().min(1),
  descEn: z.string().min(1),
  badgeAr: z.string().min(1),
  badgeEn: z.string().min(1),
  image: z.string().url(),
  link: z.string().min(1),
  segment: segmentEnum.default("PERSONAL"),
  status: contentStatusEnum.default("DRAFT"),
  startDate: z.coerce.date().optional().nullable(),
  endDate: z.coerce.date().optional().nullable(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export const campaignQuerySchema = z.object({
  page: z.string().optional(),
  pageSize: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  search: z.string().optional(),
  segment: segmentEnum.optional(),
  status: contentStatusEnum.optional(),
});
