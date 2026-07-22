import { and, eq } from "drizzle-orm"
import { Elysia, status, t } from "elysia"
import { COOKIE_NAME_SESSION } from "#/libs/auth/cookie"
import { HTTP_STATUS_CODE } from "#/libs/auth/http-status"
import { verifyPassword } from "#/libs/auth/password"
import { createSession } from "#/libs/auth/session"
import { sessionCookieSchema } from "#/libs/auth/session-cookie-schema"
import { db } from "#/libs/db/db"
import { ACCOUNT, ANALYTICS, USER } from "#/libs/db/schema/user"

const MIN_PASSWORD_LENGTH = 8

export const routeSignInCredential = new Elysia().post(
  "/sign-in-credential",
  async ({ body, cookie }) => {
    const { email: rawEmail, password } = body
    const email = rawEmail.trim().toLowerCase()

    const [row] = await db
      .select({
        account: ACCOUNT,
        user: USER,
      })
      .from(USER)
      .innerJoin(ACCOUNT, eq(ACCOUNT.userId, USER.id))
      .where(and(eq(USER.email, email), eq(ACCOUNT.provider, "credentials")))
      .limit(1)

    if (!row?.account.password) {
      return status(HTTP_STATUS_CODE["401_UNAUTHORIZED"], { error: "Invalid email or password" })
    }

    const isValid = await verifyPassword(row.account.password, password)

    if (!isValid) {
      return status(HTTP_STATUS_CODE["401_UNAUTHORIZED"], { error: "Invalid email or password" })
    }

    await createSession(cookie[COOKIE_NAME_SESSION], row.user.id)

    const lastActiveAt = new Date()

    await db
      .insert(ANALYTICS)
      .values({
        lastActiveAt,
        userId: row.user.id,
      })
      .onConflictDoUpdate({
        set: { lastActiveAt },
        target: ANALYTICS.userId,
      })

    return {
      user: {
        email: row.user.email,
        id: row.user.id,
        name: row.user.name,
      },
    }
  },
  {
    body: t.Object({
      email: t.String({ format: "email" }),
      password: t.String({ minLength: MIN_PASSWORD_LENGTH }),
    }),
    cookie: sessionCookieSchema,
  },
)
