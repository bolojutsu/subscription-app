use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Vendor {
    pub vendor_id: String,
    pub name: String,
    pub email: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateVendorPayload {
    pub business_name: String,
    pub email: String,
}

impl Vendor {
    pub fn new(vendor_id: impl Into<String>, business_name: impl Into<String>, email: impl Into<String>) -> Self {
        Self {
            vendor_id: vendor_id.into(),
            name: business_name.into(),
            email: email.into(),
        }
    }
}