const RoleSelection = () => {
    return (
        <section className="background">
            <h1>How do you want to use Regular?</h1>
            <div className="choice">
                <a href="/vendor">Are you a Vendor / Seller?</a>
                <p>Or</p>
                <a href="/customer">Are you a User / customer?</a>
            </div>
        </section>
    );
};

export default RoleSelection;