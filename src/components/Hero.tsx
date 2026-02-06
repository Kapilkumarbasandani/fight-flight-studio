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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-black">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/50 via-brand-black/60 to-brand-black z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 opacity-85 brightness-125"
        >
          <source src="/fight-flight-studio/videos/home.mp4" type="video/mp4" />
        </video>
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-green/10 to-brand-black -z-10" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-green/15 rounded-full blur-3xl" />
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
            <span className="text-gradient-green">Fight.</span>{' '}
            <span className="text-gradient-pink">Fly.</span>{' '}
            <span className="text-brand-white/80">Become.</span>
          </h1>

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
