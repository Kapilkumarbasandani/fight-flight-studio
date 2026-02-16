import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { CreditCard, Zap, Plus, History, Download, AlertCircle, Check, X } from "lucide-react";
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
        const creditsData = await creditsRes.json();
        setCreditData(creditsData);

        // Fetch credit packages
        const packagesRes = await fetch('/api/credit-packages');
        const packagesData = await packagesRes.json();
        setPackages(packagesData);

        // Fetch credit history
        const historyRes = await fetch(`/api/credits/history?userId=${userId}&limit=10`);
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

  const handleBuyClick = (pkg: any) => {
    setSelectedPackage(pkg);
    setShowCheckout(true);
  };

  const handleCheckout = () => {
    setProcessing(true);
    
    // Simulate Razorpay checkout flow
    // In production: POST /api/payments/create-order then launch Razorpay UI
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      // Reset after success animation
      setTimeout(() => {
        setShowCheckout(false);
        setSuccess(false);
        setSelectedPackage(null);
      }, 2000);
    }, 2000);
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
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              Class <span className="text-neonPink">Credits</span>
            </h1>
            <p className="text-white/60 text-lg">Top up your balance to keep training</p>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="glass-card p-8 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap className="w-48 h-48 text-neonPink transform rotate-12" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-black text-white mb-2">Current Balance</h2>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-6xl font-black text-neonPink">{creditData?.balance || 0}</span>
                    <span className="text-xl text-white/60 font-bold mb-2">credits remaining</span>
                  </div>
                  <button className="px-6 py-3 bg-neonPink/10 text-neonPink font-bold rounded-lg hover:bg-neonPink hover:text-black transition-all duration-300">
                    Auto-Refill Settings
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white mb-6">Buy Credits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {packages.map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => handleBuyClick(pkg)}
                      className={`glass-card p-6 border text-left transition-all duration-300 hover:scale-105 ${
                        pkg.popular
                          ? "border-neonGreen/50 bg-neonGreen/5"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      {pkg.popular && (
                        <div className="mb-4">
                          <span className="px-2 py-1 bg-neonGreen text-black text-xs font-bold rounded">
                            MOST POPULAR
                          </span>
                        </div>
                      )}
                      <div className="text-3xl font-black text-white mb-1">{pkg.credits}</div>
                      <div className="text-white/60 text-sm font-bold mb-4">Class Credits</div>
                      <div className="text-2xl font-bold text-white mb-1">${pkg.price}</div>
                      <div className="text-white/40 text-xs">${pkg.perClass} / class</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-8 border border-white/10 h-fit">
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
        </div>

        {/* Razorpay Checkout Simulation Modal */}
        {showCheckout && selectedPackage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card border border-white/20 max-w-md w-full p-8 relative animate-scale-in">
              <button 
                onClick={() => {
                  setShowCheckout(false);
                  setSelectedPackage(null);
                  setSuccess(false);
                }}
                disabled={processing}
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
                  <p className="text-white/60">Your account has been updated</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black text-white mb-6">Complete Purchase</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-white/60">Credits</span>
                      <span className="text-white font-bold">{selectedPackage.credits} credits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Price per class</span>
                      <span className="text-white font-bold">${selectedPackage.perClass}</span>
                    </div>
                    <div className="h-px bg-white/10" />
                    <div className="flex justify-between">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-neonGreen font-black text-xl">${selectedPackage.price}</span>
                    </div>
                  </div>

                  <div className="bg-neonGreen/10 border border-neonGreen/30 rounded-lg p-4 mb-6">
                    <p className="text-white/80 text-sm text-center">
                      <span className="text-neonGreen font-bold">Secure Payment:</span> Your transaction will be processed via Razorpay
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowCheckout(false);
                        setSelectedPackage(null);
                      }}
                      disabled={processing}
                      className="flex-1 px-6 py-3 glass-card border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 transition-all duration-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={processing}
                      className="flex-1 px-6 py-3 bg-neonGreen text-black font-bold rounded-lg hover:bg-neonGreen/90 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Pay Now
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}