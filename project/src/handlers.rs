use axum::{extract::State, http::StatusCode, Json};
use uuid::Uuid;

use crate::state::SharedState;
use crate::subscription::{CreateSubscriptionPayload, Subscription};
use crate::user::{CreateUserPayload, User};

// GET /api/health
pub async fn health_check() -> &'static str {
    "API is running"
}

// POST /api/users
pub async fn create_user(
    State(state): State<SharedState>,
    Json(payload): Json<CreateUserPayload>,
) -> (StatusCode, Json<User>) {
    let user = User::new(Uuid::new_v4().to_string(), payload.name);

    state
        .lock()
        .unwrap()
        .users
        .insert(user.user_id.clone(), user.clone());

    (StatusCode::CREATED, Json(user))
}

// POST /api/subscriptions
pub async fn create_subscription(
    State(state): State<SharedState>,
    Json(payload): Json<CreateSubscriptionPayload>,
) -> Result<(StatusCode, Json<Subscription>), StatusCode> {
    let mut db = state.lock().unwrap();

    // Can't subscribe a user that doesn't exist
    if !db.users.contains_key(&payload.user_id) {
        return Err(StatusCode::NOT_FOUND);
    }

    let subscription = Subscription::new(
        Uuid::new_v4().to_string(),
        payload.user_id,
        payload.plan_name,
        payload.price_in_cents,
    );

    db.subscriptions
        .insert(subscription.subscription_id.clone(), subscription.clone());

    Ok((StatusCode::CREATED, Json(subscription)))
}