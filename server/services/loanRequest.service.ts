import { loanRequestRepository } from "../repositories/loanRequest.repository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import type { Prisma, RequestStatus } from "@prisma/client";

const ALLOWED_SORT_FIELDS = ["createdAt", "status", "loanType", "amount"];

export const loanRequestService = {
  async list(query: PaginationQuery & { status?: string }) {
    const pagination = normalizePagination(query, ALLOWED_SORT_FIELDS, "createdAt");
    const { items, total } = await loanRequestRepository.list(pagination, query.status);
    return buildPaginatedResult(items, total, pagination.page, pagination.pageSize);
  },
  async getById(id: string) {
    const request = await loanRequestRepository.findById(id);
    if (!request) throw ApiError.notFound("Loan request not found");
    return request;
  },
  create(input: Record<string, unknown>) {
    const clean = sanitizeObjectStrings(input, []);
    return loanRequestRepository.create(clean as unknown as Prisma.LoanRequestCreateInput);
  },
  async update(id: string, input: { status?: RequestStatus; notes?: string }) {
    const existing = await loanRequestRepository.findById(id);
    if (!existing) throw ApiError.notFound("Loan request not found");
    return loanRequestRepository.update(id, input);
  },
  async delete(id: string) {
    const existing = await loanRequestRepository.findById(id);
    if (!existing) throw ApiError.notFound("Loan request not found");
    await loanRequestRepository.delete(id);
  },
  countPending() {
    return loanRequestRepository.countPending();
  },
};
