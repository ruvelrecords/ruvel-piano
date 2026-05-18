'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function TeacherGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.replace('/login');
    } else if (session.role !== 'teacher') {
      router.replace('/student');
    }
  }, [session, isLoading, router]);

  if (isLoading || !session || session.role !== 'teacher') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-black tracking-wider gold-gradient-text mb-2">RÜVEL</div>
          <div className="text-[#888888] text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function StudentGuard({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.replace('/login');
    } else if (session.role !== 'student') {
      router.replace('/dashboard');
    }
  }, [session, isLoading, router]);

  if (isLoading || !session || session.role !== 'student') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-black tracking-wider gold-gradient-text mb-2">RÜVEL</div>
          <div className="text-[#888888] text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
