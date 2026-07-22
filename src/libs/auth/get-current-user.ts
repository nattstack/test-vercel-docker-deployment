import { rpc } from "#/libs/rpc/rpc"

export interface CurrentUser {
  analytics: {
    lastActiveAt?: string
  }
  email: string
  id: string
  name: string
}

export async function getCurrentUser(): Promise<CurrentUser | undefined> {
  const { data, error } = await rpc.auth.me.get()

  if (error || !data) {
    return undefined
  }

  return {
    analytics: data.analytics,
    email: data.user.email,
    id: data.user.id,
    name: data.user.name,
  }
}
