import { createFileRoute } from "@tanstack/react-router"
import type { MaybePromise } from "elysia"
import { app } from "#/api/app"

function handle({ request }: { request: Request }): MaybePromise<Response> {
  return app.fetch(request)
}

export const Route = createFileRoute("/api/$")({
  server: {
    handlers: {
      ANY: handle,
    },
  },
})
