"use client";

export function Tagline() {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] py-16 md:py-24 flex items-center justify-center overflow-hidden">
      {/* Image-sequence video-like background */}
      <div className="absolute inset-0 bg-black" style={{ zIndex: 0 }}>
        <div
          className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat animate-tagline-slide-1"
          style={{ backgroundImage: "url('/1.jpg')" }}
        />
        <div
          className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat animate-tagline-slide-2"
          style={{ backgroundImage: "url('/10.jpg')" }}
        />
        <div
          className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat animate-tagline-slide-3"
          style={{ backgroundImage: "url('/13.jpg')" }}
        />
        <div
          className="absolute inset-0 w-full h-full bg-contain bg-center bg-no-repeat animate-tagline-slide-4"
          style={{ backgroundImage: "url('/17.jpg')" }}
        />
      </div>

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
          <h2 className="headline-font text-white mb-8 fade-in tracking-wide leading-tight text-center">

            <div className="text-2xl sm:text-4xl md:text-6xl">
              Bangalore's first and only
            </div>

            <div className="text-xl sm:text-3xl md:text-5xl mt-3">
              <span className="text-neonGreen">Muay Thai</span> and{" "}
              <span className="text-neonPink">Aerial Dance</span>
            </div>

            <div className="text-2xl sm:text-4xl md:text-6xl mt-3">
              Studio
            </div>

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