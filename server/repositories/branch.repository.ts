import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";
import type { NormalizedPagination } from "../utils/pagination.ts";

export const branchRepository = {
  findById(id: string) {
    return prisma.branch.findUnique({ where: { id } });
  },
  create(data: Prisma.BranchCreateInput) {
    return prisma.branch.create({ data });
  },
  update(id: string, data: Prisma.BranchUpdateInput) {
    return prisma.branch.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.branch.delete({ where: { id } });
  },
  async list(pagination: NormalizedPagination) {
    const where: Prisma.BranchWhereInput = pagination.search
      ? {
          OR: [
            { nameAr: { contains: pagination.search, mode: "insensitive" } },
            { nameEn: { contains: pagination.search, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.branch.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder },
      }),
      prisma.branch.count({ where }),
    ]);

    return { items, total };
  },
  listAll() {
    return prisma.branch.findMany({ orderBy: { nameEn: "asc" } });
  },
};
