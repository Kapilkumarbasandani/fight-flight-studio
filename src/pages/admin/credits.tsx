import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState } from "react";
import { CreditCard, Plus, Minus, Search, TrendingUp, TrendingDown, X, Check } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  credits: number;
  level: string;
}

interface AdjustmentHistory {
  id: string;
  memberName: string;
  amount: number;
  reason: string;
  adminName: string;
  timestamp: string;
}

export default function AdminCredits() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState<number>(0);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "deduct">("add");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [members] = useState<Member[]>([
    { id: "1", name: "Sarah Johnson", email: "sarah@example.com", credits: 8, level: "Warrior" },
    { id: "2", name: "Mike Chen", email: "mike@example.com", credits: 3, level: "Trainee" },
    { id: "3", name: "Emma Davis", email: "emma@example.com", credits: 15, level: "Immortal" },
    { id: "4", name: "James Wilson", email: "james@example.com", credits: 0, level: "Sidekick" },
    { id: "5", name: "Lisa Anderson", email: "lisa@example.com", credits: 12, level: "Superhero" }
  ]);

  const [adjustmentHistory, setAdjustmentHistory] = useState<AdjustmentHistory[]>([
    { id: "1", memberName: "Sarah Johnson", amount: 5, reason: "Compensation for technical issue", adminName: "Admin", timestamp: "2026-02-03 10:30 AM" },
    { id: "2", memberName: "Mike Chen", amount: -2, reason: "Duplicate booking refund", adminName: "Admin", timestamp: "2026-02-03 09:15 AM" },
    { id: "3", memberName: "Emma Davis", amount: 10, reason: "Referral bonus", adminName: "Admin", timestamp: "2026-02-02 04:45 PM" }
  ]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectMember = (member: Member) => {
    setSelectedMember(member);
    setAdjustmentAmount(0);
    setReason("");
  };

  const handleSubmitAdjustment = async () => {
    if (!selectedMember || adjustmentAmount === 0 || !reason.trim()) {
      showToast("Please fill all fields", "error");
      return;
    }

    setLoading(true);
    try {
      // In production: await fetch('/api/admin/credits/adjust', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     memberId: selectedMember.id,
      //     amount: adjustmentType === 'add' ? adjustmentAmount : -adjustmentAmount,
      //     reason: reason
      //   })
      // })

      const finalAmount = adjustmentType === "add" ? adjustmentAmount : -adjustmentAmount;
      
      const newHistory: AdjustmentHistory = {
        id: Date.now().toString(),
        memberName: selectedMember.name,
        amount: finalAmount,
        reason: reason,
        adminName: "Admin",
        timestamp: new Date().toLocaleString()
      };

      setAdjustmentHistory([newHistory, ...adjustmentHistory]);
      showToast(`Successfully ${adjustmentType === 'add' ? 'added' : 'deducted'} ${adjustmentAmount} credits`, "success");
      
      setSelectedMember(null);
      setAdjustmentAmount(0);
      setReason("");
    } catch (error) {
      showToast("Failed to adjust credits", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Adjust Credits - Admin - Fight&Flight"
        description="Add or deduct member credits"
      />
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Adjust <span className="text-[#39FF14]">Credits</span>
              </h1>
              <p className="text-gray-400 text-lg">
                Add or deduct credits for members
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Member Selection */}
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#39FF14]/10">
                  <Search className="w-5 h-5 text-[#39FF14]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Select Member</h2>
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

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleSelectMember(member)}
                    className={`w-full p-4 rounded-lg border transition-all text-left ${
                      selectedMember?.id === member.id
                        ? "bg-[#39FF14]/10 border-[#39FF14]"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{member.name}</h3>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#39FF14] font-bold">{member.credits}</p>
                        <p className="text-gray-400 text-xs">{member.level}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Adjustment Form */}
            <div className="glass-card p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#FF2D55]/10">
                  <CreditCard className="w-5 h-5 text-[#FF2D55]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Credit Adjustment</h2>
              </div>

              {selectedMember ? (
                <>
                  <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-gray-400 text-sm mb-1">Selected Member</p>
                    <h3 className="text-white font-semibold text-lg">{selectedMember.name}</h3>
                    <p className="text-[#39FF14]">Current Balance: {selectedMember.credits} credits</p>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-3">Action Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setAdjustmentType("add")}
                        className={`p-4 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                          adjustmentType === "add"
                            ? "bg-[#39FF14]/10 border-[#39FF14]"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <Plus className={`w-5 h-5 ${adjustmentType === "add" ? "text-[#39FF14]" : "text-gray-400"}`} />
                        <span className={`font-semibold ${adjustmentType === "add" ? "text-[#39FF14]" : "text-gray-400"}`}>
                          Add Credits
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdjustmentType("deduct")}
                        className={`p-4 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                          adjustmentType === "deduct"
                            ? "bg-[#FF2D55]/10 border-[#FF2D55]"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <Minus className={`w-5 h-5 ${adjustmentType === "deduct" ? "text-[#FF2D55]" : "text-gray-400"}`} />
                        <span className={`font-semibold ${adjustmentType === "deduct" ? "text-[#FF2D55]" : "text-gray-400"}`}>
                          Deduct Credits
                        </span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Amount</label>
                    <input
                      type="number"
                      min="0"
                      value={adjustmentAmount || ""}
                      onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
                      placeholder="Enter amount..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-semibold mb-2">Reason</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Enter reason for adjustment..."
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#39FF14] transition-colors resize-none"
                    />
                  </div>

                  <button
                    onClick={handleSubmitAdjustment}
                    disabled={loading || adjustmentAmount === 0 || !reason.trim()}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-all ${
                      adjustmentType === "add"
                        ? "neon-button-green"
                        : "bg-[#FF2D55] hover:bg-[#FF2D55]/80 text-white"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? "Processing..." : `${adjustmentType === "add" ? "Add" : "Deduct"} ${adjustmentAmount} Credits`}
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CreditCard className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400">Select a member to adjust credits</p>
                </div>
              )}
            </div>
          </div>

          {/* Adjustment History */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-[#39FF14]/10">
                <TrendingUp className="w-5 h-5 text-[#39FF14]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Recent Adjustments</h2>
            </div>

            <div className="space-y-3">
              {adjustmentHistory.map((adjustment) => (
                <div key={adjustment.id} className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${adjustment.amount > 0 ? "bg-[#39FF14]/10" : "bg-[#FF2D55]/10"}`}>
                      {adjustment.amount > 0 ? (
                        <TrendingUp className="w-5 h-5 text-[#39FF14]" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-[#FF2D55]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{adjustment.memberName}</h3>
                      <p className="text-gray-400 text-sm">{adjustment.reason}</p>
                      <p className="text-gray-500 text-xs mt-1">
                        By {adjustment.adminName} • {adjustment.timestamp}
                      </p>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${adjustment.amount > 0 ? "text-[#39FF14]" : "text-[#FF2D55]"}`}>
                    {adjustment.amount > 0 ? "+" : ""}{adjustment.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

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