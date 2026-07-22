import { sql } from "drizzle-orm"
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"

export const USER = pgTable("user", {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  email: text().unique().notNull(),
  emailVerified: boolean().default(false).notNull(),
  id: uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  name: text().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export const ACCOUNT = pgTable("account", {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
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

export const ANALYTICS = pgTable("analytics", {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  id: uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  lastActiveAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  userId: uuid()
    .notNull()
    .unique()
    .references(() => USER.id, { onDelete: "cascade" }),
})

export const PROFILE = pgTable("profile", {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  id: uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  image: text(),
  userId: uuid()
    .notNull()
    .references(() => USER.id, { onDelete: "cascade" }),
})

export const SESSION = pgTable("session", {
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  hash: text().unique().notNull(),
  id: uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  userId: uuid()
    .notNull()
    .references(() => USER.id, { onDelete: "cascade" }),
})

export type Account = typeof ACCOUNT.$inferSelect
export type Analytics = typeof ANALYTICS.$inferSelect
export type Profile = typeof PROFILE.$inferSelect
export type Session = typeof SESSION.$inferSelect
export type User = typeof USER.$inferSelect

export const schemaSelectAccount = createSelectSchema(ACCOUNT)
export const schemaSelectAnalytics = createSelectSchema(ANALYTICS)
export const schemaSelectProfile = createSelectSchema(PROFILE)
export const schemaSelectSession = createSelectSchema(SESSION)
export const schemaSelectUser = createSelectSchema(USER)
