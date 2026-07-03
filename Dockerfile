# ---------- Build stage ----------
# Full dependencies (incl. devDependencies) so we can generate the Prisma
# client, build the frontend, and bundle the server.
FROM node:22-slim AS build
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
# `npm run build` runs `prisma generate` before bundling — see package.json.
RUN npm run build

# ---------- Production dependencies ----------
# `prisma` (CLI) is a normal dependency so `prisma migrate deploy` and
# `prisma generate` are available at runtime without devDependencies.
FROM node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev
RUN npx prisma generate

# ---------- Runtime stage ----------
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY scripts ./scripts
COPY package*.json ./

EXPOSE 3000

# Applies any pending migrations, then starts the server. Render (and any
# other platform) injects PORT at runtime — the app reads it via
# process.env.PORT (see server/config/env.ts), never a hardcoded port.
CMD ["npm", "run", "start:render"]
