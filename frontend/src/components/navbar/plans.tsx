import {
    Scissors,
    Dumbbell,
    Camera,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Repeat,
    type LucideIcon,
  } from 'lucide-react';
  
  type PlanTemplate = {
    id: string;
    category: string;
    title: string;
    icon: LucideIcon;
    price: string;     // e.g. "$45"
    interval: string;  // e.g. "per month"
    billingNote: string;
    description: string;
    features: string[];
    popular: boolean;
  };
  
  type PlanStep = {
    number: string;
    title: string;
    description: string;
  };
  
  // TODO: move these into their own file (e.g. plans.data.ts) once they come from the backend.
  const planTemplates: PlanTemplate[] = [
    {
      id: 'barber',
      category: 'Barbershops & Salons',
      title: 'The Bi-Weekly Clean-Up',
      icon: Scissors,
      price: '$45',
      interval: 'per month',
      billingNote: 'Billed monthly, 1 cut every 2 weeks',
      description: 'Keep regulars looking fresh while securing guaranteed recurring income for your shop.',
      features: [
        '2 standard haircuts per month',
        'Priority weekend booking slots',
        '10% off retail hair products',
        'Automated roll-over visit tracking',
      ],
      popular: true,
    },
    {
      id: 'fitness',
      category: 'Gyms & Personal Trainers',
      title: 'The Hybrid Training Pass',
      icon: Dumbbell,
      price: '$120',
      interval: 'per month',
      billingNote: 'Billed monthly',
      description: 'Ideal for independent trainers combining open gym access with dedicated 1-on-1 coaching.',
      features: [
        'Unlimited open gym access',
        '2 private 1-on-1 training sessions',
        'Custom workout plan in client portal',
        'Flexible month-to-month pause options',
      ],
      popular: false,
    },
    {
      id: 'studio',
      category: 'Creative Studios',
      title: 'The Creator Retainer',
      icon: Camera,
      price: '$250',
      interval: 'per month',
      billingNote: 'Billed monthly',
      description: 'Lock in predictable studio hours for local podcasters, photographers, and video creators.',
      features: [
        '8 studio booking hours per month',
        'Included lighting & audio gear kit',
        '24-hour advance booking guarantee',
        'Guest access pass for up to 3 crew',
      ],
      popular: false,
    },
  ];
  
  const planSteps: PlanStep[] = [
    {
      number: '01',
      title: 'Define your offer',
      description: 'Set your price, billing frequency, and what perks or visits are included in each cycle.',
    },
    {
      number: '02',
      title: 'Share your link',
      description: 'Send a clean checkout link via SMS, post it on Instagram, or display a QR code in your shop.',
    },
    {
      number: '03',
      title: 'Automate recurring revenue',
      description: 'Cards are billed automatically. Payments hit your bank account while regulars book seamlessly.',
    },
  ];
  
  export default function PlansPage() {
    return (
      <main className="plans-page">
        <div className="plans-container">
          {/* Hero */}
          <header className="hero-section">
            <p className="badge-pill">
              <Sparkles className="icon-sm" aria-hidden="true" />
              Plan Blueprint Studio
            </p>
            <h1 className="hero-title">Build plans your regulars will actually use.</h1>
            <p className="hero-description">
              Stop relying on one-off appointments. Package your core services into predictable,
              automated subscriptions that keep clients coming back.
            </p>
          </header>
  
          {/* Templates */}
          <section className="templates-section" aria-labelledby="templates-heading">
            <div className="templates-header">
              <div>
                <h2 id="templates-heading" className="templates-title">Ready-to-Use Templates</h2>
                <p className="templates-subtitle">
                  Select a blueprint or build your own custom membership structure.
                </p>
              </div>
              {/* TODO: swap for <Link to="..."> once the route exists */}
              <button type="button" className="btn-custom-plan">+ Custom Plan</button>
            </div>
  
            <ul className="templates-grid">
              {planTemplates.map((template) => {
                const Icon = template.icon;
                const headingId = `plan-${template.id}-title`;
                return (
                  <li key={template.id} className="templates-item">
                    <article
                      className={`plan-card${template.popular ? ' popular' : ''}`}
                      aria-labelledby={headingId}
                    >
                      {template.popular && <span className="popular-tag">Most Popular</span>}
  
                      <div className="card-body">
                        <div className="card-top">
                          <div className="icon-box">
                            <Icon className="icon-md" aria-hidden="true" />
                          </div>
                          <span className="category-tag">{template.category}</span>
                        </div>
  
                        <div>
                          <h3 id={headingId} className="card-title">{template.title}</h3>
                          <p className="card-pricing">
                            <span className="price-amount">{template.price}</span>
                            <span className="price-frequency">{template.interval}</span>
                          </p>
                          <p className="billing-note">{template.billingNote}</p>
                        </div>
  
                        <p className="card-description">{template.description}</p>
  
                        <ul className="feature-list">
                          {template.features.map((feature) => (
                            <li key={feature} className="feature-item">
                              <CheckCircle2 className="feature-icon" aria-hidden="true" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
  
                      {/* TODO: wire to the plan builder, prefilled with this template */}
                      <button
                        type="button"
                        className="btn-blueprint"
                        aria-label={`Use the ${template.title} blueprint`}
                      >
                        Use Blueprint
                        <ArrowRight className="icon-sm" aria-hidden="true" />
                      </button>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
  
          {/* How it works */}
          <section className="how-it-works-card" aria-labelledby="how-heading">
            <div className="section-header-sm">
              <h2 id="how-heading" className="section-title">How plan billing works</h2>
              <p className="section-subtitle">Set up takes under 5 minutes. No coding required.</p>
            </div>
  
            <ol className="steps-grid">
              {planSteps.map((step) => (
                <li key={step.number} className="step-card">
                  <span className="step-number" aria-hidden="true">{step.number}</span>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </li>
              ))}
            </ol>
          </section>
  
          {/* CTA */}
          <section className="cta-banner" aria-labelledby="cta-heading">
            <p className="badge-dark">
              <Repeat className="icon-sm" aria-hidden="true" />
              Automated Retention
            </p>
            <h2 id="cta-heading" className="cta-title">
              Ready to turn your regulars into monthly revenue?
            </h2>
            <div className="cta-actions">
              {/* TODO: these are navigation, so swap to <Link>/<a href> when routes exist */}
              <button type="button" className="btn-primary-launch">Launch Your First Plan</button>
              <button type="button" className="btn-secondary-talk">Talk to Sales</button>
            </div>
          </section>
        </div>
      </main>
    );
  }