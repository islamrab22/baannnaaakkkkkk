import crypto from "crypto";
import { userRepository } from "../repositories/user.repository.ts";
import { refreshTokenRepository } from "../repositories/refreshToken.repository.ts";
import { hashPassword, verifyPassword } from "../utils/password.ts";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.ts";
import { ApiError } from "../utils/ApiError.ts";
import { env } from "../config/env.ts";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function refreshExpiryDate(): Date {
  const match = /^(\d+)([smhd])$/.exec(env.JWT_REFRESH_EXPIRES_IN);
  const amount = match ? parseInt(match[1], 10) : 7;
  const unit = match ? match[2] : "d";
  const multipliers: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return new Date(Date.now() + amount * (multipliers[unit] ?? 86_400_000));
}

export const authService = {
  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email.toLowerCase());
    if (!user || !user.isActive) throw ApiError.unauthorized("Invalid email or password");

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) throw ApiError.unauthorized("Invalid email or password");

    await userRepository.touchLastLogin(user.id);

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    const jti = crypto.randomUUID();
    const refreshToken = signRefreshToken({ sub: user.id, jti });

    await refreshTokenRepository.create({
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: refreshExpiryDate(),
    });

    return { accessToken, refreshToken, user };
  },

  async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw ApiError.unauthorized("Invalid or expired refresh token");
    }

    const stored = await refreshTokenRepository.findByHash(hashToken(refreshToken));
    if (!stored || stored.revokedAt || stored.expiresAt < new Date() || stored.userId !== payload.sub) {
      throw ApiError.unauthorized("Refresh token is no longer valid");
    }

    const user = stored.user;
    if (!user.isActive) throw ApiError.unauthorized("Account is disabled");

    const newJti = crypto.randomUUID();
    const newRefreshToken = signRefreshToken({ sub: user.id, jti: newJti });
    const newStored = await refreshTokenRepository.create({
      tokenHash: hashToken(newRefreshToken),
      userId: user.id,
      expiresAt: refreshExpiryDate(),
    });
    await refreshTokenRepository.revoke(stored.id, newStored.id);

    const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
    return { accessToken, refreshToken: newRefreshToken, user };
  },

  async logout(refreshToken: string) {
    const stored = await refreshTokenRepository.findByHash(hashToken(refreshToken));
    if (stored && !stored.revokedAt) {
      await refreshTokenRepository.revoke(stored.id);
    }
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw ApiError.notFound("User not found");

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) throw ApiError.badRequest("Current password is incorrect");

    const passwordHash = await hashPassword(newPassword);
    await userRepository.update(userId, { passwordHash });
    await refreshTokenRepository.revokeAllForUser(userId);
  },

  hashPassword,
};
