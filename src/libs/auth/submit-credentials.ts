export type CredentialsAuthPath = "/api/auth/sign-in-credential" | "/api/auth/sign-up-credential"

interface AuthErrorResponse {
  error?: string
}

interface AuthUserResponse {
  user: {
    email: string
    id: string
    name: string
  }
}

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
    const response = await fetch(path, {
      body: JSON.stringify({ email, password }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })

    if (!response.ok) {
      let message = "Something went wrong"

      try {
        const data = (await response.json()) as AuthErrorResponse
        if (data.error) {
          message = data.error
        }
      } catch {
        // Keep fallback message when the body is not JSON.
      }

      return { error: message, ok: false }
    }

    await (response.json() as Promise<AuthUserResponse>)
    return { ok: true }
  } catch {
    return { error: "Something went wrong", ok: false }
  }
}
