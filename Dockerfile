# ---------- Build stage ----------
FROM node:22-slim AS build
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# ---------- Production dependencies ----------
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
COPY package*.json ./

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.cjs"]
