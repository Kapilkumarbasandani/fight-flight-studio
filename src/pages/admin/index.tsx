import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { TrendingUp, Users, CreditCard, Activity, AlertTriangle, Crown } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 245000,
      thisMonth: 45000,
      growth: 12.5,
      trend: [32000, 38000, 41000, 45000]
    },
    attendance: {
      total: 1247,
      thisMonth: 234,
      growth: 8.3,
      trend: [180, 210, 220, 234]
    },
    packSales: {
      total: 156,
      thisMonth: 28,
      topPack: "Warrior Pack (10 credits)",
      trend: [20, 24, 26, 28]
    },
    disciplineSplit: {
      muayThai: 58,
      aerial: 42
    },
    underperformingClasses: [
      { id: 1, title: "Morning Conditioning", attendance: 3, capacity: 12, utilizationRate: 25 },
      { id: 2, title: "Evening Aerial Basics", attendance: 4, capacity: 10, utilizationRate: 40 },
      { id: 3, title: "Weekend Muay Thai", attendance: 5, capacity: 15, utilizationRate: 33 }
    ]
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // In production: const response = await fetch('/api/admin/analytics')
      // const data = await response.json()
      // setAnalytics(data)
      
      // For now: using mock data
      await new Promise(resolve => setTimeout(resolve, 500));
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

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14]" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Revenue"
                  value={`₹${(analytics.revenue.total / 1000).toFixed(0)}K`}
                  subtitle={`+${analytics.revenue.growth}% this month`}
                  icon={TrendingUp}
                  trend={analytics.revenue.trend}
                  color="green"
                />
                <StatCard
                  title="Attendance"
                  value={analytics.attendance.thisMonth}
                  subtitle={`${analytics.attendance.total} total sessions`}
                  icon={Users}
                  trend={analytics.attendance.trend}
                  color="pink"
                />
                <StatCard
                  title="Pack Sales"
                  value={analytics.packSales.thisMonth}
                  subtitle={analytics.packSales.topPack}
                  icon={CreditCard}
                  trend={analytics.packSales.trend}
                  color="green"
                />
                <StatCard
                  title="Discipline Split"
                  value={`${analytics.disciplineSplit.muayThai}%`}
                  subtitle={`${analytics.disciplineSplit.aerial}% Aerial`}
                  icon={Activity}
                  color="pink"
                />
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              </div>
            </>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}