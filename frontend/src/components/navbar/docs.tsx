import { Sparkles } from 'lucide-react';

type DocSection = {
  id: string;
  title: string;
  intro: string;
  steps: { title: string; body: string }[];
};

type Faq = { question: string; answer: string };

// TODO: check each step against what the app actually does today.
const sections: DocSection[] = [
  {
    id: 'vendors',
    title: 'Getting started as a vendor',
    intro: 'Set up your first subscription offer and start taking recurring payments.',
    steps: [
      { title: 'Create your vendor account', body: 'Sign up as a vendor and add your business name and a short description.' },
      { title: 'Build a plan', body: 'Choose a price, a billing frequency and what is included, or start from a template.' },
      { title: 'Share your link', body: 'Send your checkout link by text, post it online, or show the QR code in your shop.' },
      { title: 'Track subscribers', body: 'Use your dashboard to see who has subscribed and how much recurring revenue you have.' },
    ],
  },
  {
    id: 'customers',
    title: 'Getting started as a customer',
    intro: 'Find a local vendor and subscribe in a couple of minutes.',
    steps: [
      { title: 'Create your account', body: 'Sign up as a customer with your name and email.' },
      { title: 'Browse vendors', body: 'Use the discovery page to find shops, trainers and studios near you.' },
      { title: 'Subscribe to a plan', body: 'Pick a vendor plan and confirm. Your subscription shows up on your dashboard.' },
    ],
  },
  {
    id: 'billing',
    title: 'Billing and payments',
    intro: 'How charges, fees and payouts work.',
    steps: [
      { title: 'Charges', body: 'Customers are billed automatically on each plan’s billing date.' },
      { title: 'Fees', body: 'Platform fees depend on your vendor tier. See the pricing page for current rates.' },
      { title: 'Payouts', body: 'Payments, minus fees, are sent to the bank account you connect.' },
    ],
  },
];

const faqs: Faq[] = [
  {
    question: 'Can customers cancel any time?',
    answer: 'Yes. Customers can cancel from their dashboard, and the plan ends at the close of the current billing period.',
  },
  {
    question: 'What happens if a payment fails?',
    answer: 'The vendor sees the subscription as past due. The customer is asked to update their payment method.',
  },
  {
    question: 'Can I change my plan price later?',
    answer: 'Yes. Price changes apply to new subscribers, and existing subscribers keep their current price until you tell them otherwise.',
  },
  {
    question: 'Do I need to know how to code?',
    answer: 'No. Everything is set up from your dashboard, and you share a link or QR code with customers.',
  },
];

export default function Docs() {
  return (
    <main className="plans-page">
      <div className="plans-container">
        <header className="hero-section">
          <p className="badge-pill">
            <Sparkles className="icon-sm" aria-hidden="true" />
            Docs
          </p>
          <h1 className="hero-title">Everything you need to get set up.</h1>
          <p className="hero-description">
            Short guides for vendors and customers, plus answers to the questions we hear most.
          </p>
        </header>

        <div className="docs-layout">
          <nav className="docs-nav" aria-label="On this page">
            <ul>
              {sections.map((s) => (
                <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
              ))}
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </nav>

          <div className="docs-content">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="docs-card"
                aria-labelledby={`${section.id}-heading`}
              >
                <h2 id={`${section.id}-heading`} className="section-title">{section.title}</h2>
                <p className="section-subtitle">{section.intro}</p>

                <ol className="docs-steps">
                  {section.steps.map((step) => (
                    <li key={step.title} className="docs-step">
                      <h3 className="step-title">{step.title}</h3>
                      <p className="step-description">{step.body}</p>
                    </li>
                  ))}
                </ol>
              </section>
            ))}

            <section id="faq" className="docs-card" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="section-title">FAQ</h2>
              <div className="faq-list">
                {faqs.map((faq) => (
                  <details key={faq.question} className="faq-item">
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}