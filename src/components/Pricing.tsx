import { Check } from "lucide-react";

export function Pricing() {
  const tiers = [
    {
      name: "TRAINEE",
      price: "$199",
      period: "/month",
      description: "Start your journey. Build the foundation.",
      features: [
        "8 classes per month",
        "Access to Muay Thai OR Aerial",
        "Beginner workshops",
        "Community access",
      ],
      color: "white",
      popular: false,
    },
    {
      name: "SIDEKICK",
      price: "$249",
      period: "/month",
      description: "Level up your training consistently.",
      features: [
        "12 classes per month",
        "Access to both disciplines",
        "Priority class booking",
        "Monthly check-ins",
      ],
      color: "white",
      popular: false,
    },
    {
      name: "SUPERHERO",
      price: "$299",
      period: "/month",
      description: "Train harder. Go further.",
      features: [
        "16 classes per month",
        "Full access to both disciplines",
        "Priority class booking",
        "Monthly 1-on-1 session",
        "Nutrition guidance",
      ],
      color: "neonGreen",
      popular: true,
    },
    {
      name: "IMMORTAL",
      price: "$499",
      period: "/month",
      description: "Unlimited power. Unlimited access.",
      features: [
        "Unlimited classes",
        "VIP priority booking",
        "Weekly private sessions",
        "Personalized training plan",
        "Guest passes (4/month)",
        "Exclusive events & workshops",
      ],
      color: "neonPink",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-40 px-6 bg-gradient-to-b from-black via-black/98 to-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neonGreen/30 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-neonPink/30 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Premium Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-white/40 uppercase text-[10px] tracking-[0.3em] font-medium">Membership Tiers</span>
          </div>
          <h2 className="headline-font text-5xl md:text-7xl lg:text-8xl text-white/90 mb-3 fade-in leading-tight tracking-wide font-light">
            Level Up. Choose Your Path.
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8 pt-4">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`glass-card-intense p-10 relative group hover:scale-105 transition-all duration-700 cinematic-shadow scale-in ${
                tier.popular ? "border-2 border-neonGreen neon-glow-green" : ""
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {tier.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-neonGreen text-black px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-2xl whitespace-nowrap">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3
                  className={`headline-font text-2xl mb-2 font-normal tracking-wide ${
                    tier.color === "neonGreen"
                      ? "text-neonGreen"
                      : tier.color === "neonPink"
                      ? "text-neonPink"
                      : "text-white"
                  }`}
                >
                  {tier.name}
                </h3>
                <p className="text-gray-400 text-xs mb-6 font-light">{tier.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-light text-white">{tier.price}</span>
                  <span className="text-gray-400 text-xs">{tier.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        tier.color === "neonGreen"
                          ? "text-neonGreen"
                          : tier.color === "neonPink"
                          ? "text-neonPink"
                          : "text-white"
                      }`}
                    />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={
                  tier.color === "neonGreen"
                    ? "btn-luxury-green w-full shadow-xl text-xs tracking-wider"
                    : tier.color === "neonPink"
                    ? "btn-luxury-pink w-full shadow-xl text-xs tracking-wider"
                    : "btn-luxury-white w-full shadow-xl text-xs tracking-wider"
                }
              >
                Start {tier.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}