import { createRootRoute } from "@tanstack/react-router"
import { RouteRoot } from "#/routes/-route-root"
import { RouteRootHead } from "#/routes/-route-root-head"
import { RouteRootNotFound } from "#/routes/-route-root-not-found"

export const Route = createRootRoute({
  component: RouteRoot,
  head: RouteRootHead,
  notFoundComponent: RouteRootNotFound,
})
