import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

type Tier = {
  id: string;
  title: string;
  price: string;
  interval: string;
  billingNote: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
};

// TODO: placeholder numbers. Replace with your real tiers and fees before launch.
const tiers: Tier[] = [
  {
    id: 'starter',
    title: 'Starter',
    price: '$0',
    interval: 'per month',
    billingNote: '5% fee per payment',
    description: 'Try subscriptions with your first few regulars. No monthly cost.',
    features: [
      'Up to 25 active subscribers',
      '1 subscription plan',
      'Shareable checkout link',
      'Vendor dashboard',
    ],
    popular: false,
    cta: 'Start free',
  },
  {
    id: 'growth',
    title: 'Growth',
    price: '$29',
    interval: 'per month',
    billingNote: '2.5% fee per payment',
    description: 'For shops and studios with a steady client base and more than one offer.',
    features: [
      'Up to 250 active subscribers',
      'Unlimited subscription plans',
      'QR code for in-shop signups',
      'Subscriber list and revenue overview',
    ],
    popular: true,
    cta: 'Choose Growth',
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '$79',
    interval: 'per month',
    billingNote: '1% fee per payment',
    description: 'For multi-chair shops, gyms and studios that run on recurring revenue.',
    features: [
      'Unlimited active subscribers',
      'Unlimited subscription plans',
      'Multiple staff accounts',
      'Priority support',
    ],
    popular: false,
    cta: 'Choose Pro',
  },
];

export default function Pricing() {
  return (
    <main className="plans-page">
      <div className="plans-container">
        <header className="hero-section">
          <p className="badge-pill">
            <Sparkles className="icon-sm" aria-hidden="true" />
            Pricing
          </p>
          <h1 className="hero-title">Pay for the plan that fits your shop.</h1>
          <p className="hero-description">
            Start free and upgrade when your subscriber list grows. No contracts, and you can switch
            tiers any time.
          </p>
        </header>

        <section className="templates-section" aria-labelledby="tiers-heading">
          <div className="templates-header">
            <div>
              <h2 id="tiers-heading" className="templates-title">Vendor plans</h2>
              <p className="templates-subtitle">
                Each payment fee is taken from the subscription charge before it reaches your bank.
              </p>
            </div>
          </div>

          <ul className="templates-grid">
            {tiers.map((tier) => {
              const headingId = `tier-${tier.id}-title`;
              return (
                <li key={tier.id} className="templates-item">
                  <article
                    className={`plan-card${tier.popular ? ' popular' : ''}`}
                    aria-labelledby={headingId}
                  >
                    {tier.popular && <span className="popular-tag">Most Popular</span>}

                    <div className="card-body">
                      <div>
                        <h3 id={headingId} className="card-title">{tier.title}</h3>
                        <p className="card-pricing">
                          <span className="price-amount">{tier.price}</span>
                          <span className="price-frequency">{tier.interval}</span>
                        </p>
                        <p className="billing-note">{tier.billingNote}</p>
                      </div>

                      <p className="card-description">{tier.description}</p>

                      <ul className="feature-list">
                        {tier.features.map((feature) => (
                          <li key={feature} className="feature-item">
                            <CheckCircle2 className="feature-icon" aria-hidden="true" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* TODO: send to vendor signup */}
                    <button
                      type="button"
                      className="btn-blueprint"
                      aria-label={`${tier.cta}: ${tier.title} plan`}
                    >
                      {tier.cta}
                      <ArrowRight className="icon-sm" aria-hidden="true" />
                    </button>
                  </article>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="how-it-works-card" aria-labelledby="customers-heading">
          <div className="section-header-sm">
            <h2 id="customers-heading" className="section-title">Customers join free</h2>
            <p className="section-subtitle">
              People subscribing to a vendor never pay to use the platform. They only pay the
              subscription price the vendor sets.
            </p>
          </div>
        </section>

        <section className="cta-banner" aria-labelledby="pricing-cta-heading">
          <h2 id="pricing-cta-heading" className="cta-title">
            Not sure which tier? Start free and move up later.
          </h2>
          <div className="cta-actions">
            <button type="button" className="btn-primary-launch">Create a vendor account</button>
            <button type="button" className="btn-secondary-talk">Read the docs</button>
          </div>
        </section>
      </div>
    </main>
  );
}