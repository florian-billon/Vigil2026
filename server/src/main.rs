mod handlers;
mod models;
mod websocket;
mod db;

use axum::{
    routing::get,
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(handlers::health))
        .route("/health", get(handlers::health))
        .layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    tracing::info!("VIGIL Server listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind address");

    axum::serve(listener, app)
        .await
        .expect("Server error");
}