"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";

interface PortraitModalProps {
  isOpen: boolean;
  onClose: () => void;
  founder: {
    name: string;
    title: string;
    image: string;
    bio: string;
    color: string;
    fullBio: string;
  };
}

export function PortraitModal({ isOpen, onClose, founder }: PortraitModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 w-14 h-14 rounded-full glass-card-intense flex items-center justify-center hover:scale-110 transition-transform group z-50"
        aria-label="Close modal"
      >
        <X className="w-6 h-6 text-white group-hover:text-neonGreen transition-colors" />
      </button>

      {/* Modal Content */}
      <div 
        className="relative max-w-7xl w-full h-[90vh] grid md:grid-cols-2 gap-8 scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Portrait Image */}
        <div className="relative h-full rounded-3xl overflow-hidden cinematic-shadow">
          <Image
            src={founder.image}
            alt={founder.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Floating Name Tag */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="glass-card-intense p-6">
              <h3
                className={`headline-font text-5xl mb-2 ${
                  founder.color === "neonGreen" ? "text-neonGreen text-glow-green" : "text-neonPink text-glow-pink"
                }`}
              >
                {founder.name}
              </h3>
              <p className="text-white/60 uppercase text-sm tracking-[0.2em] font-semibold">
                {founder.title}
              </p>
            </div>
          </div>
        </div>

        {/* Bio Content */}
        <div className="flex flex-col justify-center space-y-8 overflow-y-auto custom-scrollbar px-4">
          <div className="glass-card-intense p-10 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-1 h-20 rounded-full ${
                founder.color === "neonGreen" ? "bg-neonGreen neon-glow-green" : "bg-neonPink neon-glow-pink"
              }`} />
              <div>
                <h4 className="text-white/50 uppercase text-xs tracking-[0.3em] font-bold mb-2">The Story</h4>
                <p className="text-white text-2xl font-light">Behind the Vision</p>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed font-light">
              {founder.fullBio}
            </p>

            <div className="pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm italic">
                "{founder.bio}"
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-6 text-center">
              <div className={`text-4xl font-bold mb-2 ${
                founder.color === "neonGreen" ? "text-neonGreen" : "text-neonPink"
              }`}>15+</div>
              <div className="text-white/60 text-xs uppercase tracking-wider">Years Experience</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className={`text-4xl font-bold mb-2 ${
                founder.color === "neonGreen" ? "text-neonGreen" : "text-neonPink"
              }`}>500+</div>
              <div className="text-white/60 text-xs uppercase tracking-wider">Students Trained</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className={`text-4xl font-bold mb-2 ${
                founder.color === "neonGreen" ? "text-neonGreen" : "text-neonPink"
              }`}>∞</div>
              <div className="text-white/60 text-xs uppercase tracking-wider">Passion</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}