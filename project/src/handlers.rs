use axum::{http::StatusCode, Json};
use crate::subscription::{CreateSubscriptionPayload, Subscription};
use crate::user::{CreateUserPayload, User};

pub async fn health_check() -> &'static str {
    "Api is running"
}

pub async fn create_user(
    Json(payload):  Json<CreateUserPayload>, 
) -> (StatusCode, Json<User>) {
    let user = User::new(payload.user_id, payload.name);
    (StatusCode::CREATED, Json(user))
}

pub async fn create_subscription(
    Json(payload): Json<CreateSubscriptionPayload>,
) -> (StatusCode, Json<Subscription>) {
    let subscription = Subscription::new(
        payload.subscription_id,
        payload.user_id,
        payload.plan_name,
        payload.price_in_cents,
    );
    (StatusCode::CREATED, Json(subscription))
}