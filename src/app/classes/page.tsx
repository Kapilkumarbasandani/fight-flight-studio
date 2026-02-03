'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export default function ClassesPage() {
  const [expandedMuayThai, setExpandedMuayThai] = useState<number | null>(0)
  const [expandedAerial, setExpandedAerial] = useState<number | null>(0)
  const [isMuayThaiHovered, setIsMuayThaiHovered] = useState(false)
  const [isAerialHovered, setIsAerialHovered] = useState(false)
  const muayThaiVideoRef = useRef<HTMLVideoElement>(null)
  const aerialVideoRef = useRef<HTMLVideoElement>(null)

  const handleMuayThaiHover = (isHovering: boolean) => {
    setIsMuayThaiHovered(isHovering)
    if (muayThaiVideoRef.current) {
      if (isHovering) {
        muayThaiVideoRef.current.play()
      } else {
        muayThaiVideoRef.current.pause()
      }
    }
  }

  const handleAerialHover = (isHovering: boolean) => {
    setIsAerialHovered(isHovering)
    if (aerialVideoRef.current) {
      if (isHovering) {
        aerialVideoRef.current.play()
      } else {
        aerialVideoRef.current.pause()
      }
    }
  }

  const muayThaiClasses = [
    {
      title: 'Fundamentals',
      level: 'Beginner Friendly',
      duration: '60 min',
      credits: '1 credit',
      description: 'Learn the basics: stance, footwork, basic punches, and kicks. Perfect for first-timers.',
    },
    {
      title: 'Technique',
      level: 'Intermediate',
      duration: '75 min',
      credits: '1 credit',
      description: 'Refine your strikes, work on combinations, and develop fight IQ through drills and pad work.',
    },
    {
      title: 'Conditioning',
      level: 'All Levels',
      duration: '60 min',
      credits: '1 credit',
      description: 'High-intensity cardio and strength training using Muay Thai movements. Burn calories, build power.',
    },
    {
      title: 'Sparring',
      level: 'Advanced',
      duration: '90 min',
      credits: '1 credit',
      description: 'Controlled sparring sessions to test your skills in a safe, supervised environment.',
    },
  ]

  const aerialClasses = [
    {
      title: 'Lyra Basics',
      level: 'Beginner Friendly',
      duration: '90 min',
      credits: '2 credits',
      description: 'Learn foundational moves on the aerial hoop. Build upper body strength and confidence in the air.',
    },
    {
      title: 'Aerial Silks',
      level: 'Beginner to Intermediate',
      duration: '90 min',
      credits: '2 credits',
      description: 'Master climbs, wraps, and drops on silks. Combine strength with grace for beautiful sequences.',
    },
    {
      title: 'Pole Flow',
      level: 'All Levels',
      duration: '90 min',
      credits: '2 credits',
      description: 'Dynamic pole work combining strength, flexibility, and artistry. Express yourself through movement.',
    },
    {
      title: 'Hammock & Straps',
      level: 'Intermediate',
      duration: '90 min',
      credits: '2 credits',
      description: 'Explore suspended fabric and strap work. Perfect for building core strength and flexibility.',
    },
  ]

  return (
    <div className="min-h-screen bg-brand-cream pt-24 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-brand-green/8 rounded-full blur-3xl animate-float" />
      <div className="absolute top-60 right-20 w-80 h-80 bg-brand-neon/6 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-brand-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="container-custom py-8 relative z-10">
        <div className="text-center mb-12">
          <h1 className="heading-lg mb-6 animate-fade-in">
            Explore Our <span className="bg-gradient-to-r from-brand-green via-brand-neon to-brand-green bg-clip-text text-transparent animate-gradient">Classes</span>
          </h1>
          <p className="text-xl text-brand-black/70 max-w-2xl mx-auto">
            From beginner to advanced, we offer classes for every level in both Muay Thai and Aerial Dance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Muay Thai Classes */}
          <div 
            className="bg-white/80 p-8 rounded-[30px_10px_30px_10px] shadow-lg border border-brand-green/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden"
            onMouseEnter={() => handleMuayThaiHover(true)}
            onMouseLeave={() => handleMuayThaiHover(false)}
          >
            {/* Background Video */}
            <div className="absolute inset-0 rounded-[30px_10px_30px_10px] overflow-hidden">
              <video
                ref={muayThaiVideoRef}
                loop
                muted
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-700 ${
                  isMuayThaiHovered ? 'opacity-30' : 'opacity-0'
                }`}
              >
                <source src="/videos/Female Boxing Video.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/50 pointer-events-none" />
            </div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-16 h-1 bg-gradient-to-r from-brand-green to-brand-neon mb-4 rounded-full animate-pulse" />
                <h2 className="text-4xl font-bold text-brand-green mb-4 relative inline-block">
                  Muay Thai Classes
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-green to-transparent rounded-full animate-shimmer" />
                </h2>
                <p className="text-brand-black/70">
                  Train with precision. Build unshakable confidence. Master the art of eight limbs.
                </p>
              </div>

            <div className="space-y-4">
              {muayThaiClasses.map((classItem, index) => (
                <div
                  key={index}
                  className="border-l-4 border-brand-green rounded-r-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => setExpandedMuayThai(expandedMuayThai === index ? null : index)}
                    className="w-full text-left pl-6 pr-4 py-4 hover:bg-brand-green/10 transition-all duration-300 flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-brand-black mb-1 group-hover:text-brand-green transition-colors duration-300">
                        {classItem.title}
                      </h3>
                      <p className="text-brand-black/60 text-sm">
                        {classItem.level} • {classItem.duration} • {classItem.credits}
                      </p>
                    </div>
                    <ChevronDown
                      className={`text-brand-green transition-transform duration-300 ${
                        expandedMuayThai === index ? 'rotate-180' : ''
                      }`}
                      size={24}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      expandedMuayThai === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-brand-black/70 pl-6 pr-4 pb-4 animate-fade-in">
                      {classItem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>

          {/* Aerial Classes */}
          <div 
            className="bg-white/80 p-8 rounded-[30px_10px_30px_10px] shadow-lg border border-brand-neon/20 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] relative overflow-hidden"
            onMouseEnter={() => handleAerialHover(true)}
            onMouseLeave={() => handleAerialHover(false)}
          >
            {/* Background Video */}
            <div className="absolute inset-0 rounded-[30px_10px_30px_10px] overflow-hidden">
              <video
                ref={aerialVideoRef}
                loop
                muted
                playsInline
                className={`w-full h-full object-cover transition-opacity duration-700 ${
                  isAerialHovered ? 'opacity-30' : 'opacity-0'
                }`}
              >
                <source src="/videos/Arial Yoga.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/30 to-white/50 pointer-events-none" />
            </div>
            
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-16 h-1 bg-gradient-to-r from-brand-neon to-brand-green mb-4 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                <h2 className="text-4xl font-bold text-brand-neon mb-4 relative inline-block">
                  Aerial Dance Classes
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-brand-neon to-transparent rounded-full animate-shimmer" style={{ animationDelay: '1s' }} />
                </h2>
                <p className="text-brand-black/70">
                  Defy gravity. Express yourself. Build strength while having the time of your life.
                </p>
              </div>

            <div className="space-y-4">
              {aerialClasses.map((classItem, index) => (
                <div
                  key={index}
                  className="border-l-4 border-brand-neon rounded-r-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    onClick={() => setExpandedAerial(expandedAerial === index ? null : index)}
                    className="w-full text-left pl-6 pr-4 py-4 hover:bg-brand-neon/10 transition-all duration-300 flex items-center justify-between group"
                  >
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-brand-black mb-1 group-hover:text-brand-neon transition-colors duration-300">
                        {classItem.title}
                      </h3>
                      <p className="text-brand-black/60 text-sm">
                        {classItem.level} • {classItem.duration} • {classItem.credits}
                      </p>
                    </div>
                    <ChevronDown
                      className={`text-brand-neon transition-transform duration-300 ${
                        expandedAerial === index ? 'rotate-180' : ''
                      }`}
                      size={24}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      expandedAerial === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-brand-black/70 pl-6 pr-4 pb-4 animate-fade-in">
                      {classItem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/book" className="btn-primary inline-block hover:scale-110 transition-transform duration-300">
            Book a Class Now
          </Link>
        </div>
      </div>
    </div>
  )
}
