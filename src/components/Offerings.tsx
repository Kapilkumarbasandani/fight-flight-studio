import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function Offerings() {
  return (
    <section id="offerings" className="section-padding bg-gradient-to-b from-brand-black via-brand-green/5 to-brand-black">
      <div className="container-custom">
        {/* Section Headline */}
        <h2 className="heading-lg text-center mb-20 text-brand-white">
          Two Disciplines. One Mission.{' '}
          <span className="text-gradient-pink">Infinite Possibilities.</span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* MUAY THAI */}
          <div className="relative overflow-hidden rounded-3xl border border-brand-green/30 shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="/fight-flight-studio/Images/real_girldoingboxing.jpeg"
                alt="Muay Thai Background"
                className="w-full h-full object-cover opacity-20 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-brand-black/90 via-brand-black/85 to-brand-black/90" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-8 space-y-6">
              <div className="w-20 h-1 bg-brand-green mb-6 rounded-full" />
              <h3 className="heading-md mb-4 text-gradient-green">
                MUAY THAI
              </h3>
              <p className="text-2xl text-brand-white font-semibold mb-6">
                The Art of Eight Limbs
              </p>
              <p className="text-xl text-brand-green/80 mb-6 italic">
                Fight with precision. Move with purpose. Own your power.
              </p>
              
              <p className="text-lg text-brand-white/70 mb-6">
                Muay Thai isn&apos;t about anger or aggression. It&apos;s about control, focus, and mastery.
              </p>
              
              <p className="text-lg text-brand-white/70 mb-8">
                You&apos;ll learn punches, elbows, knees, and kicks — not to hurt anyone, but to discover 
                what your body can do when it moves with intention.
              </p>

              {/* What You'll Experience */}
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-4 text-brand-white">What You&apos;ll Experience:</h4>
                <ul className="space-y-2 text-brand-white/70">
                  <li className="flex items-start">
                    <span className="text-brand-green mr-2">→</span>
                    Traditional Muay Thai techniques with modern coaching
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green mr-2">→</span>
                    Pad work, shadow boxing, clinch training
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green mr-2">→</span>
                    Cardio, conditioning, and controlled power
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-green mr-2">→</span>
                    Mental discipline and unshakable confidence
                  </li>
                </ul>
              </div>

              {/* Who It's For */}
              <p className="text-brand-white/60 mb-8 italic">
                <strong className="text-brand-green">Who It&apos;s For:</strong> Anyone ready to feel strong, 
                focused, and fearless — no experience required.
              </p>
            </div>
          </div>

          {/* AERIAL DANCE */}
          <div className="relative overflow-hidden rounded-3xl border border-brand-rose/30 shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src="/fight-flight-studio/Images/realgirlarieldanceimage.jpeg"
                alt="Aerial Dance Background"
                className="w-full h-full object-cover opacity-20 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-brand-black/90 via-brand-black/85 to-brand-black/90" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-8 space-y-6">
              <div className="w-20 h-1 bg-brand-rose mb-6 rounded-full" />
              <h3 className="heading-md mb-4 text-gradient-pink">
                AERIAL DANCE
              </h3>
              <p className="text-2xl text-brand-white font-semibold mb-6">
                The Art of Flight
              </p>
              <p className="text-xl text-brand-rose/80 mb-6 italic">
                Defy gravity. Express yourself. Find your flow.
              </p>
              
              <p className="text-lg text-brand-white/70 mb-6">
                Aerial dance is where strength meets art, where you stop asking &ldquo;can I?&rdquo; and start asking &ldquo;how high?&rdquo;
              </p>
              
              <p className="text-lg text-brand-white/70 mb-8">
                From silks to lyra, pole to hammock, you&apos;ll build muscles you didn&apos;t know you had and move 
                in ways that feel like flying.
              </p>

              {/* Disciplines */}
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-4 text-brand-white">Disciplines We Teach:</h4>
                <div className="grid grid-cols-2 gap-3 text-brand-white/70">
                  <div className="flex items-center">
                    <span className="text-brand-rose mr-2">✦</span>
                    Lyra (aerial hoop)
                  </div>
                  <div className="flex items-center">
                    <span className="text-brand-rose mr-2">✦</span>
                    Silks
                  </div>
                  <div className="flex items-center">
                    <span className="text-brand-rose mr-2">✦</span>
                    Hammock
                  </div>
                  <div className="flex items-center">
                    <span className="text-brand-rose mr-2">✦</span>
                    Pole
                  </div>
                  <div className="flex items-center">
                    <span className="text-brand-rose mr-2">✦</span>
                    Aerial cube
                  </div>
                  <div className="flex items-center">
                    <span className="text-brand-rose mr-2">✦</span>
                    Straps
                  </div>
                </div>
              </div>

              {/* Who It's For */}
              <p className="text-brand-white/60 mb-8 italic">
                <strong className="text-brand-rose">Who It&apos;s For:</strong> Anyone who&apos;s ever wanted to 
                feel weightless, powerful, and free.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
