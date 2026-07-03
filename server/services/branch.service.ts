import { branchRepository } from "../repositories/branch.repository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import type { Prisma } from "@prisma/client";

const ALLOWED_SORT_FIELDS = ["nameEn", "nameAr", "createdAt"];

export const branchService = {
  async list(query: PaginationQuery) {
    const pagination = normalizePagination(query, ALLOWED_SORT_FIELDS, "createdAt");
    const { items, total } = await branchRepository.list(pagination);
    return buildPaginatedResult(items, total, pagination.page, pagination.pageSize);
  },
  listAll() {
    return branchRepository.listAll();
  },
  async getById(id: string) {
    const branch = await branchRepository.findById(id);
    if (!branch) throw ApiError.notFound("Branch not found");
    return branch;
  },
  create(input: Record<string, unknown>) {
    const clean = sanitizeObjectStrings(input, []);
    return branchRepository.create(clean as unknown as Prisma.BranchCreateInput);
  },
  async update(id: string, input: Record<string, unknown>) {
    const existing = await branchRepository.findById(id);
    if (!existing) throw ApiError.notFound("Branch not found");
    const clean = sanitizeObjectStrings(input, []);
    return branchRepository.update(id, clean as unknown as Prisma.BranchUpdateInput);
  },
  async delete(id: string) {
    const existing = await branchRepository.findById(id);
    if (!existing) throw ApiError.notFound("Branch not found");
    await branchRepository.delete(id);
  },
};
