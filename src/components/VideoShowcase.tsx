'use client';

import { useState, useEffect } from 'react';

export function VideoShowcase() {
  const [currentVideo, setCurrentVideo] = useState<'muaythai' | 'aerial'>('muaythai');

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo(prev => prev === 'muaythai' ? 'aerial' : 'muaythai');
    }, 10000); // Switch every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-brand-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/80 via-transparent to-brand-cream z-10" />
        <video
          key={currentVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-opacity duration-1000 opacity-50"
        >
          {currentVideo === 'muaythai' ? (
            <source src="/videos/Yogaa.mp4" type="video/mp4" />
          ) : (
            <source src="/videos/Arial Yoga.mp4" type="video/mp4" />
          )}
        </video>
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cream via-brand-pink/5 to-brand-green/5 -z-10" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container-custom px-4 text-center">
          <div className="transition-all duration-700" key={currentVideo}>
            {currentVideo === 'muaythai' ? (
              <div className="space-y-6">
                <div className="inline-block border-2 border-brand-green/60 px-6 py-2 mb-4 rounded-full bg-brand-cream/10">
                  <span className="heading-sm text-brand-green">MUAY THAI</span>
                </div>
                <h2 className="heading-lg text-brand-black mb-6">
                  THE ART OF <span className="text-brand-green">EIGHT LIMBS</span>
                </h2>
                <p className="text-2xl text-brand-green/90 italic max-w-2xl mx-auto font-medium">
                  Fight with precision. Move with purpose. Own your power.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="inline-block border-2 border-brand-rose/60 px-6 py-2 mb-4 rounded-full bg-brand-cream/10">
                  <span className="heading-sm text-brand-rose">AERIAL DANCE</span>
                </div>
                <h2 className="heading-lg text-brand-black mb-6">
                  DEFY <span className="text-brand-rose">GRAVITY</span>
                </h2>
                <p className="text-2xl text-brand-rose/90 italic max-w-2xl mx-auto font-medium">
                  Fly with grace. Move with strength. Discover your wings.
                </p>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-12 flex gap-4 justify-center">
            <div className={`h-1 w-16 transition-all duration-300 rounded-full ${
              currentVideo === 'muaythai' ? 'bg-brand-green' : 'bg-brand-black/20'
            }`} />
            <div className={`h-1 w-16 transition-all duration-300 rounded-full ${
              currentVideo === 'aerial' ? 'bg-brand-rose' : 'bg-brand-black/20'
            }`} />
          </div>
        </div>
      </div>

      {/* Decorative Glows */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-green/15 rounded-full blur-[120px] z-5" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-rose/15 rounded-full blur-[120px] z-5" />
    </section>
  );
}
