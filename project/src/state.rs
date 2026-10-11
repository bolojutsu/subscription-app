use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};

use crate::{subscription::Subscription, user::User, vendor::Vendor};

#[derive(Default)]
pub struct AppState {
    pub users: HashMap<String, User>,
    pub vendors: HashMap<String, Vendor>,
    pub subscriptions: HashMap<String, Subscription>,
}

pub type SharedState = Arc<Mutex<AppState>>;