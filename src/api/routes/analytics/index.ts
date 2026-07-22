import { Elysia } from "elysia"
import { routeAnalyticsList } from "#/api/routes/analytics/list"

export const routeGroupAnalytics = new Elysia({ prefix: "/analytics" }).use(routeAnalyticsList)
