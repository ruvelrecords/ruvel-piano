'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Music, Lock, User } from 'lucide-react';

type LoginTab = 'teacher' | 'student';

export default function LoginPage() {
  const { login, session, isLoading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<LoginTab>('teacher');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && session) {
      if (session.role === 'teacher') router.replace('/dashboard');
      else router.replace('/student');
    }
  }, [session, isLoading, router]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) {
      document.getElementById(`pin-${index + 1}`)?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      document.getElementById(`pin-${index - 1}`)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const credential = tab === 'teacher' ? password : pin.join('');

    if (!username.trim()) {
      setError('Please enter your username.');
      setSubmitting(false);
      return;
    }
    if (tab === 'teacher' && !password) {
      setError('Please enter your password.');
      setSubmitting(false);
      return;
    }
    if (tab === 'student' && credential.length < 4) {
      setError('Please enter your 4-digit PIN.');
      setSubmitting(false);
      return;
    }

    const result = login(username.trim(), credential);

    if (result.success) {
      if (tab === 'teacher') router.replace('/dashboard');
      else router.replace('/student');
    } else {
      setError(result.message);
      setSubmitting(false);
    }
  };

  const inputCls = 'w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-black tracking-wider gold-gradient-text mb-2">RÜVEL</div>
          <div className="text-[#888888] text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.02]" style={{ background: 'radial-gradient(circle, #C9A84C, transparent)' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-5">
            <Music className="w-7 h-7 text-[#C9A84C]" />
          </div>
          <h1 className="text-4xl font-black tracking-wider gold-gradient-text">RÜVEL</h1>
          <p className="text-[#888888] text-sm mt-1 font-medium tracking-widest uppercase">Piano Method</p>
          <p className="text-[#555555] text-xs mt-2">Perth, Australia</p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="flex rounded-xl bg-[#0a0a0a] p-1 mb-7 border border-[#1a1a1a]">
            <button
              onClick={() => { setTab('teacher'); setError(''); setPin(['','','','']); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                tab === 'teacher' ? 'bg-[#C9A84C] text-black' : 'text-[#888888] hover:text-white'
              }`}
            >
              🎓 Teacher
            </button>
            <button
              onClick={() => { setTab('student'); setError(''); setPassword(''); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                tab === 'student' ? 'bg-[#C9A84C] text-black' : 'text-[#888888] hover:text-white'
              }`}
            >
              🎹 Student
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs text-[#888888] mb-2 font-medium">
                {tab === 'teacher' ? 'Username' : 'Your Name / Username'}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
                <input
                  type="text"
                  placeholder={tab === 'teacher' ? 'teacher' : 'e.g. luciana'}
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(''); }}
                  className={`${inputCls} pl-10`}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password (teacher) */}
            {tab === 'teacher' && (
              <div>
                <label className="block text-xs text-[#888888] mb-2 font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    className={`${inputCls} pl-10 pr-10`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555555] hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* PIN (student) */}
            {tab === 'student' && (
              <div>
                <label className="block text-xs text-[#888888] mb-3 font-medium">4-Digit PIN</label>
                <div className="flex gap-3 justify-center">
                  {pin.map((digit, i) => (
                    <input
                      key={i}
                      id={`pin-${i}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(i, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                      className="w-14 h-14 text-center text-xl font-bold bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
                    />
                  ))}
                </div>
                <p className="text-xs text-[#555555] text-center mt-3">
                  Forgot PIN? Contact your teacher.
                </p>
              </div>
            )}

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border border-[#2a2a2a] bg-[#0d0d0d] accent-[#C9A84C]"
              />
              <label htmlFor="remember" className="text-xs text-[#888888]">Remember me</label>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-[#C9A84C] text-black rounded-xl font-bold text-sm hover:bg-[#d4b56a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {submitting ? 'Signing in...' : tab === 'teacher' ? 'Sign In as Teacher' : 'Enter with PIN'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#333333] mt-6">
          RÜVEL Piano Method · Perth, Australia
        </p>
      </div>
    </div>
  );
}
