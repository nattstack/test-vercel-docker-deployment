import { isProduction } from "#/utils/environment"

export const BASE_URL = isProduction ? "https://test.localhost" : "https://test.localhost"
