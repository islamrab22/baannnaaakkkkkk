import { z } from "zod";

export const updateSettingsSchema = z.object({
  siteNameAr: z.string().min(1).optional(),
  siteNameEn: z.string().min(1).optional(),
  logoUrl: z.string().url().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  contactAddressAr: z.string().optional().nullable(),
  contactAddressEn: z.string().optional().nullable(),
  socialFacebook: z.string().url().optional().nullable(),
  socialTwitter: z.string().url().optional().nullable(),
  socialInstagram: z.string().url().optional().nullable(),
  socialLinkedin: z.string().url().optional().nullable(),
  socialYoutube: z.string().url().optional().nullable(),
  homepageHeroAr: z.string().optional().nullable(),
  homepageHeroEn: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
});
