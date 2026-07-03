import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";
import type { NormalizedPagination } from "../utils/pagination.ts";

export const categoryRepository = {
  findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  },
  findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },
  create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({ data });
  },
  update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
  async list(pagination: NormalizedPagination, type?: string) {
    const where: Prisma.CategoryWhereInput = {
      ...(type ? { type: type as Prisma.EnumCategoryTypeFilter["equals"] } : {}),
      ...(pagination.search
        ? {
            OR: [
              { nameAr: { contains: pagination.search, mode: "insensitive" } },
              { nameEn: { contains: pagination.search, mode: "insensitive" } },
              { slug: { contains: pagination.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder },
      }),
      prisma.category.count({ where }),
    ]);

    return { items, total };
  },
  listAll() {
    return prisma.category.findMany({ orderBy: { nameEn: "asc" } });
  },
};
