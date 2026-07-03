import { messageRepository } from "../repositories/message.repository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import type { MessageType, MessageStatus, Prisma } from "@prisma/client";

const ALLOWED_SORT_FIELDS = ["createdAt", "type", "status"];

export const messageService = {
  async list(query: PaginationQuery & { type?: string; status?: string }) {
    const pagination = normalizePagination(query, ALLOWED_SORT_FIELDS, "createdAt");
    const { items, total } = await messageRepository.list(pagination, query.type, query.status);
    return buildPaginatedResult(items, total, pagination.page, pagination.pageSize);
  },
  async getById(id: string) {
    const message = await messageRepository.findById(id);
    if (!message) throw ApiError.notFound("Message not found");
    return message;
  },
  create(type: MessageType, input: Record<string, unknown>) {
    const clean = sanitizeObjectStrings(input, []);
    const { data, ...rest } = clean as Record<string, unknown>;
    return messageRepository.create({
      type,
      ...(rest as Prisma.MessageCreateInput),
      data: (data ?? clean) as Prisma.InputJsonValue,
    });
  },
  async updateStatus(id: string, status: MessageStatus) {
    const existing = await messageRepository.findById(id);
    if (!existing) throw ApiError.notFound("Message not found");
    return messageRepository.update(id, { status });
  },
  async delete(id: string) {
    const existing = await messageRepository.findById(id);
    if (!existing) throw ApiError.notFound("Message not found");
    await messageRepository.delete(id);
  },
  countUnread() {
    return messageRepository.countUnread();
  },
};
