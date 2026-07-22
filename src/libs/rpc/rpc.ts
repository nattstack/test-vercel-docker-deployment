import { treaty } from "@elysia/eden"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeader } from "@tanstack/react-start/server"
import { app } from "#/api/app"
import { BASE_URL } from "#/utils/url"

const getTreaty = createIsomorphicFn()
  .client(() => treaty<typeof app>(BASE_URL).api)
  .server(
    () =>
      treaty(app, {
        headers: () => ({ cookie: getRequestHeader("cookie") ?? "" }),
      }).api,
  )

export const rpc = getTreaty()
