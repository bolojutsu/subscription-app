const SignupFormClient = () => {
    return (
        <section className="signup-form">
            <div className="signup-form__inner">
                <h1 className="signup-form__heading">Register your business to start accepting recurring payments</h1>
                <form className="signup-form__form">
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
                    <div className="signup-form__actions">
                        <button type="submit" className="signup-form__submit">Register</button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default SignupFormClient;