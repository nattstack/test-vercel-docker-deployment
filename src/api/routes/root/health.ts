import { Elysia } from "elysia"

const localDateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  fractionalSecondDigits: 3,
  hour: "numeric",
  minute: "numeric",
  month: "numeric",
  second: "numeric",
  year: "numeric",
})

export const routeHealth = new Elysia().get("/health", () => {
  const now = new Date()

  return {
    localDateTime: localDateTimeFormatter.format(now),
    status: "ok",
    timestamp: now.toISOString(),
  }
})
