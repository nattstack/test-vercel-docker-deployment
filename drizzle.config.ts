/**
 * Drizzle Kit configuration.
 *
 * Prototyping (current workflow, no migration files):
 * - `bun run db:push` — sync the schema straight to the database.
 *
 * Migration-based workflow (once schema history matters):
 * - `bun run db:generate` — write SQL migration files for schema changes.
 * - `bun run db:migrate` — apply pending migration files to the database.
 *
 * Inspect the database in a browser UI with `bun run db:studio`.
 */

import { defineConfig } from "drizzle-kit"

if (!process.env.DATABASE_URL) {
  throw new Error("`DATABASE_URL` environment variable is required.")
}

export default defineConfig({
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "./src/libs/db/migrations",
  schema: "./src/libs/db/schema",
})
