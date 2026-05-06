"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { PortraitModal } from "./PortraitModal";
import { Expand } from "lucide-react";

interface Founder {
  id: number;
  name: string;
  title: string;
  image: string;
  bio: string;
  fullBio: string;
  color: string;
}

export function Founders() {
  const [selectedFounder, setSelectedFounder] = useState<number | null>(null);
  const [founders, setFounders] = useState<Founder[]>([]);

  useEffect(() => {
    fetch("/api/founders")
      .then((res) => res.json())
      .then((data: Founder[]) => setFounders(data))
      .catch((err) => console.error("Failed to load founders:", err));
  }, []);


  return (
    <>
      <section id="founders" className="py-16 md:py-40 px-4 md:px-6 bg-gradient-to-b from-black via-black/98 to-black relative overflow-hidden">
        {/* Cinematic Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-neonGreen/30 blur-[150px] rounded-full" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-neonPink/30 blur-[150px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Premium Section Header */}
          <div className="text-center mb-12 md:mb-24">
            <div className="inline-block mb-4">
              <span className="text-white/40 uppercase text-[10px] tracking-[0.3em] font-medium">Meet the Visionaries</span>
            </div>
            <h2 className="headline-font text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-white mb-6 fade-in leading-tight tracking-wide">
              Two Worlds.
              <br />
              One Vision.
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Two worlds. Two disciplines. One revolutionary space.
            </p>
          </div>

          {/* Luxury Founder Cards */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            {founders.map((founder, index) => (
            <div
              key={founder.name}
              className={`glass-card-intense p-4 md:p-8 group hover:scale-[1.02] transition-all duration-700 cursor-pointer cinematic-shadow relative overflow-hidden ${
              index === 0 ? "slide-in-left" : "slide-in-right"}`
              }
              onClick={() => setSelectedFounder(index)}>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
              founder.color === "neonGreen" ? "bg-neonGreen/5" : "bg-neonPink/5"}`
              } />

                {/* Portrait with Expand Button */}
                <div className="relative h-[280px] sm:h-[380px] md:h-[500px] mb-6 md:mb-8 overflow-hidden rounded-2xl">
                  <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                  style={{ filter: 'brightness(1.15) contrast(1.05)' }} />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Expand Button */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`w-12 h-12 rounded-full glass-card-intense flex items-center justify-center ${
                  founder.color === "neonGreen" ? "hover:border-neonGreen" : "hover:border-neonPink"} border-2 border-white/20 hover:scale-110 transition-transform`
                  }>
                      <Expand className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Decorative Corner Accent */}
                  <div className={`absolute bottom-0 left-0 w-1 h-32 ${
                founder.color === "neonGreen" ? "bg-neonGreen" : "bg-neonPink"} opacity-0 group-hover:opacity-100 transition-opacity duration-700`
                } />
                </div>

                {/* Founder Info */}
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-1 h-16 rounded-full ${
                  founder.color === "neonGreen" ? "bg-neonGreen group-hover:neon-glow-green" : "bg-neonPink group-hover:neon-glow-pink"} transition-all duration-700`
                  } />
                    <div>
                      <h3
                      className={`headline-font text-3xl md:text-5xl mb-2 transition-all duration-700 ${
                      founder.color === "neonGreen" ?
                      "text-neonGreen group-hover:text-glow-green" :
                      "text-neonPink group-hover:text-glow-pink"}`
                      }>
                        {founder.name}
                    </h3>
                      <p className="text-white/60 uppercase text-xs tracking-[0.2em] font-bold">
                        {founder.title}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed text-lg pl-5 font-light italic">
                    "{founder.bio}"
                  </p>

                  <div className="pt-4 pl-5">
                    <span className={`text-sm uppercase tracking-wider font-bold ${
                  founder.color === "neonGreen" ? "text-neonGreen" : "text-neonPink"} group-hover:underline`
                  }>
                      View Full Story →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portrait Modal */}
      {selectedFounder !== null && (
      <PortraitModal
        isOpen={selectedFounder !== null}
        onClose={() => setSelectedFounder(null)}
        founder={founders[selectedFounder]} />

      )}
    </>);

}