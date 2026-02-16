import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera, Bell, Lock, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import type { UserResponse } from "@/models/User";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        try {
          const response = await fetch(`/api/user/profile?userId=${userData._id}`);
          if (response.ok) {
            const fullUserData = await response.json();
            setUser(fullUserData);
            setAddress(fullUserData.profile?.address || '');
            setBirthday(fullUserData.profile?.birthday || '');
          } else {
            setUser(userData);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUser(userData);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          profile: {
            address,
            birthday,
          },
        }),
      });

      if (response.ok) {
        const { user: updatedUser } = await response.json();
        setUser(updatedUser);
        
        // Update localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          localStorage.setItem('user', JSON.stringify({ ...userData, profile: updatedUser.profile }));
        }
        
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const formatMemberSince = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Billing", icon: CreditCard }
  ];

  return (
    <>
      <SEO title="Profile - Fight&Flight" description="Manage your account" />
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              Your <span className="text-neonPink">Profile</span>
            </h1>
            <p className="text-white/60 text-lg">Manage your account settings</p>
          </div>

          <div className="glass-card p-8 border border-white/10">
            <div className="flex flex-col md:flex-row items-start gap-8 pb-8 border-b border-white/10">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neonGreen to-neonPink flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 p-3 bg-neonGreen text-black rounded-full hover:bg-neonGreen/90 transition-all duration-300 group-hover:scale-110">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-black text-white mb-2">{user?.name || 'Loading...'}</h2>
                <p className="text-white/60 mb-4">Member since {user?.createdAt ? formatMemberSince(user.createdAt) : 'N/A'}</p>
                <div className="flex items-center gap-4">
                  {user?.hero?.levelName && (
                    <div className="px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-lg">
                      <p className="text-yellow-400 font-bold text-sm">{user.hero.levelName}</p>
                    </div>
                  )}
                  {user?.hero?.level && (
                    <div className="px-4 py-2 glass-card border border-white/10 rounded-lg">
                      <p className="text-white/60 font-bold text-sm">Level {user.hero.level}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-8 mb-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id
                        ? "bg-neonGreen text-black"
                        : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {activeTab === "personal" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      readOnly
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Email</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                      <Mail className="w-4 h-4 text-white/40" />
                      <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="flex-1 bg-transparent text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Phone</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                      <Phone className="w-4 h-4 text-white/40" />
                      <input
                        type="tel"
                        value={user?.whatsapp || ''}
                        readOnly
                        className="flex-1 bg-transparent text-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm font-bold mb-2">Birthday</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-white/40" />
                      <input
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className="flex-1 bg-transparent text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-bold mb-2">Address</label>
                  <div className="flex items-start gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
                    <MapPin className="w-4 h-4 text-white/40 mt-1" />
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your address"
                      rows={3}
                      className="flex-1 bg-transparent text-white focus:outline-none resize-none placeholder:text-white/30"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-8 py-3 bg-neonGreen text-black font-bold rounded-lg hover:bg-neonGreen/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                {[
                  { title: "Class Reminders", desc: "Get notified before your scheduled classes" },
                  { title: "Booking Confirmations", desc: "Receive booking and cancellation updates" },
                  { title: "Credit Alerts", desc: "Notifications when credits are running low" },
                  { title: "Achievement Unlocks", desc: "Celebrate when you earn new badges" },
                  { title: "Studio Announcements", desc: "Important updates from Fight&Flight" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h3 className="text-white font-bold mb-1">{item.title}</h3>
                      <p className="text-white/60 text-sm">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neonGreen"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-white/60 text-sm font-bold mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-bold mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-bold mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none transition-all duration-300"
                  />
                </div>
                <button className="px-8 py-3 bg-neonGreen text-black font-bold rounded-lg hover:bg-neonGreen/90 transition-all duration-300">
                  Update Password
                </button>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-bold mb-1">Current Plan</h3>
                      <p className="text-neonGreen text-2xl font-black">
                        {user?.membership?.type === 'unlimited' ? 'Unlimited' : 
                         user?.membership?.type === 'flex-5' ? 'Flex 5' : 
                         user?.membership?.type === 'drop-in' ? 'Drop-in' : 'No Plan'}
                      </p>
                    </div>
                    <a href="/app/credits" className="px-6 py-2 glass-card border border-white/10 text-white font-bold rounded-lg hover:border-neonPink/50 transition-all duration-300">
                      Buy Credits
                    </a>
                  </div>
                  {user?.membership?.endDate && (
                    <p className="text-white/60 text-sm">
                      Plan expires: {new Date(user.membership.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-white font-bold mb-4">Credits Balance</h3>
                  <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-center">
                      <p className="text-4xl font-black text-neonGreen mb-2">{user?.credits?.balance || 0}</p>
                      <p className="text-white/60 text-sm">Available Credits</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}