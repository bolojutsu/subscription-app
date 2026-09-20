use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub user_id: String,
    pub name: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateUserPayload {
    pub user_id: String,
    pub name: String,
}

impl User {
    pub fn new(user_id: impl Into<String>, name: impl Into<String>) -> Self {
        Self {
            user_id: user_id.into(),
            name: name.into(),
        }
    }
}