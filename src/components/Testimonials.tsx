'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

export function Testimonials() {
  const testimonials = [
    {
      name: 'Priya Sharma',
      membership: 'WARRIOR MEMBER',
      rating: 5,
      image: '/Images/realgirlarieldanceimage.jpeg',
      quote: 'This place changed my life. I came for fitness, stayed for the community. The combination of Muay Thai and aerial work has transformed not just my body, but my mindset.',
    },
    {
      name: 'Arjun Patel',
      membership: 'IMMORTAL MEMBER',
      rating: 5,
      image: '/Images/real_girldoingboxing.jpeg',
      quote: "I've trained at luxury studios worldwide. Nothing compares to Fight&Flight. The instructors are world-class, the space is stunning, and the energy is electric.",
    },
    {
      name: 'Maya Thompson',
      membership: 'TRAINEE MEMBER',
      rating: 5,
      image: '/Images/realgirlarieldanceimage.jpeg',
      quote: 'Never thought I&apos;d love working out. The aerial classes feel like art, the Muay Thai feels like therapy. Best decision I&apos;ve made this year.',
    },
  ]

  return (
    <section id="testimonials" className="section-padding bg-brand-cream relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-rose/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold text-brand-black mb-4 tracking-tight">
            REAL PEOPLE. REAL <span className="text-brand-green">POWER.</span>
            <br />
            REAL <span className="text-brand-rose">CHANGE.</span>
          </h2>
          <p className="text-xl text-brand-black/70 max-w-2xl mx-auto">
            Don&apos;t take our word for it. Hear from the fighters and flyers who found their transformation here.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm border border-brand-black/10 rounded-[30px_10px_30px_10px] p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-brand-green"
                />
                <div>
                  <h4 className="font-bold text-xl text-brand-black">{testimonial.name}</h4>
                  <p className="text-sm text-brand-green font-semibold">{testimonial.membership}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="fill-brand-green text-brand-green" />
                ))}
              </div>

              <p className="text-brand-black/80 italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
