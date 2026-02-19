"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export function Hero() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeVideo, setActiveVideo] = useState(1);

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    if (video1 && video2) {
      video1.play().catch((error) => {
        console.log("Video 1 autoplay failed:", error);
      });

      video2.load();

      const handleVideoEnd = () => {
        setActiveVideo(2);
        video2.play().catch((error) => {
          console.log("Video 2 autoplay failed:", error);
        });
      };

      const handleVideo2End = () => {
        setActiveVideo(1);
        video1.currentTime = 0;
        video1.play().catch((error) => {
          console.log("Video 1 replay failed:", error);
        });
      };

      video1.addEventListener("ended", handleVideoEnd);
      video2.addEventListener("ended", handleVideo2End);

      return () => {
        video1.removeEventListener("ended", handleVideoEnd);
        video2.removeEventListener("ended", handleVideo2End);
      };
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden" id="home">
      {/* Video 1: Home Video */}
      <video
        ref={video1Ref}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: "transform 0.1s ease-out",
          opacity: activeVideo === 1 ? 1 : 0,
          zIndex: activeVideo === 1 ? 2 : 1,
          filter: 'brightness(1.2) contrast(1.1) saturate(1.15)'
        }}
      >
        <source src="/home.mp4" type="video/mp4" />
      </video>

      {/* Video 2: Aerial Dancer */}
      <video
        ref={video2Ref}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: "transform 0.1s ease-out",
          opacity: activeVideo === 2 ? 1 : 0,
          zIndex: activeVideo === 2 ? 2 : 1,
          filter: 'brightness(1.2) contrast(1.1) saturate(1.15)'
        }}
      >
        <source src="/526744_Dancer_Performer_Woman_Acrobat_By_Morten_Lovechild_Artlist_HD.mp4" type="video/mp4" />
      </video>

      {/* Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60 z-10" />
      
      {/* Subtle Neon Accent Overlays */}
      <div className="absolute inset-0 opacity-10 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-neonGreen/20 via-transparent via-50% to-neonPink/20" />
      </div>

      {/* Main Content - Positioned Lower */}
      <div 
        className="relative z-20 h-full flex flex-col items-center justify-end px-6 text-center pb-32 md:pb-40"
        style={{
          transform: `translateY(${scrollY * -0.3}px)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        {/* Main Headline - Single Horizontal Line */}
        <h1 className="headline-font text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-[0.15em] uppercase mb-6 relative z-10">
          Fight&Flight
        </h1>
        <div className="text-lg md:text-xl lg:text-2xl text-white/80 mb-12 font-semibold">
          Where Grit meets Grace
        </div>
        {/* CTA Button with Neon Green Border */}
        <Link
          href="/app"
          className="relative z-10 px-12 py-4 text-neonGreen text-sm md:text-base lg:text-lg font-bold uppercase tracking-widest border-2 border-neonGreen rounded-full hover:bg-neonGreen hover:text-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(57,255,20,0.6)]"
        >
          Start your journey
        </Link>
      </div>

      {/* Subtle Floating Particles */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-15">
        <div className="absolute top-20 left-10 w-2 h-2 bg-neonGreen/40 rounded-full animate-pulse-slow blur-sm" />
        <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-neonPink/40 rounded-full animate-pulse-slow blur-sm" />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-neonGreen/30 rounded-full animate-pulse-slow blur-sm" />
        <div className="absolute bottom-20 right-1/3 w-1.5 h-1.5 bg-neonPink/30 rounded-full animate-pulse-slow blur-sm" />
      </div>
    </section>
  );
}