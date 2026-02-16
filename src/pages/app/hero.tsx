import { SEO } from "@/components/SEO";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Award, Star, Target, Zap, Shield, Crown, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroStatsPage() {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [loading, setLoading] = useState(true);
  const [heroData, setHeroData] = useState<any>(null);
  
  // Fetch hero stats and achievements
  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user._id;

        if (!userId) {
          console.error('No user ID found');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/user/hero?userId=${userId}`);
        const data = await response.json();
        setHeroData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hero data:', error);
        setLoading(false);
      }
    };

    fetchHeroData();
  }, []);

  // Icon mapping for achievements
  const iconMap: { [key: string]: any } = {
    'zap': Zap,
    'crown': Crown,
    'shield': Shield,
    'star': Star,
    'target': Target,
    'award': Award
  };

  return (
    <>
      <SEO title="Hero Stats - Fight&Flight" description="Track your progress and achievements" />
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                Hero <span className="text-neonGreen">Stats</span>
              </h1>
              <p className="text-white/60 text-lg">Level up your real-life character</p>
            </div>
            <div className="glass-card px-6 py-3 border border-white/10 flex items-center gap-3">
              <Crown className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="text-xs text-white/40 font-bold uppercase tracking-wider">Current Rank</div>
                <div className="text-xl font-black text-white">{heroData?.levelName || 'Loading...'}</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-neonGreen/30 border-t-neonGreen rounded-full animate-spin mx-auto" />
              <p className="text-white/60 mt-4">Loading hero stats...</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT: Level Circle + Power Stats */}
            <div className="glass-card p-8 md:p-12 border border-white/10 flex flex-col items-center">
              {/* Animated Level Circle */}
              <div className="relative w-64 h-64 md:w-72 md:h-72 mb-12">
                {/* Animated Progress Ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  {/* Background Circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  {/* Animated Progress Circle - Green */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#39FF14"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="565.48"
                    strokeDashoffset="141.37"
                    className="transition-all duration-1000"
                    style={{
                      filter: "drop-shadow(0 0 10px #39FF14)"
                    }}
                  />
                </svg>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-7xl md:text-8xl font-black text-white mb-2">{heroData?.level || 0}</span>
                  <span className="text-base md:text-lg font-bold text-white/60 uppercase tracking-wider">LEVEL</span>
                </div>
              </div>

              {/* Power Stats */}
              <div className="w-full space-y-6">
                {heroData?.stats && heroData.stats.map((stat: any, index: number) => (
                  <div key={index} className="w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-bold text-base md:text-lg">{stat.label}</span>
                      <span className={`text-${stat.color} font-black text-lg`}>{stat.value}/{stat.max}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-${stat.color} transition-all duration-1000 ease-out`}
                        style={{ 
                          width: `${(stat.value / stat.max) * 100}%`,
                          boxShadow: stat.color === "neonGreen" 
                            ? "0 0 10px #39FF14" 
                            : "0 0 10px #FF2F92"
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Achievements Section */}
            <div className="glass-card p-8 border border-white/10 flex flex-col">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
                Achievements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                {heroData?.achievements && heroData.achievements.map((item: any, index: number) => {
                  const Icon = iconMap[item.icon] || Award;
                  return (
                    <div 
                      key={index}
                      className={`p-6 rounded-lg border transition-all duration-300 flex flex-col items-start gap-4 ${
                        item.unlocked 
                          ? `bg-black/40 border-${item.color}/30 hover:border-${item.color}/60` 
                          : "bg-black/20 border-white/5 opacity-40 grayscale"
                      }`}
                    >
                      <div className={`p-4 rounded-lg ${
                        item.unlocked 
                          ? `bg-${item.color}/20` 
                          : "bg-white/5"
                      }`}>
                        <Icon 
                          className={`w-8 h-8 ${
                            item.unlocked 
                              ? `text-${item.color}` 
                              : "text-white/40"
                          }`}
                          style={item.unlocked && item.color === "neonGreen" ? {
                            filter: "drop-shadow(0 0 8px #39FF14)"
                          } : item.unlocked && item.color === "neonPink" ? {
                            filter: "drop-shadow(0 0 8px #FF2F92)"
                          } : {}}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-2">{item.label}</h3>
                        <p className="text-white/60 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Level Up Animation Modal */}
        {showLevelUp && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="text-center animate-scale-in">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-neonGreen to-neonPink rounded-full mx-auto animate-pulse-slow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Crown className="w-16 h-16 text-white animate-bounce" />
                </div>
              </div>
              <h2 className="text-6xl font-black text-white mb-4 animate-slide-up">
                LEVEL UP!
              </h2>
              <p className="text-2xl text-neonGreen font-bold mb-2">Level {heroData?.level || 0}</p>
              <p className="text-xl text-white/60 mb-8">{heroData?.levelName || ''}</p>
              <button
                onClick={() => setShowLevelUp(false)}
                className="px-8 py-4 bg-neonGreen text-black font-black text-lg rounded-lg hover:bg-neonGreen/90 transition-all duration-300"
              >
                CONTINUE
              </button>
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
}