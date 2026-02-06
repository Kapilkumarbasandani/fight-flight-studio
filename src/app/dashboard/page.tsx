'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Award, TrendingUp, Target, BookOpen, LogOut } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  whatsapp: string;
  createdAt: string;
}

interface Booking {
  _id: string;
  classTitle: string;
  discipline: 'muay-thai' | 'aerial';
  date: string;
  time: string;
  duration: number;
  instructor: string;
  credits: number;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }

    const userData = JSON.parse(userStr);
    setUser(userData);

    // Fetch user's bookings
    fetchBookings(userData._id);
  }, [router]);

  const fetchBookings = async (userId: string) => {
    try {
      const response = await fetch(`/fight-flight-studio/api/bookings?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FFF5E6] to-[#FFE4C4] flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const completedClasses = bookings.filter(b => b.status === 'completed').length;
  const upcomingClasses = bookings.filter(b => b.status === 'booked').length;
  const muayThaiClasses = bookings.filter(b => b.discipline === 'muay-thai').length;
  const aerialClasses = bookings.filter(b => b.discipline === 'aerial').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24">
      <div className="container-custom">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Welcome back, <span className="text-brand-green">{user.name.split(' ')[0]}</span>! 👋
            </h1>
            <p className="text-gray-700 text-lg">Track your journey to becoming a superhero</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {bookings.length === 0 ? (
          /* First Time User - No Bookings */
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-12 shadow-2xl">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-green to-brand-neon rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen size={48} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-gray-300 text-lg mb-8">
                Book your first class and begin your transformation. Choose between the power of Muay Thai or the grace of Aerial Dance.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-green to-brand-neon text-white font-bold rounded-xl hover:shadow-lg hover:shadow-brand-green/50 transition-all duration-300 transform hover:scale-105"
              >
                <Calendar size={24} />
                Book Your First Class
              </Link>
            </div>
          </div>
        ) : (
          /* User with Bookings - Show Progress */
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center">
                    <Award className="text-brand-green" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{completedClasses}</div>
                <div className="text-gray-300 text-sm">Classes Completed</div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-pink/20 rounded-xl flex items-center justify-center">
                    <Calendar className="text-brand-pink" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{upcomingClasses}</div>
                <div className="text-gray-300 text-sm">Upcoming Classes</div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center">
                    <Target className="text-brand-green" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{muayThaiClasses}</div>
                <div className="text-gray-300 text-sm">Muay Thai Sessions</div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-brand-pink/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-brand-pink" size={24} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{aerialClasses}</div>
                <div className="text-gray-300 text-sm">Aerial Sessions</div>
              </div>
            </div>

            {/* Book More Classes CTA */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Continue Your Journey</h3>
                  <p className="text-gray-300">Book more classes and level up your skills!</p>
                </div>
                <Link
                  href="/book"
                  className="px-8 py-4 bg-gradient-to-r from-brand-green to-brand-neon text-white font-bold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
                >
                  Book Another Class
                </Link>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="text-brand-green" />
                Your Classes
              </h3>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className={`p-6 rounded-xl border-2 ${
                      booking.discipline === 'muay-thai'
                        ? 'border-brand-green/30 bg-brand-green/5'
                        : 'border-brand-pink/30 bg-brand-pink/5'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-white">{booking.classTitle}</h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              booking.status === 'completed'
                                ? 'bg-green-500/20 text-green-300'
                                : booking.status === 'booked'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-gray-500/20 text-gray-300'
                            }`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-gray-300">
                          <div>
                            <span className="text-gray-400 text-sm">Date:</span>{' '}
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Time:</span> {booking.time}
                          </div>
                          <div>
                            <span className="text-gray-400 text-sm">Instructor:</span> {booking.instructor}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`text-2xl ${
                          booking.discipline === 'muay-thai' ? 'text-brand-green' : 'text-brand-pink'
                        }`}
                      >
                        {booking.discipline === 'muay-thai' ? '🥊' : '✨'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
