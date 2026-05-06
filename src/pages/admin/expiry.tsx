import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect, useRef } from "react";
import { Clock, Play, Pause, Search, AlertTriangle, X, Check, RefreshCcw } from "lucide-react";
import { useAdminProtection } from "@/hooks/use-admin-protection";

interface Member {
  id: string;
  name: string;
  email: string;
  credits: number;
  expiryDate: string;
  expiryPaused: boolean;
  pausedUntil?: string;
  level: string;
  expiringCredits: any[];
}

export default function AdminExpiry() {
  const { user, loading: authLoading, isAdmin } = useAdminProtection();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseUntilDate, setPauseUntilDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchMembers();
      // Auto-refresh every 30 seconds so new users and credit changes appear live
      pollRef.current = setInterval(() => {
        fetchMembers();
      }, 30000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [user, isAdmin]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        // Map users to members format with expiry info from DB
        const mappedMembers = data.map((usr: any) => {
          // Determine earliest expiry from expiringCredits array or creditExpiryDate
          let expiryDate = usr.creditExpiryDate || null;
          if (!expiryDate && usr.expiringCredits && usr.expiringCredits.length > 0) {
            // Pick the soonest expiry date
            const sorted = [...usr.expiringCredits].sort(
              (a: any, b: any) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
            );
            expiryDate = sorted[0].expiryDate;
          }
          if (!expiryDate) {
            expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          }
          return {
            id: usr.id || usr._id,
            name: usr.name,
            email: usr.email,
            credits: usr.credits || 0,
            expiryDate,
            expiryPaused: usr.expiryPaused || false,
            pausedUntil: usr.pausedUntil || null,
            level: usr.level || 'Trainee',
            expiringCredits: usr.expiringCredits || []
          };
        });
        setMembers(mappedMembers);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      showToast("Failed to fetch members", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePauseExpiry = async () => {
    if (!selectedMember || !pauseUntilDate) {
      showToast("Please select a date", "error");
      return;
    }

    setProcessingUserId(selectedMember.id);
    try {
      const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('/api/admin/expiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pause',
          userId: selectedMember.id,
          pausedUntil: pauseUntilDate,
          adminId: adminUser._id
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to pause expiry');
      }

      const result = await response.json();
      showToast(result.message, "success");
      setShowPauseModal(false);
      setSelectedMember(null);
      setPauseUntilDate("");
      // Re-fetch from DB to get accurate state
      await fetchMembers();
    } catch (error: any) {
      showToast(error.message || "Failed to pause expiry", "error");
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleResumeExpiry = async (member: Member) => {
    if (!confirm(`Resume credit expiry for ${member.name}?`)) return;

    setProcessingUserId(member.id);
    try {
      const adminUser = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await fetch('/api/admin/expiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resume',
          userId: member.id,
          adminId: adminUser._id
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to resume expiry');
      }

      const result = await response.json();
      showToast(result.message, "success");
      // Re-fetch from DB to get accurate state
      await fetchMembers();
    } catch (error: any) {
      showToast(error.message || "Failed to resume expiry", "error");
    } finally {
      setProcessingUserId(null);
    }
  };

  const getExpiryStatus = (member: Member) => {
    if (member.expiryPaused) {
      return { text: "Paused", color: "text-yellow-400", bg: "bg-yellow-400/10" };
    }
    const daysUntilExpiry = Math.ceil((new Date(member.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 7) {
      return { text: "Expiring Soon", color: "text-red-400", bg: "bg-red-400/10" };
    }
    return { text: "Active", color: "text-[#39FF14]", bg: "bg-[#39FF14]/10" };
  };

  return (
    <>
      <SEO 
        title="Expiry Management - Admin - Fight&Flight"
        description="Pause or resume credit expiry for members"
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
                Expiry <span className="text-[#39FF14]">Management</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Pause or resume credit expiry for members
              </p>
              {lastUpdated && (
                <p className="text-gray-500 text-xs mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s
                </p>
              )}
            </div>
            <button
              onClick={() => fetchMembers()}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Refresh now"
            >
              <RefreshCcw className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Info Banner */}
          <div className="glass-card p-4 flex items-start gap-3 border-l-4 border-yellow-400">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-semibold mb-1">Credit Expiry Policy</p>
              <p className="text-gray-400 text-sm">
                Use this tool to temporarily pause credit expiry for members on medical leave, travel, or special circumstances. Paused credits will not expire until the resume date.
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#39FF14]/10">
                <Search className="w-5 h-5 text-[#39FF14]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Search Members</h2>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredMembers.map((member) => {
              const status = getExpiryStatus(member);
              return (
                <div key={member.id} className="glass-card p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-gray-400 text-sm">{member.email}</p>
                      <p className="text-gray-500 text-xs mt-1">{member.level}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color} ${status.bg}`}>
                      {status.text}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Credits Balance</span>
                      <span className="text-[#39FF14] font-semibold">{member.credits}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Expiry Date</span>
                      <span className="text-white font-semibold">
                        {new Date(member.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                    {member.expiryPaused && member.pausedUntil && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Paused Until</span>
                        <span className="text-yellow-400 font-semibold">
                          {new Date(member.pausedUntil).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    {member.expiryPaused ? (
                      <button
                        onClick={() => handleResumeExpiry(member)}
                        disabled={processingUserId === member.id}
                        className="w-full px-4 py-2 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 rounded-lg text-[#39FF14] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Play className="w-4 h-4" />
                        {processingUserId === member.id ? "Resuming..." : "Resume Expiry"}
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowPauseModal(true);
                        }}
                        disabled={processingUserId === member.id}
                        className="w-full px-4 py-2 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg text-yellow-400 font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Pause className="w-4 h-4" />
                        {processingUserId === member.id ? "Pausing..." : "Pause Expiry"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pause Modal */}
        {showPauseModal && selectedMember && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Pause Credit Expiry</h2>
                <button
                  onClick={() => {
                    setShowPauseModal(false);
                    setSelectedMember(null);
                    setPauseUntilDate("");
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Member</p>
                  <h3 className="text-white font-semibold text-lg">{selectedMember.name}</h3>
                  <p className="text-[#39FF14] text-sm">Current Balance: {selectedMember.credits} credits</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Expiry: {new Date(selectedMember.expiryDate).toLocaleDateString()}
                  </p>
                  {selectedMember.expiringCredits && selectedMember.expiringCredits.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-gray-400 text-xs mb-2 font-semibold uppercase tracking-wider">Expiring Credits Breakdown</p>
                      {selectedMember.expiringCredits.map((ec: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm mb-1">
                          <span className="text-white">{ec.amount || ec.credits} credits</span>
                          <span className="text-red-400">{new Date(ec.expiryDate).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-semibold mb-2">Pause Until Date</label>
                  <input
                    type="date"
                    value={pauseUntilDate}
                    onChange={(e) => setPauseUntilDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                  />
                  <p className="text-gray-400 text-xs mt-2">
                    Credits will not expire until this date. After this date, normal expiry rules apply.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPauseModal(false);
                      setSelectedMember(null);
                      setPauseUntilDate("");
                    }}
                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePauseExpiry}
                    disabled={!!processingUserId || !pauseUntilDate}
                    className="flex-1 px-6 py-3 bg-yellow-400/20 hover:bg-yellow-400/30 rounded-lg text-yellow-400 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    {processingUserId ? "Pausing..." : "Pause Expiry"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 ${
            toast.type === "success" ? "bg-[#39FF14]/20 border border-[#39FF14]" : "bg-red-500/20 border border-red-500"
          }`}>
            {toast.type === "success" ? (
              <Check className="w-5 h-5 text-[#39FF14]" />
            ) : (
              <X className="w-5 h-5 text-red-500" />
            )}
            <span className="text-white font-semibold">{toast.message}</span>
          </div>
        )}
      </DashboardLayout>
      )}
    </>
  );
}