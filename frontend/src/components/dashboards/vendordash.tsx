import { useState, useEffect } from "react";
import { getSession, clearSession } from "../../configs/session";
import { api } from "../../configs/api";
import type { Subscription, Vendor, User } from "../../configs/types";

type VendorTab = "overview" | "subscribers" | "profile";

const VendorDash = () => {
  const session = getSession();
  const vendorId = session?.role === "vendor" ? session.id : null;

  const [activeTab, setActiveTab] = useState<VendorTab>("overview");
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscribers, setSubscribers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editable business profile form
  const [businessForm, setBusinessForm] = useState({
    business_name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
  });
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!vendorId) {
      setLoading(false);
      return;
    }

    const loadVendorData = async () => {
      try {
        setLoading(true);
        const [vendorData, vendorSubs] = await Promise.all([
          api.getVendor(vendorId),
          api.getVendorSubscriptions(vendorId),
        ]);

        setVendor(vendorData);
        setBusinessForm({
          business_name: vendorData.business_name || "",
          email: vendorData.email || "",
          phone: vendorData.phone || "",
          website: vendorData.website || "",
          address: vendorData.address || "",
        });
        setSubscriptions(vendorSubs);

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

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;
    setSavingBusiness(true);
    setSaveMessage(null);
    try {
      // Adjust to match your actual api.ts method signature
      if ("updateVendor" in api && typeof (api as any).updateVendor === "function") {
        const updated = await (api as any).updateVendor(vendorId, businessForm);
        setVendor((prev) => (prev ? { ...prev, ...updated } : updated));
      } else {
        setVendor((prev) => (prev ? { ...prev, ...businessForm } : null));
      }
      setSaveMessage("Business profile updated!");
    } catch {
      setSaveMessage("Failed to save business details.");
    } finally {
      setSavingBusiness(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    window.location.href = "/";
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
      <div className="dash-layout">
        {/* Sidebar Navigation */}
        <aside className="dash-sidebar" aria-label="Vendor Navigation">
          <div className="dash-sidebar__brand">
            <span className="portal-tag">Vendor Portal</span>
            <h2>{vendor?.business_name || session.name}</h2>
          </div>

          <nav className="dash-sidebar__nav">
            <button
              type="button"
              className={`sidebar-link ${activeTab === "overview" ? "is-active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview & Metrics
            </button>
            <button
              type="button"
              className={`sidebar-link ${activeTab === "subscribers" ? "is-active" : ""}`}
              onClick={() => setActiveTab("subscribers")}
            >
              Subscribers ({subscriptions.length})
            </button>
            <button
              type="button"
              className={`sidebar-link ${activeTab === "profile" ? "is-active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              Business Profile
            </button>
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
            <p className="status-message">Loading business analytics...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              {activeTab === "overview" && (
                <>
                  <header className="section-header">
                    <h2>Business Overview</h2>
                    <p>Track recurring revenue and subscriber growth.</p>
                  </header>

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

                  {vendor && (
                    <section className="vendor-details-card">
                      <div className="card-header-row">
                        <h3>Public Storefront Details</h3>
                        <button
                          type="button"
                          className="btn-secondary-sm"
                          onClick={() => setActiveTab("profile")}
                        >
                          Edit Profile
                        </button>
                      </div>
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
                            <a href={vendor.website} target="_blank" rel="noreferrer">
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
                </>
              )}

              {activeTab === "subscribers" && (
                <section className="subscribers-section">
                  <header className="section-header">
                    <h2>Customer Subscriptions</h2>
                    <p>All active and past members subscribed to your plans.</p>
                  </header>

                  {subscriptions.length === 0 ? (
                    <p className="empty-state">No customers have subscribed yet.</p>
                  ) : (
                    <div className="subscribers-table-wrapper">
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
                    </div>
                  )}
                </section>
              )}

              {activeTab === "profile" && (
                <section className="vendor-details-card">
                  <header className="section-header">
                    <h2>Edit Business Profile</h2>
                    <p>Update the contact and location details customers see.</p>
                  </header>

                  <form onSubmit={handleSaveBusiness} className="dash-form">
                    <div className="form-group">
                      <label htmlFor="biz-name">Business Name</label>
                      <input
                        id="biz-name"
                        type="text"
                        value={businessForm.business_name}
                        onChange={(e) =>
                          setBusinessForm({
                            ...businessForm,
                            business_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="biz-email">Contact Email</label>
                        <input
                          id="biz-email"
                          type="email"
                          value={businessForm.email}
                          onChange={(e) =>
                            setBusinessForm({ ...businessForm, email: e.target.value })
                          }
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="biz-phone">Phone Number</label>
                        <input
                          id="biz-phone"
                          type="tel"
                          value={businessForm.phone}
                          onChange={(e) =>
                            setBusinessForm({ ...businessForm, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="biz-website">Website URL</label>
                      <input
                        id="biz-website"
                        type="url"
                        placeholder="https://..."
                        value={businessForm.website}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, website: e.target.value })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="biz-address">Street Address</label>
                      <input
                        id="biz-address"
                        type="text"
                        value={businessForm.address}
                        onChange={(e) =>
                          setBusinessForm({ ...businessForm, address: e.target.value })
                        }
                      />
                    </div>

                    {saveMessage && <p className="form-feedback">{saveMessage}</p>}

                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={savingBusiness}
                    >
                      {savingBusiness ? "Saving..." : "Save Business Profile"}
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

export default VendorDash;