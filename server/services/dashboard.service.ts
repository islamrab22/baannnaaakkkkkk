import { prisma } from "../config/prisma.ts";

export const dashboardService = {
  async getStats() {
    const [
      productCount,
      publishedProductCount,
      newsCount,
      publishedNewsCount,
      campaignCount,
      branchCount,
      userCount,
      unreadMessages,
      pendingLoanRequests,
      pendingCardRequests,
      messagesByType,
      requestsByStatus,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.news.count(),
      prisma.news.count({ where: { status: "PUBLISHED" } }),
      prisma.campaign.count(),
      prisma.branch.count(),
      prisma.user.count(),
      prisma.message.count({ where: { status: "NEW" } }),
      prisma.loanRequest.count({ where: { status: "PENDING" } }),
      prisma.cardRequest.count({ where: { status: "PENDING" } }),
      prisma.message.groupBy({ by: ["type"], _count: { _all: true } }),
      prisma.loanRequest.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

    return {
      products: { total: productCount, published: publishedProductCount },
      news: { total: newsCount, published: publishedNewsCount },
      campaigns: { total: campaignCount },
      branches: { total: branchCount },
      users: { total: userCount },
      messages: {
        unread: unreadMessages,
        byType: messagesByType.map((m) => ({ type: m.type, count: m._count._all })),
      },
      loanRequests: {
        pending: pendingLoanRequests,
        byStatus: requestsByStatus.map((r) => ({ status: r.status, count: r._count._all })),
      },
      cardRequests: { pending: pendingCardRequests },
    };
  },
};
