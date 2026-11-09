import { useState, type FormEvent } from "react";
import { api } from "../../configs/api";
import { saveSession } from "../../configs/session";

const LoginFormCustomer = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = String(data.get("email")).trim();

        setLoading(true);
        setError(null);
        try {
            const user = await api.loginCustomer(email);
            saveSession({ role: "customer", id: user.user_id, name: user.name });
            window.location.href = "/customer-dashboard";
        } catch {
            setError("No customer account found with this email.");
            setLoading(false);
        }
    };

    return (
        <section className="signup-form" style={{ padding: "8rem 1.5rem 4rem" }}>
            <div className="signup-form__inner">
                <h1 className="signup-form__heading">Customer Sign In</h1>
                <form className="signup-form__form" onSubmit={handleSubmit}>
                    <div className="signup-form__group signup-form__group--full">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    {error && <p className="signup-form__error" style={{ color: "var(--color-flame-text)" }}>{error}</p>}
                    <div className="signup-form__actions">
                        <button type="submit" className="signup-form__submit" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default LoginFormCustomer;