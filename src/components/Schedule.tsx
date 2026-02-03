'use client'

import { useState } from 'react'

export function Schedule() {
  const [activeTab, setActiveTab] = useState<'muaythai' | 'aerial'>('muaythai')

  const schedule = {
    muaythai: [
      { day: 'MON', times: ['6:00 AM', '12:00 PM', '6:30 PM'] },
      { day: 'TUE', times: ['6:00 AM', '6:30 PM'] },
      { day: 'WED', times: ['6:00 AM', '12:00 PM', '6:30 PM'] },
      { day: 'THU', times: ['6:00 AM', '6:30 PM'] },
      { day: 'FRI', times: ['6:00 AM', '12:00 PM', '6:30 PM'] },
      { day: 'SAT', times: ['8:00 AM', '10:00 AM'] },
      { day: 'SUN', times: ['9:00 AM'] },
    ],
    aerial: [
      { day: 'MON', times: ['10:00 AM', '7:30 PM'] },
      { day: 'TUE', times: ['10:00 AM', '12:00 PM', '7:30 PM'] },
      { day: 'WED', times: ['10:00 AM', '7:30 PM'] },
      { day: 'THU', times: ['10:00 AM', '12:00 PM', '7:30 PM'] },
      { day: 'FRI', times: ['10:00 AM', '7:30 PM'] },
      { day: 'SAT', times: ['9:00 AM', '11:00 AM', '2:00 PM'] },
      { day: 'SUN', times: ['10:00 AM', '12:00 PM'] },
    ],
  }

  return (
    <section id="schedule" className="section-padding bg-brand-black relative overflow-hidden">
      <div className="absolute top-20 right-10 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-rose/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            STEP INTO YOUR <span className="text-brand-green">POWER</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Classes designed to fit your life. Train when it works for you.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('muaythai')}
            className={`px-8 py-4 rounded-full font-bold uppercase tracking-wide transition-all duration-300 ${
              activeTab === 'muaythai'
                ? 'bg-brand-green text-white shadow-lg scale-105'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Muay Thai
          </button>
          <button
            onClick={() => setActiveTab('aerial')}
            className={`px-8 py-4 rounded-full font-bold uppercase tracking-wide transition-all duration-300 ${
              activeTab === 'aerial'
                ? 'bg-brand-rose text-white shadow-lg scale-105'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Aerial Arts
          </button>
        </div>

        {/* Schedule Grid */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-7 gap-4">
            {schedule[activeTab].map((daySchedule, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <div className={`text-center font-bold text-lg mb-4 ${
                  activeTab === 'muaythai' ? 'text-brand-green' : 'text-brand-rose'
                }`}>
                  {daySchedule.day}
                </div>
                <div className="space-y-2">
                  {daySchedule.times.map((time, idx) => (
                    <div
                      key={idx}
                      className="text-white/80 text-sm text-center py-2 bg-white/5 rounded-lg"
                    >
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
