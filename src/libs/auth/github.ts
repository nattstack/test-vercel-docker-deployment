import { GitHub } from "arctic"
import { BASE_URL } from "#/utils/url"

export const GITHUB_OAUTH_SCOPES = ["user:email"] as const

export const GITHUB_CALLBACK_PATH = "/api/auth/github/callback"

export interface GitHubProfile {
  avatarUrl: null | string
  email: string
  name: string
  providerAccountId: string
}

interface GitHubEmailResponse {
  email: string
  primary: boolean
  verified: boolean
}

interface GitHubUserResponse {
  avatar_url: null | string
  id: number
  login: string
  name: null | string
}

export function createGitHubClient(): GitHub {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error(
      "`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` environment variables are required.",
    )
  }

  return new GitHub(clientId, clientSecret, getGitHubRedirectUri())
}

export async function fetchGitHubProfile(accessToken: string): Promise<GitHubProfile> {
  const [userResponse, emailsResponse] = await Promise.all([
    fetch("https://api.github.com/user", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "experiment-server-side-session",
      },
    }),
    fetch("https://api.github.com/user/emails", {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "experiment-server-side-session",
      },
    }),
  ])

  if (!userResponse.ok) {
    throw new Error("Failed to fetch GitHub user profile")
  }

  if (!emailsResponse.ok) {
    throw new Error("Failed to fetch GitHub user emails")
  }

  const user = (await userResponse.json()) as GitHubUserResponse
  const emails = (await emailsResponse.json()) as GitHubEmailResponse[]

  const primaryVerified = emails.find((entry) => entry.primary && entry.verified)
  const anyVerified = emails.find((entry) => entry.verified)
  const email = primaryVerified?.email ?? anyVerified?.email

  if (!email) {
    throw new Error("No verified GitHub email available")
  }

  return {
    avatarUrl: user.avatar_url,
    email: email.trim().toLowerCase(),
    name: user.name?.trim() || user.login,
    providerAccountId: String(user.id),
  }
}

export function getGitHubRedirectUri(): string {
  return `${BASE_URL}${GITHUB_CALLBACK_PATH}`
}
