use serde::{Deserialize,Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Subscription{
    pub subscription_id: String,
    pub user_id: String,
    pub plan_name: String,
    pub price_in_cents: u32,
    pub is_active: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreateSubscriptionPayload {
    pub subscription_id: String,
    pub user_id: String,
    pub plan_name: String,
    pub price_in_cents: u32,
}

impl Subscription {
    pub fn new(
        subscription_id: impl Into<String>,
        user_id: impl Into<String>,
        plan_name: impl Into<String>,
        price_in_cents: u32,
    ) -> Self {
        Self {
            subscription_id: subscription_id.into(),
            user_id: user_id.into(),
            plan_name: plan_name.into(),
            price_in_cents,
            is_active: true, 
        }
    }
}