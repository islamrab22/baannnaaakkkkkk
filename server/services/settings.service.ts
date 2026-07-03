import { settingsRepository } from "../repositories/settings.repository.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import type { Prisma } from "@prisma/client";

export const settingsService = {
  get() {
    return settingsRepository.get();
  },
  update(input: Record<string, unknown>) {
    const clean = sanitizeObjectStrings(input, []);
    return settingsRepository.update(clean as unknown as Prisma.SettingsUpdateInput);
  },
};
