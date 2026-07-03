import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";
import type { NormalizedPagination } from "../utils/pagination.ts";

export const loanRequestRepository = {
  findById(id: string) {
    return prisma.loanRequest.findUnique({ where: { id } });
  },
  create(data: Prisma.LoanRequestCreateInput) {
    return prisma.loanRequest.create({ data });
  },
  update(id: string, data: Prisma.LoanRequestUpdateInput) {
    return prisma.loanRequest.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.loanRequest.delete({ where: { id } });
  },
  async list(pagination: NormalizedPagination, status?: string) {
    const where: Prisma.LoanRequestWhereInput = {
      ...(status ? { status: status as Prisma.EnumRequestStatusFilter["equals"] } : {}),
      ...(pagination.search
        ? {
            OR: [
              { name: { contains: pagination.search, mode: "insensitive" } },
              { phone: { contains: pagination.search, mode: "insensitive" } },
              { loanType: { contains: pagination.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.loanRequest.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder },
      }),
      prisma.loanRequest.count({ where }),
    ]);

    return { items, total };
  },
  countPending() {
    return prisma.loanRequest.count({ where: { status: "PENDING" } });
  },
};
