import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";
import type { NormalizedPagination } from "../utils/pagination.ts";

export interface ProductFilters {
  group?: string;
  segment?: string;
  status?: string;
}

export const productRepository = {
  findBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug }, include: { category: true } });
  },
  findById(id: string) {
    return prisma.product.findUnique({ where: { id }, include: { category: true } });
  },
  create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data, include: { category: true } });
  },
  update(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data, include: { category: true } });
  },
  delete(id: string) {
    return prisma.product.delete({ where: { id } });
  },
  async list(pagination: NormalizedPagination, filters: ProductFilters) {
    const where: Prisma.ProductWhereInput = {
      ...(filters.group ? { group: filters.group as Prisma.EnumProductGroupFilter["equals"] } : {}),
      ...(filters.segment ? { segment: filters.segment as Prisma.EnumSegmentFilter["equals"] } : {}),
      ...(filters.status ? { status: filters.status as Prisma.EnumContentStatusFilter["equals"] } : {}),
      ...(pagination.search
        ? {
            OR: [
              { titleAr: { contains: pagination.search, mode: "insensitive" } },
              { titleEn: { contains: pagination.search, mode: "insensitive" } },
              { slug: { contains: pagination.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder },
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    return { items, total };
  },
  listPublic(group: string, segment: string) {
    return prisma.product.findMany({
      where: { group: group as Prisma.EnumProductGroupFilter["equals"], segment: segment as Prisma.EnumSegmentFilter["equals"], status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    });
  },
};
