import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";
import type { NormalizedPagination } from "../utils/pagination.ts";

export const messageRepository = {
  findById(id: string) {
    return prisma.message.findUnique({ where: { id } });
  },
  create(data: Prisma.MessageCreateInput) {
    return prisma.message.create({ data });
  },
  update(id: string, data: Prisma.MessageUpdateInput) {
    return prisma.message.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.message.delete({ where: { id } });
  },
  async list(pagination: NormalizedPagination, type?: string, status?: string) {
    const where: Prisma.MessageWhereInput = {
      ...(type ? { type: type as Prisma.EnumMessageTypeFilter["equals"] } : {}),
      ...(status ? { status: status as Prisma.EnumMessageStatusFilter["equals"] } : {}),
      ...(pagination.search
        ? {
            OR: [
              { name: { contains: pagination.search, mode: "insensitive" } },
              { email: { contains: pagination.search, mode: "insensitive" } },
              { subject: { contains: pagination.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.message.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder },
      }),
      prisma.message.count({ where }),
    ]);

    return { items, total };
  },
  countUnread() {
    return prisma.message.count({ where: { status: "NEW" } });
  },
};
