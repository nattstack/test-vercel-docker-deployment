// oxlint-disable eslint/new-cap -- Elysia TypeBox helpers use PascalCase constructors by design.
// oxlint-disable unicorn/max-nested-calls -- TypeBox schema composition is naturally nested.

import { generateState } from "arctic"
import { and, eq, isNull } from "drizzle-orm"
import { Elysia, redirect, t } from "elysia"
import { COOKIE_NAME_SESSION } from "#/libs/auth/cookie"
import {
  createGitHubClient,
  fetchGitHubProfile,
  GITHUB_OAUTH_SCOPES,
  type GitHubProfile,
} from "#/libs/auth/github"
import { GITHUB_OAUTH_ERROR, GitHubEmailInUseError } from "#/libs/auth/github-oauth-error"
import {
  clearCookieOAuthState,
  COOKIE_NAME_OAUTH_STATE,
  setCookieOAuthState,
} from "#/libs/auth/oauth-state-cookie"
import { createSession } from "#/libs/auth/session"
import { db } from "#/libs/db/db"
import { ACCOUNT, ANALYTICS, PROFILE, USER } from "#/libs/db/schema/user"
import { BASE_URL } from "#/utils/url"

const SIGN_IN_ERROR_REDIRECT = `${BASE_URL}/sign-in?error=${GITHUB_OAUTH_ERROR.GENERIC}`
const SIGN_IN_EMAIL_IN_USE_REDIRECT = `${BASE_URL}/sign-in?error=${GITHUB_OAUTH_ERROR.EMAIL_IN_USE}`
const DASHBOARD_REDIRECT = `${BASE_URL}/dashboard`

const oauthCookieSchema = t.Cookie({
  [COOKIE_NAME_OAUTH_STATE]: t.Optional(t.String()),
  [COOKIE_NAME_SESSION]: t.Optional(t.String()),
})

const githubCallbackQuerySchema = t.Object({
  code: t.Optional(t.String()),
  state: t.Optional(t.String()),
})

export const routeGitHub = new Elysia()
  .get(
    "/github",
    ({ cookie }) => {
      const github = createGitHubClient()
      const state = generateState()
      const scopes = [...GITHUB_OAUTH_SCOPES]
      const authorizationUrl = github.createAuthorizationURL(state, scopes)

      setCookieOAuthState(cookie[COOKIE_NAME_OAUTH_STATE], state)

      return redirect(authorizationUrl.toString())
    },
    {
      cookie: oauthCookieSchema,
    },
  )
  .get(
    "/github/callback",
    async ({ cookie, query }) => {
      const storedState = cookie[COOKIE_NAME_OAUTH_STATE].value
      clearCookieOAuthState(cookie[COOKIE_NAME_OAUTH_STATE])

      const { code, state } = query

      if (!code || !state || !storedState || state !== storedState) {
        return redirect(SIGN_IN_ERROR_REDIRECT)
      }

      try {
        const github = createGitHubClient()
        const tokens = await github.validateAuthorizationCode(code)
        const accessToken = tokens.accessToken()
        const profile = await fetchGitHubProfile(accessToken)
        const userId = await upsertGitHubUser(profile)

        await createSession(cookie[COOKIE_NAME_SESSION], userId)
        await touchAnalytics(userId)

        return redirect(DASHBOARD_REDIRECT)
      } catch (error) {
        if (error instanceof GitHubEmailInUseError) {
          return redirect(SIGN_IN_EMAIL_IN_USE_REDIRECT)
        }

        return redirect(SIGN_IN_ERROR_REDIRECT)
      }
    },
    {
      cookie: oauthCookieSchema,
      query: githubCallbackQuerySchema,
    },
  )

async function createUserFromGitHubProfile(profile: GitHubProfile): Promise<string> {
  const user = await db.transaction(async (tx) => {
    const [createdUser] = await tx
      .insert(USER)
      .values({
        email: profile.email,
        emailVerified: true,
        name: profile.name,
      })
      .returning()

    if (!createdUser) {
      throw new Error("Failed to create user")
    }

    await tx.insert(ACCOUNT).values({
      provider: "github",
      providerAccountId: profile.providerAccountId,
      userId: createdUser.id,
    })

    await tx.insert(ANALYTICS).values({
      userId: createdUser.id,
    })

    await tx.insert(PROFILE).values({
      image: profile.avatarUrl,
      userId: createdUser.id,
    })

    return createdUser
  })

  return user.id
}

async function findUserIdByEmail(email: string): Promise<string | undefined> {
  const [row] = await db.select({ id: USER.id }).from(USER).where(eq(USER.email, email)).limit(1)
  return row?.id
}

async function findUserIdByGitHubAccount(providerAccountId: string): Promise<string | undefined> {
  const githubAccount = and(
    eq(ACCOUNT.provider, "github"),
    eq(ACCOUNT.providerAccountId, providerAccountId),
  )

  const [row] = await db
    .select({ userId: ACCOUNT.userId })
    .from(ACCOUNT)
    .where(githubAccount)
    .limit(1)

  return row?.userId
}

async function maybeSetProfileImage(userId: string, avatarUrl: null | string): Promise<void> {
  if (!avatarUrl) {
    return
  }

  const emptyImageForUser = and(eq(PROFILE.userId, userId), isNull(PROFILE.image))

  await db.update(PROFILE).set({ image: avatarUrl }).where(emptyImageForUser)
}

async function touchAnalytics(userId: string): Promise<void> {
  const lastActiveAt = new Date()

  await db
    .insert(ANALYTICS)
    .values({
      lastActiveAt,
      userId,
    })
    .onConflictDoUpdate({
      set: { lastActiveAt },
      target: ANALYTICS.userId,
    })
}

async function upsertGitHubUser(profile: GitHubProfile): Promise<string> {
  const existingByProvider = await findUserIdByGitHubAccount(profile.providerAccountId)

  if (existingByProvider) {
    await maybeSetProfileImage(existingByProvider, profile.avatarUrl)
    return existingByProvider
  }

  const existingByEmail = await findUserIdByEmail(profile.email)

  if (existingByEmail) {
    throw new GitHubEmailInUseError()
  }

  return createUserFromGitHubProfile(profile)
}
