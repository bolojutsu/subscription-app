use axum::{
    Router, http::Method, routing::{ get, post},
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
 
mod handlers;
mod subscription;
mod user;
 
use handlers::{create_subscription, create_user, health_check};

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods([Method::GET, Method::POST])
    .allow_headers(Any);

    let app = Router::new()
    .route("/api/health", get(health_check))
    .route("/api/users", post(create_user))
    .route("/api/subscriptions", post(create_subscription))
    .layer(cors);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Server running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}