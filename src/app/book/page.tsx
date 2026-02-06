'use client'

import { BookingCalendar } from '@/components/BookingCalendar'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24">
      <div className="container-custom">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-300 hover:text-brand-green transition-colors mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="heading-lg mb-4 text-white">
            Book Your <span className="text-brand-green">Fight</span> or{' '}
            <span className="text-brand-pink">Flight</span>
          </h1>
          <p className="text-xl text-gray-300">
            Choose a class that fits your schedule and start your transformation.
          </p>
        </div>

        <BookingCalendar />
      </div>
    </div>
  )
}
