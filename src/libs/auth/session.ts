import { and, eq, gt } from "drizzle-orm"
import type { Cookie } from "elysia"
import { clearSessionCookie, getSessionExpiresAt, setSessionCookie } from "#/libs/auth/cookie"
import { db } from "#/libs/db/db"
import { SESSION, USER, type User } from "#/libs/db/schema/user"

const TOKEN_BYTE_LENGTH = 32
const HEX_PAD_LENGTH = 2
const RADIX_HEX = 16

export async function createSession(
  userId: string,
  cookie: Cookie<string | undefined>,
): Promise<void> {
  const rawToken = createRawSessionToken()
  const tokenHash = await hashSessionToken(rawToken)
  const expiresAt = getSessionExpiresAt().toISOString()

  await db.insert(SESSION).values({
    expiresAt,
    tokenHash,
    userId,
  })

  setSessionCookie(cookie, rawToken)
}

export async function deleteSession(cookie: Cookie<string | undefined>): Promise<void> {
  const rawToken = cookie.value

  if (rawToken) {
    const tokenHash = await hashSessionToken(rawToken)
    await db.delete(SESSION).where(eq(SESSION.tokenHash, tokenHash))
  }

  clearSessionCookie(cookie)
}

export async function findUserBySessionToken(
  rawToken: string | undefined,
): Promise<undefined | User> {
  if (!rawToken) {
    return undefined
  }

  const tokenHash = await hashSessionToken(rawToken)
  const now = new Date().toISOString()

  const [row] = await db
    .select({ user: USER })
    .from(SESSION)
    .innerJoin(USER, eq(SESSION.userId, USER.id))
    .where(and(eq(SESSION.tokenHash, tokenHash), gt(SESSION.expiresAt, now)))
    .limit(1)

  return row?.user
}

export async function resolveSessionUser(
  cookie: Cookie<string | undefined>,
): Promise<undefined | User> {
  const user = await findUserBySessionToken(cookie.value)

  if (!user) {
    if (cookie.value) {
      clearSessionCookie(cookie)
    }

    return undefined
  }

  return user
}

function createRawSessionToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(TOKEN_BYTE_LENGTH))
  return Buffer.from(bytes).toString("base64url")
}

async function hashSessionToken(rawToken: string): Promise<string> {
  const encoded = new TextEncoder().encode(rawToken)
  const digest = await crypto.subtle.digest("SHA-256", encoded)
  const bytes = new Uint8Array(digest)

  return Array.from(bytes, (byte) => byte.toString(RADIX_HEX).padStart(HEX_PAD_LENGTH, "0")).join(
    "",
  )
}
