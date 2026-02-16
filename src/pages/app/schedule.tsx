import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Calendar, Clock, User, MapPin, Filter, ChevronLeft, ChevronRight, X, AlertCircle, CreditCard, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { ClassResponse } from "@/models/Class";

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id;

      // Fetch classes
      const classesRes = await fetch('/api/classes');
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setClasses(classesData);
      }

      // Fetch user credits and forms status
      if (userId) {
        const creditsRes = await fetch(`/api/credits?userId=${userId}`);
        const formsRes = await fetch(`/api/forms/submissions?userId=${userId}`);
        
        if (creditsRes.ok && formsRes.ok) {
          const creditsData = await creditsRes.json();
          const formsData = await formsRes.json();
          
          setUserData({
            credits: creditsData.balance || 0,
            formsCompleted: formsData.allRequiredCompleted || false,
            id: userId
          });
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdated(new Date());
    }
  };

  // Group classes by day
  const schedule = days.reduce((acc, day) => {
    acc[day] = classes.filter(cls => cls.day === day);
    return acc;
  }, {} as Record<string, ClassResponse[]>);

  const getClassColor = (type: string) => {
    switch(type) {
      case "muay-thai": return { bg: "bg-neonGreen", text: "text-neonGreen", border: "border-neonGreen" };
      case "aerial": return { bg: "bg-neonPink", text: "text-neonPink", border: "border-neonPink" };
      case "yoga": return { bg: "bg-purple-400", text: "text-purple-400", border: "border-purple-400" };
      case "conditioning": return { bg: "bg-white", text: "text-white", border: "border-white" };
      default: return { bg: "bg-neonGreen", text: "text-neonGreen", border: "border-neonGreen" };
    }
  };

  const canBookClass = (classItem: ClassResponse) => {
    if (!userData) return { allowed: false, reason: "loading" };
    
    const spotsLeft = classItem.capacity - (classItem.bookedCount || 0);
    
    // Check if forms completed
    if (!userData.formsCompleted) {
      return { allowed: false, reason: "forms" };
    }
    
    // Check if class is full
    if (spotsLeft === 0) {
      return { allowed: false, reason: "full" };
    }
    
    // Check if user has enough credits
    if (userData.credits < classItem.creditsRequired) {
      return { allowed: false, reason: "credits" };
    }
    
    return { allowed: true, reason: null };
  };

  const handleBookClick = (classItem: ClassResponse) => {
    const bookingCheck = canBookClass(classItem);
    
    if (!bookingCheck.allowed) {
      setBookingError(bookingCheck.reason || "");
      setSelectedClass(classItem);
      setShowBookingModal(true);
      return;
    }
    
    setSelectedClass(classItem);
    setBookingError("");
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    try {
      // Calculate the next occurrence of this class day
      const getNextClassDate = (dayName: string, time: string) => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const targetDayIndex = daysOfWeek.indexOf(dayName);
        const now = new Date();
        const currentDayIndex = now.getDay();
        
        // Calculate days until next occurrence
        let daysUntil = targetDayIndex - currentDayIndex;
        
        // If it's today, check if the time has passed
        if (daysUntil === 0) {
          const [timeStr, period] = time.split(' ');
          const [hours, minutes] = timeStr.split(':').map(Number);
          let classHour = hours;
          
          if (period === 'PM' && hours !== 12) {
            classHour += 12;
          } else if (period === 'AM' && hours === 12) {
            classHour = 0;
          }
          
          const classTime = new Date(now);
          classTime.setHours(classHour, minutes, 0, 0);
          
          // If time has passed, book for next week
          if (now > classTime) {
            daysUntil = 7;
          }
        } else if (daysUntil < 0) {
          // Day already passed this week, go to next week
          daysUntil += 7;
        }
        
        const nextDate = new Date(now);
        nextDate.setDate(now.getDate() + daysUntil);
        
        return nextDate.toISOString().split('T')[0];
      };

      const bookingDate = getNextClassDate(selectedClass.day, selectedClass.time);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userData.id,
          classId: selectedClass._id,
          className: selectedClass.name,
          classType: selectedClass.type,
          instructor: selectedClass.instructor,
          date: bookingDate,
          time: selectedClass.time,
          creditsUsed: selectedClass.creditsRequired
        })
      });

      if (response.ok) {
        setBookingSuccess(true);
        
        // Refresh data
        await fetchData();
        
        // Reset after animation
        setTimeout(() => {
          setShowBookingModal(false);
          setBookingSuccess(false);
          setSelectedClass(null);
        }, 2000);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to book class');
      }
    } catch (error) {
      console.error('Error booking class:', error);
      alert('Failed to book class');
    }
  };

  return (
    <>
      <SEO title="Schedule - Fight&Flight" description="View and book classes" />
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                Class <span className="text-neonGreen">Schedule</span>
              </h1>
              <p className="text-white/60 text-lg">Book your next session</p>
              {lastUpdated && (
                <p className="text-white/40 text-xs mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => fetchData()}
                disabled={refreshing}
                className="flex items-center gap-2 px-6 py-3 glass-card border border-white/10 hover:border-neonGreen/50 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50"
                title="Refresh schedule"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 glass-card border border-white/10 hover:border-neonGreen/50 text-white font-bold rounded-lg transition-all duration-300">
                <Filter className="w-5 h-5" />
                <span className="hidden md:inline">Filter</span>
              </button>
            </div>
          </div>

          {/* Credits Warning */}
          {userData && userData.credits <= 2 && (
            <div className="glass-card p-4 border border-yellow-500/30 bg-yellow-500/10">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <div className="flex-1">
                  <p className="text-yellow-400 font-bold">Low Credits</p>
                  <p className="text-white/60 text-sm">You have {userData.credits} credits remaining</p>
                </div>
                <Link href="/app/credits" className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg font-bold hover:bg-yellow-500/30 transition-all duration-300">
                  Buy More
                </Link>
              </div>
            </div>
          )}

          <div className="glass-card p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 hover:bg-white/5 rounded-lg transition-all duration-300">
                <ChevronLeft className="w-6 h-6 text-white/60" />
              </button>
              <h2 className="text-2xl font-black text-white">Week of Jan 20, 2026</h2>
              <button className="p-2 hover:bg-white/5 rounded-lg transition-all duration-300">
                <ChevronRight className="w-6 h-6 text-white/60" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-6">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`p-3 rounded-lg font-bold text-sm transition-all duration-300 ${
                    selectedDay === day
                      ? "bg-neonGreen text-black"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12 text-white/60">Loading classes...</div>
              ) : schedule[selectedDay]?.length === 0 ? (
                <div className="text-center py-12 text-white/60">No classes scheduled for {selectedDay}</div>
              ) : (
                schedule[selectedDay]?.map((classItem, index) => {
                  const colors = getClassColor(classItem.type);
                  const spotsLeft = classItem.capacity - (classItem.bookedCount || 0);
                  const almostFull = spotsLeft <= 3 && spotsLeft > 0;
                  const isFull = spotsLeft === 0;
                  const bookingCheck = canBookClass(classItem);
                
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-neonGreen/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-6 flex-1">
                        <div className={`w-1 h-16 rounded-full ${colors.bg}`} />
                      
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-xl font-black text-white">{classItem.name}</h3>
                          
                            <span className={`px-2 py-1 ${colors.bg}/20 ${colors.text} text-xs font-bold rounded`}>
                              {classItem.creditsRequired} {classItem.creditsRequired === 1 ? 'CREDIT' : 'CREDITS'}
                            </span>
                          
                          {almostFull && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded">
                              ALMOST FULL
                            </span>
                          )}
                          
                          {isFull && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded">
                              FULL
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {classItem.time}
                          </span>
                          <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {classItem.instructor}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {spotsLeft} spots left
                          </span>
                        </div>
                      </div>
                    </div>

                    {isFull ? (
                      <button disabled className="px-6 py-3 bg-white/5 text-white/40 rounded-lg font-bold cursor-not-allowed whitespace-nowrap">
                        Full
                      </button>
                    ) : !bookingCheck.allowed && bookingCheck.reason === "forms" ? (
                      <Link href="/app/forms" className="px-6 py-3 bg-red-500/10 text-red-400 rounded-lg font-bold hover:bg-red-500/20 transition-all duration-300 whitespace-nowrap">
                        Complete Forms
                      </Link>
                    ) : !bookingCheck.allowed && bookingCheck.reason === "credits" ? (
                      <Link href="/app/credits" className="px-6 py-3 bg-yellow-500/10 text-yellow-400 rounded-lg font-bold hover:bg-yellow-500/20 transition-all duration-300 whitespace-nowrap">
                        Buy Credits
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleBookClick(classItem)}
                        className="px-6 py-3 bg-neonGreen/10 text-neonGreen rounded-lg font-bold hover:bg-neonGreen hover:text-black transition-all duration-300 whitespace-nowrap"
                      >
                        Book Class
                      </button>
                    )}
                  </div>
                );
              })
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-neonGreen rounded-full" />
                <h3 className="text-lg font-black text-white">Muay Thai</h3>
              </div>
              <p className="text-white/60 text-sm">High-intensity martial arts training</p>
            </div>

            <div className="glass-card p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-neonPink rounded-full" />
                <h3 className="text-lg font-black text-white">Aerial</h3>
              </div>
              <p className="text-white/60 text-sm">Graceful aerial arts (2 credits)</p>
            </div>

            <div className="glass-card p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full" />
                <h3 className="text-lg font-black text-white">Yoga</h3>
              </div>
              <p className="text-white/60 text-sm">Mind-body flow and flexibility</p>
            </div>

            <div className="glass-card p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-white rounded-full" />
                <h3 className="text-lg font-black text-white">Conditioning</h3>
              </div>
              <p className="text-white/60 text-sm">Strength and endurance training</p>
            </div>
          </div>
        </div>

        {/* Booking Confirmation Modal */}
        {showBookingModal && selectedClass && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card border border-white/20 max-w-md w-full p-8 relative animate-scale-in">
              <button 
                onClick={() => {
                  setShowBookingModal(false);
                  setBookingSuccess(false);
                  setSelectedClass(null);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>

              {bookingSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-neonGreen/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <div className="w-10 h-10 bg-neonGreen rounded-full" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-2">Booking Confirmed!</h3>
                  <p className="text-white/60">See you in class</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-white mb-6">Confirm Booking</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-white/60">Class</span>
                      <span className="text-white font-bold">{selectedClass.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Time</span>
                      <span className="text-white font-bold">{selectedClass.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Instructor</span>
                      <span className="text-white font-bold">{selectedClass.instructor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Credits</span>
                      <span className="text-neonGreen font-bold">{selectedClass.credits} credit{selectedClass.credits > 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-bold mb-1">No Refunds Policy</p>
                        <p className="text-white/60 text-sm">Cancellations do not result in credit refunds. Please ensure you can attend before booking.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowBookingModal(false);
                        setSelectedClass(null);
                      }}
                      className="flex-1 px-6 py-3 glass-card border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmBooking}
                      className="flex-1 px-6 py-3 bg-neonGreen text-black font-bold rounded-lg hover:bg-neonGreen/90 transition-all duration-300"
                    >
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}