'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  GraduationCap,
  Music,
  Music2,
  Star,
  Gamepad2,
  Video,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/classes', label: 'Classes', icon: Calendar },
  { href: '/payments', label: 'Payments', icon: DollarSign },
  { href: '/method', label: 'Method', icon: BookOpen },
  { href: '/theory', label: 'Teoría', icon: GraduationCap },
  { href: '/staff', label: 'Pentagrama', icon: Music2 },
  { href: '/library', label: 'Library', icon: Music },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/media', label: 'Media', icon: Video },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { payments, classes } = useApp();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Notification badge logic
  const today = new Date().toISOString().split('T')[0];
  const todayClasses = classes.filter((c) => c.date === today && c.status === 'Scheduled').length;
  const lowPackStudents = payments.filter((p) => p.classesRemaining > 0 && p.classesRemaining <= 1).length;

  const getBadge = (href: string) => {
    if (href === '/classes' && todayClasses > 0) return todayClasses;
    if (href === '/payments' && lowPackStudents > 0) return lowPackStudents;
    return 0;
  };

  return (
    <aside className="hidden md:flex flex-col w-[240px] h-screen bg-[#111111] border-r border-[#2a2a2a] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#2a2a2a]">
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-wider gold-gradient-text">RÜVEL</span>
          <span className="text-xs text-[#888888] font-medium tracking-widest uppercase mt-0.5">Piano Method</span>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
          <span className="text-xs text-[#C9A84C] font-semibold">Teacher Mode</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            const badge = getBadge(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                  active
                    ? 'bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/20'
                    : 'text-[#888888] hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    active ? 'text-[#C9A84C]' : 'text-[#555555] group-hover:text-white'
                  }`}
                />
                <span className="flex-1">{label}</span>
                {badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#C9A84C] text-black text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {badge}
                  </span>
                )}
                {active && badge === 0 && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-[#2a2a2a] space-y-1">
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
            pathname === '/settings'
              ? 'bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/20'
              : 'text-[#888888] hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <Settings
            className={`w-4 h-4 flex-shrink-0 ${
              pathname === '/settings' ? 'text-[#C9A84C]' : 'text-[#555555] group-hover:text-white'
            }`}
          />
          Settings
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#888888] hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 group"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 text-[#555555] group-hover:text-red-400 transition-colors" />
          Sign Out
        </button>

        {/* Studio info */}
        <div className="mt-3 px-3 py-3 bg-[#1a1a1a] rounded-lg">
          <p className="text-xs text-[#C9A84C] font-semibold">RÜVEL Piano Method</p>
          <p className="text-xs text-[#555555] mt-0.5">Perth, Australia</p>
        </div>
      </div>
    </aside>
  );
}
