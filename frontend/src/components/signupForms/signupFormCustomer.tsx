import { useState, type FormEvent } from "react";
import { api } from "../../configs/api";
import { saveSession } from "../../configs/session";

const SignupFormCustomer = () => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);

        if (data.get("password") !== data.get("confirmPassword")) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Passwords are intentionally NOT sent yet. Add hashing + auth on the backend first.
            const user = await api.createUser({
                name: String(data.get("name")),
                email: String(data.get("email")),
            });
            saveSession({ role: "customer", id: user.user_id, name: user.name });
            window.location.href = "/discover";
        } catch {
            setError("Something went wrong. Try again.");
            setLoading(false);
        }
    };

    return (
        <section className="signup-form">
            <div className="signup-form__inner">
                <h1 className="signup-form__heading">Create your account</h1>
                <form className="signup-form__form" onSubmit={handleSubmit}>
                    <div className="signup-form__group signup-form__group--full">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" name="name" required />
                    </div>
                    <div className="signup-form__group signup-form__group--full">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="signup-form__group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <div className="signup-form__group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required />
                    </div>
                    {error && <p className="signup-form__error">{error}</p>}
                    <div className="signup-form__actions">
                        <button type="submit" className="signup-form__submit" disabled={loading}>
                            {loading ? "Creating..." : "Sign up"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default SignupFormCustomer;