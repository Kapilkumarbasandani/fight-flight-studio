import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Zap, History, Download, AlertCircle, Check, X, Copy, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function CreditsPage() {
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creditData, setCreditData] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [activePaymentId, setActivePaymentId] = useState<string>('');
  const [transactionId, setTransactionId] = useState('');
  const [upiId, setUpiId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch user credits, packages and history
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user._id;

        if (!userId) {
          console.error('No user ID found');
          setLoading(false);
          return;
        }

        // Fetch credits balance
        const creditsRes = await fetch(`/api/credits?userId=${userId}`);
        if (!creditsRes.ok) throw new Error(`Server error: ${creditsRes.status}`);
        const creditsData = await creditsRes.json();
        setCreditData(creditsData);

        // Fetch credit packages
        const packagesRes = await fetch('/api/credit-packages');
        if (!packagesRes.ok) throw new Error(`Server error: ${packagesRes.status}`);
        const packagesData = await packagesRes.json();
        setPackages(packagesData);

        // Fetch credit history
        const historyRes = await fetch(`/api/credits/history?userId=${userId}&limit=10`);
        if (!historyRes.ok) throw new Error(`Server error: ${historyRes.status}`);
        const historyData = await historyRes.json();
        setHistory(historyData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching credit data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBuyClick = async (pkg: any) => {
    setSelectedPackage(pkg);
    
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id;

      if (!userId) {
        showToast('Please login to continue', 'error');
        return;
      }

      // Initiate payment
      const response = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          credits: pkg.credits,
          amount: pkg.price,
          packageId: pkg.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const data = await response.json();
      // Merge the top-level paymentId into paymentInfo so submit can access it
      setPaymentInfo({ ...data.paymentInfo, paymentId: data.paymentId });
      setActivePaymentId(data.paymentId);
      setShowCheckout(true);
    } catch (error) {
      console.error('Error initiating payment:', error);
      showToast('Failed to initiate payment. Please try again.', 'error');
    }
  };

  const fetchCreditData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user._id;

      if (!userId) {
        return;
      }

      // Fetch credits balance
      const creditsRes = await fetch(`/api/credits?userId=${userId}`);
      const creditsData = await creditsRes.json();
      setCreditData(creditsData);

      // Update localStorage with new balance
      const updatedUser = { ...user, credits: { balance: creditsData.balance } };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Fetch credit history
      const historyRes = await fetch(`/api/credits/history?userId=${userId}&limit=10`);
      const historyData = await historyRes.json();
      setHistory(historyData);
    } catch (error) {
      console.error('Error fetching credit data:', error);
    }
  };

  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      showToast('Please enter transaction ID', 'error');
      return;
    }

    // Validate transaction ID — allow 8-24 alphanumeric (covers all UPI/IMPS/NEFT/RTGS formats)
    if (!/^[A-Za-z0-9]{8,24}$/.test(transactionId.trim())) {
      showToast('Please enter a valid transaction ID (8–24 alphanumeric characters)', 'error');
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch('/api/payments/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId: activePaymentId,
          transactionId,
          upiId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit payment details');
      }

      setSubmitting(false);
      setSuccess(true);
      showToast(data.message || 'Payment submitted! Credits will be added once admin verifies.', 'success');
      
      // Refresh credit data to show updated balance
      await fetchCreditData();
      
      // Reset form
      setTransactionId('');
      setUpiId('');
      
      // Reset after success animation
      setTimeout(() => {
        setShowCheckout(false);
        setSuccess(false);
        setSelectedPackage(null);
        setPaymentInfo(null);
        setActivePaymentId('');
      }, 3000);
    } catch (error: any) {
      console.error('Submit payment error:', error);
      showToast(error.message || 'Failed to submit payment. Please try again.', 'error');
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'success');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const downloadInvoice = (url: string) => {
    // In production: trigger download from API
    console.log("Downloading invoice:", url);
    alert("Invoice download would start here");
  };

  return (
    <>
      <SEO title="Credits - Fight&Flight" description="Manage your class credits" />
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-1">
              Class <span className="text-neonPink">Credits</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-lg">Top up your balance to keep training</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-neonPink/30 border-t-neonPink rounded-full animate-spin mx-auto" />
              <p className="text-white/60 mt-4">Loading credits...</p>
            </div>
          ) : (
            <>
              {/* Expiring Credits Warning */}
              {creditData?.expiringCredits && creditData.expiringCredits.length > 0 && (
                <div className="glass-card p-4 border border-yellow-500/30 bg-yellow-500/10">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <div className="flex-1">
                      <p className="text-yellow-400 font-bold">Credits Expiring Soon</p>
                      <p className="text-white/60 text-sm">
                        {creditData.expiringCredits[0].amount} credits expire on {creditData.expiringCredits[0].expiryDate} ({creditData.expiringCredits[0].daysLeft} days left)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="md:col-span-2 space-y-4 sm:space-y-6">
              <div className="glass-card p-5 sm:p-8 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 sm:p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap className="w-24 h-24 sm:w-48 sm:h-48 text-neonPink transform rotate-12" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-lg sm:text-2xl font-black text-white mb-2">Current Balance</h2>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-4xl sm:text-6xl font-black text-neonPink">{creditData?.balance || 0}</span>
                    <span className="text-sm sm:text-xl text-white/60 font-bold mb-1">credits remaining</span>
                  </div>
                  <button className="px-4 sm:px-6 py-2 sm:py-3 text-sm bg-neonPink/10 text-neonPink font-bold rounded-lg hover:bg-neonPink hover:text-black transition-all duration-300">
                    Auto-Refill Settings
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-4 sm:mb-6">Buy Credits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => handleBuyClick(pkg)}
                      className={`glass-card p-4 sm:p-6 border text-left transition-all duration-300 active:scale-95 sm:hover:scale-105 ${
                        pkg.popular
                          ? "border-neonGreen/50 bg-neonGreen/5"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      {pkg.popular && (
                        <div className="mb-3">
                          <span className="px-2 py-1 bg-neonGreen text-black text-xs font-bold rounded">
                            MOST POPULAR
                          </span>
                        </div>
                      )}
                      <div className="text-2xl sm:text-3xl font-black text-white mb-0.5">{pkg.credits}</div>
                      <div className="text-white/60 text-xs sm:text-sm font-bold mb-3">Class Credits</div>
                      <div className="text-xl sm:text-2xl font-bold text-white mb-0.5">₹{pkg.price}</div>
                      <div className="text-white/40 text-xs">₹{pkg.perClass} / class</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-4 sm:p-8 border border-white/10 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <History className="w-5 h-5 text-neonGreen" />
                <h2 className="text-xl font-black text-white">History</h2>
              </div>
              <div className="space-y-4">
                {history.length > 0 ? history.map((item) => (
                  <div key={item._id} className="pb-4 border-b border-white/10 last:border-0">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-white font-bold text-sm flex-1">{item.action}</p>
                      {item.invoiceUrl && (
                        <button
                          onClick={() => downloadInvoice(item.invoiceUrl!)}
                          className="p-1 hover:bg-white/10 rounded transition-colors"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4 text-neonGreen" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">{item.date}</span>
                      <div className="flex items-center gap-2">
                        <span className={item.change.startsWith("+") ? "text-neonGreen font-bold" : "text-neonPink font-bold"}>
                          {item.change}
                        </span>
                        <span className="text-white/20">|</span>
                        <span className="text-white/60">Bal: {item.balance}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-white/40 text-sm text-center py-4">No transaction history</p>
                )}
              </div>
              <button className="w-full mt-4 text-center text-white/40 hover:text-white text-sm transition-colors">
                View All Transactions
              </button>
            </div>
          </div>
        </>
      )}

      {/* Payment Modal with QR and UPI */}
      {showCheckout && selectedPackage && paymentInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative animate-scale-in">
            <button 
              onClick={() => {
                setShowCheckout(false);
                setSelectedPackage(null);
                setPaymentInfo(null);
                setActivePaymentId('');
                setSuccess(false);
                setTransactionId('');
                setUpiId('');
              }}
              disabled={submitting}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>

            {success ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-neonGreen/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Check className="w-10 h-10 text-neonGreen" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Credits Added!</h3>
                <p className="text-white/60">Your payment has been verified and credits are now in your account</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black text-white mb-6">Complete Payment</h3>
                
                {/* Pack Details */}
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60">Package</span>
                    <span className="text-white font-bold">{selectedPackage.credits} Credits</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-white/60 font-semibold">Total Amount</span>
                    <span className="text-neonGreen font-black text-xl">₹{selectedPackage.price}</span>
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-bold text-white">Payment Instructions</h4>
                  
                  {/* UPI ID */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-white/60 mb-2">UPI ID</p>
                    <div className="flex items-center justify-between bg-black/30 rounded-lg p-3">
                      <span className="text-white font-mono">{paymentInfo.upiId}</span>
                      <button
                        onClick={() => copyToClipboard(paymentInfo.upiId)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 text-neonGreen" />
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <p className="text-sm text-white/60 mb-4">Scan QR Code</p>
                    <div className="w-48 h-48 bg-white rounded-lg mx-auto flex items-center justify-center p-2">
                      <img 
                        src={paymentInfo.qrCodeUrl} 
                        alt="Payment QR Code" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-white/60 mt-2">Scan with any UPI app to pay</p>
                  </div>

                  {/* Transaction ID Input */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Transaction ID / UTR <span className="text-neonPink">*</span>
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen"
                      placeholder="Enter 12-digit transaction ID"
                      required
                    />
                  </div>

                  {/* UPI ID Input (Optional) */}
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Your UPI ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-neonGreen"
                      placeholder="yourname@upi"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitPayment}
                  disabled={submitting || !transactionId.trim()}
                  className="w-full px-6 py-4 bg-neonGreen text-black font-bold rounded-lg hover:bg-neonGreen/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Payment
                    </>
                  )}
                </button>

                <p className="text-xs text-white/40 text-center mt-4">
                  Enter your 12-digit transaction ID to instantly verify and add credits to your account
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
          toast.type === 'success' ? 'bg-neonGreen text-black' : 'bg-neonPink text-white'
        } font-bold z-50`}>
          {toast.message}
        </div>
      )}
        </div>
      </DashboardLayout>
    </>
  );
}