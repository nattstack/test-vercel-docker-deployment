// oxlint-disable react/only-export-components -- TanStack Router file routes export `Route`.

import { createFileRoute, redirect } from "@tanstack/react-router"
import { getCurrentUser } from "#/libs/auth/get-current-user"

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const user = await getCurrentUser()

    throw redirect({
      to: user ? "/dashboard" : "/sign-in",
    })
  },
})
