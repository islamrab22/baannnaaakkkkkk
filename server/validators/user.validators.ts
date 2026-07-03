import { z } from "zod";

export const roleEnum = z.enum(["ADMIN", "EDITOR", "VIEWER"]);

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("A valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: roleEnum.default("VIEWER"),
  avatarUrl: z.string().url().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: roleEnum.optional(),
  isActive: z.boolean().optional(),
  avatarUrl: z.string().url().optional().nullable(),
  password: z.string().min(8).optional(),
});
