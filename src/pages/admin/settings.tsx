import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { Settings, Check, X, Globe, Phone, Mail, MapPin } from "lucide-react";
import { useAdminProtection } from "@/hooks/use-admin-protection";

interface StudioInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
  googleMapsEmbed: string;
  social: { instagram: string; facebook: string; twitter: string };
}

export default function AdminSettings() {
  const { user, loading: authLoading, isAdmin } = useAdminProtection();
  const [form, setForm] = useState<StudioInfo>({
    name: "", address: "", phone: "", email: "",
    googleMapsUrl: "", googleMapsEmbed: "",
    social: { instagram: "", facebook: "", twitter: "" },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (user && isAdmin) fetchSettings();
  }, [user, isAdmin]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setForm(data);
      } else {
        // fallback: use public endpoint
        const pub = await fetch("/api/studio-info");
        if (pub.ok) setForm(await pub.json());
      }
    } catch {
      showToast("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast("Settings saved — changes are now live on the website", "success");
      } else {
        showToast("Failed to save settings", "error");
      }
    } catch {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const set = (field: keyof StudioInfo, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const setSocial = (key: keyof StudioInfo["social"], value: string) =>
    setForm(prev => ({ ...prev, social: { ...prev.social, [key]: value } }));

  return (
    <>
      <SEO title="Studio Settings - Admin" description="Manage studio contact information" />
      {authLoading ? (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14]" />
        </div>
      ) : !isAdmin ? null : (
        <DashboardLayout>
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Studio <span className="text-[#39FF14]">Settings</span>
              </h1>
              <p className="text-gray-400 text-lg">Update studio contact info — reflects instantly in the website footer and contact sections</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14]" />
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-6">
                {/* Basic Info */}
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#39FF14]" /> Basic Information
                  </h2>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Studio Name</label>
                    <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" />Address
                    </label>
                    <textarea rows={3} value={form.address} onChange={e => set("address", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14] resize-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        <Phone className="w-4 h-4 inline mr-1" />Phone
                      </label>
                      <input type="text" value={form.phone} onChange={e => set("phone", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        <Mail className="w-4 h-4 inline mr-1" />Email
                      </label>
                      <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" />
                    </div>
                  </div>
                </div>

                {/* Maps */}
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#39FF14]" /> Google Maps
                  </h2>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Maps Link (full URL)</label>
                    <input type="url" value={form.googleMapsUrl} onChange={e => set("googleMapsUrl", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" placeholder="https://www.google.com/maps/..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Embed URL (from Google Maps → Share → Embed)</label>
                    <input type="url" value={form.googleMapsEmbed} onChange={e => set("googleMapsEmbed", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" placeholder="https://www.google.com/maps/embed?pb=..." />
                  </div>
                </div>

                {/* Social */}
                <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
                  <h2 className="text-lg font-semibold text-white">Social Media</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Instagram URL</label>
                      <input type="text" value={form.social.instagram} onChange={e => setSocial("instagram", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" placeholder="https://instagram.com/..." />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Facebook URL</label>
                      <input type="text" value={form.social.facebook} onChange={e => setSocial("facebook", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" placeholder="https://facebook.com/..." />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Twitter / X URL</label>
                      <input type="text" value={form.social.twitter} onChange={e => setSocial("twitter", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" placeholder="https://twitter.com/..." />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={saving}
                  className="w-full py-4 rounded-xl bg-[#39FF14] text-black font-bold text-lg hover:bg-[#39FF14]/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </form>
            )}
          </div>

          {toast && (
            <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 ${toast.type === "success" ? "bg-[#39FF14]/20 border border-[#39FF14]" : "bg-red-500/20 border border-red-500"}`}>
              {toast.type === "success" ? <Check className="w-5 h-5 text-[#39FF14]" /> : <X className="w-5 h-5 text-red-500" />}
              <span className="text-white font-semibold">{toast.message}</span>
            </div>
          )}
        </DashboardLayout>
      )}
    </>
  );
}
