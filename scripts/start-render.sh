#!/bin/sh
# Boots the app the way Render (or any platform running the Dockerfile's
# CMD) does: apply pending migrations, then start the server.
#
# `prisma migrate deploy` is wrapped in a timeout because it can hang
# indefinitely — with no error, no output, nothing — if DATABASE_URL (or
# DIRECT_URL) points at a transaction-mode connection pooler such as
# PgBouncer/Supavisor. Migrate needs a session-level Postgres advisory
# lock; a transaction pooler can hand the lock and unlock statements to
# different backend connections, so the unlock never happens and the
# process just sits there. From the outside (e.g. Render) this is
# indistinguishable from a slow boot until the platform's own deploy
# timeout fires, which is reported as "No open ports detected" because
# the server never reaches app.listen().
#
# If this timeout is ever hit, it means DIRECT_URL is not a true direct
# (non-pooled) connection. Fix the environment variable — do not remove
# this timeout.
MIGRATE_TIMEOUT_SECONDS="${MIGRATE_TIMEOUT_SECONDS:-60}"

echo "[start-render] Applying pending migrations (timeout: ${MIGRATE_TIMEOUT_SECONDS}s)..."

timeout "${MIGRATE_TIMEOUT_SECONDS}" npx prisma migrate deploy
status=$?
if [ "$status" -ne 0 ]; then
  if [ "$status" -eq 124 ]; then
    echo "[start-render] FATAL: 'prisma migrate deploy' timed out after ${MIGRATE_TIMEOUT_SECONDS}s." >&2
    echo "[start-render] This almost always means DIRECT_URL is pointed at a connection" >&2
    echo "[start-render] pooler (PgBouncer/Supavisor) instead of a direct Postgres connection." >&2
    echo "[start-render] On Supabase: use the 'Direct connection' string (port 5432) for" >&2
    echo "[start-render] DIRECT_URL, not the 'Transaction pooler' string (port 6543)." >&2
  else
    echo "[start-render] FATAL: 'prisma migrate deploy' failed with exit code ${status}." >&2
  fi
  exit "$status"
fi

echo "[start-render] Migrations applied. Starting server..."
exec node dist/server.cjs
