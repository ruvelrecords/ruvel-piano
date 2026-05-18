'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Calendar, DollarSign, Package, Plus, Clock, TrendingUp, ChevronRight, AlertCircle, CheckCircle2, GraduationCap } from 'lucide-react';
import { formatDate, formatDateShort, formatAUD, getInitials, getAgeGroupColor, formatTime12h } from '@/lib/utils';
import { MODULES, RUVEL_KEYS } from '@/lib/constants';
import { getStorage } from '@/lib/storage';
import { QuizResultsStore } from '@/lib/quizzes';

export default function DashboardPage() {
  const { students, classes, payments, activity, settings } = useApp();
  const { session } = useAuth();
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [quizResults, setQuizResults] = useState<QuizResultsStore>({});

  useEffect(() => {
    setQuizResults(getStorage<QuizResultsStore>('quiz_results', {}));
  }, []);

  useEffect(() => {
    if (students.length === 0) return;
    const timer = setInterval(() => {
      setSpotlightIndex((i) => (i + 1) % students.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [students.length]);

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Stats
  const totalStudents = students.length;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);
  const classesThisWeek = classes.filter((c) => {
    const d = new Date(c.date);
    return d >= weekStart && d <= weekEnd && c.status !== 'Cancelled';
  }).length;

  const pendingPayments = payments
    .filter((p) => p.classesRemaining > 0)
    .reduce((sum, p) => {
      const paidPerClass = p.amount / p.classesTotal;
      return sum + paidPerClass * p.classesRemaining;
    }, 0);

  const activePacks = payments.filter((p) => p.classesRemaining > 0).length;

  // Today's classes
  const todayClasses = classes
    .filter((c) => c.date === todayStr && c.status === 'Scheduled')
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

  // Upcoming classes (next 5 days, not today)
  const upcoming = classes
    .filter((c) => {
      return c.date > todayStr && c.status === 'Scheduled';
    })
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.time || '').localeCompare(b.time || '');
    })
    .slice(0, 3);

  // Pending actions
  const pendingActions: { type: string; message: string; studentId?: string; link: string; severity: 'warning' | 'info' }[] = [];

  students.forEach((student) => {
    const studentPayments = payments.filter((p) => p.studentId === student.id);
    const activePayment = studentPayments.find((p) => p.classesRemaining > 0);

    if (activePayment && activePayment.classesRemaining === 1) {
      pendingActions.push({
        type: 'payment',
        message: `${student.name} — 1 class remaining in pack`,
        studentId: student.id,
        link: '/payments',
        severity: 'warning',
      });
    }

    if (!activePayment && studentPayments.length > 0) {
      const lastPayment = studentPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      if (lastPayment && lastPayment.classesRemaining === 0) {
        pendingActions.push({
          type: 'payment',
          message: `${student.name} — pack used up, needs renewal`,
          studentId: student.id,
          link: '/payments',
          severity: 'warning',
        });
      }
    }
  });

  // This week summary
  const thisWeekCompleted = classes.filter((c) => {
    const d = new Date(c.date);
    return d >= weekStart && d <= now && c.status === 'Completed';
  }).length;

  const thisWeekRevenue = payments
    .filter((p) => {
      const d = new Date(p.date);
      return d >= weekStart && d <= weekEnd;
    })
    .reduce((sum, p) => sum + p.amount, 0);

  // Financial summary
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthRevenue = payments
    .filter((p) => new Date(p.date) >= monthStart)
    .reduce((sum, p) => sum + p.amount, 0);
  const totalAllTime = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = payments
    .filter((p) => p.classesRemaining > 0)
    .reduce((sum, p) => sum + (p.amount / p.classesTotal) * p.classesRemaining, 0);

  const spotlight = students[spotlightIndex];
  const spotlightModule = spotlight ? MODULES.find((m) => m.id === spotlight.currentModule) : null;
  const spotlightLastClass = spotlight
    ? classes
        .filter((c) => c.studentId === spotlight.id && c.status === 'Completed')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;
  const spotlightKeys = spotlight ? RUVEL_KEYS.filter((k) => spotlight.keysEarned.includes(k.id)) : [];

  const recentActivity = activity.slice(0, 5);

  const activityIcon = (type: string) => {
    switch (type) {
      case 'class': return '🎹';
      case 'payment': return '💰';
      case 'key': return '🔑';
      case 'student': return '👤';
      default: return '📝';
    }
  };

  const statCards = [
    { label: 'Total Students', value: totalStudents, icon: Users, color: '#C9A84C', sub: `${totalStudents} enrolled` },
    { label: 'Classes This Week', value: classesThisWeek, icon: Calendar, color: '#FF6B35', sub: 'scheduled' },
    { label: 'Pre-paid Balance', value: formatAUD(pendingPayments), icon: DollarSign, color: '#27AE60', sub: 'AUD credit' },
    { label: 'Active Packs', value: activePacks, icon: Package, color: '#9B59B6', sub: 'in progress' },
  ];

  const teacherName = session?.name === 'Teacher' ? settings.teacherName : session?.name;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold gradient-text mb-1">
          Welcome back, {teacherName} 🎹
        </h1>
        <p className="text-[#888888] text-sm">
          {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · Perth, Australia
        </p>
      </div>

      {/* TODAY'S CLASSES — top priority */}
      {todayClasses.length > 0 && (
        <div className="mb-6 bg-[#111111] border border-[#C9A84C]/40 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
              Today&apos;s Classes
            </h2>
            <span className="text-xs text-[#C9A84C] font-medium">{todayClasses.length} class{todayClasses.length !== 1 ? 'es' : ''} today</span>
          </div>
          <div className="space-y-3">
            {todayClasses.map((c) => {
              const student = students.find((s) => s.id === c.studentId);
              const classModule = MODULES.find((m) => m.id === c.module);
              return (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-lg">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: getAgeGroupColor(student?.ageGroup || '') }}
                  >
                    {getInitials(student?.name || '?')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-sm">{student?.name}</p>
                    <p className="text-xs text-[#888888]">
                      {classModule?.title} · {c.nextClassFocus || 'Class today'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-[#C9A84C]">{formatTime12h(c.time)}</p>
                    <p className="text-xs text-[#555555]">{c.duration} min</p>
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/classes" className="mt-3 flex items-center justify-center gap-1 text-xs text-[#C9A84C] hover:text-[#d4b56a] transition-colors">
            Log class after it&apos;s done <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* PENDING ACTIONS */}
      {pendingActions.length > 0 && (
        <div className="mb-6 bg-[#111111] border border-yellow-500/30 rounded-xl p-5">
          <h2 className="font-semibold text-white flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-yellow-500" /> Pending Actions
          </h2>
          <div className="space-y-2">
            {pendingActions.map((action, i) => (
              <Link
                key={i}
                href={action.link}
                className="flex items-center gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/10 transition-colors"
              >
                <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <p className="text-sm text-white flex-1">{action.message}</p>
                <ChevronRight className="w-4 h-4 text-[#555555]" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#888888] text-sm">{label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-[#555555] mt-1">{sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upcoming + Activity */}
        <div className="lg:col-span-2 space-y-4">
          {/* This week summary */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-4 h-4 text-[#C9A84C]" /> This Week
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-white">{classesThisWeek}</div>
                <div className="text-xs text-[#888888] mt-0.5">Scheduled</div>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-white">{thisWeekCompleted}</div>
                <div className="text-xs text-[#888888] mt-0.5">Completed</div>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-[#27AE60]">{formatAUD(thisWeekRevenue)}</div>
                <div className="text-xs text-[#888888] mt-0.5">Received</div>
              </div>
            </div>
          </div>

          {/* Upcoming classes */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#C9A84C]" /> Upcoming Classes
              </h2>
              <Link href="/classes" className="text-xs text-[#C9A84C] hover:text-[#d4b56a] flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {upcoming.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="w-10 h-10 text-[#2a2a2a] mx-auto mb-3" />
                <p className="text-[#555555] text-sm">No upcoming classes scheduled</p>
                <Link href="/classes" className="text-xs text-[#C9A84C] hover:underline mt-2 inline-block">
                  Schedule a class
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcoming.map((c) => {
                  const student = students.find((s) => s.id === c.studentId);
                  const classModule = MODULES.find((m) => m.id === c.module);
                  return (
                    <div key={c.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: getAgeGroupColor(student?.ageGroup || '') }}
                      >
                        {getInitials(student?.name || '?')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm">{student?.name}</p>
                        <p className="text-xs text-[#888888]">
                          {classModule?.title} · {formatTime12h(c.time) || 'TBD'}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-medium text-[#C9A84C]">{formatDateShort(c.date)}</p>
                        <p className="text-xs text-[#555555]">{c.duration} min</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#C9A84C]" /> Recent Activity
            </h2>
            {recentActivity.length === 0 ? (
              <p className="text-[#555555] text-sm text-center py-4">No activity yet</p>
            ) : (
              <div className="space-y-2">
                {recentActivity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 py-2 border-b border-[#1a1a1a] last:border-0">
                    <span className="text-sm flex-shrink-0 mt-0.5">{activityIcon(a.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white">{a.message}</p>
                      <p className="text-xs text-[#555555] mt-0.5">{formatDate(a.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz results */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-[#C9A84C]" /> Resultados de Quizzes
            </h2>
            {students.length === 0 ? (
              <p className="text-[#555555] text-sm text-center py-4">Sin estudiantes</p>
            ) : (
              <div className="space-y-1">
                {students.map((s) => {
                  const results = quizResults[s.id] || {};
                  const entries = Object.entries(results)
                    .map(([mid, r]) => ({ moduleId: Number(mid), ...r }))
                    .sort((a, b) => a.moduleId - b.moduleId);
                  const avg = entries.length
                    ? Math.round(entries.reduce((sum, e) => sum + e.percent, 0) / entries.length)
                    : null;
                  return (
                    <div key={s.id} className="flex items-center gap-3 py-2 border-b border-[#1a1a1a] last:border-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: getAgeGroupColor(s.ageGroup) }}
                      >
                        {getInitials(s.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium">{s.name}</p>
                        {entries.length === 0 ? (
                          <p className="text-xs text-[#555555]">Aún no ha hecho quizzes</p>
                        ) : (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entries.map((e) => (
                              <span
                                key={e.moduleId}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                  e.percent >= 80
                                    ? 'bg-emerald-500/15 text-emerald-400'
                                    : e.percent >= 60
                                    ? 'bg-yellow-500/15 text-yellow-400'
                                    : 'bg-rose-500/15 text-rose-400'
                                }`}
                              >
                                M{e.moduleId}: {e.percent}%
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {avg !== null && (
                        <div className="text-right flex-shrink-0">
                          <p
                            className={`text-sm font-bold ${
                              avg >= 80 ? 'text-emerald-400' : avg >= 60 ? 'text-yellow-400' : 'text-rose-400'
                            }`}
                          >
                            {avg}%
                          </p>
                          <p className="text-[10px] text-[#555555]">promedio</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Financial summary */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
            <h2 className="font-semibold text-white flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-[#27AE60]" /> Financial Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
                <span className="text-sm text-[#888888]">This week</span>
                <span className="text-sm font-semibold text-[#27AE60]">{formatAUD(thisWeekRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
                <span className="text-sm text-[#888888]">This month</span>
                <span className="text-sm font-semibold text-white">{formatAUD(thisMonthRevenue)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]">
                <span className="text-sm text-[#888888]">Pre-paid credit</span>
                <span className="text-sm font-semibold text-[#C9A84C]">{formatAUD(outstandingBalance)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-[#888888]">All time</span>
                <span className="text-sm font-bold text-white">{formatAUD(totalAllTime)}</span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
            <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#C9A84C]" /> Quick Actions
            </h2>
            <div className="space-y-2">
              <Link href="/students" className="flex items-center gap-2 w-full px-3 py-2.5 bg-[#C9A84C]/10 hover:bg-[#C9A84C]/20 text-[#C9A84C] rounded-lg text-sm font-medium transition-colors border border-[#C9A84C]/20">
                <Users className="w-4 h-4" /> + Add Student
              </Link>
              <Link href="/classes" className="flex items-center gap-2 w-full px-3 py-2.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-lg text-sm font-medium transition-colors border border-[#2a2a2a]">
                <Calendar className="w-4 h-4 text-[#FF6B35]" /> + Log Class
              </Link>
              <Link href="/payments" className="flex items-center gap-2 w-full px-3 py-2.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-lg text-sm font-medium transition-colors border border-[#2a2a2a]">
                <DollarSign className="w-4 h-4 text-[#27AE60]" /> + Record Payment
              </Link>
            </div>
          </div>

          {/* Student spotlight */}
          {spotlight && (
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5" style={{ background: getAgeGroupColor(spotlight.ageGroup), transform: 'translate(30%, -30%)' }} />
              <h2 className="font-semibold text-[#888888] text-xs uppercase tracking-wider mb-3">Student Spotlight</h2>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: getAgeGroupColor(spotlight.ageGroup) }}
                >
                  {getInitials(spotlight.name)}
                </div>
                <div>
                  <Link href={`/students/${spotlight.id}`} className="font-semibold text-white hover:text-[#C9A84C] transition-colors">
                    {spotlight.name}
                  </Link>
                  <p className="text-xs text-[#888888]">{spotlight.ageGroup}</p>
                </div>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-3 mb-3">
                <p className="text-xs text-[#888888] mb-1">Current Module</p>
                <p className="text-sm font-medium text-[#C9A84C]">
                  {spotlightModule ? `${spotlightModule.icon} Module ${spotlightModule.id} — ${spotlightModule.title}` : 'Module 1'}
                </p>
              </div>
              {spotlightLastClass && (
                <div className="bg-[#1a1a1a] rounded-lg p-3">
                  <p className="text-xs text-[#888888] mb-1">Last Homework</p>
                  <p className="text-xs text-white line-clamp-2">{spotlightLastClass.homeworkAssigned || 'No homework assigned'}</p>
                </div>
              )}
              {spotlightKeys.length > 0 && (
                <div className="mt-3 flex gap-1 flex-wrap">
                  {spotlightKeys.map((k) => (
                    <span key={k.id} className="text-sm" title={k.name}>{k.emoji}</span>
                  ))}
                </div>
              )}
              {students.length > 1 && (
                <div className="flex gap-1 mt-3 justify-center">
                  {students.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSpotlightIndex(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${i === spotlightIndex ? 'bg-[#C9A84C]' : 'bg-[#2a2a2a]'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Time indicator */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
            <div className="flex items-center gap-2 text-[#888888]">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Perth, Australia</span>
            </div>
            <p className="text-xs text-[#555555] mt-1">
              {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
