"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useRef, useEffect } from "react";

export function Testimonials() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((error) => {
        console.log("Video autoplay failed:", error);
      });
    }
  }, []);
  const testimonials = [
    {
      name: "Marcus Rivera",
      role: "Warrior Member",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      quote: "This place changed my life. I came for fitness, stayed for the community. The combination of Muay Thai and aerial work has transformed not just my body, but my mindset.",
      rating: 5,
    },
    {
      name: "Elena Santos",
      role: "Immortal Member",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      quote: "I've trained at luxury studios worldwide. Nothing compares to Fight&Flight. The instructors are world-class, the space is stunning, and the energy is electric.",
      rating: 5,
    },
    {
      name: "Jordan Kim",
      role: "Trainee Member",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      quote: "Never thought I'd love working out. The aerial classes feel like art, the Muay Thai feels like therapy. Best decision I've made this year.",
      rating: 5,
    },
  ];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(1.2) contrast(1.1) saturate(1.15)' }}
      >
        <source src="/Arial Yoga.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 z-10" />

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="text-center mb-20">
          <h2 className="headline-font text-5xl md:text-7xl text-white mb-6 fade-in font-light tracking-wide leading-tight">
            Our students love it, and so will you!
          </h2>
          <p className="text-gray-400 text-base max-w-3xl mx-auto font-light leading-relaxed">
            Hear from the fighters and flyers who found their transformation here.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="glass-card-intense p-8 hover:scale-105 transition-all duration-300 fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover grayscale"
                    style={{ filter: 'brightness(1.15) contrast(1.05)' }}
                  />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm uppercase tracking-wider">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-neonGreen text-neonGreen" />
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed italic">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}