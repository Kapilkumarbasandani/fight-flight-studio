'use client'

import { BookingCalendar } from '@/components/BookingCalendar'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BookPage() {
  return (
    <div className="min-h-screen bg-brand-black pt-24">
      <div className="container-custom">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-brand-white/60 hover:text-brand-neon transition-colors mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="heading-lg mb-4">
            Book Your <span className="text-brand-neon">Fight</span> or{' '}
            <span className="text-brand-pink">Flight</span>
          </h1>
          <p className="text-xl text-brand-white/70">
            Choose a class that fits your schedule and start your transformation.
          </p>
        </div>

        <BookingCalendar />
      </div>
    </div>
  )
}
