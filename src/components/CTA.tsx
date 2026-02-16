import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="relative py-40 px-6 bg-black overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-neonGreen/30 via-transparent to-neonPink/30" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neonGreen/30 rounded-full blur-[200px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="headline-font text-6xl md:text-7xl lg:text-8xl text-white/90 mb-10 fade-in leading-tight tracking-wide font-light">
          Ready to start?
          <br />
          <span className="text-neonGreen font-normal">It's time to unlock your inner superhero.</span>
        </h2>

        <p className="text-gray-400 text-lg md:text-xl mb-12 leading-relaxed fade-in font-light max-w-2xl mx-auto">
          Your transformation begins the moment you walk through our doors.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center fade-in">
          <button className="btn-luxury-green flex items-center gap-3 group shadow-2xl text-xs tracking-wider">
            Book your first class today!
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-neonGreen to-transparent opacity-50" />
    </section>
  );
}