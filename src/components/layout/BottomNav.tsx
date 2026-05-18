'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  BookOpen,
  GraduationCap,
  Music,
  Star,
  Gamepad2,
  Video,
  Settings,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/classes', label: 'Classes', icon: Calendar },
  { href: '/payments', label: 'Pay', icon: DollarSign },
  { href: '/method', label: 'Method', icon: BookOpen },
  { href: '/theory', label: 'Teoría', icon: GraduationCap },
  { href: '/library', label: 'Library', icon: Music },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/games', label: 'Games', icon: Gamepad2 },
  { href: '/media', label: 'Media', icon: Video },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { payments, classes } = useApp();

  const today = new Date().toISOString().split('T')[0];
  const todayClasses = classes.filter((c) => c.date === today && c.status === 'Scheduled').length;
  const lowPackStudents = payments.filter((p) => p.classesRemaining > 0 && p.classesRemaining <= 1).length;

  const getBadge = (href: string) => {
    if (href === '/classes' && todayClasses > 0) return todayClasses;
    if (href === '/payments' && lowPackStudents > 0) return lowPackStudents;
    return 0;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111111] border-t border-[#2a2a2a]">
      <div className="flex items-center justify-around overflow-x-auto px-1 py-2 gap-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          const badge = getBadge(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg min-w-[52px] transition-colors relative ${
                active ? 'text-[#C9A84C]' : 'text-[#555555]'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C9A84C] text-black text-[9px] font-bold flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
