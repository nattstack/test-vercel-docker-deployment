import { rpc } from "#/libs/rpc/rpc"
import { getRpcErrorMessage } from "#/libs/rpc/rpc-error-message"

export type CredentialsAuthPath = "sign-in-credential" | "sign-up-credential"

export function getCredentials(form: HTMLFormElement): { email: string; password: string } {
  const formData = new FormData(form)

  return {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  }
}

export async function submitCredentials(
  path: CredentialsAuthPath,
  email: string,
  password: string,
): Promise<{ error?: string; ok: boolean }> {
  try {
    const { error } = await rpc.auth[path].post({ email, password })

    if (error) {
      return {
        error: getRpcErrorMessage(error, "Something went wrong"),
        ok: false,
      }
    }

    return { ok: true }
  } catch {
    return { error: "Something went wrong", ok: false }
  }
}
