import { loanRequestRepository } from "../repositories/loanRequest.repository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import { sendTelegramNotification, formatTelegramMessage } from "../config/telegram.ts";
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
  async create(input: Record<string, unknown>) {
    const clean = sanitizeObjectStrings(input, []);
    const request = await loanRequestRepository.create(clean as unknown as Prisma.LoanRequestCreateInput);

    void sendTelegramNotification(
      formatTelegramMessage("🏦 New loan request", {
        Name: request.name,
        Phone: request.phone,
        Email: request.email,
        "Loan type": request.loanType,
        Amount: request.amount,
        "Preferred branch": request.preferredBranch,
      })
    );

    return request;
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
