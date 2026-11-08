import Header from './components/header';
import Plans from './components/navbar/plans';
import Docs from './components/navbar/docs';
import Pricing from './components/navbar/pricing';
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
                if (session?.role === 'customer') {
                    return <Discover customerId={session.id} />;
                } else {
                    return <RoleSelection />;
                }
            case '/vendor-dashboard':
                if (session?.role === 'vendor') {
                    return <h1>Welcome, {session.name}</h1>; // placeholder
                } else {
                    return <RoleSelection />;
                }
            case '/plans':
                return <Plans/>
            case '/pricing':
                return <Pricing/>
            case '/docs':
                return <Docs/>
            default:
                return <h1>404</h1>;
        }
    }

    // If it's not a 404 page, render the Header at the top globally
    return (
        <main>
            {path !== '*' && path !== '404' && <Header />} 
            {renderContent()}
        </main>
    );
}

export default App;