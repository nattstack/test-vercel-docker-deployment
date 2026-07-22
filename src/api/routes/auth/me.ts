import { Elysia, status } from "elysia"
import { SESSION_COOKIE_NAME } from "#/libs/auth/cookie"
import { HTTP_STATUS_CODE } from "#/libs/auth/http-status"
import { resolveSessionUser } from "#/libs/auth/session"
import { sessionCookieSchema } from "#/libs/auth/session-cookie-schema"

export const routeMe = new Elysia().get(
  "/me",
  async ({ cookie }) => {
    const user = await resolveSessionUser(cookie[SESSION_COOKIE_NAME])

    if (!user) {
      return status(HTTP_STATUS_CODE["401_UNAUTHORIZED"], { error: "Unauthorized" })
    }

    return {
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
      },
    }
  },
  {
    cookie: sessionCookieSchema,
  },
)
