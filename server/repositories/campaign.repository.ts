import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";
import type { NormalizedPagination } from "../utils/pagination.ts";

export const campaignRepository = {
  findById(id: string) {
    return prisma.campaign.findUnique({ where: { id } });
  },
  create(data: Prisma.CampaignCreateInput) {
    return prisma.campaign.create({ data });
  },
  update(id: string, data: Prisma.CampaignUpdateInput) {
    return prisma.campaign.update({ where: { id }, data });
  },
  delete(id: string) {
    return prisma.campaign.delete({ where: { id } });
  },
  async list(pagination: NormalizedPagination, segment?: string, status?: string) {
    const where: Prisma.CampaignWhereInput = {
      ...(segment ? { segment: segment as Prisma.EnumSegmentFilter["equals"] } : {}),
      ...(status ? { status: status as Prisma.EnumContentStatusFilter["equals"] } : {}),
      ...(pagination.search
        ? {
            OR: [
              { titleAr: { contains: pagination.search, mode: "insensitive" } },
              { titleEn: { contains: pagination.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { [pagination.sortBy ?? "createdAt"]: pagination.sortOrder },
      }),
      prisma.campaign.count({ where }),
    ]);

    return { items, total };
  },
  listPublic(segment: string) {
    return prisma.campaign.findMany({
      where: { segment: segment as Prisma.EnumSegmentFilter["equals"], status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    });
  },
};
