import { prisma } from "../config/prisma.ts";

export const refreshTokenRepository = {
  create(data: { tokenHash: string; userId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({ data });
  },
  findByHash(tokenHash: string) {
    return prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } });
  },
  revoke(id: string, replacedBy?: string) {
    return prisma.refreshToken.update({ where: { id }, data: { revokedAt: new Date(), replacedBy } });
  },
  revokeAllForUser(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },
  deleteExpired() {
    return prisma.refreshToken.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  },
};
