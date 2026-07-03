# Bank of Palestine — Banking Platform & Admin CMS

A production-grade banking website with a full Admin CMS, built on a clean-architecture
Express/TypeScript backend and a React/Vite frontend.

## Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, React Router, Recharts, Sonner
- **Backend:** Express, TypeScript, clean architecture (controllers/services/repositories)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT access + refresh tokens (httpOnly cookie rotation), bcrypt, role-based access (Admin/Editor/Viewer)
- **Uploads:** Cloudinary (URLs only persisted in Postgres)
- **Security:** Helmet, CORS, rate limiting, Zod validation, XSS sanitization, audit logging

## Project Structure

```
server/
  app.ts            Express app assembly (helmet, cors, morgan, rate limiting)
  config/           env, prisma client, cloudinary, logger, static content
  controllers/       Route handlers
  routes/            Public + /admin/* route trees
  middleware/        auth, rbac, validation, error handling, upload, rate limit
  services/          Business logic
  repositories/      Prisma data access
  validators/        Zod schemas
  utils/             jwt, password hashing, pagination, sanitize, audit, slugify
prisma/
  schema.prisma      Users, Products, Categories, Campaigns, News, Branches,
                      Messages, LoanRequests, CardRequests, Settings, AuditLog
  seed.ts            Seed data + demo admin/editor/viewer accounts
src/
  PublicSite.tsx      Public banking website (unchanged design)
  admin/              Admin CMS SPA, mounted at /admin
```

## Local Development

**Prerequisites:** Node.js 20+, PostgreSQL 14+

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in `DATABASE_URL`, JWT secrets, and (optionally)
   Cloudinary credentials.
3. Run migrations and generate the Prisma client:
   ```
   npm run prisma:migrate
   ```
4. Seed the database with demo content and staff accounts:
   ```
   npm run prisma:seed
   ```
   This prints the generated admin/editor/viewer credentials to the console.
5. Start the dev server (Express + Vite middleware):
   ```
   npm run dev
   ```
6. Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin`
   for the CMS.

## Roles

| Role   | Permissions                                              |
|--------|-----------------------------------------------------------|
| ADMIN  | Full access: create/update/delete everything, manage users & settings |
| EDITOR | Create/update content (products, news, campaigns, branches), update request statuses |
| VIEWER | Read-only access across the console |

## Scripts

- `npm run dev` — start Express + Vite dev server
- `npm run build` — build the frontend and bundle the server for production
- `npm start` — run the production build
- `npm run lint` — TypeScript project-wide type check
- `npm run prisma:migrate` — create/apply a dev migration
- `npm run prisma:deploy` — apply migrations in production
- `npm run prisma:seed` — seed the database
- `npm run prisma:studio` — open Prisma Studio

## Deployment

- **Frontend + API:** deploy as a single Node service (e.g. **Render**) — `npm run build` then `npm start`.
  If you split the frontend to **Vercel**, point its API calls at the Render backend URL and set `CLIENT_URL`
  on the backend to the Vercel origin (CORS).
- **Database:** **Supabase PostgreSQL** — set `DATABASE_URL` to the Supabase connection string and run
  `npm run prisma:deploy` as part of your release step.
- **Images:** **Cloudinary** — set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

### Docker

A `Dockerfile` and `docker-compose.yml` are included for local or self-hosted deployment:

```
docker compose up --build
```

This starts a Postgres container and the app container (which runs `prisma migrate deploy`
on boot). Set `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `COOKIE_SECRET` in your shell
or a `.env` file before running in anything beyond local testing.

## Security Notes

- Access tokens are short-lived JWTs sent in the `Authorization` header; refresh tokens are
  rotated on each use and stored hashed, in an httpOnly cookie scoped to `/api/auth`.
- All admin-facing routes require authentication; write operations additionally require the
  `EDITOR` or `ADMIN` role, and destructive operations require `ADMIN`.
- All mutating input is validated with Zod and sanitized against XSS before persistence.
- Every admin create/update/delete/login action is written to the `audit_logs` table.
