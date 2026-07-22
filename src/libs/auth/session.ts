/**
 * Cookie-based session management.
 *
 * Each session is identified by an opaque random secret stored in an httpOnly
 * cookie. Only the SHA-256 hash of that secret is persisted in the SESSION
 * table, so leaked database rows cannot be replayed as valid cookie values.
 */

import { and, eq, gt } from "drizzle-orm"
import type { Cookie } from "elysia"
import { clearCookieSession, getSessionExpiresAt, setCookieSession } from "#/libs/auth/cookie"
import { db } from "#/libs/db/db"
import { SESSION, USER, type User } from "#/libs/db/schema/user"

/** Number of random bytes in a session secret (256 bits of entropy). */
const SESSION_SECRET_BYTE_LENGTH = 32
/** Width of one byte rendered as hex, used for zero-padding (e.g. 0xa -> "0a"). */
const HEX_PAD_LENGTH = 2
/** Base 16, used when converting digest bytes to a hex string. */
const RADIX_HEX = 16

/**
 * Creates a new session for the given user.
 *
 * Generates a random session secret, stores its SHA-256 hash in the SESSION
 * table alongside an expiry date, and writes the plaintext secret to the
 * session cookie.
 *
 * @param cookie - Session cookie to write the new secret to.
 * @param userId - ID of the user the session belongs to.
 */
export async function createSession(
  cookie: Cookie<string | undefined>,
  userId: string,
): Promise<void> {
  const sessionSecret = createSessionSecret()
  const sessionSecretHash = await hashSessionSecret(sessionSecret)
  const expiresAt = getSessionExpiresAt().toISOString()

  await db.insert(SESSION).values({
    expiresAt,
    hash: sessionSecretHash,
    userId,
  })

  setCookieSession(cookie, sessionSecret)
}

/**
 * Deletes the session referenced by the session cookie (i.e. logout).
 *
 * Removes the matching row from the SESSION table when the cookie holds a
 * secret, and clears the cookie in all cases.
 *
 * @param cookie - Session cookie holding the current session secret.
 */
export async function deleteSession(cookie: Cookie<string | undefined>): Promise<void> {
  const sessionSecret = cookie.value

  if (sessionSecret) {
    const sessionSecretHash = await hashSessionSecret(sessionSecret)
    await db.delete(SESSION).where(eq(SESSION.hash, sessionSecretHash))
  }

  clearCookieSession(cookie)
}

/**
 * Looks up the user that owns the session matching the given secret.
 *
 * Hashes the secret and searches for a session with that hash that has not
 * yet expired. Expired sessions are filtered out by the query, not deleted.
 *
 * @param sessionSecret - Plaintext session secret, typically read from the cookie.
 * @returns The session's user, or `undefined` if the secret is missing,
 *   unknown, or the session has expired.
 */
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

/**
 * Resolves the currently authenticated user from the session cookie.
 *
 * When the session is invalid (no cookie, unknown secret, or expired), any
 * stale cookie is cleared so the client stops sending a dead secret.
 *
 * @param cookie - Session cookie from the incoming request.
 * @returns The authenticated user, or `undefined` when the session is invalid.
 */
export async function resolveSessionUser(
  cookie: Cookie<string | undefined>,
): Promise<undefined | User> {
  const user = await findUserBySessionSecret(cookie.value)

  if (!user) {
    // The cookie references a session that no longer exists or has expired.
    if (cookie.value) {
      clearCookieSession(cookie)
    }

    return undefined
  }

  return user
}

/**
 * Generates a cryptographically random session secret.
 *
 * @returns 32 random bytes encoded as base64url (cookie-safe, unpadded).
 */
function createSessionSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(SESSION_SECRET_BYTE_LENGTH))
  return Buffer.from(bytes).toString("base64url")
}

/**
 * Hashes a session secret with SHA-256 for storage and lookup in the database.
 *
 * @param sessionSecret - Plaintext session secret to hash.
 * @returns The digest as a lowercase hex string (64 characters).
 */
async function hashSessionSecret(sessionSecret: string): Promise<string> {
  const encoded = new TextEncoder().encode(sessionSecret)
  const digest = await crypto.subtle.digest("SHA-256", encoded)
  const bytes = new Uint8Array(digest)

  // Render each digest byte as two hex characters, e.g. [0x0a, 0xff] -> "0aff".
  return Array.from(bytes, (byte) => byte.toString(RADIX_HEX).padStart(HEX_PAD_LENGTH, "0")).join(
    "",
  )
}
