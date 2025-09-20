interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  popular?: boolean;
}

function PricingTier({
  name,
  price,
  description,
  features,
  cta,
  ctaLink,
  popular,
}: PricingTierProps) {
  return (
    <div
      className={`relative rounded-2xl border bg-white/5 p-8 backdrop-blur-sm ${
        popular
          ? 'border-purple-500/50 bg-white/10'
          : 'border-white/10 hover:border-white/20'
      } transition-all duration-200`}
    >
      {popular && (
        <div className="-top-3 -translate-x-1/2 absolute left-1/2 transform">
          <span className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 font-medium text-sm text-white">
            Free in Beta!
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="mb-2 font-medium text-2xl text-white">{name}</h3>
        <div className="mb-2 font-medium text-4xl text-white">{price}</div>
        <p className="mb-8 text-gray-400">{description}</p>

        <ul className="mb-8 space-y-4 text-left">
          {features.map((feature) => (
            <li className="flex items-center" key={feature}>
              <div className="mr-4 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>

        <a
          className={`inline-block w-full rounded-lg px-6 py-3 text-center font-medium transition-all duration-200 ${
            popular
              ? 'bg-white text-black hover:bg-gray-100'
              : 'border border-white/20 text-white hover:bg-white/5'
          }`}
          href={ctaLink}
          rel="noopener noreferrer"
          target="_blank"
        >
          {cta}
        </a>
      </div>
    </div>
  );
}

export function Pricing() {
  const tiers: PricingTierProps[] = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Essential features for tracking',
      features: [
        'Basic activity logging',
        'Voice-to-text input',
        'Daily notes with markdown',
        'Context organization',
        'Simple text & markdown export',
        'Community support',
      ],
      cta: 'Start Free',
      ctaLink: 'https://app.lifebuffer.com',
    },
    {
      name: 'Premium',
      price: 'Free during Beta',
      description: 'All premium features unlocked',
      features: [
        'Everything in Basic',
        'AI categorization & insights',
        'Advanced search & discovery',
        'All export formats & templates',
        'Time tracking (coming soon)',
        'Priority support',
      ],
      cta: 'Get Beta Access',
      popular: true,
      ctaLink: 'https://app.lifebuffer.com',
    },
  ];

  return (
    <section className="bg-black px-4 py-20 sm:px-6 lg:px-8" id="pricing">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-medium text-4xl text-white lg:text-5xl">
            Everything Free During Beta
          </h2>
          <p className="text-gray-400 text-xl">
            Get full access to all features while we're in Beta
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/30 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-green-300 text-sm font-medium">Beta Access Available Now</span>
          </div>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          {tiers.map((tier) => (
            <PricingTier key={tier.name} {...tier} />
          ))}
        </div>

        <div className="mt-12 space-y-2 text-center">
          <p className="text-gray-400">
            💳 No credit card required during Beta • 💜 100% Open Source
          </p>
          <p className="text-gray-400">
            🚀 Be an early adopter • 🔄 Export everything • 🔒 Your data stays private • ⭐ Self-hostable
          </p>
        </div>
      </div>
    </section>
  );
}
