import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, Clock, Users, CreditCard, X, Check, RefreshCcw } from "lucide-react";
import { useAdminProtection } from "@/hooks/use-admin-protection";

interface Session {
  id: string;
  title: string;
  instructor: string;
  time: string;
  day: string;
  capacity: number;
  creditsRequired: number;
  type: "muay_thai" | "aerial" | "conditioning" | "yoga";
  level: "beginner" | "intermediate" | "advanced" | "all-levels";
  enrolled: number;
}

export default function AdminSessions() {
  const { user, loading: authLoading, isAdmin } = useAdminProtection();
  const [sessions, setSessions] = useState<Session[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    time: "",
    day: "Monday",
    capacity: 10,
    creditsRequired: 1,
    type: "muay_thai" as "muay_thai" | "aerial" | "conditioning" | "yoga",
    level: "all-levels" as "beginner" | "intermediate" | "advanced" | "all-levels"
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [dayFilter, setDayFilter] = useState<string>('All');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user && isAdmin) {
      loadSessions();
      pollRef.current = setInterval(() => {
        loadSessions();
      }, 30000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [user, isAdmin]);

  const loadSessions = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/classes?userId=${user._id}&userRole=${user.role}`);
      if (response.ok) {
        const data = await response.json();
        // Map classes to sessions format — only show active sessions
        const mappedSessions = data
          .filter((cls: any) => cls.active !== false)
          .map((cls: any) => ({
            id: cls._id,
            title: cls.name,
            instructor: cls.instructor,
            time: cls.time,
            day: cls.day,
            capacity: cls.capacity,
            creditsRequired: cls.creditsRequired,
            type: cls.type,
            level: cls.level || "all-levels",
            enrolled: cls.enrolled || 0
          }));
        setSessions(mappedSessions);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (session?: Session) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        title: session.title,
        instructor: session.instructor,
        time: session.time,
        day: session.day,
        capacity: session.capacity,
        creditsRequired: session.creditsRequired,
        type: session.type,
        level: session.level
      });
    } else {
      setEditingSession(null);
      setFormData({
        title: "",
        instructor: "",
        time: "",
        day: "Monday",
        capacity: 10,
        creditsRequired: 1,
        type: "muay_thai",
        level: "all-levels"
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSession(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      if (editingSession) {
        // Update existing class
        const response = await fetch('/api/admin/classes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            userRole: user.role,
            classId: editingSession.id,
            classData: {
              name: formData.title,
              instructor: formData.instructor,
              time: formData.time,
              day: formData.day,
              capacity: formData.capacity,
              creditsRequired: formData.creditsRequired,
              type: formData.type,
              level: formData.level,
              active: true
            }
          })
        });

        if (response.ok) {
          showToast("Session updated successfully", "success");
          loadSessions();
        } else {
          throw new Error('Failed to update session');
        }
      } else {
        // Create new class
        const response = await fetch('/api/admin/classes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            userRole: user.role,
            classData: {
              name: formData.title,
              instructor: formData.instructor,
              time: formData.time,
              day: formData.day,
              capacity: formData.capacity,
              creditsRequired: formData.creditsRequired,
              type: formData.type,
              level: formData.level,
              description: '',
              active: true
            }
          })
        });

        if (response.ok) {
          showToast("Session created successfully", "success");
          loadSessions();
        } else {
          throw new Error('Failed to create session');
        }
      }
      
      handleCloseModal();
    } catch (error) {
      showToast("Failed to save session", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm("Are you sure you want to delete this session?")) return;
    if (!user) return;

    try {
      const response = await fetch('/api/admin/classes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          userRole: user.role,
          classId: sessionId
        })
      });

      if (response.ok) {
        // Optimistic: remove from local state immediately
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        showToast("Session deleted successfully", "success");
        // Then reload from server to confirm
        loadSessions();
      } else {
        const data = await response.json().catch(() => ({}));
        showToast(data.error || "Failed to delete session", "error");
      }
    } catch (error) {
      showToast("Failed to delete session", "error");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "muay_thai": return "text-[#39FF14] bg-[#39FF14]/10";
      case "aerial": return "text-[#FF2F92] bg-[#FF2F92]/10";
      case "conditioning": return "text-orange-400 bg-orange-400/10";
      case "yoga": return "text-purple-400 bg-purple-400/10";
      default: return "text-white bg-white/10";
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "muay_thai": return "Muay Thai";
      case "aerial": return "Aerial";
      case "conditioning": return "Conditioning";
      case "yoga": return "Yoga";
      default: return type;
    }
  };

  const getLevelLabel = (level: Session["level"]) => {
    switch (level) {
      case "all-levels":
        return "All Levels";
      case "beginner":
        return "Beginner";
      case "intermediate":
        return "Intermediate";
      case "advanced":
        return "Advanced";
      default:
        return "All Levels";
    }
  };

  return (
    <>
      <SEO 
        title="Manage Sessions - Admin - Fight&Flight"
        description="Create, edit, and manage class sessions"
      />      {authLoading ? (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14] mx-auto mb-4" />
            <p className="text-white/60">Verifying access...</p>
          </div>
        </div>
      ) : !isAdmin ? null : (      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Manage <span className="text-[#39FF14]">Sessions</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Create, edit, and manage class schedules
              </p>
              {lastUpdated && (
                <p className="text-gray-500 text-xs mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadSessions()}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Refresh now"
              >
                <RefreshCcw className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="neon-button-green flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Session
              </button>
            </div>
          </div>

          {loading && !showModal ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14]" />
            </div>
          ) : (
            <>
              {/* Weekday Filter */}
              <div className="flex flex-wrap gap-2">
                {['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <button
                    key={day}
                    onClick={() => setDayFilter(day)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      dayFilter === day
                        ? 'bg-[#39FF14] text-black'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Sessions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions
                  .filter((s) => dayFilter === 'All' || s.day === dayFilter)
                  .map((session) => (
                <div key={session.id} className="glass-card p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{session.title}</h3>
                      <p className="text-gray-400">{session.instructor}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(session.type)}`}>
                      {getTypeName(session.type)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-white">
                      <Clock className="w-4 h-4 text-white" />
                      <span className="text-sm">{session.day}, {session.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <Users className="w-4 h-4 text-white" />
                      <span className="text-sm">{session.enrolled}/{session.capacity} enrolled</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <CreditCard className="w-4 h-4 text-white" />
                      <span className="text-sm">{session.creditsRequired} credit{session.creditsRequired > 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      Level: {getLevelLabel(session.level)}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleOpenModal(session)}
                      className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(session.id)}
                      className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
                ))}
              </div>
              {sessions.filter((s) => dayFilter === 'All' || s.day === dayFilter).length === 0 && (
                <div className="text-center py-16 text-white/40">
                  <p className="text-lg">No sessions on {dayFilter}</p>
                </div>
              )}
            </>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">
                  {editingSession ? "Edit Session" : "Create New Session"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Class Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                    placeholder="e.g., Advanced Muay Thai"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Instructor</label>
                  <input
                    type="text"
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                    placeholder="e.g., Coach Mike"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Day</label>
                    <select
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                      className="w-full px-4 py-3 bg-black/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-black/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-80"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-black/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                  >
                    <option value="muay_thai">Muay Thai</option>
                    <option value="aerial">Aerial</option>
                    <option value="yoga">Yoga</option>
                    <option value="conditioning">Conditioning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as Session["level"] })}
                    className="w-full px-4 py-3 bg-black/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                  >
                    <option value="all-levels">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      required
                      min="1"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Credits Required</label>
                    <input
                      type="number"
                      value={formData.creditsRequired}
                      onChange={(e) => setFormData({ ...formData, creditsRequired: parseInt(e.target.value) })}
                      required
                      min="1"
                      max="3"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 neon-button-green"
                  >
                    {loading ? "Saving..." : editingSession ? "Update Session" : "Create Session"}
                  </button>
                </div>
              </form>
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