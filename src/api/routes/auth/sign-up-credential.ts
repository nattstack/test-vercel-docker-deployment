import { eq } from "drizzle-orm"
import { Elysia, status, t } from "elysia"
import { COOKIE_NAME_SESSION } from "#/libs/auth/cookie"
import { HTTP_STATUS_CODE } from "#/libs/auth/http-status"
import { hashPassword } from "#/libs/auth/password"
import { createSession } from "#/libs/auth/session"
import { sessionCookieSchema } from "#/libs/auth/session-cookie-schema"
import { db } from "#/libs/db/db"
import { ACCOUNT, ANALYTICS, PROFILE, USER } from "#/libs/db/schema/user"

const MIN_PASSWORD_LENGTH = 8

function nameFromEmail(email: string): string {
  const [localPart] = email.split("@")

  if (!localPart) {
    return email
  }

  return localPart
}

export const routeSignUpCredential = new Elysia().post(
  "/sign-up-credential",
  async ({ body, cookie }) => {
    const { email: rawEmail, password } = body
    const email = rawEmail.trim().toLowerCase()

    const [existingUser] = await db
      .select({ id: USER.id })
      .from(USER)
      .where(eq(USER.email, email))
      .limit(1)

    if (existingUser) {
      return status(HTTP_STATUS_CODE["409_CONFLICT"], { error: "Email already in use" })
    }

    const passwordHash = await hashPassword(password)

    const user = await db.transaction(async (tx) => {
      const [createdUser] = await tx
        .insert(USER)
        .values({
          email,
          name: nameFromEmail(email),
        })
        .returning()

      if (!createdUser) {
        throw new Error("Failed to create user")
      }

      await tx.insert(ACCOUNT).values({
        password: passwordHash,
        provider: "credentials",
        userId: createdUser.id,
      })

      await tx.insert(ANALYTICS).values({
        userId: createdUser.id,
      })

      await tx.insert(PROFILE).values({
        userId: createdUser.id,
      })

      return createdUser
    })

    await createSession(cookie[COOKIE_NAME_SESSION], user.id)

    return {
      user: {
        email: user.email,
        id: user.id,
        name: user.name,
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
