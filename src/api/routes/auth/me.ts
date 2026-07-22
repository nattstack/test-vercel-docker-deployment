// oxlint-disable unicorn/max-nested-calls new-cap

import { eq } from "drizzle-orm"
import { Elysia, status, t } from "elysia"
import { COOKIE_NAME_SESSION } from "#/libs/auth/cookie"
import { HTTP_STATUS_CODE } from "#/libs/auth/http-status"
import { resolveSessionUser } from "#/libs/auth/session"
import { sessionCookieSchema } from "#/libs/auth/session-cookie-schema"
import { db } from "#/libs/db/db"
import { ANALYTICS } from "#/libs/db/schema/user"

const authUserResponse = t.Object({
  analytics: t.Object({
    lastActiveAt: t.Optional(t.String()),
  }),
  user: t.Object({
    email: t.String(),
    id: t.String(),
    name: t.String(),
  }),
})

const authErrorResponse = t.Object({
  error: t.String(),
})

export const routeMe = new Elysia().get(
  "/me",
  async ({ cookie }) => {
    const user = await resolveSessionUser(cookie[COOKIE_NAME_SESSION])

    if (!user) {
      return status(HTTP_STATUS_CODE["401_UNAUTHORIZED"], { error: "Unauthorized" })
    }

    const [analytics] = await db
      .select({
        lastActiveAt: ANALYTICS.lastActiveAt,
      })
      .from(ANALYTICS)
      .where(eq(ANALYTICS.userId, user.id))
      .limit(1)

    return {
      analytics: {
        lastActiveAt: analytics?.lastActiveAt.toISOString() ?? undefined,
      },
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
      },
    }
  },
  {
    cookie: sessionCookieSchema,
    response: {
      [HTTP_STATUS_CODE["200_OK"]]: authUserResponse,
      [HTTP_STATUS_CODE["401_UNAUTHORIZED"]]: authErrorResponse,
    },
  },
)
