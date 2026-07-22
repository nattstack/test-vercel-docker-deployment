// oxlint-disable unicorn/max-nested-calls new-cap

import { desc, eq } from "drizzle-orm"
import { Elysia, status, t } from "elysia"
import { COOKIE_NAME_SESSION } from "#/libs/auth/cookie"
import { HTTP_STATUS_CODE } from "#/libs/auth/http-status"
import { resolveSessionUser } from "#/libs/auth/session"
import { sessionCookieSchema } from "#/libs/auth/session-cookie-schema"
import { db } from "#/libs/db/db"
import { ANALYTICS, USER } from "#/libs/db/schema/user"

const analyticsListResponse = t.Object({
  analytics: t.Array(
    t.Object({
      email: t.String(),
      lastActiveAt: t.Nullable(t.String()),
      name: t.String(),
      userId: t.String(),
    }),
  ),
})

const analyticsErrorResponse = t.Object({
  error: t.String(),
})

export const routeAnalyticsList = new Elysia().get(
  "/list",
  async ({ cookie }) => {
    const user = await resolveSessionUser(cookie[COOKIE_NAME_SESSION])

    if (!user) {
      return status(HTTP_STATUS_CODE["401_UNAUTHORIZED"], { error: "Unauthorized" })
    }

    const rows = await db
      .select({
        email: USER.email,
        lastActiveAt: ANALYTICS.lastActiveAt,
        name: USER.name,
        userId: USER.id,
      })
      .from(ANALYTICS)
      .innerJoin(USER, eq(ANALYTICS.userId, USER.id))
      .orderBy(desc(ANALYTICS.lastActiveAt))

    return {
      analytics: rows.map((row) =>
        Object.assign(row, { lastActiveAt: row.lastActiveAt.toISOString() }),
      ),
    }
  },
  {
    cookie: sessionCookieSchema,
    response: {
      [HTTP_STATUS_CODE["200_OK"]]: analyticsListResponse,
      [HTTP_STATUS_CODE["401_UNAUTHORIZED"]]: analyticsErrorResponse,
    },
  },
)
