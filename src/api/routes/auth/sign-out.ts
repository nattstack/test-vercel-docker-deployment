import { Elysia } from "elysia"
import { SESSION_COOKIE_NAME } from "#/libs/auth/cookie"
import { deleteSession } from "#/libs/auth/session"
import { sessionCookieSchema } from "#/libs/auth/session-cookie-schema"

export const routeSignOut = new Elysia().post(
  "/sign-out",
  async ({ cookie }) => {
    await deleteSession(cookie[SESSION_COOKIE_NAME])

    return { ok: true }
  },
  {
    cookie: sessionCookieSchema,
  },
)
