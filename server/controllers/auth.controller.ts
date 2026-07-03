import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { authService } from "../services/auth.service.ts";
import { userService } from "../services/user.service.ts";
import { ApiError } from "../utils/ApiError.ts";
import { recordAudit } from "../utils/audit.ts";
import { isProduction } from "../config/env.ts";

const REFRESH_COOKIE_NAME = "refresh_token";
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function sanitizeUser(user: { id: string; name: string; email: string; role: string; avatarUrl: string | null }) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl };
}

export const authController = {
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(email, password);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    req.user = { id: user.id, email: user.email, role: user.role };
    await recordAudit(req, "LOGIN", "User", user.id);
    res.json({ accessToken, user: sanitizeUser(user) });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) throw ApiError.unauthorized("No refresh token provided");

    const { accessToken, refreshToken, user } = await authService.refresh(token);
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, REFRESH_COOKIE_OPTIONS);
    res.json({ accessToken, user: sanitizeUser(user) });
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (token) await authService.logout(token);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
    res.json({ success: true });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const user = await userService.getById(req.user.id);
    res.json(user);
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const user = await userService.update(req.user.id, req.body);
    res.json(user);
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
    res.json({ success: true, message: "Password updated. Please log in again." });
  }),
};
