use axum::{Json, response::IntoResponse};
use serde_json::json;

pub async fn health() -> impl IntoResponse {
    Json(json!({
        "status": "ok",
        "service": "vigil-server",
        "version": "0.1.0"
    }))
}