import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import type { UserResponse } from "@/models/User";
import { getHashedRoute } from "@/lib/route-hash";
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  Trophy,
  FileText,
  User,
  Menu,
  X,
  LogOut,
  Award,
  Shield,
  Users,
  BarChart3,
  Clock,
  UserCog,
  CheckSquare,
  Tag,
  Settings
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check authentication
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    setUser(JSON.parse(storedUser));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };
  
  // Detect if we're in admin area
  const isAdminArea = router.pathname.startsWith("/admin");

  // Navigation items with hashed URLs for security
  const memberNavItems = [
    { href: getHashedRoute("/app"), label: "Dashboard", icon: LayoutDashboard },
    { href: getHashedRoute("/app/schedule"), label: "Schedule", icon: Calendar },
    { href: getHashedRoute("/app/bookings"), label: "My Bookings", icon: Calendar },
    { href: getHashedRoute("/app/credits"), label: "Credits", icon: CreditCard },
    { href: getHashedRoute("/app/hero"), label: "Hero Stats", icon: Award },
    { href: getHashedRoute("/app/forms"), label: "Forms & Waivers", icon: FileText },
    { href: getHashedRoute("/app/profile"), label: "Profile", icon: User }
  ];

  const adminNavItems = [
    { href: getHashedRoute("/admin"), label: "Dashboard", icon: LayoutDashboard },
    { href: getHashedRoute("/admin/sessions"), label: "Manage Sessions", icon: Calendar },
    { href: "/admin/payments?status=submitted", label: "Payment Approvals", icon: CheckSquare },
    { href: getHashedRoute("/admin/credits"), label: "Credit Adjustments", icon: CreditCard },
    { href: getHashedRoute("/admin/expiry"), label: "Expiry Management", icon: Clock },
    { href: "/admin/users", label: "User Management", icon: UserCog },
    { href: "/admin/pricing", label: "Pricing", icon: Tag },
    { href: "/admin/insights", label: "Insights", icon: BarChart3 },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const navItems = isAdminArea ? adminNavItems : memberNavItems;
  const isActive = (path: string) => {
    // For paths with query strings, check asPath
    if (path.includes('?')) {
      return router.asPath === path;
    }
    // For hashed routes, compare pathname with the destination route
    return router.pathname === path || router.asPath === path;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Background decorative gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-neonGreen/5 via-transparent to-neonPink/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neonGreen/10 via-transparent to-transparent pointer-events-none" />

      {/* ── Sidebar ─────────────────────────────────────────────────────────
           Kept as a direct child of the root div (NOT inside the relative
           z-10 flex container) so it is always positioned relative to the
           viewport and is never trapped inside a parent stacking context.
           This fixes the iOS Safari "fixed-inside-relative" bug where the
           sidebar becomes invisible or unresponsive.
      ──────────────────────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#0a0a0a] border-r border-white/10 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Fight&Flight" width={40} height={40} className="rounded-lg" />
              <div className="flex flex-col">
                <span className="text-white font-black text-lg">
                  FIGHT<span className="text-neonGreen">&</span><span className="text-neonPink">FLIGHT</span>
                </span>
                <span className="text-white/40 text-xs font-bold">
                  {isAdminArea ? "ADMIN PORTAL" : "MEMBER PORTAL"}
                </span>
              </div>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/60 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 p-6 space-y-2 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-neonGreen/20 to-neonGreen/10 text-neonGreen border border-neonGreen/50 shadow-lg shadow-neonGreen/20"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-bold text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/10 space-y-2">
            {isAdminArea && user.role === 'admin' ? (
              <Link
                href="/app"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <User className="w-5 h-5" />
                <span className="font-bold text-sm">Switch to Member</span>
              </Link>
            ) : user.role === 'admin' ? (
              <Link
                href="/admin"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-neonGreen/80 hover:text-neonGreen hover:bg-neonGreen/5 transition-all duration-300 border border-neonGreen/20"
              >
                <Shield className="w-5 h-5" />
                <span className="font-bold text-sm">Admin Panel</span>
              </Link>
            ) : null}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/60 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-bold text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Tap-outside-to-close — right of sidebar only, never blocks sidebar links */}
      <div
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-y-0 left-72 right-0 z-40 lg:hidden"
        style={{ pointerEvents: sidebarOpen ? 'auto' : 'none' }}
      />

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="lg:ml-72">
        <header className="sticky top-0 z-30 bg-black/80 border-b border-white/10" style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          <div className="flex items-center justify-between px-4 py-4 md:p-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/60 hover:text-white p-1"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:flex-none" />
            <div className="flex items-center gap-4">
              {isAdminArea && user.role === 'admin' && (
                <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neonGreen/20 to-neonGreen/10 border border-neonGreen/30 shadow-lg shadow-neonGreen/20">
                  <Shield className="w-4 h-4 text-neonGreen" />
                  <span className="text-neonGreen font-bold text-xs uppercase tracking-wider">Admin Mode</span>
                </div>
              )}
              <Link href={getHashedRoute("/app/profile")} className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-white/5 transition-all duration-300">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neonGreen to-neonPink flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white font-bold text-sm">{user.name}</p>
                  <p className="text-white/40 text-xs">{user.role === 'admin' ? 'Admin' : 'Member'}</p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 md:p-8 lg:p-12">
          {children}
        </main>

        <footer className="border-t border-white/10 py-5 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Fight&Flight. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Enabled by <span className="text-neonGreen font-semibold">Ikara.Club</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}