export interface User {
    user_id: string;
    name: string;
}

export interface Subscription{
    subscription_id: string;
    user_id: string;
    plan_name: string;
    price_in_cents: number;
    is_active: boolean;
}

export interface CreateUserPayload {
    name: string;
}

export interface CreateSubscriptionPayload {
    user_id: string;
    plan_name: string;
    price_in_cents: number;
}