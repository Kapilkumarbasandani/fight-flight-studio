'use client'

import { useState } from 'react'
import { mockClasses, mockUser } from '@/lib/mockData'
import { Class } from '@/types'
import { Filter, X } from 'lucide-react'

export function BookingCalendar() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<'all' | 'muay-thai' | 'aerial'>('all')
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [selectedInstructor, setSelectedInstructor] = useState<'all' | 'Shaleena' | 'Tinsley'>('all')
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)

  const filteredClasses = mockClasses.filter((classItem) => {
    if (selectedDiscipline !== 'all' && classItem.discipline !== selectedDiscipline) return false
    if (selectedLevel !== 'all' && classItem.level !== selectedLevel && classItem.level !== 'all-levels') return false
    if (selectedInstructor !== 'all' && classItem.instructor !== selectedInstructor) return false
    return true
  })

  const handleBookClass = (classItem: Class) => {
    if (mockUser.credits >= classItem.credits) {
      alert(`Booking confirmed for ${classItem.title}!\n\nCredits used: ${classItem.credits}\nRemaining balance: ${mockUser.credits - classItem.credits}`)
      setSelectedClass(null)
    } else {
      alert(`Insufficient credits. You need ${classItem.credits} credits but only have ${mockUser.credits}.`)
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="bg-brand-white/5 border border-brand-white/10 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-brand-neon" size={20} />
          <h3 className="text-lg font-bold text-brand-white">Filter Classes</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Discipline */}
          <div>
            <label className="block text-sm text-brand-white/70 mb-2">Discipline</label>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value as any)}
              className="w-full bg-brand-black border border-brand-white/30 text-brand-white px-4 py-2 focus:border-brand-neon focus:outline-none"
            >
              <option value="all">All Classes</option>
              <option value="muay-thai">Muay Thai</option>
              <option value="aerial">Aerial Dance</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm text-brand-white/70 mb-2">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="w-full bg-brand-black border border-brand-white/30 text-brand-white px-4 py-2 focus:border-brand-neon focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner Friendly</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm text-brand-white/70 mb-2">Instructor</label>
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value as any)}
              className="w-full bg-brand-black border border-brand-white/30 text-brand-white px-4 py-2 focus:border-brand-neon focus:outline-none"
            >
              <option value="all">All Instructors</option>
              <option value="Shaleena">Shaleena</option>
              <option value="Tinsley">Tinsley</option>
            </select>
          </div>
        </div>
      </div>

      {/* Class Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <div
            key={classItem.id}
            className={`border-2 p-6 transition-all duration-300 cursor-pointer ${
              classItem.discipline === 'muay-thai'
                ? 'border-brand-neon/30 hover:border-brand-neon bg-brand-neon/5'
                : 'border-brand-pink/30 hover:border-brand-pink bg-brand-pink/5'
            }`}
            onClick={() => setSelectedClass(classItem)}
          >
            {/* Icon */}
            <div className="text-3xl mb-3">
              {classItem.discipline === 'muay-thai' ? '🥊' : '✨'}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-brand-white mb-2">{classItem.title}</h3>

            {/* Details */}
            <div className="space-y-1 text-sm text-brand-white/70 mb-4">
              <p className="flex items-center gap-2">
                <span>📅</span>
                {new Date(classItem.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
                {' • '}
                {classItem.time}
              </p>
              <p className="flex items-center gap-2">
                <span>👤</span>
                {classItem.instructor}
              </p>
              <p className="flex items-center gap-2">
                <span>⏱</span>
                {classItem.duration} minutes
              </p>
              <p className="flex items-center gap-2">
                <span>💳</span>
                {classItem.credits} credit{classItem.credits > 1 ? 's' : ''}
                {classItem.discipline === 'aerial' && (
                  <span className="text-brand-pink text-xs">⚡ Aerial classes use 2 credits</span>
                )}
              </p>
            </div>

            {/* Availability */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-brand-white/60 mb-1">
                <span>Spots available</span>
                <span>{classItem.spotsAvailable}/{classItem.spotsAvailable + 4}</span>
              </div>
              <div className="w-full bg-brand-white/10 h-1">
                <div
                  className={`h-full ${
                    classItem.discipline === 'muay-thai' ? 'bg-brand-neon' : 'bg-brand-pink'
                  }`}
                  style={{ width: `${(classItem.spotsAvailable / (classItem.spotsAvailable + 4)) * 100}%` }}
                />
              </div>
            </div>

            {/* CTA */}
            <button
              className={`w-full py-3 font-bold uppercase tracking-wide transition-all ${
                classItem.discipline === 'muay-thai'
                  ? 'bg-brand-neon text-brand-black hover:bg-opacity-90'
                  : 'bg-brand-pink text-brand-white hover:bg-opacity-90'
              }`}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-brand-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-brand-neon max-w-lg w-full p-8 relative">
            <button
              onClick={() => setSelectedClass(null)}
              className="absolute top-4 right-4 text-brand-white/60 hover:text-brand-white"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-brand-white mb-6">Confirm Booking</h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-brand-white/60 text-sm">You selected:</p>
                <p className="text-xl font-bold text-brand-white">{selectedClass.title}</p>
              </div>

              <div className="border-t border-brand-white/10 pt-4 space-y-2 text-brand-white/70">
                <p>
                  <strong className="text-brand-white">Date:</strong>{' '}
                  {new Date(selectedClass.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>
                  <strong className="text-brand-white">Time:</strong> {selectedClass.time}
                </p>
                <p>
                  <strong className="text-brand-white">Instructor:</strong> {selectedClass.instructor}
                </p>
                <p>
                  <strong className="text-brand-white">Duration:</strong> {selectedClass.duration} minutes
                </p>
              </div>

              <div className="border-t border-brand-white/10 pt-4">
                <p className="text-brand-white/70 mb-2">
                  <strong className="text-brand-white">Credits required:</strong> {selectedClass.credits}
                </p>
                <p className="text-brand-white/70 mb-2">
                  <strong className="text-brand-white">Your balance:</strong> {mockUser.credits} credits
                </p>
                <p className="text-brand-neon font-bold">
                  After booking: {mockUser.credits - selectedClass.credits} credits remaining
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setSelectedClass(null)}
                className="flex-1 py-3 border-2 border-brand-white/30 text-brand-white hover:bg-brand-white hover:text-brand-black transition-all font-bold uppercase"
              >
                Cancel
              </button>
              <button
                onClick={() => handleBookClass(selectedClass)}
                className="flex-1 py-3 bg-brand-neon text-brand-black font-bold uppercase hover:bg-opacity-90 transition-all"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
