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

        {/* Compact Weekly Grid */}
        <div className="glass-card-intense p-6 md:p-8 overflow-x-auto cinematic-shadow">
          <div className="min-w-[900px]">
            {/* Header Row */}
            <div className="grid grid-cols-8 gap-2 mb-4 pb-4 border-b border-white/10">
              <div className="text-center">
                <span className="text-white/40 text-xs uppercase tracking-wider font-bold">Time</span>
              </div>
              {schedule.map((day) => (
                <div key={day.day} className="text-center">
                  <span className="headline-font text-white text-base md:text-lg">{day.day}</span>
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-2">
              {/* Generate all unique time slots */}
              {Array.from(
                new Set(
                  schedule.flatMap((day) => day.classes.map((c) => c.time))
                )
              )
                .sort((a, b) => {
                  const timeA = new Date(`2000-01-01 ${a}`);
                  const timeB = new Date(`2000-01-01 ${b}`);
                  return timeA.getTime() - timeB.getTime();
                })
                .map((timeSlot) => (
                  <div key={timeSlot} className="grid grid-cols-8 gap-2 items-start">
                    {/* Time Label */}
                    <div className="flex items-center justify-center py-3">
                      <span className="text-white/60 text-xs font-medium">{timeSlot}</span>
                    </div>

                    {/* Day Columns */}
                    {schedule.map((day) => {
                      const classInSlot = day.classes.find((c) => c.time === timeSlot);
                      
                      if (!classInSlot) {
                        return <div key={day.day} className="py-3" />;
                      }

                      const isSelected =
                        selectedClass?.day === day.day && selectedClass?.time === timeSlot;

                      return (
                        <button
                          key={day.day}
                          onClick={() => handleClassClick(day.day, timeSlot)}
                          className={`
                            group relative py-3 px-2 rounded-2xl transition-all duration-300 cursor-pointer
                            ${
                              classInSlot.type === "muayThai"
                                ? "bg-neonGreen/10 border border-neonGreen/30 hover:bg-neonGreen/20 hover:border-neonGreen/50"
                                : "bg-neonPink/10 border border-neonPink/30 hover:bg-neonPink/20 hover:border-neonPink/50"
                            }
                            ${isSelected ? "ring-2 ring-white/50 scale-105" : ""}
                          `}
                        >
                          <div className="text-center">
                            <div
                              className={`
                                text-xs font-bold mb-0.5
                                ${classInSlot.type === "muayThai" ? "text-neonGreen" : "text-neonPink"}
                              `}
                            >
                              {classInSlot.type === "muayThai" ? "MT" : "AA"}
                            </div>
                            <div className="text-white/70 text-[10px] leading-tight">
                              {classInSlot.level}
                            </div>
                          </div>

                          {/* Hover Glow Effect */}
                          <div
                            className={`
                              absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl
                              ${
                                classInSlot.type === "muayThai"
                                  ? "bg-neonGreen/20"
                                  : "bg-neonPink/20"
                              }
                            `}
                          />
                        </button>
                      );
                    })}
                  </div>
                ))}
            </div>
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