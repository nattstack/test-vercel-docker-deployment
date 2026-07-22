# syntax=docker/dockerfile:1.7
#
# Runtime image for the TanStack Start app.
#
# Build context: the repo root. Nitro emits the production server bundle into
# `.output/`, which is the only build artifact copied into the runtime image.

ARG BUN_VERSION=1.3.11

FROM oven/bun:${BUN_VERSION}-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

FROM deps AS build

COPY . .

RUN bun run build

FROM oven/bun:${BUN_VERSION}-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
