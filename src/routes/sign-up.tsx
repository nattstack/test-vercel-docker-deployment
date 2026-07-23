// oxlint-disable react/only-export-components -- TanStack Router file routes export `Route`.
// oxlint-disable unicorn/consistent-function-scoping
// oxlint-disable unicorn/no-useless-undefined -- intentional clears for auth UI state

import { Button, ButtonLink, Column, Input, Label, Spacer } from "@nattstack/ui"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useState, type JSX, type SubmitEvent } from "react"
import { messageForGitHubOAuthError } from "#/libs/auth/github-oauth-error"
import { requireGuest } from "#/libs/auth/route-guards"
import { getCredentials, submitCredentials } from "#/libs/auth/submit-credentials"

export const Route = createFileRoute("/sign-up")({
  beforeLoad: requireGuest,
  component: function SignUpRoute(): JSX.Element {
    const navigate = useNavigate()
    const { error: oauthError } = Route.useSearch()

    const [error, setError] = useState<string | undefined>(messageForGitHubOAuthError(oauthError))
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function onSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
      event.preventDefault()
      setError(undefined)
      setIsSubmitting(true)

      const { email, password } = getCredentials(event.currentTarget)
      const result = await submitCredentials("sign-up-credential", email, password)

      if (!result.ok) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      await navigate({ to: "/dashboard" })
    }

    return (
      <Column className="h-dvh items-center justify-center">
        <form className="flex w-full max-w-320 flex-col" onSubmit={onSubmit}>
          <h1 className="text-24">Sign up</h1>
          <Spacer height={24} />

          <Label htmlFor="email">Email</Label>
          <Spacer height={4} />

          <Input defaultValue="larry@example.com" id="email" name="email" type="email" />
          <Spacer height={16} />

          <Label htmlFor="password">Password</Label>
          <Spacer height={4} />

          <Input defaultValue="password" id="password" name="password" type="password" />
          <Spacer height={16} />

          {error && (
            <>
              <p className="text-red-11 text-14">{error}</p>
              <Spacer height={16} />
            </>
          )}

          <Button isFullWidth isLoading={isSubmitting} label="Sign up" size={48} type="submit" />
          <Spacer height={12} />

          <ButtonLink
            href="/api/auth/github"
            isFullWidth
            label="Continue with GitHub"
            size={48}
            variant="secondary"
          />
          <Spacer height={12} />

          <ButtonLink
            as={Link}
            isFullWidth
            label="Already have an account?"
            size={48}
            to="/sign-in"
            variant="secondary"
          />
        </form>
      </Column>
    )
  },
  validateSearch: (search: Record<string, unknown>): { error?: string } => ({
    error: typeof search.error === "string" ? search.error : undefined,
  }),
})
