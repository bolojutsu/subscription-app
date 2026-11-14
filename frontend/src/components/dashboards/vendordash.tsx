import { useState, useEffect } from "react";
import { getSession, saveSession, clearSession } from "../../configs/session";
import { api } from "../../configs/api";
import { formatCurrency } from "../../configs/format";
import type { Subscription, Vendor, User } from "../../configs/types";
import DashSidebar from "../dashsidebar";
import StatCard from "../statcard";
import StatusBadge from "../statusbadge";


type VendorTab = "overview" | "subscribers" | "profile";

const toBusinessForm = (v: Vendor) => ({
  business_name: v.business_name || "",
  email: v.email || "",
  phone: v.phone || "",
  address: v.address || "",
  website: v.website || "",
  description: v.description || "",
});

type BusinessForm = ReturnType<typeof toBusinessForm>;

const EMPTY_FORM: BusinessForm = {
  business_name: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  description: "",
};

const VendorDash = () => {
  const session = getSession();
  const vendorId = session?.role === "vendor" ? session.id : null;

  const [activeTab, setActiveTab] = useState<VendorTab>("overview");
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [subscribers, setSubscribers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [businessForm, setBusinessForm] = useState<BusinessForm>(EMPTY_FORM);
  const [savingBusiness, setSavingBusiness] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    if (!vendorId) {
      setLoading(false);
      return;
    }

    // Guards against setting state after unmount / vendorId change
    let cancelled = false;

    const loadVendorData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [vendorData, vendorSubs] = await Promise.all([
          api.getVendor(vendorId),
          api.getVendorSubscriptions(vendorId),
        ]);
        if (cancelled) return;

        setVendor(vendorData);
        setBusinessForm(toBusinessForm(vendorData));
        setSubscriptions(vendorSubs);

        // TODO: replace with one GET /api/vendors/:id/subscribers call (joined name + email)
        const userIds = Array.from(new Set(vendorSubs.map((s) => s.user_id)));
        const profiles = await Promise.all(
          userIds.map((id) => api.getUser(id).catch(() => null))
        );
        if (cancelled) return;

        setSubscribers(
          Object.fromEntries(
            profiles.filter((u): u is User => u !== null).map((u) => [u.user_id, u])
          )
        );
      } catch {
        if (!cancelled) setError("Failed to load vendor dashboard details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadVendorData();
    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  const updateField = (field: keyof BusinessForm, value: string) =>
    setBusinessForm((prev) => ({ ...prev, [field]: value }));

  const handleTabChange = (tab: VendorTab) => {
    setActiveTab(tab);
    setSaveMessage(null);
  };

  const handleSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorId) return;
    setSavingBusiness(true);
    setSaveMessage(null);
    try {
      const updated = await api.updateVendor(vendorId, businessForm);
      setVendor(updated);

      // Keep the session in sync so the sidebar name updates immediately
      saveSession({ role: "vendor", id: vendorId, name: updated.business_name });
      setSaveMessage({ text: "Business profile updated successfully!", isError: false });
    } catch {
      setSaveMessage({ text: "Failed to save business details.", isError: true });
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

  const tabs: { id: VendorTab; label: string }[] = [
    { id: "overview", label: "Overview & Metrics" },
    { id: "subscribers", label: `Subscribers (${activeSubscriptions.length})` },
    { id: "profile", label: "Business Profile" },
  ];

  return (
    <section className="dash-page vendor-dash">
      <div className="dash-layout">
        <DashSidebar
          ariaLabel="Vendor Navigation"
          eyebrow="Vendor Portal"
          title={vendor?.business_name || session.name}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onLogout={handleLogout}
        />

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
                    <h1>Business Overview</h1>
                    <p>Track recurring revenue and subscriber growth.</p>
                  </header>

                  <div className="stats-grid">
                    <StatCard label="Active Subscribers" value={activeSubscriptions.length} />
                    <StatCard
                      label="Monthly Revenue (MRR)"
                      value={formatCurrency(monthlyRecurringRevenue)}
                    />
                    <StatCard
                      label="Total Lifetime Subscriptions"
                      value={subscriptions.length}
                    />
                  </div>

                  {vendor && (
                    <section className="vendor-details-card">
                      <div className="card-header-row">
                        <h3>Public Storefront Details</h3>
                        <button
                          type="button"
                          className="btn-secondary-sm"
                          onClick={() => handleTabChange("profile")}
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
                        {vendor.description && (
                          <p className="vendor-details-grid__wide">
                            <strong>Description:</strong> {vendor.description}
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
                    <h1>Customer Subscriptions</h1>
                    <p>All members subscribed to your plans, including canceled ones.</p>
                  </header>

                  {subscriptions.length === 0 ? (
                    <p className="empty-state">No customers have subscribed yet.</p>
                  ) : (
                    <div className="subscribers-table-wrapper">
                      <table className="subscribers-table">
                        <thead>
                          <tr>
                            <th scope="col">Customer Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Plan</th>
                            <th scope="col">Price</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscriptions.map((sub) => {
                            const subscriber = subscribers[sub.user_id];
                            return (
                              <tr key={sub.subscription_id}>
                                <td>{subscriber?.name ?? "Unknown"}</td>
                                <td>{subscriber?.email ?? "N/A"}</td>
                                <td>{sub.plan_name}</td>
                                <td>{formatCurrency(sub.price_in_cents)}/mo</td>
                                <td>
                                  <StatusBadge active={sub.is_active} />
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
                <section className="panel-card">
                  <header className="section-header">
                    <h1>Edit Business Profile</h1>
                    <p>Update storefront contact and location details.</p>
                  </header>

                  <form onSubmit={handleSaveBusiness} className="dash-form">
                    <div className="form-group">
                      <label htmlFor="biz-name">Business Name</label>
                      <input
                        id="biz-name"
                        type="text"
                        value={businessForm.business_name}
                        onChange={(e) => updateField("business_name", e.target.value)}
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
                          onChange={(e) => updateField("email", e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="biz-phone">Phone Number</label>
                        <input
                          id="biz-phone"
                          type="tel"
                          value={businessForm.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
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
                        onChange={(e) => updateField("website", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="biz-address">Street Address</label>
                      <input
                        id="biz-address"
                        type="text"
                        value={businessForm.address}
                        onChange={(e) => updateField("address", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="biz-desc">Business Description</label>
                      <textarea
                        id="biz-desc"
                        rows={3}
                        value={businessForm.description}
                        onChange={(e) => updateField("description", e.target.value)}
                      />
                    </div>

                    {saveMessage && (
                      <p
                        className={`form-feedback ${
                          saveMessage.isError ? "form-feedback--error" : ""
                        }`}
                        role="status"
                      >
                        {saveMessage.text}
                      </p>
                    )}

                    <button type="submit" className="btn-primary" disabled={savingBusiness}>
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