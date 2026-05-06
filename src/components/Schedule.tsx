"use client";

import { useState, useEffect } from "react";

interface ClassItem {
  _id: string;
  name: string;
  type: string;
  instructor: string;
  day: string;
  time: string;
  level: string;
  capacity: number;
  creditsRequired: number;
}

type DisciplineKey = "muay_thai" | "aerial" | "yoga" | "conditioning";

const DISCIPLINE_CONFIG: Record<string, { color: string; borderColor: string; textColor: string; label: string; abbr: string; dotColor: string }> = {
  "muay-thai":    { color: "bg-neonGreen/10",  borderColor: "border-neonGreen/30",  textColor: "text-neonGreen",  label: "Muay Thai",    abbr: "MT", dotColor: "bg-neonGreen" },
  "muay_thai":    { color: "bg-neonGreen/10",  borderColor: "border-neonGreen/30",  textColor: "text-neonGreen",  label: "Muay Thai",    abbr: "MT", dotColor: "bg-neonGreen" },
  "aerial":       { color: "bg-neonPink/10",   borderColor: "border-neonPink/30",   textColor: "text-neonPink",   label: "Aerial Arts",  abbr: "AA", dotColor: "bg-neonPink" },
  "yoga":         { color: "bg-purple-500/10", borderColor: "border-purple-500/30", textColor: "text-purple-400", label: "Yoga",         abbr: "YG", dotColor: "bg-purple-400" },
  "conditioning": { color: "bg-orange-500/10", borderColor: "border-orange-500/30", textColor: "text-orange-400", label: "Conditioning", abbr: "CD", dotColor: "bg-orange-400" },
};

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_ABBR: Record<string, string> = {
  Monday: "MON", Tuesday: "TUE", Wednesday: "WED", Thursday: "THU",
  Friday: "FRI", Saturday: "SAT", Sunday: "SUN",
};

export function Schedule() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);

  useEffect(() => {
    // view=all → returns every active class regardless of current time/day
    // so the home page always shows the full weekly schedule as configured
    fetch("/api/classes?view=all")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setClasses(data);
      })
      .catch(() => {})
      .finally(() => setLoadingClasses(false));
  }, []);

  const handleClassClick = (day: string, time: string) => {
    const user = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (!user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("redirectAfterLogin", "/app/schedule");
        localStorage.setItem("selectedClass", JSON.stringify({ day, time }));
      }
      window.dispatchEvent(new CustomEvent("openAuthModal"));
    } else {
      if (typeof window !== "undefined") {
        window.location.href = `/app/schedule?day=${encodeURIComponent(day)}&time=${encodeURIComponent(time)}`;
      }
    }
  };

  // Group classes by day, then by discipline within each day
  const scheduleByDay = DAY_ORDER.map((day) => {
    const dayClasses = classes.filter((c) => c.day === day);
    // Group by discipline
    const byDiscipline: Record<string, ClassItem[]> = {};
    dayClasses.forEach((c) => {
      const key = c.type || "muay_thai";
      if (!byDiscipline[key]) byDiscipline[key] = [];
      byDiscipline[key].push(c);
    });
    return { day, abbr: DAY_ABBR[day], byDiscipline, hasClasses: dayClasses.length > 0 };
  }).filter((d) => d.hasClasses);

  // Collect all active discipline types present in the data
  const activeDisciplines = Array.from(new Set(classes.map((c) => c.type))).filter(Boolean);

  return (
    <section id="schedule" className="py-16 md:py-32 px-4 md:px-6 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neonGreen/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="headline-font text-4xl sm:text-6xl md:text-8xl text-white mb-6 fade-in leading-[0.85] tracking-tight">
            WEEKLY SCHEDULE
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            1% better every day just by showing up.
          </p>

          {/* Dynamic Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            {["muay-thai", "muay_thai", "aerial", "yoga", "conditioning"]
              .filter((key, idx, arr) => {
                // De-duplicate muay-thai / muay_thai for legend display
                const isMuay = key === "muay-thai" || key === "muay_thai";
                if (isMuay && arr.findIndex((k) => k === "muay-thai" || k === "muay_thai") !== idx) return false;
                return activeDisciplines.some((d) => {
                  if (isMuay) return d === "muay-thai" || d === "muay_thai";
                  return d === key;
                });
              })
              .map((key) => {
                const cfg = DISCIPLINE_CONFIG[key];
                return (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${cfg.dotColor} rounded`} />
                    <span className="text-white font-medium">{cfg.label}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {loadingClasses ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-neonGreen" />
          </div>
        ) : scheduleByDay.length === 0 ? (
          <div className="text-center py-20 text-white/40 text-lg">No classes scheduled yet.</div>
        ) : (
          <div className="glass-card-intense p-4 md:p-8 cinematic-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {scheduleByDay.map(({ day, abbr, byDiscipline }) => (
                <div key={day} className="space-y-4">
                  {/* Day Header */}
                  <div className="text-center pb-3 border-b border-white/10">
                    <h3 className="headline-font text-white text-2xl md:text-3xl">{abbr}</h3>
                  </div>

                  {/* Disciplines for this day */}
                  <div className="space-y-3">
                    {Object.entries(byDiscipline).map(([discipline, disciplineClasses]) => {
                      const cfg = DISCIPLINE_CONFIG[discipline] || DISCIPLINE_CONFIG["muay_thai"];
                      return (
                        <div key={discipline} className="space-y-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 ${cfg.dotColor} rounded-full`} />
                            <span className={`${cfg.textColor} text-xs font-bold uppercase tracking-wide`}>{cfg.abbr}</span>
                          </div>
                          {disciplineClasses.map((classItem, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleClassClick(classItem.day, classItem.time)}
                              className={`w-full group relative py-3 px-3 rounded-xl transition-all duration-300 cursor-pointer ${cfg.color} border ${cfg.borderColor} hover:scale-105`}
                              style={{ '--hover-bg': cfg.color } as React.CSSProperties}
                            >
                              <div className="text-center">
                                <div className={`${cfg.textColor} text-sm font-bold mb-1`}>
                                  {classItem.time}
                                </div>
                                <div className="text-white/70 text-xs leading-tight">
                                  {classItem.level || "All Levels"}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              const user = localStorage.getItem("user");
              if (user) {
                window.location.href = "/app/schedule";
              } else {
                window.dispatchEvent(new Event("openAuthModal"));
              }
            }}
            className="btn-luxury-green shadow-2xl cursor-pointer"
          >
            VIEW FULL SCHEDULE & BOOK
          </button>
        </div>
      </div>
    </section>
  );
}

