const Header = () => {
    return (
        <header className="site-header">
        <div className="site-header__inner">
          <a className="site-header__mark" href="/">
            Regular
          </a>
   
          <nav className="site-header__nav" aria-label="Main">
            <a href="#plans">Plans</a>
            <a href="#pricing">Pricing</a>
            <a href="#docs">Docs</a>
          </nav>
   
          <div className="site-header__actions">
            <a className="site-header__login" href="/login">
              Log in
            </a>
            <a className="site-header__cta" href="/signup">
              Get started
            </a>
          </div>
        </div>
      </header>
    );
}

export default Header