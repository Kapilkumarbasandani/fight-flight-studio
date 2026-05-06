import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { User, Mail, Phone, MapPin, Calendar, Edit, Camera, Bell, Lock, CreditCard } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { UserResponse } from "@/models/User";
import { getHashedRoute } from "@/lib/route-hash";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [profilePicture, setProfilePicture] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; ok: boolean } | null>(null);

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
            setProfilePicture(fullUserData.profile?.profilePicture || '');
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePicture(base64String);
        setUploadingImage(false);
      };
      reader.onerror = () => {
        alert('Error reading file');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
      setUploadingImage(false);
    }
  };

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
            profilePicture,
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

  const handleChangePassword = async () => {
    if (!user) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ text: 'All fields are required', ok: false });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ text: 'New passwords do not match', ok: false });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters', ok: false });
      return;
    }
    setChangingPassword(true);
    setPasswordMsg(null);
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, currentPassword, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setPasswordMsg({ text: 'Password updated successfully!', ok: true });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ text: data.error || 'Failed to update password', ok: false });
      }
    } catch (error) {
      setPasswordMsg({ text: 'Error updating password', ok: false });
    } finally {
      setChangingPassword(false);
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
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-1">
              Your <span className="text-neonPink">Profile</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-lg">Manage your account settings</p>
          </div>

          <div className="glass-card p-5 sm:p-8 border border-white/10 overflow-hidden">
            <div className="flex flex-row items-center gap-4 sm:gap-8 pb-5 sm:pb-8 border-b border-white/10">
              <div className="relative group flex-shrink-0">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-neonGreen to-neonPink flex items-center justify-center overflow-hidden border-4 border-white/10">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
                  )}
                </div>
                <label htmlFor="profile-picture-upload" className="absolute bottom-0 right-0 p-2 sm:p-3 bg-neonGreen text-black rounded-full hover:bg-neonGreen/90 transition-all duration-300 group-hover:scale-110 cursor-pointer">
                  {uploadingImage ? (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </label>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-3xl font-black text-white mb-1 truncate">{user?.name || 'Loading...'}</h2>
                <p className="text-white/60 text-xs sm:text-base mb-2 sm:mb-4">Member since {user?.createdAt ? formatMemberSince(user.createdAt) : 'N/A'}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {user?.hero?.levelName && (
                    <div className="px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-lg">
                      <p className="text-yellow-400 font-bold text-xs sm:text-sm">{user.hero.levelName}</p>
                    </div>
                  )}
                  {user?.hero?.level && (
                    <div className="px-2 sm:px-4 py-1 sm:py-2 glass-card border border-white/10 rounded-lg">
                      <p className="text-white/60 font-bold text-xs sm:text-sm">Level {user.hero.level}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs — scrollable on mobile with compact sizing */}
            <div className="flex gap-1.5 sm:gap-2 mt-5 sm:mt-8 mb-5 sm:mb-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-lg font-bold whitespace-nowrap text-xs sm:text-sm transition-all duration-300 flex-shrink-0 ${
                      activeTab === tab.id
                        ? "bg-neonGreen text-black"
                        : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
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
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-bold mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm font-bold mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-neonGreen focus:outline-none transition-all duration-300"
                  />
                </div>
                {passwordMsg && (
                  <p className={`text-sm font-semibold ${passwordMsg.ok ? 'text-neonGreen' : 'text-[#FF2D55]'}`}>
                    {passwordMsg.text}
                  </p>
                )}
                <button
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="px-8 py-3 bg-neonGreen text-black font-bold rounded-lg hover:bg-neonGreen/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {changingPassword ? 'Updating...' : 'Update Password'}
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
                    <Link href={getHashedRoute("/app/credits")} className="px-6 py-2 glass-card border border-white/10 text-white font-bold rounded-lg hover:border-neonPink/50 transition-all duration-300">
                      Buy Credits
                    </Link>
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