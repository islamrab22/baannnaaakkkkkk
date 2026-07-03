import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";
import type { NormalizedPagination } from "../utils/pagination.ts";

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data });
  },
  update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.user.delete({ where: { id } });
  },
  touchLastLogin(id: string) {
    return prisma.user.update({ where: { id }, data: { lastLoginAt: new Date() } });
  },
  async list(pagination: NormalizedPagination) {
    const where: Prisma.UserWhereInput = pagination.search
      ? {
          OR: [
            { name: { contains: pagination.search, mode: "insensitive" } },
            { email: { contains: pagination.search, mode: "insensitive" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder },
      }),
      prisma.user.count({ where }),
    ]);

    return { items, total };
  },
  count() {
    return prisma.user.count();
  },
};
