export const GITHUB_OAUTH_ERROR = {
  EMAIL_IN_USE: "email_in_use",
  GENERIC: "github",
} as const

export type GitHubOAuthErrorCode = (typeof GITHUB_OAUTH_ERROR)[keyof typeof GITHUB_OAUTH_ERROR]

export class GitHubEmailInUseError extends Error {
  public readonly code = GITHUB_OAUTH_ERROR.EMAIL_IN_USE

  public constructor() {
    super("An account with this email already exists")
    this.name = "GitHubEmailInUseError"
  }
}

export function messageForGitHubOAuthError(error: string | undefined): string | undefined {
  if (error === GITHUB_OAUTH_ERROR.EMAIL_IN_USE) {
    return "An account with this email already exists. Sign in with email and password instead."
  }

  if (error === GITHUB_OAUTH_ERROR.GENERIC) {
    return "GitHub sign-in failed. Please try again."
  }

  return undefined
}
