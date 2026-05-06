import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect, useRef } from "react";
import { CreditCard, Check, X, Eye, Filter, ArrowLeft, AlertCircle, CheckCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useAdminProtection } from "@/hooks/use-admin-protection";
import { useRouter } from "next/router";

interface Payment {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  credits: number;
  packName: string;
  paymentMethod: string;
  status: 'pending' | 'submitted' | 'verified' | 'rejected';
  transactionId: string | null;
  upiId: string | null;
  screenshot: string | null;
  createdAt: string;
  submittedAt?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  notes?: string;
}

export default function PaymentsManagement() {
  const { user, loading: authLoading, isAdmin } = useAdminProtection();
  const router = useRouter();
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [verifyNotes, setVerifyNotes] = useState('');
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize status filter from URL query param
  useEffect(() => {
    if (router.isReady) {
      const queryStatus = router.query.status as string;
      if (queryStatus && ['all', 'submitted', 'verified', 'rejected', 'pending'].includes(queryStatus)) {
        setStatusFilter(queryStatus);
      }
    }
  }, [router.isReady, router.query.status]);

  useEffect(() => {
    if (user && isAdmin) {
      loadPayments();
      pollRef.current = setInterval(() => {
        loadPayments();
      }, 30000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [user, isAdmin]);

  const loadPayments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Always fetch all payments so tab counts are accurate; filter client-side
      const response = await fetch(`/api/admin/payments?userRole=${user.role}&status=all`);
      if (response.ok) {
        const data = await response.json();
        setAllPayments(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error("Failed to load payments:", error);
      showToast("Failed to load payments", "error");
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtered view
  const payments = statusFilter === 'all'
    ? allPayments
    : allPayments.filter(p => p.status === statusFilter);

  const handleVerifyPayment = async (paymentId: string, action: 'verify' | 'reject') => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}?userRole=${user.role}&userId=${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes: verifyNotes })
      });

      if (response.ok) {
        showToast(`Payment ${action === 'verify' ? 'verified' : 'rejected'} successfully`, "success");
        setShowModal(false);
        setSelectedPayment(null);
        setVerifyNotes('');
        loadPayments();
      } else {
        showToast(`Failed to ${action} payment`, "error");
      }
    } catch (error) {
      console.error(`Error ${action}ing payment:`, error);
      showToast(`Failed to ${action} payment`, "error");
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-[#39FF14] bg-[#39FF14]/10';
      case 'rejected': return 'text-[#FF2D55] bg-[#FF2D55]/10';
      case 'submitted': return 'text-yellow-500 bg-yellow-500/10';
      case 'pending': return 'text-gray-400 bg-gray-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      case 'submitted': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <>
      <SEO 
        title="Payment Management - Admin Dashboard"
        description="Manage and verify user payments"
      />
      {authLoading ? (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14] mx-auto mb-4" />
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      ) : !isAdmin ? null : (
        <DashboardLayout>
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/admin" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Payment <span className="text-[#39FF14]">Management</span>
                  </h1>
                  <p className="text-gray-400">Verify and track all payment transactions</p>
                  {lastUpdated && (
                    <p className="text-gray-500 text-xs mt-1">
                      Last updated: {lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => loadPayments()}
                title="Refresh now"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCcw className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'submitted', 'verified', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    statusFilter === status
                      ? 'bg-[#39FF14] text-gray-900'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  {status !== 'all' && (
                    <span className="ml-2 text-sm">
                      ({allPayments.filter(p => p.status === status).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Payments List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#39FF14]" />
              </div>
            ) : payments.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Payments Found</h3>
                <p className="text-gray-400">No payment transactions to display.</p>
              </div>
            ) : (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/10">
                      <tr className="text-left">
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">User</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Pack</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Amount</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Transaction ID</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Date</th>
                        <th className="px-6 py-4 text-sm font-semibold text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {payments.map((payment) => (
                        <tr key={payment._id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-white font-medium">{payment.userName}</p>
                              <p className="text-sm text-gray-400">{payment.userEmail}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-white">{payment.packName}</p>
                            <p className="text-sm text-gray-400">{payment.credits} credits</p>
                          </td>
                          <td className="px-6 py-4 text-white font-semibold">
                            ₹{payment.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-400 font-mono">
                              {payment.transactionId || 'N/A'}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                              {getStatusIcon(payment.status)}
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setShowModal(true);
                                }}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 text-gray-400" />
                              </button>
                              {payment.status === 'submitted' && (
                                <>
                                  <button
                                    onClick={() => handleVerifyPayment(payment._id, 'verify')}
                                    className="p-2 hover:bg-[#39FF14]/10 rounded-lg transition-colors"
                                    title="Verify Payment"
                                  >
                                    <Check className="w-4 h-4 text-[#39FF14]" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedPayment(payment);
                                      setShowModal(true);
                                    }}
                                    className="p-2 hover:bg-[#FF2D55]/10 rounded-lg transition-colors"
                                    title="Reject Payment"
                                  >
                                    <X className="w-4 h-4 text-[#FF2D55]" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Payment Details Modal */}
            {showModal && selectedPayment && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                <div className="glass-card w-full max-w-lg flex flex-col" style={{ maxHeight: '90vh' }}>
                  {/* Sticky Header */}
                  <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 flex-shrink-0">
                    <div>
                      <h2 className="text-xl font-bold text-white">Payment Details</h2>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(selectedPayment.status)}`}>
                        {getStatusIcon(selectedPayment.status)}
                        {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                      </span>
                    </div>
                    <button
                      onClick={() => { setShowModal(false); setSelectedPayment(null); setVerifyNotes(''); }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Scrollable Body */}
                  <div className="overflow-y-auto flex-1 px-6 py-4 space-y-3">
                    {/* User info */}
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">User</p>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Name</span>
                        <span className="text-sm text-white font-medium">{selectedPayment.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Email</span>
                        <span className="text-sm text-white font-medium break-all text-right">{selectedPayment.userEmail}</span>
                      </div>
                    </div>

                    {/* Pack info */}
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Package</p>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Pack</span>
                        <span className="text-sm text-white font-medium">{selectedPayment.packName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Credits</span>
                        <span className="text-sm text-[#39FF14] font-bold">{selectedPayment.credits}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-white/10">
                        <span className="text-sm text-gray-400 font-semibold">Amount</span>
                        <span className="text-sm text-white font-bold">₹{selectedPayment.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Payment info */}
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Transaction</p>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Method</span>
                        <span className="text-sm text-white font-medium">{selectedPayment.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Transaction ID</span>
                        <span className="text-sm text-white font-mono break-all text-right ml-4">{selectedPayment.transactionId || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">UPI ID</span>
                        <span className="text-sm text-white font-medium">{selectedPayment.upiId || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Submitted</span>
                        <span className="text-sm text-white font-medium">
                          {selectedPayment.submittedAt
                            ? new Date(selectedPayment.submittedAt).toLocaleString()
                            : new Date(selectedPayment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {selectedPayment.verifiedAt && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-400">Verified At</span>
                          <span className="text-sm text-white font-medium">{new Date(selectedPayment.verifiedAt).toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Notes textarea — only for submitted */}
                    {selectedPayment.status === 'submitted' && (
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Admin Notes (Optional)</label>
                        <textarea
                          value={verifyNotes}
                          onChange={(e) => setVerifyNotes(e.target.value)}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]"
                          rows={2}
                          placeholder="Add any notes about this payment..."
                        />
                      </div>
                    )}
                  </div>

                  {/* Sticky Footer — action buttons */}
                  {selectedPayment.status === 'submitted' && (
                    <div className="flex gap-3 px-6 py-4 border-t border-white/10 flex-shrink-0">
                      <button
                        onClick={() => handleVerifyPayment(selectedPayment._id, 'verify')}
                        className="flex-1 px-4 py-3 bg-[#39FF14] text-gray-900 rounded-lg font-semibold hover:bg-[#32d612] transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Accept & Add Credits
                      </button>
                      <button
                        onClick={() => handleVerifyPayment(selectedPayment._id, 'reject')}
                        className="flex-1 px-4 py-3 bg-[#FF2D55] text-white rounded-lg font-semibold hover:bg-[#e02850] transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Toast Notification */}
            {toast && (
              <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
                toast.type === 'success' ? 'bg-[#39FF14] text-gray-900' : 'bg-[#FF2D55] text-white'
              } font-semibold z-50`}>
                {toast.message}
              </div>
            )}
          </div>
        </DashboardLayout>
      )}
    </>
  );
}
