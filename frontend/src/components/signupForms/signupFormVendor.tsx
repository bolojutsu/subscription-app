import { useState, type FormEvent } from "react";
import { api } from "../../configs/api";
import { saveSession } from "../../configs/session";

const SignupFormVendor = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        // empty optional fields become undefined so they're omitted from the payload
        const optional = (key: string) => String(data.get(key) ?? "").trim() || undefined;

        setLoading(true);
        setError(null);
        try {
            const vendor = await api.createVendor({
                business_name: String(data.get("business-name")),
                email: String(data.get("business-email")),
                phone: optional("business-phone"),
                address: optional("business-address"),
                website: optional("business-website"),
                description: optional("business-description"),
            });
            saveSession({ role: "vendor", id: vendor.vendor_id, name: vendor.business_name });
            window.location.href = "/vendor-dashboard";
        } catch {
            setError("Something went wrong. Try again.");
            setLoading(false);
        }
    };

    return (
        <section className="signup-form">
            <div className="signup-form__inner">
                <h1 className="signup-form__heading">Register your business to start accepting recurring payments</h1>
                <form className="signup-form__form" onSubmit={handleSubmit}>
                    <div className="signup-form__group">
                        <label htmlFor="business-name">Business Name</label>
                        <input type="text" id="business-name" name="business-name" required />
                    </div>
                    <div className="signup-form__group">
                        <label htmlFor="business-email">Business Email</label>
                        <input type="email" id="business-email" name="business-email" required />
                    </div>
                    <div className="signup-form__group">
                        <label htmlFor="business-phone">Business Phone</label>
                        <input type="tel" id="business-phone" name="business-phone" />
                    </div>
                    <div className="signup-form__group">
                        <label htmlFor="business-address">Business Address</label>
                        <input type="text" id="business-address" name="business-address" />
                    </div>
                    <div className="signup-form__group">
                        <label htmlFor="business-website">Business Website</label>
                        <input type="url" id="business-website" name="business-website" />
                    </div>
                    <div className="signup-form__group signup-form__group--full">
                        <label htmlFor="business-description">Business Description</label>
                        <textarea id="business-description" name="business-description"></textarea>
                    </div>
                    {error && <p className="signup-form__error">{error}</p>}
                    <div className="signup-form__actions">
                        <button type="submit" className="signup-form__submit" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default SignupFormVendor;