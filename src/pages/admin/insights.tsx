import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect, useRef } from "react";
import { Users, DollarSign, Calendar, TrendingUp, TrendingDown, Pause, CheckCircle, AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useAdminProtection } from "@/hooks/use-admin-protection";

interface UserExpiry {
  id: string;
  name: string;
  email: string;
  expiryDate: string;
  daysRemaining: number;
  creditsRemaining: number;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  user: string;
  type: string;
}

export default function InsightsPage() {
  const { user, loading: authLoading, isAdmin } = useAdminProtection();
  const [activeTab, setActiveTab] = useState<'users' | 'finance'>('users');
  const [financePeriod, setFinancePeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  
  const [userInsights, setUserInsights] = useState({
    totalActive: 0,
    totalPaused: 0,
    totalUsers: 0,
    expiringUsers: [] as UserExpiry[],
    pausedUsers: [] as any[],
    activeMembers: [] as any[],
  });

  const [financeInsights, setFinanceInsights] = useState({
    monthly: {
      totalTransactions: 0,
      totalRevenue: 0,
      averageTransaction: 0,
      growth: 0,
      transactions: [] as Transaction[],
    },
    quarterly: {
      totalTransactions: 0,
      totalRevenue: 0,
      averageTransaction: 0,
      growth: 0,
      transactions: [] as Transaction[],
    },
    yearly: {
      totalTransactions: 0,
      totalRevenue: 0,
      averageTransaction: 0,
      growth: 0,
      transactions: [] as Transaction[],
    },
  });

  useEffect(() => {
    if (user && isAdmin) {
      loadInsights();
      pollRef.current = setInterval(() => {
        loadInsights();
      }, 30000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [user, isAdmin]);

  const loadInsights = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/insights?userId=${user._id}&userRole=${user.role}`);
      if (response.ok) {
        const data = await response.json();
        setUserInsights(data.userInsights);
        setFinanceInsights(data.financeInsights);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to load insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentFinanceData = financeInsights[financePeriod];

  return (
    <>
      <SEO 
        title="Insights - Admin Dashboard"
        description="Detailed user and finance analytics"
      />
      {authLoading ? (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14] mx-auto mb-4" />
            <p className="text-white/60">Loading insights...</p>
          </div>
        </div>
      ) : !isAdmin ? null : (
        <DashboardLayout>
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    <span className="text-[#39FF14]">Insights</span> Dashboard
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Comprehensive user and financial analytics
                  </p>
                  {lastUpdated && (
                    <p className="text-gray-500 text-xs mt-1">
                      Last updated: {lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => loadInsights()}
                title="Refresh now"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCcw className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 border-b border-white/10">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 font-semibold transition-colors relative ${
                  activeTab === 'users' 
                    ? 'text-[#39FF14]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Users className="w-5 h-5 inline-block mr-2" />
                User Insights
                {activeTab === 'users' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#39FF14]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('finance')}
                className={`px-6 py-3 font-semibold transition-colors relative ${
                  activeTab === 'finance' 
                    ? 'text-[#39FF14]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-5 h-5 inline-block mr-2" />
                Finance Insights
                {activeTab === 'finance' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#39FF14]" />
                )}
              </button>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14] mx-auto mb-4" />
                  <p className="text-white/60">Loading insights...</p>
                </div>
              </div>
            ) : (
              <>
            {/* User Insights Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">{/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-[#39FF14]/10">
                        <CheckCircle className="w-6 h-6 text-[#39FF14]" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-[#39FF14]" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{userInsights.totalActive}</h3>
                    <p className="text-gray-400 text-sm">Active Members</p>
                  </div>
                  
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-yellow-500/10">
                        <Pause className="w-6 h-6 text-yellow-500" />
                      </div>
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{userInsights.totalPaused}</h3>
                    <p className="text-gray-400 text-sm">Paused Accounts</p>
                  </div>
                  
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-[#FF2D55]/10">
                        <Calendar className="w-6 h-6 text-[#FF2D55]" />
                      </div>
                      <AlertCircle className="w-5 h-5 text-[#FF2D55]" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{userInsights.expiringUsers.length}</h3>
                    <p className="text-gray-400 text-sm">Expiring Soon</p>
                  </div>
                </div>

                {/* Expiry Date List */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-[#FF2D55]/10">
                      <Calendar className="w-5 h-5 text-[#FF2D55]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Credits Expiring Soon</h2>
                  </div>
                  <div className="space-y-3">
                    {userInsights.expiringUsers.map((user) => (
                      <div key={user.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{user.name}</h3>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${user.daysRemaining <= 3 ? 'text-[#FF2D55]' : 'text-yellow-500'}`}>
                              {user.daysRemaining} days left
                            </p>
                            <p className="text-gray-400 text-sm">{user.creditsRemaining} credits</p>
                            <p className="text-gray-500 text-xs mt-1">{user.expiryDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Paused Users */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-yellow-500/10">
                      <Pause className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Paused Members</h2>
                  </div>
                  <div className="space-y-3">
                    {userInsights.pausedUsers.map((user) => (
                      <div key={user.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold">{user.name}</h3>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-yellow-500 font-semibold">{user.reason}</p>
                            <p className="text-gray-500 text-xs">Since {user.pausedDate}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Members */}
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-[#39FF14]/10">
                      <CheckCircle className="w-5 h-5 text-[#39FF14]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Active Members</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-gray-400 font-semibold py-3 px-4">Name</th>
                          <th className="text-left text-gray-400 font-semibold py-3 px-4">Email</th>
                          <th className="text-left text-gray-400 font-semibold py-3 px-4">Credits</th>
                          <th className="text-left text-gray-400 font-semibold py-3 px-4">Last Class</th>
                          <th className="text-left text-gray-400 font-semibold py-3 px-4">Member Since</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userInsights.activeMembers.map((member) => (
                          <tr key={member.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 text-white font-medium">{member.name}</td>
                            <td className="py-3 px-4 text-gray-400">{member.email}</td>
                            <td className="py-3 px-4">
                              <span className="px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-sm font-semibold">
                                {member.credits}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-400">{member.lastClass}</td>
                            <td className="py-3 px-4 text-gray-400">{member.joinDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Finance Insights Tab */}
            {activeTab === 'finance' && (
              <div className="space-y-6">
                {/* Period Selector */}
                <div className="flex gap-4">
                  {(['monthly', 'quarterly', 'yearly'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setFinancePeriod(period)}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                        financePeriod === period
                          ? 'bg-[#39FF14] text-black'
                          : 'glass-card text-gray-400 hover:text-white'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Finance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-[#39FF14]/10">
                        <DollarSign className="w-6 h-6 text-[#39FF14]" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">
                      ₹{(currentFinanceData.totalRevenue / 1000).toFixed(0)}K
                    </h3>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                  </div>
                  
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-[#FF2D55]/10">
                        <TrendingUp className="w-6 h-6 text-[#FF2D55]" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">{currentFinanceData.totalTransactions}</h3>
                    <p className="text-gray-400 text-sm">Total Transactions</p>
                  </div>
                  
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-purple-500/10">
                        <DollarSign className="w-6 h-6 text-purple-500" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">₹{currentFinanceData.averageTransaction}</h3>
                    <p className="text-gray-400 text-sm">Avg Transaction</p>
                  </div>
                  
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-lg bg-[#39FF14]/10">
                        <TrendingUp className="w-6 h-6 text-[#39FF14]" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold text-[#39FF14] mb-1">+{currentFinanceData.growth}%</h3>
                    <p className="text-gray-400 text-sm">Growth Rate</p>
                  </div>
                </div>

                {/* Recent Transactions */}
                {financePeriod === 'monthly' && currentFinanceData.transactions.length > 0 && (
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-lg bg-[#39FF14]/10">
                        <DollarSign className="w-5 h-5 text-[#39FF14]" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left text-gray-400 font-semibold py-3 px-4">Date</th>
                            <th className="text-left text-gray-400 font-semibold py-3 px-4">User</th>
                            <th className="text-left text-gray-400 font-semibold py-3 px-4">Type</th>
                            <th className="text-right text-gray-400 font-semibold py-3 px-4">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentFinanceData.transactions.map((transaction) => (
                            <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="py-3 px-4 text-gray-400">{transaction.date}</td>
                              <td className="py-3 px-4 text-white font-medium">{transaction.user}</td>
                              <td className="py-3 px-4">
                                <span className="px-3 py-1 rounded-full bg-[#39FF14]/10 text-[#39FF14] text-sm">
                                  {transaction.type}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right text-[#39FF14] font-bold">
                                ₹{transaction.amount.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
            </>
            )}
          </div>
        </DashboardLayout>
      )}
    </>
  );
}
