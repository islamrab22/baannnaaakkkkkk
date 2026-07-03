import { productRepository } from "../repositories/product.repository.ts";
import { ApiError } from "../utils/ApiError.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import type { Prisma } from "@prisma/client";

const ALLOWED_SORT_FIELDS = ["titleEn", "titleAr", "slug", "createdAt", "updatedAt", "status"];

interface ProductQuery extends PaginationQuery {
  group?: string;
  segment?: string;
  status?: string;
}

export const productService = {
  async list(query: ProductQuery) {
    const pagination = normalizePagination(query, ALLOWED_SORT_FIELDS, "createdAt");
    const { items, total } = await productRepository.list(pagination, {
      group: query.group,
      segment: query.segment,
      status: query.status,
    });
    return buildPaginatedResult(items, total, pagination.page, pagination.pageSize);
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw ApiError.notFound("Product not found");
    return product;
  },

  async getBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw ApiError.notFound("Product not found");
    return product;
  },

  async create(input: Record<string, unknown>) {
    const existing = await productRepository.findBySlug(input.slug as string);
    if (existing) throw ApiError.conflict("A product with this slug already exists");

    const clean = sanitizeObjectStrings(input, ["descAr", "descEn"]);
    return productRepository.create(clean as unknown as Prisma.ProductCreateInput);
  },

  async update(id: string, input: Record<string, unknown>) {
    const existing = await productRepository.findById(id);
    if (!existing) throw ApiError.notFound("Product not found");

    if (input.slug && input.slug !== existing.slug) {
      const slugTaken = await productRepository.findBySlug(input.slug as string);
      if (slugTaken) throw ApiError.conflict("A product with this slug already exists");
    }

    const clean = sanitizeObjectStrings(input, ["descAr", "descEn"]);
    return productRepository.update(id, clean as unknown as Prisma.ProductUpdateInput);
  },

  async delete(id: string) {
    const existing = await productRepository.findById(id);
    if (!existing) throw ApiError.notFound("Product not found");
    await productRepository.delete(id);
  },

  listPublic(group: string, segment: string) {
    return productRepository.listPublic(group, segment);
  },
};
