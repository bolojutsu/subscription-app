export interface User {
    user_id: string;
    name: string;
  }
  
  export interface Vendor {
    vendor_id: string;
    business_name: string;
    email: string;
  }
  
  export interface Subscription {
    subscription_id: string;
    user_id: string;
    vendor_id: string;
    plan_name: string;
    price_in_cents: number;
    is_active: boolean;
  }
  
  export interface CreateUserPayload {
    name: string;
  }
  
  export interface CreateVendorPayload {
    business_name: string;
    email: string;
  }
  
  export interface CreateSubscriptionPayload {
    user_id: string;
    vendor_id: string;
    plan_name: string;
    price_in_cents: number;
  }