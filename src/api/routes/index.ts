import { Elysia } from "elysia"
import { routeGroupAuth } from "#/api/routes/auth"
import { routeGroupRoot } from "#/api/routes/root"

export const routes = new Elysia().use(routeGroupRoot).use(routeGroupAuth)
