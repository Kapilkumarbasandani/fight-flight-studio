"use client";

import Image from "next/image";
import { Flame, Bird, Zap, Heart, Trophy, Star } from "lucide-react";
import { useEffect, useRef } from "react";

export function Offerings() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, []);

  const muayThaiOfferings = [
    {
      icon: Flame,
      title: "STRIKING FUNDAMENTALS",
      description: "Master the art of eight limbs. Precision, power, technique.",
    },
    {
      icon: Zap,
      title: "CONDITIONING & COMBAT",
      description: "High-intensity training that builds warriors, not just athletes.",
    },
    {
      icon: Trophy,
      title: "SPARRING SESSIONS",
      description: "Test your limits. Controlled combat with experienced fighters.",
    },
  ];

  const aerialOfferings = [
    {
      icon: Bird,
      title: "HOOP & HAMMOCK",
      description: "Suspended elegance. Strength wrapped in graceful movement.",
    },
    {
      icon: Heart,
      title: "CHOREOGRAPHY",
      description: "Movement as art. Express, flow, and defy gravity with style.",
    },
    {
      icon: Star,
      title: "FLEXIBILITY & FLOW",
      description: "Unlock your body's potential. Stretch, bend, soar.",
    },
  ];

  return (
    <section id="offerings" className="relative py-40 px-6 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="/it_doesn_t_matter_what_we_re_up_against_I_just_want_you_up_against_me._aerial_aerialstrong.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" style={{ zIndex: 10 }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" style={{ zIndex: 10 }} />
      
      <div className="absolute inset-0 opacity-10" style={{ zIndex: 10 }}>
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-neonGreen/30 to-transparent" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-neonPink/30 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonGreen/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonPink/20 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <div className="inline-block mb-4">
            <span className="text-white/40 uppercase text-[10px] tracking-[0.3em] font-medium">Dual Disciplines</span>
          </div>
          <h2 className="headline-font text-5xl md:text-7xl lg:text-8xl text-white/90 mb-6 fade-in leading-tight tracking-wide font-light">
            Where Grit Meets Grace
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed font-light">
            Two worlds. One revolutionary experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card-intense p-12 border-l-4 border-neonGreen group hover:scale-[1.02] transition-all duration-700 slide-in-left cinematic-shadow">
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="/aerial-1.png"
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

          <div className="glass-card-intense p-12 border-l-4 border-neonPink group hover:scale-[1.02] transition-all duration-700 slide-in-right cinematic-shadow">
            <div className="flex items-center gap-4 mb-8">
              <Image
                src="/aerial-2.png"
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
          <button className="btn-luxury-green shadow-2xl text-xs tracking-wider">Explore All Classes</button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-3 h-3 bg-neonGreen/30 rounded-full animate-pulse-slow blur-sm" style={{ zIndex: 15 }} />
      <div className="absolute top-10 right-10 w-3 h-3 bg-neonPink/30 rounded-full animate-pulse-slow blur-sm" style={{ zIndex: 15 }} />
    </section>
  );
}