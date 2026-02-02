'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/50 via-brand-black/70 to-brand-cream z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 opacity-60"
        >
          <source src="/videos/Female Boxing Video.mp4" type="video/mp4" />
        </video>
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cream via-brand-pink/10 to-brand-green/10 -z-10" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand-rose/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-20 container-custom text-center px-4">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Main Headline */}
          <h1 className="heading-xl mb-6">
            <span className="text-brand-green">Fight.</span>{' '}
            <span className="text-brand-rose">Fly.</span>{' '}
            <span className="text-brand-cream">Become.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-brand-cream/90 max-w-4xl mx-auto mb-8 leading-relaxed">
            Your body is capable of incredible things. We'll show you how to unlock them —{' '}
            <span className="text-brand-green font-semibold">through the power of Muay Thai</span> and{' '}
            <span className="text-brand-rose font-semibold">the art of aerial dance</span>.
          </p>

          {/* Supporting Copy */}
          <p className="text-lg text-brand-cream/70 mb-12 italic max-w-2xl mx-auto">
            Join Bangkok's most inclusive movement studio. No judgment. No intimidation. Just transformation.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/book" className="btn-primary group flex items-center gap-2">
              Book Your First Class
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link href="/pricing" className="btn-secondary">
              Find Your Power
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
