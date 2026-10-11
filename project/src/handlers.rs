use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use uuid::Uuid;

use crate::state::SharedState;
use crate::subscription::{CreateSubscriptionPayload, Subscription};
use crate::user::{CreateUserPayload, User};
use crate::vendor::{CreateVendorPayload, Vendor};

// GET /api/health
pub async fn health_check() -> &'static str {
    "API is running"
}

// ---------- Users (people subscribing to a service) ----------

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

// GET /api/users/:id
pub async fn get_user(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> Result<Json<User>, StatusCode> {
    let database = state.lock().unwrap();
    database
        .users
        .get(&id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

// GET /api/users/:id/subscriptions
pub async fn get_user_subscriptions(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> Result<Json<Vec<Subscription>>, StatusCode> {
    let database = state.lock().unwrap();

    if !database.users.contains_key(&id) {
        return Err(StatusCode::NOT_FOUND);
    }

    let subs: Vec<Subscription> = database
        .subscriptions
        .values()
        .filter(|s| s.user_id == id)
        .cloned()
        .collect();

    Ok(Json(subs))
}

// ---------- Vendors (businesses offering a subscription service) ----------

// POST /api/vendors
pub async fn create_vendor(
    State(state): State<SharedState>,
    Json(payload): Json<CreateVendorPayload>,
) -> (StatusCode, Json<Vendor>) {
    let vendor = Vendor::new(Uuid::new_v4().to_string(), payload.business_name, payload.email);

    state
        .lock()
        .unwrap()
        .vendors
        .insert(vendor.vendor_id.clone(), vendor.clone());

    (StatusCode::CREATED, Json(vendor))
}

// GET /api/vendors/:id
pub async fn get_vendor(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> Result<Json<Vendor>, StatusCode> {
    let database = state.lock().unwrap();
    database
        .vendors
        .get(&id)
        .cloned()
        .map(Json)
        .ok_or(StatusCode::NOT_FOUND)
}

// GET /api/vendors/:id/subscriptions
// Lets a vendor see everyone currently subscribed to one of their plans.
pub async fn get_vendor_subscriptions(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> Result<Json<Vec<Subscription>>, StatusCode> {
    let database = state.lock().unwrap();

    if !database.vendors.contains_key(&id) {
        return Err(StatusCode::NOT_FOUND);
    }

    let subs: Vec<Subscription> = database
        .subscriptions
        .values()
        .filter(|s| s.vendor_id == id)
        .cloned()
        .collect();

    Ok(Json(subs))
}

// ---------- Subscriptions (the link between a user and a vendor) ----------

// POST /api/subscriptions
pub async fn create_subscription(
    State(state): State<SharedState>,
    Json(payload): Json<CreateSubscriptionPayload>,
) -> Result<(StatusCode, Json<Subscription>), StatusCode> {
    let mut db = state.lock().unwrap();

    // Both sides of the subscription need to exist
    if !db.users.contains_key(&payload.user_id) {
        return Err(StatusCode::NOT_FOUND);
    }
    if !db.vendors.contains_key(&payload.vendor_id) {
        return Err(StatusCode::NOT_FOUND);
    }

    let subscription = Subscription::new(
        Uuid::new_v4().to_string(),
        payload.user_id,
        payload.vendor_id,
        payload.plan_name,
        payload.price_in_cents,
    );

    db.subscriptions
        .insert(subscription.subscription_id.clone(), subscription.clone());

    Ok((StatusCode::CREATED, Json(subscription)))
}

// POST /api/subscriptions/:id/cancel
pub async fn cancel_subscription(
    State(state): State<SharedState>,
    Path(id): Path<String>,
) -> Result<Json<Subscription>, StatusCode> {
    let mut database = state.lock().unwrap();
    let sub = database
        .subscriptions
        .get_mut(&id)
        .ok_or(StatusCode::NOT_FOUND)?;

    sub.is_active = false;
    Ok(Json(sub.clone()))
}