import { Elysia } from "elysia"

const ROOT_MESSAGE = "Hello Elysia!"

export const routeRoot = new Elysia().get("/", () => ({ message: ROOT_MESSAGE }))
