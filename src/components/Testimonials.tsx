"use client";

import { ExternalLink, Star } from "lucide-react";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?sca_esv=43340ab55d5d8314&sxsrf=ANbL-n6BKE-AOjAfE-tr26qGN0f_P344CA:1776928809711&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOctpzGk6F9Cp7p6d-IMK3q1WHxQ1ujJJOrbHyTBP42EHJLw8YzQjUrubzANG02-gPA2Vy3mt7fEp0P7bCOlJDBdWmDRkxAnq-uystA67HCeoaJCAaA%3D%3D&q=Fight+%26+Flight+Studio+Reviews&sa=X&ved=2ahUKEwjlpvnTt4OUAxXxjGMGHUI0DucQ0bkNegQIIRAH&biw=1536&bih=730&dpr=1.25";

const STATIC_REVIEWS = [
  {
    id: 1,
    initials: "RS",
    name: "Rita S.",
    timeAgo: "1 month ago",
    quote:
      "Love this place! The Muay Thai classes and the coaches really push you to your limits while keeping it fun. The aerial yoga classes are a perfect mix of flexibility and core strength.",
  },
  {
    id: 2,
    initials: "PS",
    name: "Priya Sharma",
    timeAgo: "3 months ago",
    quote:
      "Fight & Flight Studio is one of a kind in Bangalore. The trainers are incredibly passionate and the atmosphere is electric. Whether you are a beginner or advanced, they tailor every session to your level.",
  },
  {
    id: 3,
    initials: "DK",
    name: "Dhruv Kapoor",
    timeAgo: "3 months ago",
    quote:
      "The only studio in Bangalore that combines Muay Thai with aerial arts, and both are top notch. Great vibes, clean space, and amazing instructors. The transformation in my strength and confidence is unreal.",
  },
  {
    id: 4,
    initials: "SR",
    name: "Sneha Rao",
    timeAgo: "3 months ago",
    quote:
      "What a gem of a studio! The moment you walk in, you feel the energy. The instructors are supportive and make every class challenging. Highly recommended if you are looking to try something different.",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-32 px-4 md:px-6 relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-black" />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 z-10" />

      <div className="max-w-7xl mx-auto relative z-20">
        <p className="text-center text-sm text-white/90 mb-4 tracking-wide">Google Reviews</p>
        <div className="text-center mb-20">
          <h2 className="headline-font text-3xl sm:text-5xl md:text-7xl text-white mb-6 fade-in font-light tracking-wide leading-tight">
            Our students love it, and so will you!
          </h2>
          <p className="text-gray-400 text-base max-w-3xl mx-auto font-light leading-relaxed">
            Hear from the fighters and flyers who found their transformation here.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="text-white text-2xl font-semibold">5</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {STATIC_REVIEWS.map((review, index) => (
            <div
              key={review.id}
              className="glass-card-intense p-4 md:p-6 hover:scale-[1.02] transition-all duration-300 fade-in min-h-[280px]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold flex items-center justify-center">
                    {review.initials}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{review.name}</h4>
                    <p className="text-gray-400 text-xs">{review.timeAgo}</p>
                  </div>
                </div>
                <span className="text-xs text-white/70">G</span>
              </div>

              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-200 leading-relaxed text-sm">
                "{review.quote}"
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-neonGreen text-neonGreen font-semibold uppercase text-xs tracking-[0.15em] hover:bg-neonGreen hover:text-black transition-all duration-300"
          >
            See all reviews on Google
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}