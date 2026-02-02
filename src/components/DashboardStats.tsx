'use client'

import { mockUser, mockBookingHistory } from '@/lib/mockData'
import Link from 'next/link'
import { CreditCard, Clock, Calendar, TrendingUp } from 'lucide-react'

export function DashboardStats() {
  const upcomingClasses = mockBookingHistory.filter(
    (booking) => new Date(booking.date) > new Date()
  )

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-12">
        <h1 className="heading-md mb-2">
          Welcome Back, <span className="text-brand-neon">{mockUser.name}</span>
        </h1>
        <p className="text-brand-white/60">Your stats at a glance:</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Credit Balance */}
        <div className="bg-brand-white/5 border border-brand-neon/30 p-6 hover:border-brand-neon transition-colors rounded-[30px_10px_30px_10px] hover:rounded-[10px_30px_10px_30px]">
          <div className="flex items-start justify-between mb-4">
            <CreditCard className="text-brand-neon" size={32} />
            <div className="text-right">
              <div className="text-3xl font-bold text-brand-white">{mockUser.credits}</div>
              <div className="text-sm text-brand-white/60">Credits</div>
            </div>
          </div>
          <div className="text-sm text-brand-white/70 mb-3">
            💳 Credits Available: {mockUser.credits}
          </div>
          {mockUser.creditsExpiring.length > 0 && (
            <div className="text-sm text-brand-pink flex items-center gap-1 mb-4">
              <Clock size={14} />
              <span>
                {mockUser.creditsExpiring[0].amount} expiring{' '}
                {new Date(mockUser.creditsExpiring[0].date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
          <Link
            href="/pricing"
            className="text-brand-neon text-sm font-semibold hover:underline"
          >
            Buy More Credits →
          </Link>
        </div>

        {/* Upcoming Classes */}
        <div className="bg-brand-white/5 border border-brand-pink/30 p-6 hover:border-brand-pink transition-colors rounded-[30px_10px_30px_10px] hover:rounded-[10px_30px_10px_30px]">
          <div className="flex items-start justify-between mb-4">
            <Calendar className="text-brand-pink" size={32} />
            <div className="text-right">
              <div className="text-3xl font-bold text-brand-white">{upcomingClasses.length}</div>
              <div className="text-sm text-brand-white/60">Upcoming</div>
            </div>
          </div>
          <div className="text-sm text-brand-white/70 mb-4">
            Classes booked this week
          </div>
          <Link
            href="/dashboard#upcoming"
            className="text-brand-pink text-sm font-semibold hover:underline"
          >
            View Schedule →
          </Link>
        </div>

        {/* Total Classes */}
        <div className="bg-brand-white/5 border border-brand-white/20 p-6 hover:border-brand-white/40 transition-colors rounded-[30px_10px_30px_10px] hover:rounded-[10px_30px_10px_30px]">
          <div className="flex items-start justify-between mb-4">
            <TrendingUp className="text-brand-white" size={32} />
            <div className="text-right">
              <div className="text-3xl font-bold text-brand-white">{mockBookingHistory.length}</div>
              <div className="text-sm text-brand-white/60">Total</div>
            </div>
          </div>
          <div className="text-sm text-brand-white/70 mb-4">
            Classes completed
          </div>
          <Link
            href="/dashboard#history"
            className="text-brand-white text-sm font-semibold hover:underline"
          >
            View History →
          </Link>
        </div>

        {/* Quick Action */}
        <div className="bg-gradient-to-br from-brand-neon/10 to-brand-pink/10 border border-brand-neon/30 p-6 flex flex-col justify-between rounded-[30px_10px_30px_10px] hover:rounded-[10px_30px_10px_30px] transition-all">
          <div>
            <h3 className="text-xl font-bold text-brand-white mb-2">Ready to train?</h3>
            <p className="text-sm text-brand-white/70 mb-4">
              Book your next class and keep the momentum going.
            </p>
          </div>
          <Link
            href="/book"
            className="btn-primary w-full text-center text-sm py-3"
          >
            Book a Class
          </Link>
        </div>
      </div>

      {/* Upcoming Classes List */}
      <div id="upcoming" className="mb-12">
        <h2 className="text-2xl font-bold text-brand-white mb-6 flex items-center gap-2">
          <Calendar className="text-brand-neon" size={24} />
          This Week
        </h2>
        {upcomingClasses.length > 0 ? (
          <div className="space-y-4">
            {upcomingClasses.map((booking) => (
              <div
                key={booking.id}
                className="bg-brand-white/5 border border-brand-white/10 p-6 hover:border-brand-neon/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-brand-white mb-1">
                      {booking.classTitle}
                    </h3>
                    <p className="text-brand-white/60">
                      {new Date(booking.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      • {booking.time} • {booking.credits} credit{booking.credits > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 border border-brand-white/30 text-brand-white hover:border-brand-pink hover:text-brand-pink transition-colors text-sm">
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-brand-neon text-brand-black font-semibold hover:bg-opacity-90 transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-brand-white/5 border border-brand-white/10 p-8 text-center">
            <p className="text-brand-white/60 mb-4">No upcoming classes booked.</p>
            <Link href="/book" className="btn-primary inline-block">
              Browse Classes
            </Link>
          </div>
        )}
      </div>

      {/* Booking History */}
      <div id="history">
        <h2 className="text-2xl font-bold text-brand-white mb-6">Recent Activity</h2>
        <div className="space-y-3">
          {mockBookingHistory.map((booking) => (
            <div
              key={booking.id}
              className="bg-brand-white/5 border border-brand-white/10 p-4 flex items-center justify-between hover:border-brand-white/20 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-neon/20 flex items-center justify-center">
                  <span className="text-brand-neon text-xl">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-white">{booking.classTitle}</h4>
                  <p className="text-sm text-brand-white/60">
                    {new Date(booking.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="text-brand-white/60 text-sm">
                {booking.credits} credit{booking.credits > 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button className="text-brand-neon hover:underline text-sm font-semibold">
            See Full History →
          </button>
        </div>
      </div>
    </div>
  )
}
