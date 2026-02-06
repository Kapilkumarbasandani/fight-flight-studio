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
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="text-brand-green" size={20} />
          <h3 className="text-lg font-bold text-white">Filter Classes</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Discipline */}
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Discipline</label>
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value as any)}
              className="w-full bg-white border border-white/30 text-gray-900 rounded-lg px-4 py-2 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            >
              <option value="all">All Classes</option>
              <option value="muay-thai">Muay Thai</option>
              <option value="aerial">Aerial Dance</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Level</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="w-full bg-white border border-white/30 text-gray-900 rounded-lg px-4 py-2 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner Friendly</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Instructor */}
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-medium">Instructor</label>
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value as any)}
              className="w-full bg-white border border-white/30 text-gray-900 rounded-lg px-4 py-2 focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
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
            className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 hover:scale-[1.02]"
            onClick={() => setSelectedClass(classItem)}
          >
            {/* Gradient Background with Border */}
            <div className={`absolute inset-0 ${
              classItem.discipline === 'muay-thai'
                ? 'bg-gradient-to-br from-brand-green/20 via-transparent to-brand-green/5'
                : 'bg-gradient-to-br from-brand-pink/20 via-transparent to-brand-pink/5'
            }`} />
            
            {/* Border Glow Effect */}
            <div className={`absolute inset-0 rounded-3xl border-2 transition-all duration-300 ${
              classItem.discipline === 'muay-thai'
                ? 'border-brand-green/30 group-hover:border-brand-green group-hover:shadow-lg group-hover:shadow-brand-green/20'
                : 'border-brand-pink/30 group-hover:border-brand-pink group-hover:shadow-lg group-hover:shadow-brand-pink/20'
            }`} />

            {/* Content */}
            <div className="relative bg-white/5 backdrop-blur-xl p-6 h-full flex flex-col">
              {/* Header with Icon and Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 ${
                  classItem.discipline === 'muay-thai'
                    ? 'bg-brand-green/20'
                    : 'bg-brand-pink/20'
                }`}>
                  {classItem.discipline === 'muay-thai' ? '🥊' : '✨'}
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  classItem.discipline === 'muay-thai'
                    ? 'bg-brand-green/20 text-brand-green border border-brand-green/30'
                    : 'bg-brand-pink/20 text-brand-pink border border-brand-pink/30'
                }`}>
                  {classItem.level}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                {classItem.title}
              </h3>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    classItem.discipline === 'muay-thai'
                      ? 'bg-brand-green/10'
                      : 'bg-brand-pink/10'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-gray-400">Date</div>
                    <div className="font-semibold">
                      {new Date(classItem.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    classItem.discipline === 'muay-thai'
                      ? 'bg-brand-green/10'
                      : 'bg-brand-pink/10'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-gray-400">Time</div>
                    <div className="font-semibold">{classItem.time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    classItem.discipline === 'muay-thai'
                      ? 'bg-brand-green/10'
                      : 'bg-brand-pink/10'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-gray-400">Instructor</div>
                    <div className="font-semibold">{classItem.instructor}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-300">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    classItem.discipline === 'muay-thai'
                      ? 'bg-brand-green/10'
                      : 'bg-brand-pink/10'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <div className="text-xs text-gray-400">Duration</div>
                    <div className="font-semibold">{classItem.duration}min</div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className={`h-px mb-4 ${
                classItem.discipline === 'muay-thai'
                  ? 'bg-gradient-to-r from-transparent via-brand-green/30 to-transparent'
                  : 'bg-gradient-to-r from-transparent via-brand-pink/30 to-transparent'
              }`} />

              {/* Availability */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span className="font-medium">Availability</span>
                  <span className="font-bold text-white">{classItem.spotsAvailable}/{classItem.spotsAvailable + 4} spots</span>
                </div>
                <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`absolute h-full rounded-full transition-all duration-500 ${
                      classItem.discipline === 'muay-thai' 
                        ? 'bg-gradient-to-r from-brand-green to-brand-neon' 
                        : 'bg-gradient-to-r from-brand-pink to-brand-rose'
                    }`}
                    style={{ width: `${(classItem.spotsAvailable / (classItem.spotsAvailable + 4)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Book Button */}
              <button
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 transform group-hover:scale-[1.02] shadow-lg ${
                  classItem.discipline === 'muay-thai'
                    ? 'bg-gradient-to-r from-brand-green to-brand-neon text-white hover:shadow-brand-green/50'
                    : 'bg-gradient-to-r from-brand-pink to-brand-rose text-white hover:shadow-brand-pink/50'
                }`}
              >
                Book This Class
              </button>

              {/* Credits Badge */}
              <div className="mt-3 text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {classItem.credits} credit{classItem.credits > 1 ? 's' : ''}
                </span>
              </div>
            </div>
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
