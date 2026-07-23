import type { Cookie } from "elysia"

export const COOKIE_NAME_OAUTH_STATE = "oauth_state"

const SECONDS_PER_MINUTE = 60
const OAUTH_STATE_MAX_AGE_MINUTES = 10

export const OAUTH_STATE_MAX_AGE_SECONDS = OAUTH_STATE_MAX_AGE_MINUTES * SECONDS_PER_MINUTE

export function clearCookieOAuthState(cookie: Cookie<string | undefined>): void {
  cookie.remove()
}

export function setCookieOAuthState(cookie: Cookie<string | undefined>, state: string): void {
  cookie.set({
    httpOnly: true,
    maxAge: OAUTH_STATE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: true,
    value: state,
  })
}
