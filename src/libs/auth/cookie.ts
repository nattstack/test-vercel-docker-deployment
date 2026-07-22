import type { Cookie } from "elysia"
import { isProduction } from "#/utils/environment"

export const SESSION_COOKIE_NAME = "session"

const SECONDS_PER_MINUTE = 60
const MINUTES_PER_HOUR = 60
const HOURS_PER_DAY = 24
const SESSION_DURATION_DAYS = 30
const MS_PER_SECOND = 1000

export const SESSION_MAX_AGE_SECONDS =
  SESSION_DURATION_DAYS * HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE

export function clearSessionCookie(cookie: Cookie<string | undefined>): void {
  cookie.remove()
}

export function getSessionExpiresAt(): Date {
  return new Date(Date.now() + SESSION_MAX_AGE_SECONDS * MS_PER_SECOND)
}

export function setSessionCookie(cookie: Cookie<string | undefined>, sessionSecret: string): void {
  cookie.set({
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: isProduction,
    value: sessionSecret,
  })
}
