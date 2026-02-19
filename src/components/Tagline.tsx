"use client";

import { useEffect, useRef } from "react";

export function Tagline() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video playback failed:", error);
      });
    }
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Boxing Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}>

        <source src="/6298527_Boxer_Training_Boxing_Gym_By_Dmitrii_Borovikov_Artlist_HD.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlays - Lighter for more video visibility */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70"
        style={{ zIndex: 10 }} />

      <div
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        style={{ zIndex: 10 }} />


      {/* Neon Green Accent Glow (Muay Thai energy) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-neonGreen/10 via-transparent to-transparent"
        style={{ zIndex: 10 }} />


      {/* Content - Centered */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
        <h2 className="headline-font text-4xl md:text-6xl lg:text-7xl text-white mb-8 fade-in tracking-wide leading-tight">
          Bangalore's first and only
          <br />
          <span className="text-neonGreen">Muay Thai</span> and <span className="text-neonPink">Aerial Dance</span>
          <br />
          Studio
        </h2>
        <p className="text-gray-300 text-lg md:text-xl leading-relaxed fade-in max-w-3xl mx-auto">
          Fight & Flight is a space to learn how to fight and fly while you find your community, have fun, and learn a skill.
        </p>
      </div>


      {/* Floating particles */}
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-neonGreen/30 rounded-full animate-pulse-slow blur-sm" style={{ zIndex: 15 }} />
      <div className="absolute top-40 right-32 w-2 h-2 bg-neonPink/30 rounded-full animate-pulse-slow blur-sm" style={{ zIndex: 15 }} />
    </section>);

}