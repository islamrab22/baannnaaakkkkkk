import { z } from "zod";

export const createBranchSchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  addressAr: z.string().min(1),
  addressEn: z.string().min(1),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  hoursAr: z.string().min(1),
  hoursEn: z.string().min(1),
  phone: z.string().min(3),
  email: z.string().email().optional().nullable(),
});

export const updateBranchSchema = createBranchSchema.partial();
