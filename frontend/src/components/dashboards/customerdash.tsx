import { useState, useEffect } from "react";
import { getSession, saveSession, clearSession } from "../../configs/session";
import { api } from "../../configs/api";
import { formatCurrency } from "../../configs/format";
import type { Subscription, Vendor } from "../../configs/types";
import DashSidebar from "../dashsidebar";
import StatCard from "../statcard";
import StatusBadge from "../statusbadge";


type CustomerTab = "overview" | "billing" | "profile";

const TABS: { id: CustomerTab; label: string }[] = [
  { id: "overview", label: "Overview & Subscriptions" },
  { id: "billing", label: "Billing & History" },
  { id: "profile", label: "Profile & Account" },
];

const NAV_LINKS = [{ href: "/discover", label: "Discover Vendors ↗" }];

const CustomerDash = () => {
  const session = getSession();
  const customerId = session?.role === "customer" ? session.id : null;

  const [activeTab, setActiveTab] = useState<CustomerTab>("overview");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [vendors, setVendors] = useState<Record<string, Vendor>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState({
    name: session?.role === "customer" ? session.name : "",
    email: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  useEffect(() => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    // Guards against setting state after unmount / customerId change
    let cancelled = false;

    const loadCustomerData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [userSubs, vendorList, customerData] = await Promise.all([
          api.getUserSubscriptions(customerId),
          api.listVendors(),
          api.getUser(customerId),
        ]);
        if (cancelled) return;

        setSubscriptions(userSubs);
        setVendors(Object.fromEntries(vendorList.map((v) => [v.vendor_id, v])));
        setProfileForm({ name: customerData.name, email: customerData.email });
      } catch {
        if (!cancelled) {
          setError("Failed to load dashboard data. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCustomerData();
    return () => {
      cancelled = true;
    };
  }, [customerId]);

  const handleTabChange = (tab: CustomerTab) => {
    setActiveTab(tab);
    setProfileMessage(null);
    setCancelError(null);
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    setCancelingId(subscriptionId);
    setCancelError(null);
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
      setCancelError("Failed to cancel subscription. Please try again.");
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
      const updatedUser = await api.updateUser(customerId, {
        name: profileForm.name,
        email: profileForm.email,
      });

      // Keep the session in sync so the sidebar greeting updates immediately
      saveSession({ role: "customer", id: customerId, name: updatedUser.name });
      setProfileMessage({ text: "Profile updated successfully!", isError: false });
    } catch {
      setProfileMessage({
        text: "Failed to update profile. Please try again.",
        isError: true,
      });
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
  // Active first, then canceled; sort is stable so original order is kept within each group
  const billingRows = [...subscriptions].sort(
    (a, b) => Number(b.is_active) - Number(a.is_active)
  );

  return (
    <section className="dash-page customer-dash">
      <div className="dash-layout">
        <DashSidebar
          ariaLabel="Customer Navigation"
          title="Regulars"
          subtitle={`Welcome back, ${profileForm.name || session.name}!`}
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          links={NAV_LINKS}
          onLogout={handleLogout}
        />

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
                    <h1>Dashboard Overview</h1>
                    <p>Manage your active memberships and monthly spend.</p>
                  </header>

                  <div className="stats-grid">
                    <StatCard label="Active Subscriptions" value={activeSubs.length} />
                    <StatCard
                      label="Total Monthly Spend"
                      value={formatCurrency(totalMonthlySpend)}
                    />
                  </div>

                  <section className="subscriptions-section">
                    <h3>Your Subscriptions</h3>
                    {cancelError && (
                      <p className="form-feedback form-feedback--error" role="alert">
                        {cancelError}
                      </p>
                    )}
                    {subscriptions.length === 0 ? (
                      <div className="empty-state">
                        <p>You haven't subscribed to any vendors yet.</p>
                        <a href="/discover" className="btn-primary">
                          Explore Available Services
                        </a>
                      </div>
                    ) : (
                      <ul className="subscriptions-list">
                        {subscriptions.map((sub) => (
                          <li key={sub.subscription_id} className="sub-card">
                            <div className="sub-card__details">
                              <h3>
                                {vendors[sub.vendor_id]?.business_name ??
                                  "Unknown Vendor"}
                              </h3>
                              <p className="sub-card__plan">
                                {sub.plan_name} Plan ·{" "}
                                {formatCurrency(sub.price_in_cents)}/mo
                              </p>
                              <StatusBadge active={sub.is_active} />
                            </div>
                            <div className="sub-card__actions">
                              {sub.is_active && (
                                <button
                                  type="button"
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
                        ))}
                      </ul>
                    )}
                  </section>
                </>
              )}

              {activeTab === "billing" && (
                <section className="panel-card">
                  <header className="section-header">
                    <h1>Billing & Payment History</h1>
                    <p>Review recurring charges across your subscribed vendors.</p>
                  </header>
                  {billingRows.length === 0 ? (
                    <p>No billing records found.</p>
                  ) : (
                    <ul className="subscriptions-list">
                      {billingRows.map((sub) => (
                        <li
                          key={sub.subscription_id}
                          className={`sub-card sub-card--compact ${
                            sub.is_active ? "" : "sub-card--inactive"
                          }`}
                        >
                          <div>
                            <h3>
                              {vendors[sub.vendor_id]?.business_name ?? "Vendor"}
                            </h3>
                            <p className="sub-card__plan">
                              {sub.plan_name} —{" "}
                              {sub.is_active ? "Recurring monthly" : "No longer billed"}
                            </p>
                          </div>
                          <div className="sub-card__amount">
                            <strong>{formatCurrency(sub.price_in_cents)}</strong>
                            <StatusBadge active={sub.is_active} />
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
                    <h1>Profile & Account Settings</h1>
                    <p>Update your personal details.</p>
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

                    {profileMessage && (
                      <p
                        className={`form-feedback ${
                          profileMessage.isError ? "form-feedback--error" : ""
                        }`}
                        role="status"
                      >
                        {profileMessage.text}
                      </p>
                    )}

                    <button type="submit" className="btn-primary" disabled={savingProfile}>
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