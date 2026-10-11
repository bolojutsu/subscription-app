import type {
  User,
  Vendor,
  Subscription,
  CreateUserPayload,
  CreateVendorPayload,
  CreateSubscriptionPayload,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
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

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Request to ${path} failed with status ${response.status}`
    );
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType?.includes("application/json")) {
    return response.json() as Promise<T>;
  }

  return response.text() as unknown as Promise<T>;
}

export const api = {
  healthCheck: () => request<string>("/api/health"),

  // Users (people subscribing to a service)
  createUser: (payload: CreateUserPayload) =>
    request<User>("/api/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getUser: (userId: string) => request<User>(`/api/users/${userId}`),

  getUserSubscriptions: (userId: string) =>
    request<Subscription[]>(`/api/users/${userId}/subscriptions`),

  // Vendors (businesses offering a subscription service)
  createVendor: (payload: CreateVendorPayload) =>
    request<Vendor>("/api/vendors", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getVendor: (vendorId: string) => request<Vendor>(`/api/vendors/${vendorId}`),

  getVendorSubscriptions: (vendorId: string) =>
    request<Subscription[]>(`/api/vendors/${vendorId}/subscriptions`),

  // Subscriptions (the link between a user and a vendor)
  createSubscription: (payload: CreateSubscriptionPayload) =>
    request<Subscription>("/api/subscriptions", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  cancelSubscription: (subscriptionId: string) =>
    request<Subscription>(`/api/subscriptions/${subscriptionId}/cancel`, {
      method: "POST",
    }),
};