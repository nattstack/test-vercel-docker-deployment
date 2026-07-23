import { Elysia } from "elysia"
import { routeGitHub } from "#/api/routes/auth/github"
import { routeMe } from "#/api/routes/auth/me"
import { routeSignInCredential } from "#/api/routes/auth/sign-in-credential"
import { routeSignOut } from "#/api/routes/auth/sign-out"
import { routeSignUpCredential } from "#/api/routes/auth/sign-up-credential"

export const routeGroupAuth = new Elysia({ prefix: "/auth" })
  .use(routeSignUpCredential)
  .use(routeSignInCredential)
  .use(routeGitHub)
  .use(routeSignOut)
  .use(routeMe)
