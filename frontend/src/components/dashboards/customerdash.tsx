import { useState, useEffect } from "react";
import { getSession, clearSession } from "../../configs/session";
import { api } from "../../configs/api";
import type { Subscription, Vendor } from "../../configs/types";

const CustomerDash = () => {
  const session = getSession();
  const customerId = session?.role === "customer" ? session.id : null;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [vendors, setVendors] = useState<Record<string, Vendor>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    const loadCustomerData = async () => {
      try {
        setLoading(true);
        // Fetch user subscriptions and all vendor profiles concurrently
        const [userSubs, vendorList] = await Promise.all([
          api.getUserSubscriptions(customerId),
          api.listVendors(),
        ]);

        const vendorMap: Record<string, Vendor> = {};
        vendorList.forEach((v) => {
          vendorMap[v.vendor_id] = v;
        });

        setSubscriptions(userSubs);
        setVendors(vendorMap);
      } catch (err) {
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomerData();
  }, [customerId]);

  const handleCancelSubscription = async (subscriptionId: string) => {
    setCancelingId(subscriptionId);
    try {
      await api.cancelSubscription(subscriptionId);
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.subscription_id === subscriptionId
            ? { ...sub, is_active: false }
            : sub
        )
      );
    } catch {
      alert("Failed to cancel subscription. Please try again.");
    } finally {
      setCancelingId(null);
    }
  };

  const handleLogout = () => {
    clearSession();
    window.location.href = "/signup-customer";
  };

  if (!session || session.role !== "customer") {
    return (
      <section className="dashboard-error">
        <h2>Access Denied</h2>
        <p>Please sign in to view your customer dashboard.</p>
        <a href="/signup-customer">Go to Customer Sign up</a>
      </section>
    );
  }

  const activeSubs = subscriptions.filter((s) => s.is_active);
  const totalMonthlySpend = activeSubs.reduce(
    (acc, sub) => acc + sub.price_in_cents, 0
  );

  return (
    <section className="customer-dash">
      <header className="customer-dash__header">
        <div className="heading">
          <h1>Regulars</h1>
          <p className="welcome-text">Welcome back, {session.name}!</p>
        </div>
        <div className="sidebar">
          <nav className="navbar">
            <div className="navlinks">
              <a href="/discover">Discover Vendors</a>
              <button onClick={handleLogout} className="btn-logout">
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {loading ? (
          <p className="status-message">Loading your active subscriptions...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            {/* Overview Stats */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Active Subscriptions</h3>
                <p className="stat-value">{activeSubs.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Monthly Spend</h3>
                <p className="stat-value">
                  ${(totalMonthlySpend / 100).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Subscriptions List */}
            <section className="subscriptions-section">
              <h2>Your Subscriptions</h2>
              {subscriptions.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't subscribed to any vendors yet.</p>
                  <a href="/discover" className="btn-primary">
                    Explore Available Services
                  </a>
                </div>
              ) : (
                <ul className="subscriptions-list">
                  {subscriptions.map((sub) => {
                    const vendor = vendors[sub.vendor_id];
                    return (
                      <li key={sub.subscription_id} className="sub-card">
                        <div className="sub-card__details">
                          <h3>
                            {vendor ? vendor.business_name : "Unknown Vendor"}
                          </h3>
                          <p className="sub-card__plan">
                            {sub.plan_name} Plan · $
                            {(sub.price_in_cents / 100).toFixed(2)}/mo
                          </p>
                          <span
                            className={`badge ${
                              sub.is_active ? "badge--active" : "badge--canceled"
                            }`}
                          >
                            {sub.is_active ? "Active" : "Canceled"}
                          </span>
                        </div>
                        <div className="sub-card__actions">
                          {sub.is_active && (
                            <button
                              className="btn-danger"
                              onClick={() =>
                                handleCancelSubscription(sub.subscription_id)
                              }
                              disabled={cancelingId === sub.subscription_id}
                            >
                              {cancelingId === sub.subscription_id
                                ? "Canceling..."
                                : "Cancel Subscription"}
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </section>
  );
};

export default CustomerDash;