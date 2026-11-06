use serde::{Deserialize, Serialize};
 
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Vendor {
    pub vendor_id: String,
    pub business_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub website: Option<String>,
    pub description: Option<String>,
}
 
#[derive(Debug, Deserialize)]
pub struct CreateVendorPayload {
    pub business_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub website: Option<String>,
    pub description: Option<String>,
}
 
impl Vendor {
    pub fn from_payload(vendor_id: String, p: CreateVendorPayload) -> Self {
        Self {
            vendor_id,
            business_name: p.business_name,
            email: p.email,
            phone: p.phone,
            address: p.address,
            website: p.website,
            description: p.description,
        }
    }
}