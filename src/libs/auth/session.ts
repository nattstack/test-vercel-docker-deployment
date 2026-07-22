import { and, eq, gt } from "drizzle-orm"
import type { Cookie } from "elysia"
import { clearSessionCookie, getSessionExpiresAt, setSessionCookie } from "#/libs/auth/cookie"
import { db } from "#/libs/db/db"
import { SESSION, USER, type User } from "#/libs/db/schema/user"

const SESSION_SECRET_BYTE_LENGTH = 32
const HEX_PAD_LENGTH = 2
const RADIX_HEX = 16

export async function createSession(
  userId: string,
  cookie: Cookie<string | undefined>,
): Promise<void> {
  const sessionSecret = createSessionSecret()
  const sessionSecretHash = await hashSessionSecret(sessionSecret)
  const expiresAt = getSessionExpiresAt().toISOString()

  await db.insert(SESSION).values({
    expiresAt,
    hash: sessionSecretHash,
    userId,
  })

  setSessionCookie(cookie, sessionSecret)
}

export async function deleteSession(cookie: Cookie<string | undefined>): Promise<void> {
  const sessionSecret = cookie.value

  if (sessionSecret) {
    const sessionSecretHash = await hashSessionSecret(sessionSecret)
    await db.delete(SESSION).where(eq(SESSION.hash, sessionSecretHash))
  }

  clearSessionCookie(cookie)
}

export async function findUserBySessionSecret(
  sessionSecret: string | undefined,
): Promise<undefined | User> {
  if (!sessionSecret) {
    return undefined
  }

  const sessionSecretHash = await hashSessionSecret(sessionSecret)
  const now = new Date().toISOString()

  const [row] = await db
    .select({ user: USER })
    .from(SESSION)
    .innerJoin(USER, eq(SESSION.userId, USER.id))
    .where(and(eq(SESSION.hash, sessionSecretHash), gt(SESSION.expiresAt, now)))
    .limit(1)

  return row?.user
}

export async function resolveSessionUser(
  cookie: Cookie<string | undefined>,
): Promise<undefined | User> {
  const user = await findUserBySessionSecret(cookie.value)

  if (!user) {
    if (cookie.value) {
      clearSessionCookie(cookie)
    }

    return undefined
  }

  return user
}

function createSessionSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(SESSION_SECRET_BYTE_LENGTH))
  return Buffer.from(bytes).toString("base64url")
}

async function hashSessionSecret(sessionSecret: string): Promise<string> {
  const encoded = new TextEncoder().encode(sessionSecret)
  const digest = await crypto.subtle.digest("SHA-256", encoded)
  const bytes = new Uint8Array(digest)

  return Array.from(bytes, (byte) => byte.toString(RADIX_HEX).padStart(HEX_PAD_LENGTH, "0")).join(
    "",
  )
}
