export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__perforation" aria-hidden="true" />

      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <p className="site-footer__mark">Regular</p>
          <p className="site-footer__tagline">
            Recurring plans for businesses built on regulars.
          </p>
        </div>

        <nav className="site-footer__col" aria-label="Product">
          <p className="site-footer__heading">Product</p>
          <a href="#plans">Plans</a>
          <a href="#pricing">Pricing</a>
          <a href="#clients">Clients</a>
        </nav>

        <nav className="site-footer__col" aria-label="Company">
          <p className="site-footer__heading">Company</p>
          <a href="#about">About</a>
          <a href="#careers">Careers</a>
          <a href="#contact">Contact</a>
        </nav>

        <nav className="site-footer__col" aria-label="Resources">
          <p className="site-footer__heading">Resources</p>
          <a href="#help">Help center</a>
          <a href="#guides">Guides</a>
          <a href="#api-docs">API docs</a>
        </nav>
      </div>

      <div className="site-footer__bottom">
        <p>© {new Date().getFullYear()} Regular</p>
        <div className="site-footer__legal">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;