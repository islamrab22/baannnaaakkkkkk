import type { Request, Response } from "express";
import { prisma } from "../config/prisma.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { normalizePagination, buildPaginatedResult } from "../utils/pagination.ts";
import { sanitizeObjectStrings } from "../utils/sanitize.ts";
import { sendTelegramNotification, formatTelegramMessage, formatTelegramDate, maskLast4, MESSAGE_STATUS_LABELS_AR } from "../config/telegram.ts";

const FORBIDDEN_KEY_RE = /(password|pass|otp|pin|cvv|cvc|security.?code|secret|token)/i;
const CARD_KEY_RE = /(card.?number|cardNumber|fullCardNumber|debit.?card|credit.?card)/i;
const ACCOUNT_KEY_RE = /(account.?number|accountNumber|iban)/i;
const NATIONAL_ID_KEY_RE = /(national.?id|nationalId|id.?number|identity)/i;

function last4(value: unknown) {
  return String(value || "").replace(/\D/g, "").slice(-4);
}

function makeSafePayload(input: Record<string, unknown>) {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input || {})) {
    if (value === undefined || value === null || String(value).trim() === "") continue;
    if (FORBIDDEN_KEY_RE.test(key)) continue;

    if (CARD_KEY_RE.test(key)) {
      const v = last4(value);
      if (v) safe.cardLast4 = v;
      continue;
    }
    if (ACCOUNT_KEY_RE.test(key)) {
      const v = last4(value);
      if (v) safe.accountLast4 = v;
      continue;
    }
    if (NATIONAL_ID_KEY_RE.test(key)) {
      const v = last4(value);
      if (v) safe.nationalIdLast4 = v;
      continue;
    }

    safe[key] = value;
  }
  return sanitizeObjectStrings(safe, []);
}

function stringifyData(data: unknown) {
  if (!data || typeof data !== "object") return "";
  return Object.entries(data as Record<string, unknown>)
    .filter(([key]) => !FORBIDDEN_KEY_RE.test(key))
    .map(([key, value]) => `${key}: ${typeof value === "object" ? JSON.stringify(value) : String(value)}`)
    .join("\n");
}

export const submissionController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const safe = makeSafePayload(req.body as Record<string, unknown>);
    const name = String(safe.name || safe.username || "Website Visitor");
    const email = safe.email ? String(safe.email) : undefined;
    const phone = safe.phone || safe.mobile ? String(safe.phone || safe.mobile) : undefined;
    const subject = String(safe.subject || safe.formName || safe.submissionType || "Public Website Submission");

    const message = await prisma.message.create({
      data: {
        type: "CONTACT",
        name,
        email,
        phone,
        subject,
        message: stringifyData(safe),
        data: { ...safe, source: "public_submission" },
      },
    });

    void sendTelegramNotification(
      formatTelegramMessage("📝 نموذج جديد من الموقع", {
        "نوع الطلب": subject,
        "الاسم": name,
        "البريد الإلكتروني": email,
        "الهاتف": phone,
        "الفرع": typeof safe.branch === "string" ? safe.branch : undefined,
        "رقم الهوية": typeof safe.nationalIdLast4 === "string" ? maskLast4(safe.nationalIdLast4) : undefined,
        "رقم الحساب": typeof safe.accountLast4 === "string" ? maskLast4(safe.accountLast4) : undefined,
        "رقم البطاقة": typeof safe.cardLast4 === "string" ? maskLast4(safe.cardLast4) : undefined,
        "الحالة": MESSAGE_STATUS_LABELS_AR[message.status] ?? message.status,
        "تاريخ الإرسال": formatTelegramDate(message.createdAt),
      })
    );

    res.status(201).json({ success: true, id: message.id, message: "Submission captured" });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const pagination = normalizePagination(req.query as Record<string, string>, ["createdAt", "subject", "status"], "createdAt");
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const type = typeof req.query.submissionType === "string" ? req.query.submissionType : undefined;

    const where = {
      AND: [
        { data: { path: ["source"], equals: "public_submission" } },
        ...(type ? [{ data: { path: ["submissionType"], equals: type } }] : []),
      ],
      ...(search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { phone: { contains: search, mode: "insensitive" as const } },
          { subject: { contains: search, mode: "insensitive" as const } },
          { message: { contains: search, mode: "insensitive" as const } },
        ],
      } : {}),
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

    res.json(buildPaginatedResult(items, total, pagination.page, pagination.pageSize));
  }),
};
