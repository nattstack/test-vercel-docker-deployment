import { createServerFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"
import { SESSION_COOKIE_NAME } from "#/libs/auth/cookie"
import { findUserBySessionToken } from "#/libs/auth/session"
import type { User } from "#/libs/db/schema/user"

export interface CurrentUser {
  email: string
  id: string
  name: string
}

function parseCookieValue(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) {
    return undefined
  }

  const prefix = `${name}=`

  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim()

    if (trimmed.startsWith(prefix)) {
      return decodeURIComponent(trimmed.slice(prefix.length))
    }
  }

  return undefined
}

function toCurrentUser(user: User): CurrentUser {
  return {
    email: user.email,
    id: user.id,
    name: user.name,
  }
}

export const getCurrentUser = createServerFn({ method: "GET" }).handler(
  async (): Promise<CurrentUser | undefined> => {
    const cookieHeader = getRequestHeader("cookie")
    const rawToken = parseCookieValue(cookieHeader, SESSION_COOKIE_NAME)
    const user = await findUserBySessionToken(rawToken)

    if (!user) {
      return undefined
    }

    return toCurrentUser(user)
  },
)
