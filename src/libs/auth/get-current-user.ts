import { rpc } from "#/libs/rpc/rpc"

export interface CurrentUser {
  email: string
  id: string
  name: string
}

export async function getCurrentUser(): Promise<CurrentUser | undefined> {
  const { data, error } = await rpc.auth.me.get()

  if (error || !data) {
    return undefined
  }

  return data.user
}
