import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Activity, Calendar, Zap, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { UserResponse } from "@/models/User";

export default function DashboardPage() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchDashboardData(userData._id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchDashboardData = async (userId: string) => {
    try {
      // Fetch user stats
      const statsRes = await fetch(`/api/user/stats?userId=${userId}`);
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch upcoming classes from schedule (limit 3 for dashboard)
      const classesRes = await fetch(`/api/classes`);
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        
        // Filter to get upcoming classes (future dates) and limit to 3
        const now = new Date();
        const upcoming = classesData
          .filter((cls: any) => {
            // You can add date filtering logic here if classes have date fields
            return cls.active;
          })
          .slice(0, 3);
        
        setUpcomingClasses(upcoming);
      }

      // Fetch recent activity (limit 3)
      const activityRes = await fetch(`/api/user/activity?userId=${userId}&limit=3`);
      const activityData = await activityRes.json();
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Dashboard - Fight&Flight" description="Your training dashboard" />
      <DashboardLayout>
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-white/60">Loading your dashboard...</div>
          </div>
        ) : (
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              Welcome Back, {user?.name || 'Warrior'}
            </h1>
            <p className="text-white/60 text-lg">Ready to fight and fly?</p>
          </div>

          {/* Expiring Credits Warning */}
          {stats && stats.expiringCredits > 0 && (
            <div className="glass-card rounded-3xl p-4 border border-yellow-500/30 bg-yellow-500/10">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <div className="flex-1">
                  <p className="text-yellow-400 font-bold">Credits Expiring Soon</p>
                  <p className="text-white/60 text-sm">
                    {stats.expiringCredits} credits expire on {stats.expiryDate}
                  </p>
                </div>
                <Link 
                  href="/app/schedule"
                  className="px-4 py-2 bg-yellow-400/20 text-yellow-400 rounded-full font-bold text-sm hover:bg-yellow-400 hover:text-black transition-all duration-300"
                >
                  Book Now
                </Link>
              </div>
            </div>
          )}

          {/* Hero Stats */}
          {stats && (
          <div className="glass-card rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-black text-white mb-6">Hero Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-4xl font-black text-neonGreen mb-2">{stats.totalClasses || 0}</div>
                <p className="text-white/60 text-sm font-medium">Total Classes</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-4xl font-black text-neonGreen mb-2">{stats.muayThaiClasses || 0}</div>
                <p className="text-white/60 text-sm font-medium">Muay Thai Classes</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-4xl font-black text-neonPink mb-2">{stats.aerialClasses || 0}</div>
                <p className="text-white/60 text-sm font-medium">Aerial Classes</p>
              </div>
            </div>
          </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card rounded-3xl p-8 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-white">Upcoming Classes</h2>
                <Link href="/app/schedule" className="text-neonGreen hover:text-neonGreen/80 text-sm font-bold">
                  View All →
                </Link>
              </div>
              {upcomingClasses.length > 0 ? (
              <div className="space-y-4">
                {upcomingClasses.map((classItem, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-neonGreen/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-12 rounded-full ${classItem.type === "muay-thai" ? "bg-neonGreen" : "bg-neonPink"}`} />
                      <div>
                        <h3 className="text-white font-bold mb-1">{classItem.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {classItem.day}, {classItem.time}
                          </span>
                          <span>•</span>
                          <span>{classItem.instructor}</span>
                          <span>•</span>
                          <span>{classItem.level}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/40 mb-1">{classItem.bookedCount || 0}/{classItem.capacity}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        classItem.type === 'muay-thai' 
                          ? 'bg-neonGreen/10 text-neonGreen' 
                          : 'bg-neonPink/10 text-neonPink'
                      }`}>
                        {classItem.type === 'muay-thai' ? 'Muay Thai' : 'Aerial'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-8 text-white/40">
                  <p>No upcoming classes booked</p>
                  <Link href="/app/schedule" className="text-neonGreen hover:text-neonGreen/80 text-sm font-bold mt-2 inline-block">
                    Browse Schedule →
                  </Link>
                </div>
              )}
            </div>

            <div className="glass-card rounded-3xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-neonPink" />
                <h2 className="text-2xl font-black text-white">Recent Activity</h2>
              </div>
              {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="pb-4 border-b border-white/10 last:border-0">
                    <p className="text-white text-sm font-medium mb-1">{activity.action}</p>
                    <span className="text-white/40 text-xs">{activity.time}</span>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-8 text-white/40">
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/app/schedule" className="glass-card rounded-3xl p-8 border border-white/10 hover:border-neonGreen/50 transition-all duration-300 group">
              <Calendar className="w-8 h-8 text-neonGreen mb-4" />
              <h3 className="text-xl font-black text-white mb-2 group-hover:text-neonGreen transition-colors">
                Book a Class
              </h3>
              <p className="text-white/60 text-sm">Reserve your spot in upcoming sessions</p>
            </Link>

            <Link href="/app/credits" className="glass-card rounded-3xl p-8 border border-white/10 hover:border-neonPink/50 transition-all duration-300 group">
              <Zap className="w-8 h-8 text-neonPink mb-4" />
              <h3 className="text-xl font-black text-white mb-2 group-hover:text-neonPink transition-colors">
                Buy Credits
              </h3>
              <p className="text-white/60 text-sm">Purchase class credits and packages</p>
            </Link>
          </div>
        </div>
        )}
      </DashboardLayout>
    </>
  );
}