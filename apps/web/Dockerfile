# syntax=docker/dockerfile:1

# Stage 1: Base with Node.js and PNPM installed
ARG NODE_VERSION=18.18.2
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

ENV NODE_ENV=production

ARG PNPM_VERSION=8.14.1
RUN npm install -g pnpm@$PNPM_VERSION

# Stage 2: Build Stage
FROM base as build

ENV NODE_ENV=development

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

COPY --link . .

RUN pnpm --filter=web deploy pruned-web && \
    cd pruned-web && \
    pnpm install && \
    pnpm run build && \
    pnpm prune --prod

ENV NODE_ENV=production

# Stage 3: Production Image
FROM base

COPY --from=build /app/pruned-web /app

EXPOSE 3000

CMD ["pnpm", "run", "start"]
