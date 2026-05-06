import { Check } from "lucide-react";
import { useState, useEffect } from "react";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  perClass: number;
  popular: boolean;
  validityDays: number;
  description: string;
  note: string;
}

function validityLabel(days: number): string {
  if (days < 7) return `Valid for ${days} day${days > 1 ? "s" : ""}`;
  if (days === 7) return "Valid for 1 week";
  if (days < 30) return `Valid for ${days / 7} weeks`;
  if (days === 30) return "Valid for 1 month";
  if (days === 60) return "Valid for 2 months";
  if (days === 90) return "Valid for 3 months";
  return `Valid for ${days} days`;
}

function packageToTier(pkg: CreditPackage, index: number, total: number) {
  const color = pkg.popular ? "neonGreen" : index === total - 1 ? "neonPink" : "white";
  return {
    name: pkg.name.toUpperCase().replace("THE ", ""),
    price: `₹${pkg.price.toLocaleString("en-IN")}`,
    period: pkg.credits === 1 ? "/credit" : "",
    description: pkg.description,
    features: [
      `${pkg.credits} Credit${pkg.credits > 1 ? "s" : ""} (₹${pkg.perClass}/credit)`,
      validityLabel(pkg.validityDays),
      pkg.description,
      pkg.note,
    ],
    color,
    popular: pkg.popular,
  };
}

export function Pricing() {
  const [tiers, setTiers] = useState<ReturnType<typeof packageToTier>[]>([]);

  useEffect(() => {
    fetch("/api/credit-packages")
      .then((res) => res.json())
      .then((data) => {
        const packages: CreditPackage[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.packages)
          ? data.packages
          : [];
        setTiers(packages.map((pkg, i) => packageToTier(pkg, i, packages.length)));
      })
      .catch((err) => console.error("Failed to load credit packages:", err));
  }, []);

  return (
    <section id="pricing" className="py-16 md:py-40 px-4 md:px-6 bg-gradient-to-b from-black via-black/98 to-black relative">
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
          <h2 className="headline-font text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white/90 mb-3 fade-in leading-tight tracking-wide font-light">
            Level Up. Choose Your Path.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`glass-card-intense p-6 md:p-10 relative group hover:scale-105 transition-all duration-700 cinematic-shadow scale-in ${
                tier.popular ? "border-2 border-neonGreen neon-glow-green" : ""
              }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {tier.popular && (
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                  <span className="inline-flex items-center bg-neonGreen text-black px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] rounded-full shadow-2xl whitespace-nowrap leading-none">
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
                onClick={() => {
                  const user = localStorage.getItem("user");
                  if (user) {
                    window.location.href = "/app/credits";
                  } else {
                    window.dispatchEvent(new Event('openAuthModal'));
                  }
                }}
                className={
                  tier.color === "neonGreen"
                    ? "btn-luxury-green w-full shadow-xl text-xs tracking-wider cursor-pointer"
                    : tier.color === "neonPink"
                    ? "btn-luxury-pink w-full shadow-xl text-xs tracking-wider cursor-pointer"
                    : "btn-luxury-white w-full shadow-xl text-xs tracking-wider cursor-pointer"
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