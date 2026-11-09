import { useState, useEffect } from "react";
import { getSession, clearSession } from "../../configs/session";
import { api } from "../../configs/api";
import type { Subscription, Vendor, User } from "../../configs/types";

const VendorDash = () => {
  const session = getSession();
  const vendorId = session?.role === "vendor" ? session.id : null;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscribers, setSubscribers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId) {
      setLoading(false);
      return;
    }

    const loadVendorData = async () => {
      try {
        setLoading(true);
        // Fetch vendor details and vendor subscriptions
        const [vendorData, vendorSubs] = await Promise.all([
          api.getVendor(vendorId),
          api.getVendorSubscriptions(vendorId),
        ]);

        setVendor(vendorData);
        setSubscriptions(vendorSubs);

        // Fetch associated customer profiles for subscribers
        const userIds = Array.from(new Set(vendorSubs.map((s) => s.user_id)));
        const userProfiles = await Promise.all(
          userIds.map((id) => api.getUser(id).catch(() => null))
        );

        const userMap: Record<string, User> = {};
        userProfiles.forEach((user) => {
          if (user) {
            userMap[user.user_id] = user;
          }
        });
        setSubscribers(userMap);
      } catch (err) {
        setError("Failed to load vendor dashboard details.");
      } finally {
        setLoading(false);
      }
    };

    loadVendorData();
  }, [vendorId]);

  const handleLogout = () => {
    clearSession();
    window.location.href = "/signup-vendor";
  };

  if (!session || session.role !== "vendor") {
    return (
      <section className="dashboard-error">
        <h2>Access Denied</h2>
        <p>Please register or sign in with a vendor account to continue.</p>
        <a href="/signup-vendor">Go to Vendor Registration</a>
      </section>
    );
  }

  const activeSubscriptions = subscriptions.filter((s) => s.is_active);
  const monthlyRecurringRevenue = activeSubscriptions.reduce(
    (acc, sub) => acc + sub.price_in_cents,
    0
  );

  return (
    <section className="vendor-dash">
      <header className="vendor-dash__header">
        <div>
          <h1>Vendor Portal</h1>
          <h2>{vendor?.business_name || session.name}</h2>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Sign Out
        </button>
      </header>

      <main className="main-content">
        {loading ? (
          <p className="status-message">Loading business analytics...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            {/* Key Business Metrics */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Active Subscribers</h3>
                <p className="stat-value">{activeSubscriptions.length}</p>
              </div>
              <div className="stat-card">
                <h3>Monthly Revenue (MRR)</h3>
                <p className="stat-value">
                  ${(monthlyRecurringRevenue / 100).toFixed(2)}
                </p>
              </div>
              <div className="stat-card">
                <h3>Total Lifetime Subscriptions</h3>
                <p className="stat-value">{subscriptions.length}</p>
              </div>
            </div>

            {/* Business Info Overview */}
            {vendor && (
              <section className="vendor-details-card">
                <h3>Business Details</h3>
                <div className="vendor-details-grid">
                  <p>
                    <strong>Email:</strong> {vendor.email}
                  </p>
                  {vendor.phone && (
                    <p>
                      <strong>Phone:</strong> {vendor.phone}
                    </p>
                  )}
                  {vendor.website && (
                    <p>
                      <strong>Website:</strong>{" "}
                      <a
                        href={vendor.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {vendor.website}
                      </a>
                    </p>
                  )}
                  {vendor.address && (
                    <p>
                      <strong>Address:</strong> {vendor.address}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Subscriber List */}
            <section className="subscribers-section">
              <h3>Customer Subscriptions</h3>
              {subscriptions.length === 0 ? (
                <p className="empty-state">No customers have subscribed yet.</p>
              ) : (
                <table className="subscribers-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Plan</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((sub) => {
                      const subscriber = subscribers[sub.user_id];
                      return (
                        <tr key={sub.subscription_id}>
                          <td>{subscriber ? subscriber.name : "Unknown"}</td>
                          <td>{subscriber ? subscriber.email : "N/A"}</td>
                          <td>{sub.plan_name}</td>
                          <td>${(sub.price_in_cents / 100).toFixed(2)}/mo</td>
                          <td>
                            <span
                              className={`badge ${
                                sub.is_active
                                  ? "badge--active"
                                  : "badge--canceled"
                              }`}
                            >
                              {sub.is_active ? "Active" : "Canceled"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </section>
          </>
        )}
      </main>
    </section>
  );
};

export default VendorDash;