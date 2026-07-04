import { messageRepository } from "../repositories/message.repository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import { sendTelegramNotification, formatTelegramMessage, formatTelegramDate } from "../config/telegram.ts";
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
  async create(type: MessageType, input: Record<string, unknown>) {
    const clean = sanitizeObjectStrings(input, []);
    const { data, ...rest } = clean as Record<string, unknown>;
    const message = await messageRepository.create({
      type,
      ...(rest as Prisma.MessageCreateInput),
      data: (data ?? clean) as Prisma.InputJsonValue,
    });

    const extra = (message.data ?? {}) as Record<string, unknown>;
    void sendTelegramNotification(
      formatTelegramMessage(`📩 New ${type} message`, {
        Name: message.name,
        Email: message.email,
        Phone: message.phone,
        "Request type": message.subject,
        Branch: typeof extra.branch === "string" ? extra.branch : undefined,
        "National ID (last 4)": typeof extra.nationalIdLast4 === "string" ? extra.nationalIdLast4 : undefined,
        "Account (last 4)": typeof extra.accountLast4 === "string" ? extra.accountLast4 : undefined,
        "Card (last 4)": typeof extra.cardLast4 === "string" ? extra.cardLast4 : undefined,
        Message: message.message,
        Status: message.status,
        "Submitted at": formatTelegramDate(message.createdAt),
      })
    );

    return message;
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
