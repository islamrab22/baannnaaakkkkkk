import { cardRequestRepository } from "../repositories/cardRequest.repository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import type { Prisma, RequestStatus } from "@prisma/client";

const ALLOWED_SORT_FIELDS = ["createdAt", "status", "cardType"];

export const cardRequestService = {
  async list(query: PaginationQuery & { status?: string }) {
    const pagination = normalizePagination(query, ALLOWED_SORT_FIELDS, "createdAt");
    const { items, total } = await cardRequestRepository.list(pagination, query.status);
    return buildPaginatedResult(items, total, pagination.page, pagination.pageSize);
  },
  async getById(id: string) {
    const request = await cardRequestRepository.findById(id);
    if (!request) throw ApiError.notFound("Card request not found");
    return request;
  },
  create(input: Record<string, unknown>) {
    const clean = sanitizeObjectStrings(input, []);
    return cardRequestRepository.create(clean as unknown as Prisma.CardRequestCreateInput);
  },
  async update(id: string, input: { status?: RequestStatus; notes?: string }) {
    const existing = await cardRequestRepository.findById(id);
    if (!existing) throw ApiError.notFound("Card request not found");
    return cardRequestRepository.update(id, input);
  },
  async delete(id: string) {
    const existing = await cardRequestRepository.findById(id);
    if (!existing) throw ApiError.notFound("Card request not found");
    await cardRequestRepository.delete(id);
  },
  countPending() {
    return cardRequestRepository.countPending();
  },
};
