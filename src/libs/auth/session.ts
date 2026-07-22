/**
 * Server-side session helpers.
 *
 * Model:
 * - The browser cookie holds the raw session secret (bearer token).
 * - The database stores only SHA-256(secret). Lookup hashes the cookie and
 *   matches `SESSION.hash`.
 *
 * Why secret and hash are different:
 * - If the DB leaks and we stored the raw secret, every active session could be
 *   hijacked by replaying those values as cookies.
 * - With hashes only, a DB leak does not yield usable cookies. Attackers would
 *   need to reverse/brute-force each high-entropy secret (effectively impossible).
 * - Same idea as passwords: never store the credential that grants access.
 *   Session secrets are random, so fast SHA-256 is enough; passwords use slow
 *   hashing (argon2) because they are guessable.
 *
 * Why no extra libraries here:
 * - `crypto.getRandomValues` is the platform CSPRNG (same class as
 *   `openssl rand` / `crypto.randomBytes`). Most "secure random string"
 *   packages wrap this API; they do not add entropy.
 * - `crypto.subtle.digest("SHA-256")` is the correct primitive for hashing a
 *   high-entropy token. A library does not make SHA-256 stronger.
 *
 * Cookie clearing: callers pass the session `Cookie` instance
 * (`cookie[COOKIE_NAME_SESSION]`), not the whole jar. `clearCookieSession` only
 * clears that one cookie.
 */

import { and, eq, gt } from "drizzle-orm"
import type { Cookie } from "elysia"
import { clearCookieSession, getSessionExpiresAt, setCookieSession } from "#/libs/auth/cookie"
import { db } from "#/libs/db/db"
import { SESSION, USER, type User } from "#/libs/db/schema/user"

/** 32 bytes = 256 bits of entropy (same strength as `openssl rand -hex 32`). */
const SESSION_SECRET_BYTE_LENGTH = 32
const HEX_PAD_LENGTH = 2
const RADIX_HEX = 16

/**
 * Creates a session: persist hash + expiry in DB, set the raw secret on the cookie.
 * If the DB insert fails, the cookie is never set (insert runs first).
 *
 * @param cookie - Session cookie instance (`cookie[COOKIE_NAME_SESSION]`), not the jar.
 * @param userId - User id to attach the session to.
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
 * Deletes the DB row for the current cookie (when present) and clears the cookie.
 * If the cookie is already missing, the DB delete is skipped — the row can only be
 * identified via the secret.
 *
 * @param cookie - Session cookie instance (`cookie[COOKIE_NAME_SESSION]`), not the jar.
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
 * Resolves the user for a raw session secret.
 *
 * @param sessionSecret - Raw secret from the cookie, or `undefined` if absent.
 * @returns The matching user, or `undefined` if missing, unknown, or expired.
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
 * Loads the user from the session cookie. Clears a stale/invalid cookie so the
 * client does not keep sending a useless value. Does not delete expired DB rows
 * here (no expiry cleanup job in this path).
 *
 * @param cookie - Session cookie instance (`cookie[COOKIE_NAME_SESSION]`), not the jar.
 * @returns The authenticated user, or `undefined` if the session is invalid.
 */
export async function resolveSessionUser(
  cookie: Cookie<string | undefined>,
): Promise<undefined | User> {
  const user = await findUserBySessionSecret(cookie.value)

  if (!user) {
    if (cookie.value) {
      clearCookieSession(cookie)
    }

    return undefined
  }

  return user
}

/**
 * Generates the cookie session secret.
 *
 * - `getRandomValues`: cryptographically secure random (not `Math.random()`).
 * - 32 bytes: 256 bits of entropy.
 * - `base64url`: cookie/URL-safe encoding (`-`/`_` instead of `+`/`/`), more
 *   compact than hex (~43 chars vs 64 for the same bytes). Encoding choice does
 *   not affect security — only representation.
 *
 * @returns A base64url-encoded random secret for the session cookie.
 */
function createSessionSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(SESSION_SECRET_BYTE_LENGTH))
  return Buffer.from(bytes).toString("base64url")
}

/**
 * Hashes a session secret for DB storage/lookup (SHA-256, hex-encoded).
 * Deterministic: the same cookie value always produces the same hash for queries.
 *
 * @param sessionSecret - Raw session secret from the cookie.
 * @returns Hex-encoded SHA-256 digest stored in `SESSION.hash`.
 */
async function hashSessionSecret(sessionSecret: string): Promise<string> {
  const encoded = new TextEncoder().encode(sessionSecret)
  const digest = await crypto.subtle.digest("SHA-256", encoded)
  const bytes = new Uint8Array(digest)

  return Array.from(bytes, (byte) => byte.toString(RADIX_HEX).padStart(HEX_PAD_LENGTH, "0")).join(
    "",
  )
}
