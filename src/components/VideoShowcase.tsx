'use client';

import { useState, useEffect } from 'react';

export function VideoShowcase() {
  const [currentVideo, setCurrentVideo] = useState<'muaythai' | 'aerial'>('muaythai');

  useEffect(() => {
    const switchToNext = () => {
      setCurrentVideo(prev => prev === 'muaythai' ? 'aerial' : 'muaythai');
    };

    // Muay Thai shows for 2 seconds, then switch to Aerial
    // Aerial shows for 5 seconds, then switch to Muay Thai
    const duration = currentVideo === 'muaythai' ? 2000 : 5000;
    const timer = setTimeout(switchToNext, duration);

    return () => clearTimeout(timer);
  }, [currentVideo]);

  return (
    <section className="relative h-screen overflow-hidden bg-brand-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/80 via-transparent to-brand-black z-10" />
        <video
          key={currentVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-opacity duration-1000 opacity-65 brightness-110"
        >
          {currentVideo === 'muaythai' ? (
            <source src="/fight-flight-studio/videos/Female Boxing Video.mp4" type="video/mp4" />
          ) : (
            <source src="/fight-flight-studio/videos/Aerial yoga.mp4" type="video/mp4" />
          )}
        </video>
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-pink/5 to-brand-green/5 -z-10" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container-custom px-4 text-center">
          <div className="transition-all duration-700" key={currentVideo}>
            {currentVideo === 'muaythai' ? (
              <div className="space-y-6">
                <div className="inline-block border-2 border-brand-green/60 px-6 py-2 mb-4 rounded-full bg-brand-black/30">
                  <span className="heading-sm text-gradient-green">MUAY THAI</span>
                </div>
                <h2 className="heading-lg text-brand-white mb-6">
                  THE ART OF <span className="text-gradient-green">EIGHT LIMBS</span>
                </h2>
                <p className="text-2xl text-brand-white/80 italic max-w-2xl mx-auto font-medium transition-all duration-500 hover:scale-105">
                  Fight with precision. Move with purpose. Own your power.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="inline-block border-2 border-brand-rose/60 px-6 py-2 mb-4 rounded-full bg-brand-black/30">
                  <span className="heading-sm text-gradient-pink">AERIAL DANCE</span>
                </div>
                <h2 className="heading-lg text-brand-white mb-6">
                  DEFY <span className="text-gradient-pink">GRAVITY</span>
                </h2>
                <p className="text-2xl text-brand-white/80 italic max-w-2xl mx-auto font-medium transition-all duration-500 hover:scale-105">
                  Fly with grace. Move with strength. Discover your wings.
                </p>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-12 flex gap-4 justify-center">
            <div className={`h-1 w-16 transition-all duration-300 rounded-full ${
              currentVideo === 'muaythai' ? 'bg-brand-green' : 'bg-brand-white/20'
            }`} />
            <div className={`h-1 w-16 transition-all duration-300 rounded-full ${
              currentVideo === 'aerial' ? 'bg-brand-rose' : 'bg-brand-white/20'
            }`} />
          </div>
        </div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-green/15 rounded-full blur-[120px] z-5" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-rose/10 rounded-full blur-[120px] z-5" />
    </section>
  );
}
