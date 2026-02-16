import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import type { UserResponse } from "@/models/User";
import type { ClassResponse } from "@/models/Class";

export default function ClassesManagementPage() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [classes, setClasses] = useState<ClassResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassResponse | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'muay-thai' as 'muay-thai' | 'aerial' | 'yoga' | 'conditioning',
    instructor: '',
    day: 'Monday',
    time: '',
    duration: 60,
    capacity: 12,
    creditsRequired: 1,
    description: '',
    level: 'all-levels' as 'beginner' | 'intermediate' | 'advanced' | 'all-levels',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      if (userData.role !== 'admin') {
        window.location.href = '/app';
        return;
      }
      
      fetchClasses(userData);
    }
  }, []);

  const fetchClasses = async (userData: UserResponse) => {
    try {
      const response = await fetch(`/api/admin/classes?userId=${userData._id}&userRole=${userData.role}`);

      if (response.ok) {
        const data = await response.json();
        setClasses(data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Convert 24-hour time to 12-hour format with AM/PM
    const convert24To12Hour = (time24: string) => {
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${hour12}:${minutes} ${period}`;
    };

    const classDataWithFormattedTime = {
      ...formData,
      time: convert24To12Hour(formData.time), // Convert to 12-hour format
    };

    try {
      const url = '/api/admin/classes';
      const method = editingClass ? 'PUT' : 'POST';
      const body = {
        userId: user._id,
        userRole: user.role,
        ...(editingClass ? { classId: editingClass._id } : {}),
        classData: classDataWithFormattedTime,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Class save response:', result);
        alert(editingClass ? 'Class updated successfully!' : 'Class created successfully!');
        setShowModal(false);
        resetForm();
        fetchClasses(user);
      } else {
        const error = await response.json();
        console.error('❌ Error response:', error);
        alert(`Failed to save class: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Error saving class');
    }
  };

  const handleDelete = async (classId: string) => {
    if (!user || !confirm('Are you sure you want to delete this class?')) return;

    try {
      const response = await fetch('/api/admin/classes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          userRole: user.role,
          classId,
        }),
      });

      if (response.ok) {
        alert('Class deleted successfully!');
        fetchClasses(user);
      } else {
        alert('Failed to delete class');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Error deleting class');
    }
  };

  const handleEdit = (classItem: ClassResponse) => {
    // Convert  12-hour time to 24-hour format for input field
    const convert12To24Hour = (time12: string) => {
      const [time, period] = time12.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours, 10);
      
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }
      
      return `${hour.toString().padStart(2, '0')}:${minutes}`;
    };

    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      type: classItem.type,
      instructor: classItem.instructor,
      day: classItem.day,
      time: convert12To24Hour(classItem.time), // Convert to 24-hour format for input
      duration: classItem.duration,
      capacity: classItem.capacity,
      creditsRequired: classItem.creditsRequired,
      description: classItem.description || '',
      level: classItem.level,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      type: 'muay-thai',
      instructor: '',
      day: 'Monday',
      time: '',
      duration: 60,
      capacity: 12,
      creditsRequired: 1,
      description: '',
      level: 'all-levels',
    });
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <>
      <SEO title="Manage Classes - Admin" description="Manage class schedule" />
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                Manage <span className="text-neonGreen">Classes</span>
              </h1>
              <p className="text-white/60 text-lg">Create and manage class schedule</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-neonGreen text-black font-bold rounded-full hover:bg-neonGreen/90 transition-all duration-300"
            >
              <Plus className="w-5 h-5" />
              Add Class
            </button>
          </div>

          <div className="glass-card rounded-3xl p-8 border border-white/10">
            {loading ? (
              <div className="text-center py-12 text-white/60">Loading classes...</div>
            ) : classes.length === 0 ? (
              <div className="text-center py-12 text-white/60">No classes found. Create your first class!</div>
            ) : (
              <div className="space-y-4">
                {classes.map((classItem) => (
                  <div
                    key={classItem._id}
                    className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-black text-white">{classItem.name}</h3>
                        <span className={`px-2 py-1 ${
                          classItem.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        } text-xs font-bold rounded`}>
                          {classItem.active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                        <span className="px-2 py-1 bg-neonGreen/20 text-neonGreen text-xs font-bold rounded">
                          {classItem.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex gap-6 text-sm text-white/60">
                        <span>{classItem.day} • {classItem.time}</span>
                        <span>{classItem.instructor}</span>
                        <span>{classItem.capacity - (classItem.bookedCount || 0)}/{classItem.capacity} spots</span>
                        <span>{classItem.creditsRequired} credits</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(classItem)}
                        className="p-3 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all duration-300"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(classItem._id)}
                        className="p-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="glass-card rounded-3xl p-8 border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black text-white">
                  {editingClass ? 'Edit Class' : 'Create New Class'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/5 rounded-lg transition-all duration-300"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Class Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none"
                      placeholder="e.g., Muay Thai Foundations"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Type</label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-4 py-3 bg-black/80 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none cursor-pointer"
                    >
                      <option value="muay-thai">Muay Thai</option>
                      <option value="aerial">Aerial</option>
                      <option value="yoga">Yoga</option>
                      <option value="conditioning">Conditioning</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Instructor</label>
                    <input
                      type="text"
                      required
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none"
                      placeholder="e.g., Coach Alex"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Day</label>
                    <select
                      required
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                      className="w-full px-4 py-3 bg-black/80 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none cursor-pointer"
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Time</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 bg-black/80 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      required
                      min="15"
                      max="180"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Capacity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="50"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Credits Required</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="5"
                      value={formData.creditsRequired}
                      onChange={(e) => setFormData({ ...formData, creditsRequired: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Level</label>
                    <select
                      required
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                      className="w-full px-4 py-3 bg-black/80 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none cursor-pointer"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="all-levels">All Levels</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-bold mb-2">Description (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none resize-none"
                    placeholder="Brief description of the class..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-neonGreen text-black font-bold rounded-full hover:bg-neonGreen/90 transition-all duration-300"
                  >
                    {editingClass ? 'Update Class' : 'Create Class'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 bg-white/5 text-white font-bold rounded-full hover:bg-white/10 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
