'use client'

import { Check } from 'lucide-react'
import Link from 'next/link'

export function PricingTiers() {
  const tiers = [
    {
      id: 'trainee',
      emoji: '🟢',
      name: 'THE TRAINEE',
      price: '₹850',
      credits: 1,
      validity: '1 week',
      badge: null,
      description: 'First-timers and the curious',
      features: [
        '1 Muay Thai class OR 1 trial aerial session',
        'Full studio access',
        'Beginner-friendly environment',
        'No commitment, just exploration',
      ],
      cta: 'Start Your Journey',
      color: 'neon',
    },
    {
      id: 'sidekick',
      emoji: '🟡',
      name: 'THE SIDEKICK',
      price: '₹4,000',
      credits: 5,
      validity: '1 month',
      badge: null,
      description: 'Weekly warriors building their routine',
      features: [
        '5 Muay Thai classes OR 2 aerial + 1 Muay Thai (or any mix)',
        'Priority booking',
        '10% off merchandise',
        'Flexibility to try both disciplines',
      ],
      savings: 'Save ₹250 vs. single credits',
      cta: 'Join the Team',
      color: 'white',
    },
    {
      id: 'superhero',
      emoji: '🔵',
      name: 'THE SUPERHERO',
      price: '₹12,000',
      credits: 20,
      validity: '2 months',
      badge: 'Best Balance',
      description: 'Committed movers leveling up consistently',
      features: [
        '20 Muay Thai classes OR 10 aerial classes (or any combination)',
        'Priority booking + late cancellation protection (1x/month)',
        '15% off all merchandise',
        'Exclusive workshops and events access',
        'Personal progress tracking',
      ],
      savings: 'Save ₹5,000 vs. single credits',
      cta: 'Unlock Your Power',
      color: 'neon',
      popular: true,
    },
    {
      id: 'immortal',
      emoji: '🔴',
      name: 'THE IMMORTAL',
      price: '₹25,000',
      credits: 50,
      validity: '3 months',
      badge: 'Best Value',
      description: 'All-in athletes mastering both arts',
      features: [
        '50 Muay Thai classes OR 25 aerial classes (or any mix)',
        'Front-of-line booking access',
        '20% off all merchandise + free studio gear bag',
        'Unlimited workshop access',
        '1 private session with a founder (₹3,000 value)',
        'Personalized training plan',
      ],
      savings: 'Save ₹17,500 vs. single credits',
      cta: 'Become Legendary',
      color: 'pink',
    },
  ]

  return (
    <section className="section-padding bg-brand-black">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="heading-lg mb-6">
            Choose Your <span className="text-brand-pink">Origin Story</span>
          </h1>
          <p className="text-xl text-brand-white/70 max-w-2xl mx-auto">
            Every superhero starts somewhere. Pick the path that fits your journey.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative p-8 border backdrop-blur-sm rounded-[30px_10px_30px_10px] ${
                tier.popular
                  ? 'border-brand-neon/50 bg-gradient-to-br from-brand-neon/5 to-brand-black shadow-[0_0_30px_rgba(0,255,65,0.15)] scale-105 lg:scale-110'
                  : tier.color === 'pink'
                  ? 'border-brand-pink/20 hover:border-brand-pink/40 bg-gradient-to-br from-brand-pink/3 to-brand-black hover:shadow-[0_0_20px_rgba(255,16,240,0.1)]'
                  : tier.color === 'neon'
                  ? 'border-brand-neon/20 hover:border-brand-neon/40 bg-gradient-to-br from-brand-neon/3 to-brand-black hover:shadow-[0_0_20px_rgba(0,255,65,0.1)]'
                  : 'border-brand-white/15 hover:border-brand-white/30 bg-gradient-to-br from-brand-white/2 to-brand-black hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]'
              } transition-all duration-500 flex flex-col hover:scale-102 transform-gpu hover:rounded-[10px_40px_10px_40px]`}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-neon text-brand-black text-xs font-bold uppercase tracking-wide rounded-full">
                  ⭐ {tier.badge}
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <div className="text-4xl mb-2">{tier.emoji}</div>
                <h3 className="text-2xl font-bold text-brand-white mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-brand-white">{tier.price}</span>
                </div>
                <p className="text-sm text-brand-white/60">
                  {tier.credits} Credit{tier.credits > 1 ? 's' : ''} • Valid for {tier.validity}
                </p>
              </div>

              {/* Description */}
              <p className="text-brand-white/70 mb-6">
                <span className="font-semibold text-brand-white">Perfect for:</span> {tier.description}
              </p>

              {/* Features */}
              <div className="flex-grow mb-6">
                <p className="text-sm font-bold text-brand-white mb-3 uppercase tracking-wide">
                  What You Get:
                </p>
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-brand-white/70">
                      <Check
                        size={16}
                        className={`mt-0.5 flex-shrink-0 ${
                          tier.color === 'pink'
                            ? 'text-brand-pink'
                            : tier.color === 'neon'
                            ? 'text-brand-neon'
                            : 'text-brand-white/50'
                        }`}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Savings */}
              {tier.savings && (
                <p className="text-sm font-bold text-brand-neon mb-4">{tier.savings}</p>
              )}

              {/* CTA */}
              <Link
                href={`/book?tier=${tier.id}`}
                className={`block text-center py-4 px-6 font-bold uppercase tracking-wide transition-all duration-300 rounded-full ${
                  tier.color === 'pink'
                    ? 'bg-brand-pink text-brand-white hover:bg-opacity-90 glow-pink'
                    : tier.color === 'neon'
                    ? 'bg-brand-neon text-brand-black hover:bg-opacity-90 glow-neon'
                    : 'border-2 border-brand-white text-brand-white hover:bg-brand-white hover:text-brand-black'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-brand-white/5 border border-brand-white/10 p-8 mb-8 rounded-3xl">
            <h3 className="text-xl font-bold text-brand-white mb-4">All packages include:</h3>
            <ul className="grid md:grid-cols-2 gap-3 text-brand-white/70">
              <li className="flex items-start gap-2">
                <Check size={20} className="text-brand-neon flex-shrink-0 mt-0.5" />
                No hidden fees
              </li>
              <li className="flex items-start gap-2">
                <Check size={20} className="text-brand-neon flex-shrink-0 mt-0.5" />
                Pause credits if you travel (up to 2 weeks)
              </li>
              <li className="flex items-start gap-2">
                <Check size={20} className="text-brand-neon flex-shrink-0 mt-0.5" />
                Cancel classes up to 12 hours in advance for full refund
              </li>
              <li className="flex items-start gap-2">
                <Check size={20} className="text-brand-neon flex-shrink-0 mt-0.5" />
                Mix and match disciplines however you want
              </li>
            </ul>
          </div>

          <div className="text-center space-y-4">
            <p className="text-brand-white/70">
              <span className="text-brand-pink font-bold">💡 Remember:</span> Aerial classes require 2 credits. 
              Muay Thai classes require 1 credit.
            </p>
            <p className="text-brand-white/60">
              <strong>Questions?</strong> Email us at{' '}
              <a href="mailto:hello@fightandflightstudio.com" className="text-brand-neon hover:underline">
                hello@fightandflightstudio.com
              </a>{' '}
              or WhatsApp{' '}
              <a href="https://wa.me/66XXXXXXXX" className="text-brand-neon hover:underline">
                +66 XX XXX XXXX
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
