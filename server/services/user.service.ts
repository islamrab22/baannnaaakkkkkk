import { userRepository } from "../repositories/user.repository.ts";
import { hashPassword } from "../utils/password.ts";
import { ApiError } from "../utils/ApiError.ts";
import { normalizePagination, buildPaginatedResult, type PaginationQuery } from "../utils/pagination.ts";
import type { Role } from "@prisma/client";

const ALLOWED_SORT_FIELDS = ["name", "email", "role", "createdAt", "lastLoginAt"];

function sanitize<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash, ...rest } = user;
  return rest;
}

export const userService = {
  async list(query: PaginationQuery) {
    const pagination = normalizePagination(query, ALLOWED_SORT_FIELDS, "createdAt");
    const { items, total } = await userRepository.list(pagination);
    return buildPaginatedResult(items.map(sanitize), total, pagination.page, pagination.pageSize);
  },

  async getById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound("User not found");
    return sanitize(user);
  },

  async create(input: { name: string; email: string; password: string; role: Role; avatarUrl?: string }) {
    const existing = await userRepository.findByEmail(input.email.toLowerCase());
    if (existing) throw ApiError.conflict("A user with this email already exists");

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      role: input.role,
      avatarUrl: input.avatarUrl,
    });
    return sanitize(user);
  },

  async update(id: string, input: { name?: string; email?: string; role?: Role; isActive?: boolean; avatarUrl?: string | null; password?: string }) {
    const existing = await userRepository.findById(id);
    if (!existing) throw ApiError.notFound("User not found");

    if (input.email && input.email.toLowerCase() !== existing.email) {
      const emailTaken = await userRepository.findByEmail(input.email.toLowerCase());
      if (emailTaken) throw ApiError.conflict("A user with this email already exists");
    }

    const data: Record<string, unknown> = {
      name: input.name,
      email: input.email?.toLowerCase(),
      role: input.role,
      isActive: input.isActive,
      avatarUrl: input.avatarUrl,
    };

    if (input.password) {
      data.passwordHash = await hashPassword(input.password);
    }

    const user = await userRepository.update(id, data);
    return sanitize(user);
  },

  async delete(id: string, requesterId: string) {
    if (id === requesterId) throw ApiError.badRequest("You cannot delete your own account");
    const existing = await userRepository.findById(id);
    if (!existing) throw ApiError.notFound("User not found");
    await userRepository.delete(id);
  },
};
