use axum::{
    http::Method,
    routing::{get, post},
    Router,
};
use std::{
    net::SocketAddr,
    sync::{Arc, Mutex},
};
use tower_http::cors::{Any, CorsLayer};

mod handlers;
mod state;
mod subscription;
mod user;

use handlers::{create_subscription, create_user, health_check};
use state::{AppState, SharedState};

#[tokio::main]
async fn main() {
    // Configure CORS so React frontend can call this backend
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(Any);

    // In-memory store shared across all requests
    let state: SharedState = Arc::new(Mutex::new(AppState::default()));

    // Build API routes
    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/users", post(create_user))
        .route("/api/subscriptions", post(create_subscription))
        .layer(cors)
        .with_state(state);

    // Run the server on port 3000
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}