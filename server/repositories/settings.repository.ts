import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.ts";

const SETTINGS_ID = "singleton";

export const settingsRepository = {
  async get() {
    const existing = await prisma.settings.findUnique({ where: { id: SETTINGS_ID } });
    if (existing) return existing;
    return prisma.settings.create({ data: { id: SETTINGS_ID } });
  },
  async update(data: Prisma.SettingsUpdateInput) {
    await this.get();
    return prisma.settings.update({ where: { id: SETTINGS_ID }, data });
  },
};
