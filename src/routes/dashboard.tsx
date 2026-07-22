// oxlint-disable react/only-export-components -- TanStack Router file routes export `Route`.
// oxlint-disable unicorn/consistent-function-scoping
// oxlint-disable unicorn/no-useless-undefined -- intentional clears for auth UI state

import { Button, Column, Spacer } from "@nattstack/ui"
import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router"
import { useState, type JSX } from "react"
import { requireUser } from "#/libs/auth/route-guards"
import { rpc } from "#/libs/rpc/rpc"
import { getRpcErrorMessage } from "#/libs/rpc/rpc-error-message"

export const Route = createFileRoute("/dashboard")({
  beforeLoad: requireUser,
  component: function DashboardRoute(): JSX.Element {
    const { user } = useRouteContext({ from: "/dashboard" })

    const navigate = useNavigate()

    const [error, setError] = useState<string | undefined>()
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function onSignOut(): Promise<void> {
      setError(undefined)
      setIsSubmitting(true)

      try {
        const { error } = await rpc.auth["sign-out"].post()

        if (error) {
          setError(getRpcErrorMessage(error, "Something went wrong"))
          setIsSubmitting(false)
          return
        }

        await navigate({ to: "/sign-in" })
      } catch {
        setError("Something went wrong")
        setIsSubmitting(false)
      }
    }

    return (
      <Column className="h-dvh items-center justify-center">
        <Column className="w-full max-w-320">
          <p className="font-medium text-16">Dashboard</p>
          <Spacer height={8} />

          <p className="text-14 text-gray-11">Signed in as {user.name}</p>
          <Spacer height={4} />

          <p className="text-14 text-gray-11">{user.email}</p>
          <Spacer height={24} />

          <p className="text-14 text-gray-11">This is a dummy dashboard page.</p>
          <Spacer height={24} />

          {error && (
            <>
              <p className="text-red-11 text-14">{error}</p>
              <Spacer height={16} />
            </>
          )}

          <Button
            isDisabled={isSubmitting}
            isFullWidth
            isLoading={isSubmitting}
            label="Sign out"
            onClick={onSignOut}
            size={48}
            type="button"
          />
        </Column>
      </Column>
    )
  },
})
