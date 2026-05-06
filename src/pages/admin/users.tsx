import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect, useRef } from "react";
import { Users, Search, CreditCard, Calendar, PauseCircle, CheckCircle, X, Check, Trash2, RefreshCcw, AlertTriangle } from "lucide-react";
import { useAdminProtection } from "@/hooks/use-admin-protection";

interface Member {
  id: string;
  name: string;
  email: string;
  credits: number;
  level: string;
  totalClasses: number;
  joinedDate: string;
  expiryPaused: boolean;
  pausedUntil?: string;
}

export default function AdminUsers() {
  const { user, loading: authLoading, isAdmin } = useAdminProtection();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user && isAdmin) {
      fetchMembers();
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
        setMembers(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      showToast("Failed to fetch members", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (member: Member) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/users?id=${member.id}`, { method: 'DELETE' });
      if (response.ok) {
        setMembers(prev => prev.filter(m => m.id !== member.id));
        showToast(`${member.name} has been removed`, "success");
        setDeleteConfirm(null);
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to delete user", "error");
      }
    } catch (error) {
      showToast("Failed to delete user", "error");
    } finally {
      setDeleting(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = members.filter(m => m.credits > 0).length;
  const pausedCount = members.filter(m => m.expiryPaused).length;

  return (
    <>
      <SEO
        title="User Management - Admin - Fight&Flight"
        description="View and manage all studio members"
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
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  User <span className="text-[#39FF14]">Management</span>
                </h1>
                <p className="text-gray-400 text-lg">All studio members</p>
                {lastUpdated && (
                  <p className="text-gray-500 text-xs mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s
                  </p>
                )}
              </div>
              <button
                onClick={() => fetchMembers()}
                title="Refresh now"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all"
              >
                <RefreshCcw className="w-5 h-5" />
                <span className="text-sm">Refresh</span>
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-[#39FF14]/10">
                  <Users className="w-6 h-6 text-[#39FF14]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Members</p>
                  <p className="text-3xl font-bold text-white">{members.length}</p>
                </div>
              </div>
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-400/10">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Active Members</p>
                  <p className="text-3xl font-bold text-white">{activeCount}</p>
                </div>
              </div>
              <div className="glass-card p-6 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-400/10">
                  <PauseCircle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Paused Members</p>
                  <p className="text-3xl font-bold text-white">{pausedCount}</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="glass-card p-6">
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

            {/* Members Table */}
            <div className="glass-card rounded-3xl overflow-hidden border border-white/10">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14]" />
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p>No members found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold">Member</th>
                        <th className="text-left px-6 py-4 text-gray-400 text-sm font-semibold">Level</th>
                        <th className="text-center px-6 py-4 text-gray-400 text-sm font-semibold">Credits</th>
                        <th className="text-center px-6 py-4 text-gray-400 text-sm font-semibold">Classes</th>
                        <th className="text-center px-6 py-4 text-gray-400 text-sm font-semibold">Joined</th>
                        <th className="text-center px-6 py-4 text-gray-400 text-sm font-semibold">Status</th>
                        <th className="text-center px-6 py-4 text-gray-400 text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMembers.map((member, idx) => (
                        <tr
                          key={member.id}
                          className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-white font-semibold">{member.name}</p>
                              <p className="text-gray-400 text-sm">{member.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-300 text-sm">{member.level}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`font-bold ${member.credits > 0 ? 'text-[#39FF14]' : 'text-gray-500'}`}>
                              {member.credits}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-gray-300">{member.totalClasses}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-gray-400 text-sm">{member.joinedDate}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {member.expiryPaused ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold text-yellow-400 bg-yellow-400/10">
                                Paused
                              </span>
                            ) : member.credits > 0 ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold text-[#39FF14] bg-[#39FF14]/10">
                                Active
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold text-gray-400 bg-gray-400/10">
                                No Credits
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => setDeleteConfirm(member)}
                              title="Remove user"
                              className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-full bg-red-500/10">
                    <AlertTriangle className="w-7 h-7 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Remove Member</h3>
                    <p className="text-gray-400 text-sm">This action cannot be undone</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-2">
                  Are you sure you want to remove <span className="text-white font-semibold">{deleteConfirm.name}</span>?
                </p>
                <p className="text-gray-500 text-sm mb-8">
                  Their account, bookings, and credit transactions will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    disabled={deleting}
                    className="flex-1 py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirm)}
                    disabled={deleting}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Remove User
                      </>
                    )}
                  </button>
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
