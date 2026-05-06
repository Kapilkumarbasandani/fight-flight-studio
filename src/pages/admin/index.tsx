import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { TrendingUp, Users, CreditCard, Activity, AlertTriangle, Crown, BarChart3, PauseCircle, Clock, UserCog } from "lucide-react";
import Link from "next/link";
import { useAdminProtection } from "@/hooks/use-admin-protection";

export default function AdminDashboard() {
  const { user, loading: authLoading, isAdmin } = useAdminProtection();
  const [analytics, setAnalytics] = useState({
    insights: {
      activeUsers: 0,
      monthlyRevenue: 0,
      totalUsers: 0,
      pausedUsers: 0,
      pendingPayments: 0,
      creditsExpiringSoon: 0
    },
    revenue: {
      total: 0,
      thisMonth: 0,
      growth: 0,
      trend: [0, 0, 0, 0]
    },
    attendance: {
      total: 0,
      thisMonth: 0,
      growth: 0,
      trend: [0, 0, 0, 0]
    },
    packSales: {
      total: 0,
      thisMonth: 0,
      topPack: "No data",
      trend: [0, 0, 0, 0]
    },
    disciplineSplit: {
      muayThai: 0,
      aerial: 0,
      yoga: 0,
      conditioning: 0
    },
    underperformingClasses: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isAdmin) {
      loadAnalytics();
    }
  }, [user, isAdmin]);

  const loadAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?userId=${user._id}&userRole=${user.role}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color }: any) => (
    <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          <p className={`text-sm mt-1 ${color === 'green' ? 'text-[#39FF14]' : 'text-[#FF2D55]'}`}>
            {subtitle}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color === 'green' ? 'bg-[#39FF14]/10' : 'bg-[#FF2D55]/10'}`}>
          <Icon className={`w-6 h-6 ${color === 'green' ? 'text-[#39FF14]' : 'text-[#FF2D55]'}`} />
        </div>
      </div>
      {trend && (
        <div className="flex gap-1 mt-4">
          {trend.map((val: number, idx: number) => (
            <div
              key={idx}
              className={`flex-1 rounded-t ${color === 'green' ? 'bg-[#39FF14]/20' : 'bg-[#FF2D55]/20'}`}
              style={{ height: `${(val / Math.max(...trend)) * 40}px` }}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <SEO 
        title="Admin Dashboard - Fight&Flight"
        description="Analytics and management overview"
      />
      {authLoading ? (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14] mx-auto mb-4" />
            <p className="text-white/60">Verifying access...</p>
          </div>
        </div>
      ) : !isAdmin ? null : (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Admin <span className="text-[#39FF14]">Dashboard</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Studio performance and management overview
              </p>
            </div>
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Crown className="w-5 h-5 text-[#39FF14]" />
              <span className="text-white font-semibold">Admin Access</span>
            </div>
          </div>

          {(loading || authLoading) ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14]" />
            </div>
          ) : !isAdmin ? null : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Link href="/admin/insights" className="block">
                  <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Active Members</p>
                        <h3 className="text-2xl font-bold text-white">{analytics.insights?.activeUsers || 0}</h3>
                        <p className="text-sm mt-1 text-[#39FF14]">
                          {analytics.insights?.totalUsers || 0} total users
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#39FF14]/10 group-hover:bg-[#39FF14]/20 transition-colors">
                        <Users className="w-6 h-6 text-[#39FF14]" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-400">Click for detailed insights →</p>
                    </div>
                  </div>
                </Link>
                <Link href="/admin/expiry" className="block">
                  <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Paused Members</p>
                        <h3 className="text-2xl font-bold text-white">{analytics.insights?.pausedUsers || 0}</h3>
                        <p className="text-sm mt-1 text-yellow-400">Expiry paused</p>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-400/10 group-hover:bg-yellow-400/20 transition-colors">
                        <PauseCircle className="w-6 h-6 text-yellow-400" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-400">Click to manage →</p>
                    </div>
                  </div>
                </Link>
                <Link href="/admin/expiry" className="block">
                  <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Credits Expiring Soon</p>
                        <h3 className="text-2xl font-bold text-white">{analytics.insights?.creditsExpiringSoon || 0}</h3>
                        <p className="text-sm mt-1 text-red-400">Within 7 days</p>
                      </div>
                      <div className="p-3 rounded-lg bg-red-400/10 group-hover:bg-red-400/20 transition-colors">
                        <Clock className="w-6 h-6 text-red-400" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-400">Click to manage →</p>
                    </div>
                  </div>
                </Link>
                <Link href="/admin/payments?status=submitted" className="block">
                  <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Pending Payments</p>
                        <h3 className="text-2xl font-bold text-white">{analytics.insights?.pendingPayments || 0}</h3>
                        <p className="text-sm mt-1 text-yellow-500">
                          Awaiting verification
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors">
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-400">Click to verify →</p>
                    </div>
                  </div>
                </Link>
                <Link href="/admin/insights" className="block">
                  <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300 cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Monthly Revenue</p>
                        <h3 className="text-2xl font-bold text-white">₹{((analytics.insights?.monthlyRevenue || 0) / 1000).toFixed(0)}K</h3>
                        <p className="text-sm mt-1 text-[#39FF14]">This month</p>
                      </div>
                      <div className="p-3 rounded-lg bg-[#39FF14]/10 group-hover:bg-[#39FF14]/20 transition-colors">
                        <BarChart3 className="w-6 h-6 text-[#39FF14]" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-xs text-gray-400">Click for detailed insights →</p>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-[#39FF14]/10">
                      <Activity className="w-5 h-5 text-[#39FF14]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Discipline Split</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-semibold">Muay Thai</span>
                        <span className="text-[#39FF14]">{analytics.disciplineSplit.muayThai}%</span>
                      </div>
                      <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#39FF14] to-[#2ecc71] rounded-full shimmer"
                          style={{ width: `${analytics.disciplineSplit.muayThai}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-semibold">Aerial Arts</span>
                        <span className="text-[#FF2D55]">{analytics.disciplineSplit.aerial}%</span>
                      </div>
                      <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF2D55] to-[#ff1744] rounded-full shimmer"
                          style={{ width: `${analytics.disciplineSplit.aerial}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-semibold">Yoga</span>
                        <span className="text-purple-400">{analytics.disciplineSplit.yoga}%</span>
                      </div>
                      <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full shimmer"
                          style={{ width: `${analytics.disciplineSplit.yoga}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white font-semibold">Conditioning</span>
                        <span className="text-orange-400">{analytics.disciplineSplit.conditioning}%</span>
                      </div>
                      <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full shimmer"
                          style={{ width: `${analytics.disciplineSplit.conditioning}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-[#FF2D55]/10">
                      <AlertTriangle className="w-5 h-5 text-[#FF2D55]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Underperforming Classes</h2>
                  </div>
                  <div className="space-y-3">
                    {analytics.underperformingClasses.map((classItem) => (
                      <div key={classItem.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-semibold">{classItem.title}</h3>
                          <span className="text-[#FF2D55] text-sm font-semibold">
                            {classItem.utilizationRate}%
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                          {classItem.attendance}/{classItem.capacity} capacity
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link
                  href="/admin/sessions"
                  className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                >
                  <div className="p-3 rounded-lg bg-[#39FF14]/10 w-fit mb-4 group-hover:bg-[#39FF14]/20 transition-colors">
                    <Activity className="w-6 h-6 text-[#39FF14]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Manage Sessions</h3>
                  <p className="text-gray-400">Create, edit, and manage class schedules</p>
                </Link>

                <Link
                  href="/admin/payments"
                  className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                >
                  <div className="p-3 rounded-lg bg-yellow-500/10 w-fit mb-4 group-hover:bg-yellow-500/20 transition-colors">
                    <CreditCard className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Payment Verification</h3>
                  <p className="text-gray-400">Verify and track all payments</p>
                </Link>

                <Link
                  href="/admin/credits"
                  className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                >
                  <div className="p-3 rounded-lg bg-[#FF2D55]/10 w-fit mb-4 group-hover:bg-[#FF2D55]/20 transition-colors">
                    <CreditCard className="w-6 h-6 text-[#FF2D55]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Adjust Credits</h3>
                  <p className="text-gray-400">Add or deduct member credits</p>
                </Link>

                <Link
                  href="/admin/expiry"
                  className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                >
                  <div className="p-3 rounded-lg bg-[#39FF14]/10 w-fit mb-4 group-hover:bg-[#39FF14]/20 transition-colors">
                    <Users className="w-6 h-6 text-[#39FF14]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Expiry Management</h3>
                  <p className="text-gray-400">Pause or resume credit expiry</p>
                </Link>

                <Link
                  href="/admin/users"
                  className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
                >
                  <div className="p-3 rounded-lg bg-blue-500/10 w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <UserCog className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">User Management</h3>
                  <p className="text-gray-400">View and manage all members</p>
                </Link>
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
      )}
    </>
  );
}