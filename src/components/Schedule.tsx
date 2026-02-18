"use client";

import { useState } from "react";

interface ClassSlot {
  time: string;
  type: "muayThai" | "aerial";
  level?: string;
}

interface DaySchedule {
  day: string;
  classes: ClassSlot[];
}

export function Schedule() {
  const [selectedClass, setSelectedClass] = useState<{ day: string; time: string } | null>(null);

  const schedule: DaySchedule[] = [
    {
      day: "MON",
      classes: [
        { time: "6:00 AM", type: "muayThai", level: "All Levels" },
        { time: "10:00 AM", type: "aerial", level: "Beginner" },
        { time: "12:00 PM", type: "muayThai", level: "Intermediate" },
        { time: "6:30 PM", type: "muayThai", level: "Advanced" },
        { time: "7:30 PM", type: "aerial", level: "All Levels" },
      ],
    },
    {
      day: "TUE",
      classes: [
        { time: "6:00 AM", type: "muayThai", level: "All Levels" },
        { time: "10:00 AM", type: "aerial", level: "Intermediate" },
        { time: "12:00 PM", type: "aerial", level: "Beginner" },
        { time: "6:30 PM", type: "muayThai", level: "All Levels" },
        { time: "7:30 PM", type: "aerial", level: "Advanced" },
      ],
    },
    {
      day: "WED",
      classes: [
        { time: "6:00 AM", type: "muayThai", level: "All Levels" },
        { time: "10:00 AM", type: "aerial", level: "Beginner" },
        { time: "12:00 PM", type: "muayThai", level: "Intermediate" },
        { time: "6:30 PM", type: "muayThai", level: "Advanced" },
        { time: "7:30 PM", type: "aerial", level: "All Levels" },
      ],
    },
    {
      day: "THU",
      classes: [
        { time: "6:00 AM", type: "muayThai", level: "All Levels" },
        { time: "10:00 AM", type: "aerial", level: "Intermediate" },
        { time: "12:00 PM", type: "aerial", level: "Beginner" },
        { time: "6:30 PM", type: "muayThai", level: "All Levels" },
        { time: "7:30 PM", type: "aerial", level: "Advanced" },
      ],
    },
    {
      day: "FRI",
      classes: [
        { time: "6:00 AM", type: "muayThai", level: "All Levels" },
        { time: "10:00 AM", type: "aerial", level: "Beginner" },
        { time: "12:00 PM", type: "muayThai", level: "Intermediate" },
        { time: "6:30 PM", type: "muayThai", level: "Advanced" },
        { time: "7:30 PM", type: "aerial", level: "All Levels" },
      ],
    },
    {
      day: "SAT",
      classes: [
        { time: "9:00 AM", type: "muayThai", level: "All Levels" },
        { time: "10:00 AM", type: "aerial", level: "Beginner" },
        { time: "11:00 AM", type: "muayThai", level: "Intermediate" },
        { time: "2:00 PM", type: "aerial", level: "Advanced" },
      ],
    },
    {
      day: "SUN",
      classes: [
        { time: "10:00 AM", type: "muayThai", level: "Recovery" },
        { time: "11:00 AM", type: "aerial", level: "Beginner" },
        { time: "3:00 PM", type: "aerial", level: "All Levels" },
      ],
    },
  ];

  // Group classes by day and type
  const scheduleByDay = schedule.map(day => ({
    day: day.day,
    muayThai: day.classes.filter(c => c.type === 'muayThai'),
    aerial: day.classes.filter(c => c.type === 'aerial')
  }));

  const handleClassClick = (day: string, time: string) => {
    setSelectedClass({ day, time });
  };

  return (
    <section id="schedule" className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neonGreen/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="headline-font text-6xl md:text-8xl text-white mb-6 fade-in leading-[0.85] tracking-tight">
            WEEKLY SCHEDULE
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            1% better every day just by showing up.
          </p>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-neonGreen rounded" />
              <span className="text-white font-medium">Muay Thai</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-neonPink rounded" />
              <span className="text-white font-medium">Aerial Arts</span>
            </div>
          </div>
        </div>

        {/* Weekly Grid - Two Columns Per Day */}
        <div className="glass-card-intense p-6 md:p-8 cinematic-shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scheduleByDay.map((daySchedule) => (
              <div key={daySchedule.day} className="space-y-4">
                {/* Day Header */}
                <div className="text-center pb-3 border-b border-white/10">
                  <h3 className="headline-font text-white text-2xl md:text-3xl">{daySchedule.day}</h3>
                </div>

                {/* Two Column Layout for MT and AA */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Muay Thai Column */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-neonGreen rounded-full" />
                      <span className="text-white/60 text-xs font-bold uppercase tracking-wide">MT</span>
                    </div>
                    {daySchedule.muayThai.length === 0 ? (
                      <div className="text-center py-4 px-2 rounded-lg bg-white/5">
                        <span className="text-white/30 text-xs">No classes</span>
                      </div>
                    ) : (
                      daySchedule.muayThai.map((classItem, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleClassClick(daySchedule.day, classItem.time)}
                          className="w-full group relative py-3 px-3 rounded-xl transition-all duration-300 cursor-pointer bg-neonGreen/10 border border-neonGreen/30 hover:bg-neonGreen/20 hover:border-neonGreen/50 hover:scale-105"
                        >
                          <div className="text-center">
                            <div className="text-neonGreen text-sm font-bold mb-1">
                              {classItem.time}
                            </div>
                            <div className="text-white/70 text-xs leading-tight">
                              {classItem.level}
                            </div>
                          </div>
                          {/* Hover Glow */}
                          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg bg-neonGreen/20" />
                        </button>
                      ))
                    )}
                  </div>

                  {/* Aerial Arts Column */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-neonPink rounded-full" />
                      <span className="text-white/60 text-xs font-bold uppercase tracking-wide">AA</span>
                    </div>
                    {daySchedule.aerial.length === 0 ? (
                      <div className="text-center py-4 px-2 rounded-lg bg-white/5">
                        <span className="text-white/30 text-xs">No classes</span>
                      </div>
                    ) : (
                      daySchedule.aerial.map((classItem, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleClassClick(daySchedule.day, classItem.time)}
                          className="w-full group relative py-3 px-3 rounded-xl transition-all duration-300 cursor-pointer bg-neonPink/10 border border-neonPink/30 hover:bg-neonPink/20 hover:border-neonPink/50 hover:scale-105"
                        >
                          <div className="text-center">
                            <div className="text-neonPink text-sm font-bold mb-1">
                              {classItem.time}
                            </div>
                            <div className="text-white/70 text-xs leading-tight">
                              {classItem.level}
                            </div>
                          </div>
                          {/* Hover Glow */}
                          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg bg-neonPink/20" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Class Info */}
        {selectedClass && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="glass-card-intense inline-block px-8 py-4">
              <p className="text-white text-sm">
                Selected: <span className="font-bold">{selectedClass.day}</span> at{" "}
                <span className="font-bold">{selectedClass.time}</span>
              </p>
              <button className="btn-luxury-green mt-3 text-xs px-6 py-2">
                BOOK THIS CLASS
              </button>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <button className="btn-luxury-green shadow-2xl">VIEW FULL SCHEDULE & BOOK</button>
        </div>
      </div>
    </section>
  );
}