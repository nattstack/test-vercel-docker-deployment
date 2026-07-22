import type { Cookie } from "elysia"

export const COOKIE_NAME_SESSION = "session"

const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24
const SESSION_DURATION_DAYS = 365
const MS_PER_SECOND = 1000

export const SESSION_MAX_AGE_SECONDS =
  SESSION_DURATION_DAYS * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE

export function clearCookieSession(cookie: Cookie<string | undefined>): void {
  cookie.remove()
}

export function getSessionExpiresAt(): Date {
  return new Date(Date.now() + SESSION_MAX_AGE_SECONDS * MS_PER_SECOND)
}

export function setCookieSession(cookie: Cookie<string | undefined>, sessionSecret: string): void {
  cookie.set({
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: true,
    value: sessionSecret,
  })
}
