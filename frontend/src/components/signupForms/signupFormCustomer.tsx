const SignupFormUser = () => {
    return (
        <section className="signup-form">
            <div className="signup-form__inner">
                <h1 className="signup-form__heading">Create your account</h1>
                <form className="signup-form__form" action="">
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
                    <div className="signup-form__actions">
                        <button type="submit" className="signup-form__submit">Sign up</button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default SignupFormUser;