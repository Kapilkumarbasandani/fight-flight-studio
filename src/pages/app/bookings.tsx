import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Calendar, Clock, User, X, Check, RefreshCw, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";

export default function BookingsPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [canceling, setCanceling] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");
  const [loading, setLoading] = useState(true);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]);

  // Fetch bookings
  useEffect(() => {
    fetchBookings();
  }, [activeTab]);

  const fetchBookings = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id;

      if (!userId) {
        console.error('No user ID found');
        setLoading(false);
        return;
      }

      if (activeTab === 'upcoming') {
        const response = await fetch(`/api/bookings?userId=${userId}&type=upcoming`);
        const data = await response.json();
        setUpcomingBookings(data);
      } else {
        const response = await fetch(`/api/bookings?userId=${userId}&type=past`);
        const data = await response.json();
        setPastBookings(data);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setLoading(false);
    }
  };

  const handleCancelClick = (booking: any) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleRescheduleClick = (booking: any) => {
    setSelectedBooking(booking);
    
    // Check if booking is >=2 days away
    if (booking.daysUntil < 2) {
      alert("Rescheduling is only allowed at least 2 days before the class start time.");
      return;
    }
    
    setShowRescheduleModal(true);
  };

  const confirmCancel = async () => {
    setCanceling(true);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id;

      const response = await fetch('/api/bookings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          userId
        })
      });

      if (response.ok) {
        // Refresh bookings list
        await fetchBookings();
        setCanceling(false);
        setShowCancelModal(false);
        setSelectedBooking(null);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to cancel booking');
        setCanceling(false);
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      alert('Failed to cancel booking');
      setCanceling(false);
    }
  };

  const confirmReschedule = () => {
    setRescheduling(true);
    
    // Simulate API call: POST /api/bookings/[id]/reschedule
    // TODO: Implement reschedule endpoint
    setTimeout(() => {
      setRescheduling(false);
      setShowRescheduleModal(false);
      setSelectedBooking(null);
      alert('Reschedule feature coming soon!');
    }, 1000);
  };

  return (
    <>
      <SEO title="My Bookings - Fight&Flight" description="Manage your class bookings" />
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              My <span className="text-neonGreen">Bookings</span>
            </h1>
            <p className="text-white/60 text-lg">Manage your upcoming and past classes</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-white/10">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`pb-4 px-6 font-bold transition-all duration-300 relative ${
                activeTab === "upcoming"
                  ? "text-neonGreen"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              Upcoming
              {activeTab === "upcoming" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neonGreen" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-4 px-6 font-bold transition-all duration-300 relative ${
                activeTab === "history"
                  ? "text-neonGreen"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              History
              {activeTab === "history" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neonGreen" />
              )}
            </button>
          </div>

          {/* Upcoming Classes */}
          {activeTab === "upcoming" && (
            <div className="glass-card p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-6">Upcoming Classes</h2>
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 hover:border-neonGreen/50 transition-all duration-300 flex-wrap gap-4"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                      <div className={`w-2 h-16 rounded-full ${booking.type === "muay-thai" ? "bg-neonGreen" : "bg-neonPink"}`} />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-white">{booking.name}</h3>
                          {booking.status === "waitlist" ? (
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full">
                              WAITLIST
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-neonGreen/20 text-neonGreen text-xs font-bold rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              CONFIRMED
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </span>
                          <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {booking.instructor}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRescheduleClick(booking)}
                        className="p-3 hover:bg-neonGreen/10 text-neonGreen rounded-lg transition-all duration-300 group"
                        title={booking.daysUntil < 2 ? "Reschedule only allowed ≥2 days before class" : "Reschedule class"}
                      >
                        <RefreshCw className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                      <button
                        onClick={() => handleCancelClick(booking)}
                        className="p-3 hover:bg-red-500/10 text-red-400 rounded-lg transition-all duration-300 group"
                      >
                        <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {activeTab === "history" && (
            <div className="glass-card p-8 border border-white/10">
              <h2 className="text-2xl font-black text-white mb-6">Past Classes</h2>
              <div className="space-y-4">
                {pastBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-6 bg-white/5 rounded-lg border border-white/10 opacity-75"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-2 h-16 rounded-full ${booking.type === "muay-thai" ? "bg-neonGreen" : "bg-neonPink"} opacity-50`} />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-white/80">{booking.name}</h3>
                          {booking.attended ? (
                            <span className="px-3 py-1 bg-neonGreen/20 text-neonGreen text-xs font-bold rounded-full">
                              ATTENDED
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-full">
                              NO-SHOW
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </span>
                          <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {booking.instructor}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card border border-white/20 max-w-md w-full p-8 relative animate-scale-in">
              <button 
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Cancel Booking?</h3>
                <p className="text-white/60">Are you sure you want to cancel this class?</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Class</span>
                  <span className="text-white font-bold">{selectedBooking.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Time</span>
                  <span className="text-white font-bold">{selectedBooking.date}, {selectedBooking.time}</span>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-bold mb-1">No Refunds Policy</p>
                    <p className="text-white/60 text-sm">Credits will not be refunded upon cancellation. This action cannot be undone.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedBooking(null);
                  }}
                  disabled={canceling}
                  className="flex-1 px-6 py-3 glass-card border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-all duration-300 disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  onClick={confirmCancel}
                  disabled={canceling}
                  className="flex-1 px-6 py-3 bg-red-500/20 text-red-400 font-bold rounded-lg hover:bg-red-500/30 transition-all duration-300 disabled:opacity-50"
                >
                  {canceling ? "Canceling..." : "Cancel Class"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reschedule Modal */}
        {showRescheduleModal && selectedBooking && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card border border-white/20 max-w-md w-full p-8 relative animate-scale-in">
              <button 
                onClick={() => {
                  setShowRescheduleModal(false);
                  setSelectedBooking(null);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-neonGreen/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-neonGreen" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Reschedule Class</h3>
                <p className="text-white/60">Choose a new date and time for your class</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Current Class</span>
                  <span className="text-white font-bold">{selectedBooking.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Current Time</span>
                  <span className="text-white font-bold">{selectedBooking.date}, {selectedBooking.time}</span>
                </div>
              </div>

              <div className="bg-neonGreen/10 border border-neonGreen/30 rounded-lg p-4 mb-6">
                <p className="text-white/60 text-sm text-center">
                  This would redirect to the schedule page to select a new time slot.
                  <br />
                  <span className="text-neonGreen font-bold">Feature ready for backend integration.</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedBooking(null);
                  }}
                  disabled={rescheduling}
                  className="flex-1 px-6 py-3 glass-card border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-all duration-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReschedule}
                  disabled={rescheduling}
                  className="flex-1 px-6 py-3 bg-neonGreen text-black font-bold rounded-lg hover:bg-neonGreen/90 transition-all duration-300 disabled:opacity-50"
                >
                  {rescheduling ? "Processing..." : "Choose New Time"}
                </button>
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}