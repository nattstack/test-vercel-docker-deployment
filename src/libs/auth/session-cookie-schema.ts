// oxlint-disable eslint/new-cap -- Elysia TypeBox helpers use PascalCase constructors by design.
// oxlint-disable unicorn/max-nested-calls -- TypeBox schema composition is naturally nested.
import { t } from "elysia"
import { COOKIE_NAME_SESSION } from "#/libs/auth/cookie"

const sessionToken = t.String()
const optionalSessionToken = t.Optional(sessionToken)

export const sessionCookieSchema = t.Cookie({
  [COOKIE_NAME_SESSION]: optionalSessionToken,
})
