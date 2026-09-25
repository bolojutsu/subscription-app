import type {User, Subscription, CreateUserPayload, CreateSubscriptionPayload} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhoast:3000";

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string){
        super(message)
        this.name = "ApiError"
        this.status = status;
    }
}  

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });

    if(!response.ok) {
        throw new ApiError(
            response.status,
            `Request to ${path} failed with status ${response.status}`
        );
    }

    const ContentType = response.headers.get("Content-type");
    if (ContentType?.includes("application/json")) {
        return response.json() as Promise<T>;
    }

    return response.text as unknown as Promise<T>
}

export const api = {
    healthCheck: () => request<string>("/api/health"),

    createUser: (payload: CreateUserPayload) => request<User>("/api/users", 
        {
            method: "Post", 
            body: JSON.stringify(payload)
        }),
    
    getUser: (userId: string) => request<User>(`/api/users/${userId}`),
    
    getUserSubscriptions: (userId: string) =>
        request<Subscription[]>(`/api/users/${userId}/subscriptions`),
     
    createSubscription: (payload: CreateSubscriptionPayload) => request<Subscription>("/api/subscriptions", 
        {
          method: "POST",
          body: JSON.stringify(payload),
        }),
     
    cancelSubscription: (subscriptionId: string) => request<Subscription>(`/api/subscriptions/${subscriptionId}/cancel`,
         {
          method: "POST",
        }),
};