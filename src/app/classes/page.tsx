import Link from 'next/link'

export default function ClassesPage() {
  return (
    <div className="min-h-screen bg-brand-black pt-24">
      <div className="container-custom section-padding">
        <div className="text-center mb-16">
          <h1 className="heading-lg mb-6">
            Explore Our <span className="text-brand-neon">Classes</span>
          </h1>
          <p className="text-xl text-brand-white/70 max-w-2xl mx-auto">
            From beginner to advanced, we offer classes for every level in both Muay Thai and Aerial Dance.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Muay Thai Classes */}
          <div>
            <div className="mb-8">
              <div className="w-16 h-1 bg-brand-neon mb-4" />
              <h2 className="text-4xl font-bold text-brand-neon mb-4">Muay Thai Classes</h2>
              <p className="text-brand-white/70">
                Train with precision. Build unshakable confidence. Master the art of eight limbs.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-brand-neon pl-6 py-4">
                <h3 className="text-2xl font-bold text-brand-white mb-2">Fundamentals</h3>
                <p className="text-brand-white/60 mb-3">Beginner Friendly • 60 min • 1 credit</p>
                <p className="text-brand-white/70">
                  Learn the basics: stance, footwork, basic punches, and kicks. Perfect for first-timers.
                </p>
              </div>

              <div className="border-l-4 border-brand-neon pl-6 py-4">
                <h3 className="text-2xl font-bold text-brand-white mb-2">Technique</h3>
                <p className="text-brand-white/60 mb-3">Intermediate • 75 min • 1 credit</p>
                <p className="text-brand-white/70">
                  Refine your strikes, work on combinations, and develop fight IQ through drills and pad work.
                </p>
              </div>

              <div className="border-l-4 border-brand-neon pl-6 py-4">
                <h3 className="text-2xl font-bold text-brand-white mb-2">Conditioning</h3>
                <p className="text-brand-white/60 mb-3">All Levels • 60 min • 1 credit</p>
                <p className="text-brand-white/70">
                  High-intensity cardio and strength training using Muay Thai movements. Burn calories, build power.
                </p>
              </div>

              <div className="border-l-4 border-brand-neon pl-6 py-4">
                <h3 className="text-2xl font-bold text-brand-white mb-2">Sparring</h3>
                <p className="text-brand-white/60 mb-3">Advanced • 90 min • 1 credit</p>
                <p className="text-brand-white/70">
                  Controlled sparring sessions to test your skills in a safe, supervised environment.
                </p>
              </div>
            </div>
          </div>

          {/* Aerial Classes */}
          <div>
            <div className="mb-8">
              <div className="w-16 h-1 bg-brand-pink mb-4" />
              <h2 className="text-4xl font-bold text-brand-pink mb-4">Aerial Dance Classes</h2>
              <p className="text-brand-white/70">
                Defy gravity. Express yourself. Build strength while having the time of your life.
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-brand-pink pl-6 py-4">
                <h3 className="text-2xl font-bold text-brand-white mb-2">Lyra Basics</h3>
                <p className="text-brand-white/60 mb-3">Beginner Friendly • 90 min • 2 credits</p>
                <p className="text-brand-white/70">
                  Learn foundational moves on the aerial hoop. Build upper body strength and confidence in the air.
                </p>
              </div>

              <div className="border-l-4 border-brand-pink pl-6 py-4">
                <h3 className="text-2xl font-bold text-brand-white mb-2">Aerial Silks</h3>
                <p className="text-brand-white/60 mb-3">Beginner to Intermediate • 90 min • 2 credits</p>
                <p className="text-brand-white/70">
                  Master climbs, wraps, and drops on silks. Combine strength with grace for beautiful sequences.
                </p>
              </div>

              <div className="border-l-4 border-brand-pink pl-6 py-4">
                <h3 className="text-2xl font-bold text-brand-white mb-2">Pole Flow</h3>
                <p className="text-brand-white/60 mb-3">All Levels • 90 min • 2 credits</p>
                <p className="text-brand-white/70">
                  Dynamic pole work combining strength, flexibility, and artistry. Express yourself through movement.
                </p>
              </div>

              <div className="border-l-4 border-brand-pink pl-6 py-4">
                <h3 className="text-2xl font-bold text-brand-white mb-2">Hammock & Straps</h3>
                <p className="text-brand-white/60 mb-3">Intermediate • 90 min • 2 credits</p>
                <p className="text-brand-white/70">
                  Explore suspended fabric and strap work. Perfect for building core strength and flexibility.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link href="/book" className="btn-primary inline-block">
            Book a Class Now
          </Link>
        </div>
      </div>
    </div>
  )
}
