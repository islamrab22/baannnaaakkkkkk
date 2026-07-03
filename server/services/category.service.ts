import { categoryRepository } from "../repositories/category.repository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import type { Prisma } from "@prisma/client";

const ALLOWED_SORT_FIELDS = ["nameEn", "nameAr", "slug", "createdAt"];

export const categoryService = {
  async list(query: PaginationQuery & { type?: string }) {
    const pagination = normalizePagination(query, ALLOWED_SORT_FIELDS, "createdAt");
    const { items, total } = await categoryRepository.list(pagination, query.type);
    return buildPaginatedResult(items, total, pagination.page, pagination.pageSize);
  },
  listAll() {
    return categoryRepository.listAll();
  },
  async getById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw ApiError.notFound("Category not found");
    return category;
  },
  async create(input: Prisma.CategoryCreateInput) {
    const existing = await categoryRepository.findBySlug(input.slug);
    if (existing) throw ApiError.conflict("A category with this slug already exists");
    return categoryRepository.create(input);
  },
  async update(id: string, input: Prisma.CategoryUpdateInput) {
    const existing = await categoryRepository.findById(id);
    if (!existing) throw ApiError.notFound("Category not found");
    if (input.slug && input.slug !== existing.slug) {
      const slugTaken = await categoryRepository.findBySlug(input.slug as string);
      if (slugTaken) throw ApiError.conflict("A category with this slug already exists");
    }
    return categoryRepository.update(id, input);
  },
  async delete(id: string) {
    const existing = await categoryRepository.findById(id);
    if (!existing) throw ApiError.notFound("Category not found");
    await categoryRepository.delete(id);
  },
};
