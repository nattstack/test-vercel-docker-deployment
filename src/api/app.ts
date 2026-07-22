import { Elysia } from "elysia"
import { routes } from "#/api/routes"

export const app = new Elysia({
  prefix: "/api",
}).use(routes)
