import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { prisma } from "../config/prisma.ts";
import { aboutContent, exchangeRates, localTransfer, localeStrings } from "../config/staticContent.ts";
import { ApiError } from "../utils/ApiError.ts";
import type { Prisma } from "@prisma/client";

export const miscController = {
  exchangeRates: asyncHandler(async (_req: Request, res: Response) => {
    res.json(exchangeRates);
  }),

  about: asyncHandler(async (_req: Request, res: Response) => {
    res.json(aboutContent);
  }),

  locale: asyncHandler(async (req: Request, res: Response) => {
    const lang = req.params.lang === "en" ? "en" : "ar";
    res.json(localeStrings[lang]);
  }),

  transfers: asyncHandler(async (req: Request, res: Response) => {
    const segment: Prisma.EnumSegmentFilter["equals"] = (req.query.category as string) === "business" ? "BUSINESS" : "PERSONAL";
    if (segment === "BUSINESS") {
      const items = await prisma.product.findMany({ where: { group: "TRANSFER", segment, status: "PUBLISHED" } });
      return res.json(items);
    }
    res.json([localTransfer]);
  }),

  compare: asyncHandler(async (req: Request, res: Response) => {
    const { type, ids } = req.body as { type?: string; ids?: string[] };
    if (!type || !Array.isArray(ids)) throw ApiError.badRequest("Invalid payload parameters. Need type and ids array.");

    const groupMap: Record<string, string> = { accounts: "ACCOUNT", loans: "LOAN", cards: "CARD" };
    const group = groupMap[type];
    if (!group) return res.json([]);

    const matched = await prisma.product.findMany({
      where: { group: group as Prisma.EnumProductGroupFilter["equals"], id: { in: ids } },
      take: 3,
    });
    res.json(matched);
  }),

  search: asyncHandler(async (req: Request, res: Response) => {
    const q = ((req.query.q as string) || "").trim();
    const lang = (req.query.lang as string) === "en" ? "en" : "ar";
    if (!q) return res.json([]);

    const titleField = lang === "en" ? "titleEn" : "titleAr";
    const taglineField = lang === "en" ? "taglineEn" : "taglineAr";
    const newsTitle = lang === "en" ? "titleEn" : "titleAr";
    const newsDesc = lang === "en" ? "descEn" : "descAr";

    const [products, newsItems] = await Promise.all([
      prisma.product.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { [titleField]: { contains: q, mode: "insensitive" } },
            { [taglineField]: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 15,
      }),
      prisma.news.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { [newsTitle]: { contains: q, mode: "insensitive" } },
            { [newsDesc]: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 10,
      }),
    ]);

    const groupPageMap: Record<string, string> = {
      ACCOUNT: "accounts",
      LOAN: "loans",
      CARD: "cards",
      ELECTRONIC_SERVICE: "electronic",
      TRANSFER: "transfers",
    };

    const results = [
      ...products.map((p) => ({
        type: groupPageMap[p.group] ?? "products",
        id: p.id,
        title: lang === "en" ? p.titleEn : p.titleAr,
        desc: lang === "en" ? p.taglineEn : p.taglineAr,
        page: groupPageMap[p.group] ?? "home",
      })),
      ...newsItems.map((n) => ({
        type: "news",
        id: n.slug,
        title: lang === "en" ? n.titleEn : n.titleAr,
        desc: lang === "en" ? n.descEn : n.descAr,
        page: "home",
      })),
    ];

    res.json(results);
  }),
};
