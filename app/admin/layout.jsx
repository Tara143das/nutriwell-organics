'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  Megaphone, 
  LogOut, 
  ShieldAlert, 
  Clock, 
  ExternalLink,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const ADMIN_NAV_ITEMS = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    allowedRoles: ['admin', 'subadmin', 'sales', 'logistics']
  },
  {
    title: 'Product Master',
    href: '/admin/products',
    icon: Package,
    allowedRoles: ['admin', 'subadmin']
  },
  {
    title: 'Staff & Roles',
    href: '/admin/employees',
    icon: Users,
    allowedRoles: ['admin'] // Only Super Admin
  },
  {
    title: 'Orders & Logistics',
    href: '/admin/orders',
    icon: ShoppingBag,
    allowedRoles: ['admin', 'subadmin', 'sales', 'logistics']
  },
  {
    title: 'Marketing & Popups',
    href: '/admin/marketing',
    icon: Megaphone,
    allowedRoles: ['admin', 'subadmin']
  }
];

export default function AdminLayout({ children }) {
  const { user, role, isAdmin, isStaff, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter(); // Fixed: Router typo resolved
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [mounted, setMounted] = useState(false);

  // Live Digital Clock & Mount Check
  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Access Validation Guard
  useEffect(() => {
    if (!loading && mounted) {
      if (!user) {
        router.push('/login?redirect=/admin/dashboard');
      } else if (!isAdmin && !isStaff && role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, role, isAdmin, isStaff, loading, mounted, router]);

  // Loading State Indicator
  if (loading || !mounted) {
    return (
      <div className="min-h-screen bg-[#0a1813] text-[#fdfcf8] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full border-2 border-[#b07f24] border-t-transparent animate-spin mb-6" />
        <div className="flex items-center gap-2 text-[#b07f24] font-serif text-lg tracking-widest uppercase">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span>Authenticating Nutriwell Staff Credentials...</span>
        </div>
        <p className="text-xs text-[#fdfcf8]/60 mt-2 font-sans">
          Verifying security clearance and encrypted tokens
        </p>
      </div>
    );
  }

  const staffRole = role || (isAdmin ? 'admin' : 'customer');
  const staffEmployeeId = user?.uid ? `NWO-${user.uid.slice(0, 6).toUpperCase()}` : 'NWO-STAFF-ROOT';

  // Unauthorized Fallback Safety Screen
  if (!isAdmin && !isStaff && !['admin', 'subadmin', 'sales', 'logistics'].includes(staffRole)) {
    return (
      <div className="min-h-screen bg-[#0a1813] text-[#fdfcf8] flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
        <h1 className="text-3xl font-serif text-[#fdfcf8]">Access Denied</h1>
        <p className="text-sm text-[#fdfcf8]/70 max-w-md mt-2 mb-6">
          Your account ({user?.email}) does not have active staff privileges for the Nutriwell Master Control Center.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-[#b07f24] text-[#0a1813] font-semibold text-xs uppercase tracking-wider"
        >
          Return to Public Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1813] text-[#fdfcf8] flex overflow-hidden font-sans">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#06120e] border-r border-[#b07f24]/30 shrink-0 z-30">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-[#b07f24]/20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#0f4d2c] border border-[#b07f24]/50 flex items-center justify-center text-[#b07f24] group-hover:scale-105 transition-transform shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-[#fdfcf8] tracking-tight leading-none">
                NUTRIWELL
              </h1>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#b07f24] font-medium block mt-1">
                Apothecary Command
              </span>
            </div>
          </Link>
        </div>

        {/* Staff Identity Capsule */}
        <div className="mx-4 my-6 p-4 rounded-2xl bg-[#0f4d2c]/30 border border-[#b07f24]/30 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#b07f24] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {staffRole === 'admin' ? 'Super Admin' : staffRole.toUpperCase()}
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          
          <h2 className="text-sm font-semibold text-[#fdfcf8] truncate">
            {user?.displayName || user?.email?.split('@')[0]}
          </h2>
          
          <p className="text-[11px] font-mono text-[#b07f24] mt-0.5 tracking-wider">
            ID: {staffEmployeeId}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-none">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const isAllowed = item.allowedRoles.includes(staffRole) || isAdmin;

            if (!isAllowed) return null;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-medium transition-all duration-300 border ${
                  isActive
                    ? 'bg-[#0f4d2c] text-[#fdfcf8] border-[#b07f24] shadow-[0_4px_20px_rgba(15,77,44,0.4)] font-semibold'
                    : 'text-[#fdfcf8]/70 border-transparent hover:border-[#b07f24]/30 hover:bg-[#0f4d2c]/20 hover:text-[#fdfcf8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#b07f24]' : 'text-[#fdfcf8]/60'}`} />
                  <span>{item.title}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-[#b07f24]" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#b07f24]/20 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-xs text-[#fdfcf8]/80 hover:text-[#fdfcf8] bg-[#0f4d2c]/20 hover:bg-[#0f4d2c]/40 border border-[#b07f24]/20 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-[#b07f24]" />
              View Live Storefront
            </span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Secure Staff Logout</span>
          </button>
        </div>

      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Operational Header */}
        <header className="h-16 bg-[#06120e] border-b border-[#b07f24]/30 px-4 sm:px-8 flex items-center justify-between shrink-0 z-20">
          
          {/* Left Mobile Drawer Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#0f4d2c]/40 border border-[#b07f24]/30 text-[#fdfcf8]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#fdfcf8]/70">
              <span className="text-[#b07f24]">System Status:</span>
              <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Operational
              </span>
            </div>
          </div>

          {/* Right Live Clock & Employee ID Tag */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f4d2c]/30 border border-[#b07f24]/20 text-xs font-mono text-[#b07f24]">
              <Clock className="w-3.5 h-3.5 text-[#fdfcf8]" />
              <span>{currentTime || '12:00:00 PM'}</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#b07f24]/10 border border-[#b07f24]/40 text-xs font-mono text-[#b07f24]">
              {staffEmployeeId}
            </div>
          </div>

        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0a1813]">
          {children}
        </main>

      </div>

      {/* 3. MOBILE SIDEBAR DRAWER */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-[#06120e] border-r border-[#b07f24]/40 p-6 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#b07f24]/20">
                <div className="font-serif font-bold text-lg text-[#fdfcf8]">NUTRIWELL ADMIN</div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg bg-[#0f4d2c] text-[#fdfcf8]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-6 space-y-2">
                {ADMIN_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  if (!item.allowedRoles.includes(staffRole) && !isAdmin) return null;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border ${
                        isActive
                          ? 'bg-[#0f4d2c] text-[#fdfcf8] border-[#b07f24]'
                          : 'text-[#fdfcf8]/70 border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#b07f24]" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-950/40 text-red-400 border border-red-900/40 text-xs font-semibold uppercase tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}