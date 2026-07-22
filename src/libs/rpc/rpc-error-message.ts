export function getRpcErrorMessage(error: unknown, fallback: string): string {
  return getMessage(error) ?? fallback
}

function getMessage(value: unknown): string | undefined {
  if (typeof value === "string" && value.length > 0 && value !== "[object Object]") {
    return value
  }

  if (value instanceof Error) {
    const errorValue = isRecord(value) && "value" in value ? getMessage(value.value) : undefined

    return errorValue ?? getMessage(value.message)
  }

  if (!isRecord(value)) {
    return
  }

  const directMessage =
    getMessage(value.error) ?? getMessage(value.message) ?? getMessage(value.summary)

  if (directMessage) {
    return directMessage
  }

  if (Array.isArray(value.errors)) {
    for (const error of value.errors) {
      const message = getMessage(error)

      if (message) {
        return message
      }
    }
  }

  if (Array.isArray(value.issues)) {
    for (const issue of value.issues) {
      const message = getMessage(issue)

      if (message) {
        return message
      }
    }
  }
}

function isRecord(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === "object" && value !== null
}
