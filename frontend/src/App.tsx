import Header from './components/header';
import Footer from './components/footer';
import Hero from './components/hero';
import SignupFormClient from './components/signupForms/signupFormClient';
import SignupFormUser from './components/signupForms/signupFormUser';
import './index.css'

function App() {
    return(
        <>
            <Header/>
            <Hero/>
            <SignupFormClient/>
            <SignupFormUser/>
            <Footer/>
        </>
    )
}

export default App
