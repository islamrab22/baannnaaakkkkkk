import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";
import type { NormalizedPagination } from "../utils/pagination.ts";

export const cardRequestRepository = {
  findById(id: string) {
    return prisma.cardRequest.findUnique({ where: { id } });
  },
  create(data: Prisma.CardRequestCreateInput) {
    return prisma.cardRequest.create({ data });
  },
  update(id: string, data: Prisma.CardRequestUpdateInput) {
    return prisma.cardRequest.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.cardRequest.delete({ where: { id } });
  },
  async list(pagination: NormalizedPagination, status?: string) {
    const where: Prisma.CardRequestWhereInput = {
      ...(status ? { status: status as Prisma.EnumRequestStatusFilter["equals"] } : {}),
      ...(pagination.search
        ? {
            OR: [
              { name: { contains: pagination.search, mode: "insensitive" } },
              { phone: { contains: pagination.search, mode: "insensitive" } },
              { cardType: { contains: pagination.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.cardRequest.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder },
      }),
      prisma.cardRequest.count({ where }),
    ]);

    return { items, total };
  },
  countPending() {
    return prisma.cardRequest.count({ where: { status: "PENDING" } });
  },
};
