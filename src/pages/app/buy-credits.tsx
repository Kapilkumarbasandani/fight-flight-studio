import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import { CreditCard, Check, Upload, Copy, CheckCircle } from "lucide-react";
import { useRouter } from "next/router";

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  perClass: number;
  popular: boolean;
  validityDays: number;
  description: string;
  note: string;
}

export default function BuyCreditsPage() {
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<CreditPack | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [upiId, setUpiId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [creditPacks, setCreditPacks] = useState<CreditPack[]>([]);
  const [paymentInfo, setPaymentInfo] = useState({ upiId: "", qrCodeUrl: "" });

  useEffect(() => {
    fetch("/api/credit-packages")
      .then((res) => res.json())
      .then((data: CreditPack[]) => setCreditPacks(data))
      .catch((err) => console.error("Failed to load credit packages:", err));
  }, []);

  const handleSelectPack = async (pack: CreditPack) => {
    setSelectedPack(pack);
    
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);

    // Initiate payment
    try {
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          amount: pack.price,
          credits: pack.credits,
          packName: pack.name,
          paymentMethod: 'UPI'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentId(data.paymentId);
        if (data.paymentInfo) {
          setPaymentInfo(data.paymentInfo);
        }
        setShowPaymentModal(true);
      } else {
        showToast("Failed to initiate payment", "error");
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      showToast("Failed to initiate payment", "error");
    }
  };

  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      showToast("Please enter transaction ID", "error");
      return;
    }

    // Validate transaction ID - allow 8-24 alphanumeric characters (covers all UPI/IMPS/NEFT formats)
    if (!/^[A-Za-z0-9]{8,24}$/.test(transactionId.trim())) {
      showToast('Please enter a valid transaction ID (8–24 alphanumeric characters)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId,
          transactionId,
          upiId: upiId || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Payment submitted! Credits will be added once admin verifies the transaction.", "success");
        
        setShowPaymentModal(false);
        setTransactionId("");
        setUpiId("");
        setTimeout(() => {
          router.push('/app/credits');
        }, 3000);
      } else {
        showToast(data.error || "Failed to submit payment", "error");
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      showToast("Failed to submit payment. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!", "success");
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  return (
    <>
      <SEO 
        title="Buy Credits - Fight&Flight"
        description="Purchase credit packs for classes"
      />
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Buy <span className="text-[#39FF14]">Credits</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose a credit pack and make payment via UPI to get started
            </p>
          </div>

          {/* Credit Packs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creditPacks.map((pack) => (
              <div
                key={pack.name}
                className={`glass-card p-6 hover:scale-[1.02] transition-all duration-300 relative ${
                  pack.popular ? 'border-2 border-[#39FF14]' : ''
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#39FF14] text-gray-900 rounded-full text-sm font-bold">
                    POPULAR
                  </div>
                )}
                {!pack.popular && pack.description && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-[#FF2D55] text-white rounded-full text-xs font-bold">
                    {pack.description}
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{pack.name}</h3>
                  <div className="text-5xl font-bold text-[#39FF14] mb-2">
                    {pack.credits}
                  </div>
                  <p className="text-gray-400">Credits</p>
                </div>
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-white mb-1">
                    ₹{pack.price.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-400">
                    ₹{pack.perClass} per credit
                  </p>
                </div>
                <button
                  onClick={() => handleSelectPack(pack)}
                  className="w-full px-6 py-3 bg-[#39FF14] text-gray-900 rounded-lg font-semibold hover:bg-[#32d612] transition-colors"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>

          {/* How it Works */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              How to Complete Payment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#39FF14] text-gray-900 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Select Pack</h3>
                <p className="text-gray-400 text-sm">Choose your desired credit pack</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#39FF14] text-gray-900 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Pay via UPI</h3>
                <p className="text-gray-400 text-sm">Scan QR code or use UPI ID</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#39FF14] text-gray-900 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Submit Transaction ID</h3>
                <p className="text-gray-400 text-sm">Enter transaction ID for verification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPack && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  disabled={submitting}
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Pack Details */}
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Pack</span>
                    <span className="text-white font-semibold">{selectedPack.name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Credits</span>
                    <span className="text-white font-semibold">{selectedPack.credits}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-gray-400 font-semibold">Total Amount</span>
                    <span className="text-[#39FF14] font-bold text-xl">₹{selectedPack.price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Payment Instructions</h3>
                  
                  {/* UPI ID */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">UPI ID</p>
                    <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                      <span className="text-white font-mono">{paymentInfo.upiId}</span>
                      <button
                        onClick={() => copyToClipboard(paymentInfo.upiId)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 text-[#39FF14]" />
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-400 mb-4">Scan QR Code</p>
                    <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center p-2">
                      <img 
                        src={paymentInfo.qrCodeUrl} 
                        alt="Payment QR Code" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Scan with any UPI app to pay</p>
                  </div>

                  {/* Transaction ID Input */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Transaction ID / UTR <span className="text-[#FF2D55]">*</span>
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]"
                      placeholder="e.g. 427112345678 or HDFC24031200001"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the UTR / transaction reference from your UPI app</p>
                  </div>

                  {/* UPI ID Input (Optional) */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Your UPI ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#39FF14]"
                      placeholder="yourname@upi"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitPayment}
                  disabled={submitting || !transactionId.trim()}
                  className="w-full px-6 py-4 bg-[#39FF14] text-gray-900 rounded-lg font-semibold hover:bg-[#32d612] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-gray-900" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Payment
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Credits will be added to your account once the admin verifies your transaction.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-[#39FF14] text-gray-900' : 'bg-[#FF2D55] text-white'
          } font-semibold z-50`}>
            {toast.message}
          </div>
        )}
      </DashboardLayout>
    </>
  );
}
