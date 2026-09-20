use std::{
    collections::HashMap,
    sync::{Arc, Mutex},
};
 
use crate::{subscription::Subscription, user::User};
 
#[derive(Default)]
pub struct AppState {
    pub users: HashMap<String, User>,
    pub subscriptions: HashMap<String, Subscription>,
}
 
pub type SharedState = Arc<Mutex<AppState>>;