import Header from './components/header';
import Plans from './components/navbar/plans';
import Docs from './components/navbar/docs';
import Pricing from './components/navbar/pricing';
import Footer from './components/footer';
import Hero from './components/hero';
import CustomerDash from './components/dashboards/customerdash';
import VendorDash from './components/dashboards/vendordash';
import RoleSelection from './components/roleSelection';
import SignupFormVendor from './components/signupForms/signupFormVendor';
import SignupFormCustomer from './components/signupForms/signupFormCustomer';
import Discover from './components/discover';
import LoginFormVendor from './components/loginForms/loginFormVendor';
import LoginFormCustomer from './components/loginForms/loginFormCustomer';
import { getSession } from './configs/session';
import './index.css';

function App() {
    const path = window.location.pathname;
    const session = getSession();

    function renderContent() {
        switch(path) {
            case '/':
                return (
                    <>
                        <Hero/>
                        <Footer/>
                    </>
                );
            
            // Auth Selection & sign up routes
            case '/signup-form':
                if (session?.role === 'customer') return <CustomerDash/>;
                if (session?.role === 'vendor') return <VendorDash/>;
                return <RoleSelection/>
            case '/vendor':
                if (session?.role === 'vendor') return <VendorDash/>;
                return <SignupFormVendor/>;
            case '/customer':
                if (session?.role === 'customer') return <CustomerDash/>;
                return <SignupFormCustomer/>;
            
            // Login routes
            case '/login':
                if (session?.role === 'customer') return <CustomerDash/>;
                if (session?.role === 'vendor') return <VendorDash/>;
                return <RoleSelection mode="login"/>;
            case '/login-customer':
                if(session?.role === 'customer') return <CustomerDash/>;
                return <LoginFormCustomer/>
            case '/login-vendor':
                if(session?.role === 'vendor') return <VendorDash/>;
                return <LoginFormVendor/>;
            
            // Protected Customer Routes
            case '/discover':
                if (session?.role === 'customer'){
                    return <Discover customerId={session.id} />
                }
                return <LoginFormCustomer/>;
            case '/customer-dashboard':
                if (session?.role === 'customer') {
                    return <CustomerDash/>
                }
                return <LoginFormCustomer/>;
            
            // Protected vendor routes
            case '/vendor-dashboard':
                if (session?.role === 'vendor') {
                    return <VendorDash/>
                }
                return <LoginFormVendor/>
            // Public Navigation pages
            case '/plans':
                return <Plans/>;
            case '/pricing':
                return <Pricing/>;
            case '/docs':
                return <Docs/>;
            
            default:
                return (
                    <div style={{textAlign: 'center', padding: '8rem 2rem'}}>
                        <h1>404</h1>
                        <p>Page not found</p>
                    </div>
                );
        }
    }

    return(
        <main>
            <Header/>
            {renderContent()}
        </main>
    )
   
}

export default App;