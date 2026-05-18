'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { session, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.replace('/login');
    } else if (session.role === 'teacher') {
      router.replace('/dashboard');
    } else {
      router.replace('/student');
    }
  }, [session, isLoading, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-black tracking-wider gold-gradient-text mb-2">RÜVEL</div>
        <div className="text-[#888888] text-sm">Loading...</div>
      </div>
    </div>
  );
}
