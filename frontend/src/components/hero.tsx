

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__inner">
        <div className="hero__copy">
          <h1 className="hero__headline">
            Turn regulars into recurring revenue.
          </h1>
          <p className="hero__subhead">
            Set your plans once. Clients subscribe, get billed
            automatically, and keep coming back — whether you run a
            barbershop, a gym, or a studio.
          </p>
          <div className="hero__actions">
            <a className="hero__primary" href="/signup">
              Start your first plan
            </a>
            <a className="hero__secondary" href="#how-it-works">
              See how billing works
            </a>
          </div>
        </div>

        <div className="hero__card" aria-hidden="true">
          <div className="hero__card-inner">
            <p className="hero__card-business">Fade District</p>
            <p className="hero__card-price">
              $45<span>/mo</span>
            </p>
            <p className="hero__card-cadence">Every 4 weeks</p>

            <div className="hero__card-divider" />

            <div className="hero__card-row">
              <span>Marcus J.</span>
              <span className="hero__card-status">Active</span>
            </div>
            <div className="hero__card-row hero__card-row--muted">
              <span>Next visit</span>
              <span>Oct 12</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;