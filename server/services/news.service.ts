import { newsRepository } from "../repositories/news.repository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import type { Prisma } from "@prisma/client";

const ALLOWED_SORT_FIELDS = ["titleEn", "titleAr", "slug", "createdAt", "publishedAt", "status"];

export const newsService = {
  async list(query: PaginationQuery & { status?: string; categoryId?: string }) {
    const pagination = normalizePagination(query, ALLOWED_SORT_FIELDS, "createdAt");
    const { items, total } = await newsRepository.list(pagination, query.status, query.categoryId);
    return buildPaginatedResult(items, total, pagination.page, pagination.pageSize);
  },
  async getById(id: string) {
    const article = await newsRepository.findById(id);
    if (!article) throw ApiError.notFound("News article not found");
    return article;
  },
  async getBySlug(slug: string) {
    const article = await newsRepository.findBySlug(slug);
    if (!article) throw ApiError.notFound("News article not found");
    return article;
  },
  async create(input: Record<string, unknown>) {
    const existing = await newsRepository.findBySlug(input.slug as string);
    if (existing) throw ApiError.conflict("A news article with this slug already exists");
    const clean = sanitizeObjectStrings(input, ["contentAr", "contentEn"]);
    const data = clean as Record<string, unknown>;
    if (data.status === "PUBLISHED") data.publishedAt = new Date();
    return newsRepository.create(data as unknown as Prisma.NewsCreateInput);
  },
  async update(id: string, input: Record<string, unknown>) {
    const existing = await newsRepository.findById(id);
    if (!existing) throw ApiError.notFound("News article not found");
    if (input.slug && input.slug !== existing.slug) {
      const slugTaken = await newsRepository.findBySlug(input.slug as string);
      if (slugTaken) throw ApiError.conflict("A news article with this slug already exists");
    }
    const clean = sanitizeObjectStrings(input, ["contentAr", "contentEn"]);
    const data = clean as Record<string, unknown>;
    if (data.status === "PUBLISHED" && existing.status !== "PUBLISHED") data.publishedAt = new Date();
    return newsRepository.update(id, data as unknown as Prisma.NewsUpdateInput);
  },
  async delete(id: string) {
    const existing = await newsRepository.findById(id);
    if (!existing) throw ApiError.notFound("News article not found");
    await newsRepository.delete(id);
  },
  listPublic() {
    return newsRepository.listPublic();
  },
};
