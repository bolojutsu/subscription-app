import Header from './components/header';
import Footer from './components/footer';
import Hero from './components/hero';
import RoleSelection from './components/roleSelection';
import SignupFormVendor from './components/signupForms/signupFormVendor';
import SignupFormCustomer from './components/signupForms/signupFormCustomer';
import Discover from './components/discover';
import { getSession } from './configs/session';
import './index.css';

function App() {
    const path = window.location.pathname;
    const session = getSession();

    function renderContent() {
        switch (path) {
            case '/':
                return (
                    <>
                        <Header />
                        <Hero />
                        <Footer />
                    </>
                );
            case '/signup-form':
                return <RoleSelection />;
            case '/vendor':
                return <SignupFormVendor />;
            case '/customer':
                return <SignupFormCustomer />;
            case '/discover':
                // only signed-up customers get in, everyone else goes back to role select
                return session?.role === 'customer'
                    ? <Discover customerId={session.id} />
                    : <RoleSelection />;
            case '/vendor-dashboard':
                return session?.role === 'vendor'
                    ? <h1>Welcome, {session.name}</h1> // placeholder
                    : <RoleSelection />;
            default:
                return <h1>404</h1>;
        }
    }

    return <main>{renderContent()}</main>;
}

export default App;