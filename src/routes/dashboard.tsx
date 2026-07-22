// oxlint-disable react/only-export-components -- TanStack Router file routes export `Route`.
// oxlint-disable unicorn/consistent-function-scoping
// oxlint-disable unicorn/no-useless-undefined -- intentional clears for auth UI state

import { Button, Column, Spacer } from "@nattstack/ui"
import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router"
import { useState, type JSX } from "react"
import { requireUser } from "#/libs/auth/route-guards"
import { rpc } from "#/libs/rpc/rpc"
import { getRpcErrorMessage } from "#/libs/rpc/rpc-error-message"

function formatLastActiveAt(lastActiveAt: null | string | undefined): string {
  if (!lastActiveAt) {
    return "Never"
  }

  return new Date(lastActiveAt).toLocaleString("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "long",
    second: "2-digit",
    year: "numeric",
  })
}

export const Route = createFileRoute("/dashboard")({
  beforeLoad: requireUser,
  component: function DashboardRoute(): JSX.Element {
    const { user } = useRouteContext({ from: "/dashboard" })
    const { analytics } = Route.useLoaderData()

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
      <Column className="min-h-dvh items-center justify-center px-16 py-32">
        <Column className="w-full max-w-640">
          <p className="font-medium text-16">Dashboard</p>
          <Spacer height={8} />

          <p className="text-14 text-gray-11">Signed in as {user.name}</p>
          <Spacer height={4} />

          <p className="text-14 text-gray-11">{user.email}</p>
          <Spacer height={24} />

          <p className="font-medium text-14">User analytics</p>
          <Spacer height={12} />

          {analytics.length === 0 ? (
            <p className="text-14 text-gray-11">No analytics yet.</p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left text-14">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-8 py-10 font-500 text-text-primary">Name</th>
                    <th className="px-8 py-10 font-500 text-text-primary">Email</th>
                    <th className="px-8 py-10 font-500 text-text-primary">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((row) => (
                    <tr className="border-b border-border" key={row.userId}>
                      <td className="px-8 py-10 text-gray-12">{row.name}</td>
                      <td className="px-8 py-10 text-gray-11">{row.email}</td>
                      <td className="px-8 py-10 text-gray-11">
                        {formatLastActiveAt(row.lastActiveAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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
  loader: async () => {
    const { data, error } = await rpc.analytics.list.get()

    if (error || !data) {
      return { analytics: [] }
    }

    return { analytics: data.analytics }
  },
})
