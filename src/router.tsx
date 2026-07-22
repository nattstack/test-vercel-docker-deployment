import { createRouter, type Router } from "@tanstack/react-router"
import { routeTree } from "#/routeTree.gen"

export function getRouter(): Router<typeof routeTree> {
  return createRouter({
    routeTree,
    scrollRestoration: true,
  })
}
