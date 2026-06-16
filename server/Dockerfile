FROM rust:1.88-alpine AS builder

WORKDIR /app

COPY Cargo.toml ./
COPY src ./src

RUN cargo build --release

FROM rust:1.88-alpine

WORKDIR /app

COPY --from=builder /app/target/release/vigil-server /app/vigil-server

EXPOSE 8080

CMD ["./vigil-server"]
