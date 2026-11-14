interface RoleSelectionProps {
    mode?: 'signup' | 'login';
}

const RoleSelection = ({mode = 'signup'}: RoleSelectionProps) => {
    let heading = "How do you want to use Regular";
    let vendorHref = '/vendor';
    let customerHref = '/customer';

    if (mode === 'login') {
        heading = 'How would you like to sign in?';
        vendorHref = '/login-vendor';
        customerHref = '/login-customer';
    }

    return (
        <section className="background">
            <h1>{heading}</h1>
            <div className="choice">
                <a href={vendorHref}>Are you a Vendor / Seller?</a>
                <p>Or</p>
                <a href={customerHref}>Are you a User / customer</a>
            </div>
        </section>
    );
};

export default RoleSelection;