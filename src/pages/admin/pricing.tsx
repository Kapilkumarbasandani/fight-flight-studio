import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect, useRef } from "react";
import { Tag, Plus, Trash2, Edit, Check, X, RefreshCcw, Star } from "lucide-react";
import { useAdminProtection } from "@/hooks/use-admin-protection";

interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  perClass: number;
  popular: boolean;
  validityDays: number;
  description: string;
  note: string;
  active: boolean;
  sortOrder: number;
}

const EMPTY_FORM = {
  name: "",
  credits: 1,
  price: 0,
  validityDays: 30,
  description: "",
  note: "",
  popular: false,
};

export default function AdminPricing() {
  const { user, loading: authLoading, isAdmin } = useAdminProtection();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<CreditPackage | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<CreditPackage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user && isAdmin) {
      fetchPackages();
      pollRef.current = setInterval(fetchPackages, 30000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [user, isAdmin]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/credit-packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
        setLastUpdated(new Date());
      }
    } catch (e) {
      showToast("Failed to fetch packages", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setEditingPkg(null);
    setFormData({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (pkg: CreditPackage) => {
    setEditingPkg(pkg);
    setFormData({
      name: pkg.name,
      credits: pkg.credits,
      price: pkg.price,
      validityDays: pkg.validityDays,
      description: pkg.description,
      note: pkg.note,
      popular: pkg.popular,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = {
        ...formData,
        credits: Number(formData.credits),
        price: Number(formData.price),
        validityDays: Number(formData.validityDays),
        perClass: Math.round(Number(formData.price) / Number(formData.credits)),
      };
      let res: Response;
      if (editingPkg) {
        res = await fetch(`/api/admin/credit-packages/${editingPkg.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/admin/credit-packages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      if (res.ok) {
        showToast(editingPkg ? "Package updated" : "Package created", "success");
        setShowModal(false);
        fetchPackages();
      } else {
        const d = await res.json();
        showToast(d.error || "Failed to save", "error");
      }
    } catch {
      showToast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (pkg: CreditPackage) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/credit-packages/${pkg.id}`, { method: "DELETE" });
      if (res.ok) {
        setPackages(prev => prev.filter(p => p.id !== pkg.id));
        showToast("Package deleted", "success");
        setDeleteConfirm(null);
      } else {
        showToast("Failed to delete", "error");
      }
    } catch {
      showToast("Failed to delete", "error");
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (pkg: CreditPackage) => {
    try {
      const res = await fetch(`/api/admin/credit-packages/${pkg.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !pkg.active }),
      });
      if (res.ok) {
        setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, active: !p.active } : p));
      }
    } catch {}
  };

  return (
    <>
      <SEO title="Pricing Management - Admin" description="Manage credit packages and pricing" />
      {authLoading ? (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14]" />
        </div>
      ) : !isAdmin ? null : (
        <DashboardLayout>
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  Pricing <span className="text-[#39FF14]">Management</span>
                </h1>
                <p className="text-gray-400 text-lg">Manage credit packages — changes reflect instantly across the entire website</p>
                {lastUpdated && (
                  <p className="text-gray-500 text-xs mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={fetchPackages} title="Refresh" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <RefreshCcw className="w-5 h-5 text-gray-400" />
                </button>
                <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-[#39FF14] text-black font-bold rounded-full hover:bg-[#39FF14]/90 transition-all">
                  <Plus className="w-5 h-5" />
                  Add Package
                </button>
              </div>
            </div>

            {/* Packages Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14]" />
              </div>
            ) : packages.length === 0 ? (
              <div className="glass-card p-12 text-center text-white/40">
                <Tag className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No pricing packages yet. Click "Add Package" to create one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {packages.map(pkg => (
                  <div key={pkg.id} className={`glass-card rounded-2xl p-6 border transition-all ${pkg.popular ? 'border-[#39FF14]/50' : 'border-white/10'} ${!pkg.active ? 'opacity-50' : ''}`}>
                    {pkg.popular && (
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 text-[#39FF14] fill-[#39FF14]" />
                        <span className="text-xs text-[#39FF14] font-bold uppercase tracking-wider">Popular</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                        <p className="text-gray-400 text-sm mt-1">{pkg.description}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(pkg)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(pkg)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-[#39FF14]">{pkg.credits}</p>
                        <p className="text-gray-400 text-xs">Credits</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-white">₹{pkg.price.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">Price</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-blue-400">₹{pkg.perClass}</p>
                        <p className="text-gray-400 text-xs">Per Class</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-yellow-400">{pkg.validityDays}d</p>
                        <p className="text-gray-400 text-xs">Validity</p>
                      </div>
                    </div>
                    {pkg.note && <p className="text-gray-500 text-xs italic mb-3">{pkg.note}</p>}
                    <button
                      onClick={() => toggleActive(pkg)}
                      className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${pkg.active ? 'bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400' : 'bg-[#39FF14]/10 text-[#39FF14] hover:bg-[#39FF14]/20'}`}
                    >
                      {pkg.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add / Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white">{editingPkg ? "Edit Package" : "Add Package"}</h3>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-lg">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Package Name *</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" placeholder="e.g. The Warrior" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Credits *</label>
                      <input type="number" required min={1} value={formData.credits} onChange={e => setFormData(p => ({ ...p, credits: Number(e.target.value) }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Price (₹) *</label>
                      <input type="number" required min={0} value={formData.price} onChange={e => setFormData(p => ({ ...p, price: Number(e.target.value) }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Validity (days) *</label>
                    <input type="number" required min={1} value={formData.validityDays} onChange={e => setFormData(p => ({ ...p, validityDays: Number(e.target.value) }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <input type="text" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" placeholder="Short tagline" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Note</label>
                    <input type="text" value={formData.note} onChange={e => setFormData(p => ({ ...p, note: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#39FF14]" placeholder="e.g. Best value" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setFormData(p => ({ ...p, popular: !p.popular }))}
                      className={`w-10 h-6 rounded-full transition-all ${formData.popular ? 'bg-[#39FF14]' : 'bg-white/10'}`}>
                      <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${formData.popular ? 'translate-x-4' : ''}`} />
                    </button>
                    <span className="text-gray-300 text-sm">Mark as Popular</span>
                  </div>
                  <div className="mt-2 bg-white/5 rounded-lg p-3 text-sm text-gray-400">
                    Per class: <span className="text-white font-semibold">₹{formData.credits > 0 ? Math.round(formData.price / formData.credits) : 0}</span>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)}
                      className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all">Cancel</button>
                    <button type="submit" disabled={saving}
                      className="flex-1 py-3 rounded-xl bg-[#39FF14] text-black font-bold hover:bg-[#39FF14]/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                      {editingPkg ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirm */}
          {deleteConfirm && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-2">Delete Package</h3>
                <p className="text-gray-400 mb-6">Delete <span className="text-white font-semibold">{deleteConfirm.name}</span>? This cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} disabled={deleting}
                    className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all">Cancel</button>
                  <button onClick={() => handleDelete(deleteConfirm)} disabled={deleting}
                    className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {deleting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

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
