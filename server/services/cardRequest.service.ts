import { cardRequestRepository } from "../repositories/cardRequest.repository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import { sendTelegramNotification, formatTelegramMessage, formatTelegramDate, REQUEST_STATUS_LABELS_AR } from "../config/telegram.ts";
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
  async create(input: Record<string, unknown>) {
    const clean = sanitizeObjectStrings(input, []);
    const request = await cardRequestRepository.create(clean as unknown as Prisma.CardRequestCreateInput);

    void sendTelegramNotification(
      formatTelegramMessage("💳 طلب بطاقة جديد", {
        "الاسم": request.name,
        "الهاتف": request.phone,
        "البريد الإلكتروني": request.email,
        "نوع الطلب": request.cardType,
        "الحالة": REQUEST_STATUS_LABELS_AR[request.status] ?? request.status,
        "تاريخ الإرسال": formatTelegramDate(request.createdAt),
      })
    );

    return request;
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
