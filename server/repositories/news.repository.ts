import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";
import type { NormalizedPagination } from "../utils/pagination.ts";

export const newsRepository = {
  findBySlug(slug: string) {
    return prisma.news.findUnique({ where: { slug }, include: { category: true } });
  },
  findById(id: string) {
    return prisma.news.findUnique({ where: { id }, include: { category: true } });
  },
  create(data: Prisma.NewsCreateInput) {
    return prisma.news.create({ data, include: { category: true } });
  },
  update(id: string, data: Prisma.NewsUpdateInput) {
    return prisma.news.update({ where: { id }, data, include: { category: true } });
  },
  delete(id: string) {
    return prisma.news.delete({ where: { id } });
  },
  async list(pagination: NormalizedPagination, status?: string, categoryId?: string) {
    const where: Prisma.NewsWhereInput = {
      ...(status ? { status: status as Prisma.EnumContentStatusFilter["equals"] } : {}),
      ...(categoryId ? { categoryId } : {}),
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
      prisma.news.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder },
        include: { category: true },
      }),
      prisma.news.count({ where }),
    ]);

    return { items, total };
  },
  listPublic() {
    return prisma.news.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" } });
  },
};
