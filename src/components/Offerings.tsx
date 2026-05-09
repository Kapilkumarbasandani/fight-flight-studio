"use client";

import Image from "next/image";
import { Flame, Bird, Zap, Heart, Trophy, Star, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

const ICON_MAP: Record<string, LucideIcon> = {
  Flame, Bird, Zap, Heart, Trophy, Star
};

interface Offering {
  icon: string;
  title: string;
  description: string;
}

interface OfferingsData {
  muayThai: Offering[];
  aerial: Offering[];
}

export function Offerings() {
  const [data, setData] = useState<OfferingsData>({ muayThai: [], aerial: [] });

  useEffect(() => {
    fetch("/api/offerings")
      .then((res) => res.json())
      .then((d: OfferingsData) => setData(d))
      .catch((err) => console.error("Failed to load offerings:", err));
  }, []);

  const muayThaiOfferings = data.muayThai.map((o) => ({ ...o, icon: ICON_MAP[o.icon] ?? Flame }));
  const aerialOfferings = data.aerial.map((o) => ({ ...o, icon: ICON_MAP[o.icon] ?? Bird }));

  return (
    <section id="offerings" className="relative py-16 md:py-40 px-4 md:px-6 overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{
          zIndex: 0,
          backgroundImage: "url('/1.webp')",
          backgroundPosition: "center 60%"
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" style={{ zIndex: 10 }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" style={{ zIndex: 10 }} />
      
      <div className="absolute inset-0 opacity-10" style={{ zIndex: 10 }}>
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-neonGreen/30 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neonPink/30 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonGreen/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonPink/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-24">
          <div className="inline-block mb-4">
            <span className="text-white/40 uppercase text-[10px] tracking-[0.3em] font-medium">Dual Disciplines</span>
          </div>
          <h2 className="headline-font text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white/90 mb-6 fade-in leading-tight tracking-wide font-light">
            Where Grit Meets Grace
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Two worlds. One revolutionary experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card-intense p-6 md:p-12 border-l-4 border-neonGreen group hover:scale-[1.02] transition-all duration-700 slide-in-left cinematic-shadow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL || ''}/founder2.gif`}
                alt="Muay Thai"
                width={100}
                height={100}
                className="rounded-lg grayscale group-hover:grayscale-0 transition-all duration-500"
                style={{ filter: 'brightness(1.2) contrast(1.1)' }}
              />
              <div>
                <h3 className="headline-font text-3xl text-neonGreen mb-1 font-normal tracking-wide">
                  Muay Thai
                </h3>
                <p className="text-white/50 uppercase text-[10px] tracking-[0.2em] font-medium">
                  The Art of Eight Limbs
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {muayThaiOfferings.map((offering, index) => (
                <div key={index} className="flex gap-4 group/item">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neonGreen/10 flex items-center justify-center border border-neonGreen/20 group-hover/item:bg-neonGreen/20 transition-colors">
                    <offering.icon className="w-6 h-6 text-neonGreen" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
                      {offering.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {offering.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card-intense p-6 md:p-12 border-l-4 border-neonPink group hover:scale-[1.02] transition-all duration-700 slide-in-right cinematic-shadow">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSETS_URL || ''}/founder1.gif`}
                alt="Aerial Arts"
                width={100}
                height={100}
                className="rounded-lg grayscale group-hover:grayscale-0 transition-all duration-500"
                style={{ filter: 'brightness(1.2) contrast(1.1)' }}
              />
              <div>
                <h3 className="headline-font text-3xl text-neonPink mb-1 font-normal tracking-wide">
                  Aerial Arts
                </h3>
                <p className="text-white/50 uppercase text-[10px] tracking-[0.2em] font-medium">
                  Gravity is Optional
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {aerialOfferings.map((offering, index) => (
                <div key={index} className="flex gap-4 group/item">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neonPink/10 flex items-center justify-center border border-neonPink/20 group-hover/item:bg-neonPink/20 transition-colors">
                    <offering.icon className="w-6 h-6 text-neonPink" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-2">
                      {offering.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {offering.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <button 
            onClick={() => {
              const user = localStorage.getItem("user");
              if (user) {
                window.location.href = "/app/schedule";
              } else {
                window.dispatchEvent(new Event('openAuthModal'));
              }
            }}
            className="btn-luxury-green shadow-2xl text-xs tracking-wider cursor-pointer"
          >
            Explore All Classes
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-3 h-3 bg-neonGreen/30 rounded-full animate-pulse-slow blur-sm" style={{ zIndex: 15 }} />
      <div className="absolute top-10 right-10 w-3 h-3 bg-neonPink/30 rounded-full animate-pulse-slow blur-sm" style={{ zIndex: 15 }} />
    </section>
  );
}