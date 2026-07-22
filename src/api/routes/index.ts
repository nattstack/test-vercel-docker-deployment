import { Elysia } from "elysia"
import { routeGroupRoot } from "#/api/routes/root"

export const routes = new Elysia().use(routeGroupRoot)
