"use client";

import { useEffect, useRef, useState } from "react";

export function Hero() {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeVideo, setActiveVideo] = useState(1);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setActiveVideo((current) => (current === 1 ? 2 : 1));
    }, activeVideo === 1 ? 1000 : 2000);

    return () => window.clearTimeout(timeout);
  }, [activeVideo]);

  useEffect(() => {
    const playVideo = (video: HTMLVideoElement | null) => {
      if (!video) return;
      video.playbackRate = 0.85;
      video.play().catch(() => {});
    };

    playVideo(video1Ref.current);
    playVideo(video2Ref.current);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative h-screen h-[100svh] w-full overflow-hidden" id="home">
      {/* Background Video 1 */}
      <video
        ref={video1Ref}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out animate-flow-slow"
        style={{
          opacity: activeVideo === 1 ? 1 : 0,
          zIndex: activeVideo === 1 ? 2 : 1,
          objectPosition: "center 28%",
          filter: 'brightness(1.2) contrast(1.1) saturate(1.15)',
          willChange: 'opacity, transform'
        }}
      >
        <source src="/home2.mp4" type="video/mp4" />
      </video>

      {/* Background Video 2 */}
      <video
        ref={video2Ref}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out animate-flow-slow-reverse"
        style={{
          opacity: activeVideo === 2 ? 1 : 0,
          zIndex: activeVideo === 2 ? 2 : 1,
          objectPosition: "center 28%",
          filter: 'brightness(1.2) contrast(1.1) saturate(1.15)',
          willChange: 'opacity, transform'
        }}
      >
        <source src="/home.mp4" type="video/mp4" />
      </video>

      {/* Dark Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60 z-10" />
      
      {/* Subtle Neon Accent Overlays */}
      <div className="absolute inset-0 opacity-10 z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-neonGreen/20 via-transparent via-50% to-neonPink/20" />
      </div>

      {/* Main Content - Positioned Lower */}
      <div 
        className="relative z-20 h-full flex flex-col items-center justify-end px-4 md:px-6 text-center pb-12 sm:pb-16 md:pb-32 lg:pb-40"
        style={{
          transform: `translateY(${scrollY * -0.3}px)`,
          transition: "transform 0.1s ease-out"
        }}
      >
        {/* Main Headline - Single Horizontal Line */}
        <h1 className="headline-font text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.15em] uppercase mb-4 sm:mb-6 relative z-10">
          Fight&Flight
        </h1>
        <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-12 font-semibold px-2">
          Where Grit meets Grace
        </div>
        {/* CTA Button with Neon Green Border */}
        <button
          onClick={() => {
            const user = localStorage.getItem("user");
            if (user) {
              window.location.href = "/app/schedule";
            } else {
              window.dispatchEvent(new Event('openAuthModal'));
            }
          }}
          className="relative z-10 px-8 sm:px-12 py-4 text-neonGreen text-sm md:text-base lg:text-lg font-bold uppercase tracking-widest border-2 border-neonGreen rounded-full hover:bg-neonGreen hover:text-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(57,255,20,0.6)] cursor-pointer"
        >
          Start your journey
        </button>
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