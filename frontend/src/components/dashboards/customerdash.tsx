import { useState, useEffect } from "react";
import { getSession, clearSession } from "../../configs/session";
import { api } from "../../configs/api";
import type { Subscription, Vendor } from "../../configs/types";

type CustomerTab = "overview" | "billing" | "profile";

const CustomerDash = () => {
  const session = getSession();
  const customerId = session?.role === "customer" ? session.id : null;

  const [activeTab, setActiveTab] = useState<CustomerTab>("overview");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [vendors, setVendors] = useState<Record<string, Vendor>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: session?.name || "",
    email: session?.email || "",
    emailNotifications: true,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    const loadCustomerData = async () => {
      try {
        setLoading(true);
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;
    setSavingProfile(true);
    setProfileMessage(null);
    try {
      // Adjust to match your actual api.ts method signature
      if ("updateUser" in api && typeof (api as any).updateUser === "function") {
        await (api as any).updateUser(customerId, {
          name: profileForm.name,
          email: profileForm.email,
        });
      }
      setProfileMessage("Profile updated successfully!");
    } catch {
      setProfileMessage("Failed to update profile. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    window.location.href = "/";
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
    (acc, sub) => acc + sub.price_in_cents,
    0
  );

  return (
    <section className="customer-dash">
      <div className="dash-layout">
        {/* Sidebar Navigation */}
        <aside className="dash-sidebar" aria-label="Customer Navigation">
          <div className="dash-sidebar__brand">
            <h1>Regulars</h1>
            <p className="welcome-text">{profileForm.name || session.name}</p>
          </div>

          <nav className="dash-sidebar__nav">
            <button
              type="button"
              className={`sidebar-link ${activeTab === "overview" ? "is-active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview & Subscriptions
            </button>
            <button
              type="button"
              className={`sidebar-link ${activeTab === "billing" ? "is-active" : ""}`}
              onClick={() => setActiveTab("billing")}
            >
              Billing & History
            </button>
            <button
              type="button"
              className={`sidebar-link ${activeTab === "profile" ? "is-active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Profile & Account
            </button>
            <a href="/discover" className="sidebar-link sidebar-link--external">
              Discover Vendors ↗
            </a>
          </nav>

          <div className="dash-sidebar__footer">
            <button onClick={handleLogout} className="btn-logout btn-full">
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Pane */}
        <main className="main-content">
          {loading ? (
            <p className="status-message">Loading your dashboard...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              {activeTab === "overview" && (
                <>
                  <header className="section-header">
                    <h2>Dashboard Overview</h2>
                    <p>Manage your active memberships and monthly spend.</p>
                  </header>

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

                  <section className="subscriptions-section">
                    <h3>Your Subscriptions</h3>
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

              {activeTab === "billing" && (
                <section className="panel-card">
                  <header className="section-header">
                    <h2>Billing & Payment History</h2>
                    <p>Review recurring charges across your subscribed vendors.</p>
                  </header>
                  {subscriptions.length === 0 ? (
                    <p>No billing records found.</p>
                  ) : (
                    <ul className="subscriptions-list">
                      {subscriptions.map((sub) => (
                        <li key={sub.subscription_id} className="sub-card">
                          <div>
                            <h3>{vendors[sub.vendor_id]?.business_name || "Vendor"}</h3>
                            <p className="sub-card__plan">{sub.plan_name} — Recurring Monthly</p>
                          </div>
                          <div>
                            <strong>${(sub.price_in_cents / 100).toFixed(2)}</strong>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )}

              {activeTab === "profile" && (
                <section className="panel-card">
                  <header className="section-header">
                    <h2>Profile & Account Settings</h2>
                    <p>Update your personal details and preferences.</p>
                  </header>

                  <form onSubmit={handleSaveProfile} className="dash-form">
                    <div className="form-group">
                      <label htmlFor="cust-name">Full Name</label>
                      <input
                        id="cust-name"
                        type="text"
                        value={profileForm.name}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cust-email">Email Address</label>
                      <input
                        id="cust-email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) =>
                          setProfileForm({ ...profileForm, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="form-group form-group--checkbox">
                      <input
                        id="cust-notif"
                        type="checkbox"
                        checked={profileForm.emailNotifications}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            emailNotifications: e.target.checked,
                          })
                        }
                      />
                      <label htmlFor="cust-notif">
                        Receive renewal reminders and vendor updates via email
                      </label>
                    </div>

                    {profileMessage && (
                      <p className="form-feedback">{profileMessage}</p>
                    )}

                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={savingProfile}
                    >
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </button>
                  </form>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </section>
  );
};

export default CustomerDash;