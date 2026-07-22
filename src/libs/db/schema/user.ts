import { sql } from "drizzle-orm"
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"

export const USER = pgTable("user", {
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  email: text().unique().notNull(),
  emailVerified: boolean().default(false).notNull(),
  id: uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  lastActiveAt: timestamp({ mode: "string" }),
  name: text().notNull(),
  updatedAt: timestamp({ mode: "string" })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date().toISOString()),
})

export const ACCOUNT = pgTable("account", {
  createdAt: timestamp({ mode: "string" }).notNull().defaultNow(),
  id: uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  password: text(),
  provider: text({ enum: ["credentials", "github", "google"] })
    .default("credentials")
    .notNull(),
  userId: uuid()
    .notNull()
    .references(() => USER.id, { onDelete: "cascade" }),
})

export const EMAIL_VERIFICATION_TOKEN = pgTable("email_verification_token", {
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  expiresAt: timestamp({ mode: "string" }).notNull(),
  id: uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  tokenHash: text().unique().notNull(),
  userId: uuid()
    .notNull()
    .references(() => USER.id, { onDelete: "cascade" }),
})

export const PASSWORD_RESET_TOKEN = pgTable("password_reset_token", {
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  expiresAt: timestamp({ mode: "string" }).notNull(),
  id: uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  tokenHash: text().unique().notNull(),
  userId: uuid()
    .notNull()
    .references(() => USER.id, { onDelete: "cascade" }),
})

export const PROFILE = pgTable("profile", {
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  id: uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  image: text(),
  userId: uuid()
    .notNull()
    .references(() => USER.id, { onDelete: "cascade" }),
})

export const SESSION = pgTable("session", {
  createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
  expiresAt: timestamp({ mode: "string" }).notNull(),
  id: uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  tokenHash: text().unique().notNull(),
  userId: uuid()
    .notNull()
    .references(() => USER.id, { onDelete: "cascade" }),
})

export type Account = typeof ACCOUNT.$inferSelect
export type EmailVerificationToken = typeof EMAIL_VERIFICATION_TOKEN.$inferSelect
export type PasswordResetToken = typeof PASSWORD_RESET_TOKEN.$inferSelect
export type Profile = typeof PROFILE.$inferSelect
export type Session = typeof SESSION.$inferSelect
export type User = typeof USER.$inferSelect

export const schemaSelectAccount = createSelectSchema(ACCOUNT)
export const schemaSelectEmailVerificationToken = createSelectSchema(EMAIL_VERIFICATION_TOKEN)
export const schemaSelectPasswordResetToken = createSelectSchema(PASSWORD_RESET_TOKEN)
export const schemaSelectProfile = createSelectSchema(PROFILE)
export const schemaSelectSession = createSelectSchema(SESSION)
export const schemaSelectUser = createSelectSchema(USER)
