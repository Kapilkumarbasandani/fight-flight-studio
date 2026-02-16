import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Clock, Users, CreditCard, X, Check } from "lucide-react";

interface Session {
  id: string;
  title: string;
  instructor: string;
  time: string;
  day: string;
  capacity: number;
  creditsRequired: number;
  type: "muay_thai" | "aerial" | "conditioning";
  enrolled: number;
}

export default function AdminSessions() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      title: "Advanced Muay Thai",
      instructor: "Coach Mike",
      time: "06:00 AM",
      day: "Monday",
      capacity: 15,
      creditsRequired: 1,
      type: "muay_thai",
      enrolled: 12
    },
    {
      id: "2",
      title: "Aerial Silks Basics",
      instructor: "Sarah Chen",
      time: "07:30 AM",
      day: "Monday",
      capacity: 10,
      creditsRequired: 2,
      type: "aerial",
      enrolled: 8
    },
    {
      id: "3",
      title: "Conditioning",
      instructor: "Coach Mike",
      time: "05:30 PM",
      day: "Tuesday",
      capacity: 12,
      creditsRequired: 1,
      type: "conditioning",
      enrolled: 10
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    instructor: "",
    time: "",
    day: "Monday",
    capacity: 10,
    creditsRequired: 1,
    type: "muay_thai" as "muay_thai" | "aerial" | "conditioning"
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      // In production: const response = await fetch('/api/admin/sessions')
      // const data = await response.json()
      // setSessions(data)
      
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      showToast("Failed to load sessions", "error");
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
        type: session.type
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
        type: "muay_thai"
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
    setLoading(true);

    try {
      if (editingSession) {
        // In production: await fetch(`/api/admin/sessions/${editingSession.id}`, {
        //   method: 'PUT',
        //   body: JSON.stringify(formData)
        // })
        
        setSessions(sessions.map(s => 
          s.id === editingSession.id 
            ? { ...s, ...formData }
            : s
        ));
        showToast("Session updated successfully", "success");
      } else {
        // In production: await fetch('/api/admin/sessions', {
        //   method: 'POST',
        //   body: JSON.stringify(formData)
        // })
        
        const newSession: Session = {
          id: Date.now().toString(),
          ...formData,
          enrolled: 0
        };
        setSessions([...sessions, newSession]);
        showToast("Session created successfully", "success");
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

    setLoading(true);
    try {
      // In production: await fetch(`/api/admin/sessions/${sessionId}`, {
      //   method: 'DELETE'
      // })
      
      setSessions(sessions.filter(s => s.id !== sessionId));
      showToast("Session deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete session", "error");
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "muay_thai": return "text-[#39FF14] bg-[#39FF14]/10";
      case "aerial": return "text-[#FF2F92] bg-[#FF2F92]/10";
      case "conditioning": return "text-purple-400 bg-purple-400/10";
      default: return "text-white bg-white/10";
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "muay_thai": return "Muay Thai";
      case "aerial": return "Aerial";
      case "conditioning": return "Conditioning";
      default: return type;
    }
  };

  return (
    <>
      <SEO 
        title="Manage Sessions - Admin - Fight&Flight"
        description="Create, edit, and manage class sessions"
      />
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Manage <span className="text-[#39FF14]">Sessions</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Create, edit, and manage class schedules
              </p>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="neon-button-green flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Session
            </button>
          </div>

          {loading && !showModal ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
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
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{session.day}, {session.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{session.enrolled}/{session.capacity} enrolled</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">{session.creditsRequired} credit{session.creditsRequired > 1 ? 's' : ''}</span>
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                  >
                    <option value="muay_thai">Muay Thai</option>
                    <option value="aerial">Aerial</option>
                    <option value="conditioning">Conditioning</option>
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
    </>
  );
}