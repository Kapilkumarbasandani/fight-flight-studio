import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Shield, User as UserIcon, LogOut } from "lucide-react";
import { AuthModal } from "./AuthModal";
import type { UserResponse } from "@/models/User";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);

  // Check for user in localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAdmin(userData.role === "admin");
      }
    }
  }, []);

  // Listen for storage events (when user logs in)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAdmin(userData.role === "admin");
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // In production: Check user role from /api/me
  // For now: simulate admin detection (can be toggled via localStorage)
  useState(() => {
    if (typeof window !== "undefined") {
      const adminMode = localStorage.getItem("admin_mode") === "true";
      setIsAdmin(adminMode);
    }
  });

  // Handle scroll effect with hide/show on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled past threshold
      setScrolled(currentScrollY > 50);
      
      // Show header when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: "#home", label: "HOME" },
    { href: "#founders", label: "FOUNDERS" },
    { href: "#offerings", label: "OFFERINGS" },
    { href: "#pricing", label: "PRICING" },
    { href: "#schedule", label: "SCHEDULE" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAdmin(false);
    window.location.href = "/";
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled 
          ? 'bg-black/70 backdrop-blur-xl border-b border-white/10' 
          : 'bg-black/65 backdrop-blur-lg border-b border-white/5'
      } ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/logo.png"
              alt="Fight&Flight"
              width={50}
              height={50}
              className="w-12 h-12 drop-shadow-[0_0_15px_rgba(57,255,20,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-all duration-300"
              style={{ filter: 'brightness(1.15)' }}
            />
            <span className="headline-font text-xl text-white font-bold uppercase tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              FIGHT<span className="text-neonGreen">&</span><span className="text-neonPink">FLIGHT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/95 hover:text-neonGreen transition-all duration-300 text-sm font-bold tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:drop-shadow-[0_0_10px_rgba(57,255,20,0.4)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 text-neonGreen border border-neonGreen/50 rounded bg-black/30 hover:bg-neonGreen/20 hover:border-neonGreen transition-all duration-300 backdrop-blur-sm shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_25px_rgba(57,255,20,0.4)]"
              >
                <Shield className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Admin</span>
              </Link>
            )}
            {user ? (
              <>
                <Link
                  href="/app"
                  className="flex items-center gap-2 px-4 py-2 text-neonGreen border border-neonGreen/50 rounded-full bg-black/30 hover:bg-neonGreen/20 hover:border-neonGreen transition-all duration-300 backdrop-blur-sm shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_25px_rgba(57,255,20,0.4)]"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-white/80 border border-white/30 rounded-full bg-black/30 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 backdrop-blur-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-6 py-2.5 text-white text-xs font-bold uppercase tracking-widest border-2 border-white/40 rounded-full bg-black/20 hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                JOIN NOW
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:text-neonGreen transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-6 space-y-4 pb-4 bg-black/60 backdrop-blur-xl rounded-lg p-4 border border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-white/95 hover:text-neonGreen transition-all duration-300 text-sm font-bold tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 w-full px-4 py-3 text-neonGreen border border-neonGreen/50 rounded bg-black/30 hover:bg-neonGreen/20 transition-all duration-300 shadow-[0_0_15px_rgba(57,255,20,0.2)]"
                onClick={() => setIsOpen(false)}
              >
                <Shield className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Admin Dashboard</span>
              </Link>
            )}
            {user ? (
              <>
                <Link
                  href="/app"
                  className="flex items-center gap-2 w-full px-4 py-3 text-neonGreen border border-neonGreen/50 rounded-full bg-black/30 hover:bg-neonGreen/20 transition-all duration-300 shadow-[0_0_15px_rgba(57,255,20,0.2)]"
                  onClick={() => setIsOpen(false)}
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">{user.name}</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-white/80 border border-white/30 rounded-full bg-black/30 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full px-6 py-3 text-white text-xs font-bold uppercase tracking-widest border-2 border-white/40 rounded-full bg-black/20 hover:bg-white hover:text-black transition-all duration-300 mt-4 shadow-lg"
              >
                JOIN NOW
              </button>
            )}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
}