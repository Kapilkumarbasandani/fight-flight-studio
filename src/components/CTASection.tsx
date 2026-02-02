import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-brand-cream via-brand-white to-brand-pink/10 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-rose/20 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-pink/15 rounded-full blur-3xl" style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '2s' }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="heading-lg mb-8 text-brand-black">
            Ready to <span className="text-brand-green">Fight</span> and{' '}
            <span className="text-brand-rose">Fly</span>?
          </h2>
          
          <p className="text-xl md:text-2xl text-brand-black/70 mb-12 max-w-2xl mx-auto">
            Your transformation starts with a single class. Book now and discover what your body is truly capable of.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/book" className="btn-primary group inline-flex items-center gap-2 glow-neon">
              Book Your First Class
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link href="/pricing" className="btn-pink inline-flex items-center gap-2 glow-pink">
              View Pricing
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
