# Dockerfile for building the API from monorepo root
# Build command:
# docker build -f programmerbar-api/Dockerfile --build-arg DATABASE_URL=postgres://postgres:postgres@localhost:5432/programmerbar -t programmerbar-api .
# or
# docker build -f programmerbar-api/Dockerfile --build-arg DATABASE_URL=postgres://postgres:postgres@host.docker.internal:5432/programmerbar -t programmerbar-api .

FROM node:22-alpine AS pruner
RUN npm install -g turbo@2.5.6
WORKDIR /app
COPY . .
RUN turbo prune @programmerbar/api --docker

FROM lukemathwalker/cargo-chef:latest AS chef
WORKDIR /app

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

FROM chef AS planner
# Copy Rust workspace files (not pruned by turbo since they're not in Node.js workspace)
COPY Cargo.toml Cargo.lock ./
COPY --from=pruner /app/out/full/programmerbar-api/Cargo.toml ./programmerbar-api/Cargo.toml
COPY --from=pruner /app/out/full/programmerbar-api/src ./programmerbar-api/src
RUN cargo chef prepare --recipe-path recipe.json --bin api

FROM chef AS builder

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json --bin api

# Copy Rust workspace files and pruned Node.js content
COPY Cargo.toml Cargo.lock ./
COPY --from=pruner /app/out/full/ .
RUN cargo build --release --bin api

FROM debian:bookworm-slim AS runtime

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libpq5 \
    libssl3 \
    curl \
    && rm -rf /var/lib/apt/lists/*

RUN useradd -r -s /bin/false -m -d /app appuser

WORKDIR /app

COPY --from=builder /app/target/release/api ./api

RUN chown -R appuser:appuser /app && \
    chmod +x ./api

USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
    CMD curl --fail http://localhost:8000/health || exit 1

ENV SERVER_PORT=8000

CMD ["./api"]