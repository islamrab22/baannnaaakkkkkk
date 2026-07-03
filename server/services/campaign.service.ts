import { campaignRepository } from "../repositories/campaign.repository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import type { Prisma } from "@prisma/client";

const ALLOWED_SORT_FIELDS = ["titleEn", "titleAr", "createdAt", "startDate", "endDate"];

export const campaignService = {
  async list(query: PaginationQuery & { segment?: string; status?: string }) {
    const pagination = normalizePagination(query, ALLOWED_SORT_FIELDS, "createdAt");
    const { items, total } = await campaignRepository.list(pagination, query.segment, query.status);
    return buildPaginatedResult(items, total, pagination.page, pagination.pageSize);
  },
  async getById(id: string) {
    const campaign = await campaignRepository.findById(id);
    if (!campaign) throw ApiError.notFound("Campaign not found");
    return campaign;
  },
  create(input: Record<string, unknown>) {
    const clean = sanitizeObjectStrings(input, []);
    return campaignRepository.create(clean as unknown as Prisma.CampaignCreateInput);
  },
  async update(id: string, input: Record<string, unknown>) {
    const existing = await campaignRepository.findById(id);
    if (!existing) throw ApiError.notFound("Campaign not found");
    const clean = sanitizeObjectStrings(input, []);
    return campaignRepository.update(id, clean as unknown as Prisma.CampaignUpdateInput);
  },
  async delete(id: string) {
    const existing = await campaignRepository.findById(id);
    if (!existing) throw ApiError.notFound("Campaign not found");
    await campaignRepository.delete(id);
  },
  listPublic(segment: string) {
    return campaignRepository.listPublic(segment);
  },
};
