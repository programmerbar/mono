# Dockerfile for building the API from monorepo root
# Build command: docker build -f programmerbar-api/Dockerfile --build-arg DATABASE_URL=postgres://postgres:postgres@localhost:5432/programmerbar -t programmerbar-api .

FROM lukemathwalker/cargo-chef:latest AS chef
WORKDIR /app

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

FROM chef AS planner
COPY Cargo.toml Cargo.lock ./
COPY programmerbar-api/Cargo.toml ./programmerbar-api/Cargo.toml
COPY programmerbar-api/src ./programmerbar-api/src
RUN cargo chef prepare --recipe-path recipe.json --bin api

FROM chef AS builder

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json --bin api

COPY . .
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