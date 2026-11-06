import Header from './components/header';
import Footer from './components/footer';
import Hero from './components/hero';
import RoleSelection from './components/roleSelection';
import SignupFormVendor from './components/signupForms/signupFormVendor';
import SignupFormCustomer from './components/signupForms/signupFormCustomer';
import './index.css';

function App() {
    const path = window.location.pathname;
    const isHome = path === '/';
    const isSignupFormPage = path === '/signup-form';
    const isSignupVendor = path === '/vendor';
    const isSignupUser = path === '/customer';

    function renderContent() {
        if (isSignupFormPage) {
            return <RoleSelection />;
        }
        if (isSignupVendor) {
            return <SignupFormVendor />;
        }
        if (isSignupUser) {
            return <SignupFormCustomer />;
        }
        if (isHome) {
            return(
                <>
                    <Header/>
                    <Hero/>
                    <Footer/>
                </>
            )
        }
    }

    return (
        <>
            
            <main>{renderContent()}</main>
        </>
    );
}

export default App;