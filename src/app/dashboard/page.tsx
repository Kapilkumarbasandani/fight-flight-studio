'use client'

import { BookingCalendar } from '@/components/BookingCalendar'
import { DashboardStats } from '@/components/DashboardStats'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-brand-black pt-24">
      <div className="container-custom">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-brand-white/60 hover:text-brand-neon transition-colors mb-8">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        <DashboardStats />
        
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-brand-white mb-8">Browse Classes</h2>
          <BookingCalendar />
        </div>
      </div>
    </div>
  )
}
