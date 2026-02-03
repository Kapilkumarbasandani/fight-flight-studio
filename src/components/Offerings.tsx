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

        <div className="space-y-32">
          {/* MUAY THAI */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <div className="w-20 h-1 bg-brand-green mb-6 rounded-full" />
              <h3 className="heading-md mb-4 text-gradient-green">
                MUAY THAI
              </h3>
              <p className="text-2xl text-brand-white font-semibold mb-6 transition-all duration-300 hover:scale-105">
                The Art of Eight Limbs
              </p>
              <p className="text-xl text-brand-green/80 mb-6 italic transition-all duration-300 hover:text-brand-green">
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

              <Link href="/classes?discipline=muay-thai" className="btn-primary inline-flex items-center gap-2 glow-neon">
                Explore Muay Thai Classes
                <ArrowRight size={20} />
              </Link>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/5] border-2 border-brand-green/40 overflow-hidden relative group shadow-[0_0_30px_rgba(0,217,163,0.2)] rounded-[40px_10px_40px_10px] transform rotate-1 hover:rotate-0 hover:shadow-[0_0_50px_rgba(0,217,163,0.4)] transition-all duration-700 hover:scale-105">
                <img
                  src="/Images/real_girldoingboxing.jpeg"
                  alt="Muay Thai Training"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green/10 via-transparent to-transparent mix-blend-multiply group-hover:from-brand-green/20 transition-all duration-500" />
                <div className="absolute top-4 right-4 w-24 h-24 border-2 border-brand-green/40 rounded-full group-hover:border-brand-green group-hover:scale-110 transition-all duration-500" style={{ animation: 'float 4s ease-in-out infinite' }} />
                <div className="absolute bottom-4 left-4 w-32 h-32 border-2 border-brand-neon/30 rounded-tl-[50px] clip-path-polygon group-hover:border-brand-neon/60 transition-all duration-500" style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '1s' }} />
              </div>
            </div>
          </div>

          {/* AERIAL DANCE */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div>
              <div className="aspect-[4/5] border-2 border-brand-rose/40 overflow-hidden relative group shadow-[0_0_30px_rgba(255,144,194,0.2)] rounded-[10px_40px_10px_40px] transform -rotate-1 hover:rotate-0 hover:shadow-[0_0_50px_rgba(255,144,194,0.4)] transition-all duration-700 hover:scale-105">
                <img
                  src="/Images/realgirlarieldanceimage.jpeg"
                  alt="Aerial Dance"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-105 group-hover:brightness-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-rose/10 via-transparent to-transparent mix-blend-multiply group-hover:from-brand-rose/20 transition-all duration-500" />
                <div className="absolute top-4 left-4 w-24 h-24 border-2 border-brand-rose/40 rounded-full group-hover:border-brand-rose group-hover:scale-110 transition-all duration-500" style={{ animation: 'float 4s ease-in-out infinite' }} />
                <div className="absolute bottom-4 right-4 w-32 h-32 border-2 border-brand-pink/30 rounded-tr-[60px] rounded-bl-[20px] group-hover:border-brand-pink/60 transition-all duration-500" style={{ animation: 'float 5s ease-in-out infinite', animationDelay: '1s' }} />
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="w-20 h-1 bg-brand-rose mb-6 rounded-full" />
              <h3 className="heading-md mb-4 text-gradient-pink">
                AERIAL DANCE
              </h3>
              <p className="text-2xl text-brand-white font-semibold mb-6 transition-all duration-300 hover:scale-105">
                The Art of Flight
              </p>
              <p className="text-xl text-brand-rose/80 mb-6 italic transition-all duration-300 hover:text-brand-rose">
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

              <Link href="/classes?discipline=aerial" className="btn-pink inline-flex items-center gap-2 glow-pink">
                Explore Aerial Classes
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
