import { redirect } from "@tanstack/react-router"
import { getCurrentUser, type CurrentUser } from "#/libs/auth/get-current-user"

export async function requireGuest(): Promise<void> {
  const user = await getCurrentUser()

  if (user) {
    throw redirect({ to: "/dashboard" })
  }
}

export async function requireUser(): Promise<{ user: CurrentUser }> {
  const user = await getCurrentUser()

  if (!user) {
    throw redirect({ to: "/sign-in" })
  }

  return { user }
}
