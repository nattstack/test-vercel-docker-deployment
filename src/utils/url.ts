import { isProduction } from "#/utils/environment"

export const BASE_URL = isProduction
  ? "https://test-vercel-docker-deployment.vercel.app"
  : "https://test.localhost"
