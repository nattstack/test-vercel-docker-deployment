import { Elysia } from "elysia"
import { COOKIE_NAME_SESSION } from "#/libs/auth/cookie"
import { deleteSession } from "#/libs/auth/session"
import { sessionCookieSchema } from "#/libs/auth/session-cookie-schema"

export const routeSignOut = new Elysia().post(
  "/sign-out",
  async ({ cookie }) => {
    await deleteSession(cookie[COOKIE_NAME_SESSION])

    return { ok: true }
  },
  {
    cookie: sessionCookieSchema,
  },
)
