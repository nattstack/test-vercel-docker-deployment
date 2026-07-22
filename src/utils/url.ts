import { isProduction } from "#/utils/environment"

export const BASE_URL = isProduction ? "https://donut.localhost" : "https://donut.localhost"
