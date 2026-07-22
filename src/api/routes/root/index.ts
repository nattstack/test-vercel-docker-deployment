import { Elysia } from "elysia"
import { routeHealth } from "#/api/routes/root/health"
import { routeRoot } from "#/api/routes/root/root"

export const routeGroupRoot = new Elysia().use(routeHealth).use(routeRoot)
