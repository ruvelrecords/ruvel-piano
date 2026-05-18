'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { MODULES, RUVEL_KEYS, MOTIVATIONAL_QUOTES } from '@/lib/constants';
import { formatDate, formatTime12h, musescoreUrl } from '@/lib/utils';
import { getQuizForModule, QuizResultsStore, QuizResult } from '@/lib/quizzes';
import { getStorage } from '@/lib/storage';
import { getPracticeLog, logPractice, getStreak, practicedToday, PracticeLog } from '@/lib/practice';
import Quiz from '@/components/Quiz';
import Metronome from '@/components/Metronome';
import EarTrainer from '@/components/EarTrainer';
import ReadingTrainer from '@/components/ReadingTrainer';
import Modal from '@/components/ui/Modal';
import { Music, LogOut, ChevronRight, ExternalLink, GraduationCap, Flame, Ear, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Tab = 'welcome' | 'module' | 'practice' | 'progress' | 'homework' | 'songs' | 'classes' | 'contact';

export default function StudentPage() {
  const { session, logout } = useAuth();
  const { students, classes, settings } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('welcome');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResultsStore>({});
  const [showEarTrainer, setShowEarTrainer] = useState(false);
  const [showReadingTrainer, setShowReadingTrainer] = useState(false);
  const [practiceLog, setPracticeLog] = useState<PracticeLog>({ dates: [], totalMinutes: 0 });
  const [practiceRefresh, setPracticeRefresh] = useState(0);

  useEffect(() => {
    setQuizResults(getStorage<QuizResultsStore>('quiz_results', {}));
  }, [showQuiz]);

  useEffect(() => {
    if (session?.studentId) setPracticeLog(getPracticeLog(session.studentId));
  }, [session?.studentId, practiceRefresh]);

  const student = students.find((s) => s.id === session?.studentId);
  if (!student) return null;

  const myQuizResult: QuizResult | undefined = quizResults[student.id]?.[student.currentModule];
  const streak = getStreak(practiceLog.dates);
  const didPracticeToday = practicedToday(practiceLog.dates);

  const handleLogPractice = () => {
    logPractice(student.id, 15);
    setPracticeRefresh((r) => r + 1);
  };

  const myClasses = classes
    .filter((c) => c.studentId === student.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const completedClasses = myClasses.filter((c) => c.status === 'Completed');
  const upcomingClasses = myClasses.filter((c) => c.status === 'Scheduled');
  const lastClass = completedClasses[0];
  const currentModule = MODULES.find((m) => m.id === student.currentModule);

  const ageGroup = student.ageGroup === 'Kids (6-12)' ? 'kids' : student.ageGroup === 'Youth (13-17)' ? 'youth' : 'adults';
  const quotes = MOTIVATIONAL_QUOTES[ageGroup];
  const quote = quotes[completedClasses.length % quotes.length];

  const earnedKeys = RUVEL_KEYS.filter((k) => student.keysEarned.includes(k.id));

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const nextModule = MODULES.find((m) => m.id === student.currentModule + 1);
  const moduleQuiz = getQuizForModule(student.currentModule);

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'welcome', label: 'Home', emoji: '🏠' },
    { id: 'module', label: 'Module', emoji: '🎹' },
    { id: 'practice', label: 'Practica', emoji: '🎯' },
    { id: 'progress', label: 'Progress', emoji: '⭐' },
    { id: 'homework', label: 'Homework', emoji: '📚' },
    { id: 'songs', label: 'Songs', emoji: '🎵' },
    { id: 'classes', label: 'Classes', emoji: '📅' },
    { id: 'contact', label: 'Contact', emoji: '📞' },
  ];

  const ageColor = student.ageGroup === 'Kids (6-12)' ? '#FF6B35' : student.ageGroup === 'Youth (13-17)' ? '#9B59B6' : '#C9A84C';

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#111111] border-b border-[#2a2a2a] px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: ageColor }}>
              {student.name[0]}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{student.name}</p>
              <p className="text-[#888888] text-xs">Student Portal</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-[#888888] hover:text-white transition-colors text-xs">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-30 bg-[#111111] border-b border-[#2a2a2a] overflow-x-auto">
        <div className="max-w-xl mx-auto flex gap-1 px-3 py-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? 'text-black font-bold'
                  : 'text-[#888888] hover:text-white hover:bg-[#1a1a1a]'
              }`}
              style={activeTab === t.id ? { background: ageColor } : {}}
            >
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 py-6 pb-16">
        {/* ─── WELCOME TAB ─────────────────────────────────────────── */}
        {activeTab === 'welcome' && (
          <div className="space-y-5">
            {/* Hero greeting */}
            <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ageColor}20, ${ageColor}05)`, border: `1px solid ${ageColor}30` }}>
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: ageColor }} />
              <p className="text-sm font-medium mb-1" style={{ color: ageColor }}>Welcome back! 👋</p>
              <h1 className="text-2xl font-bold text-white mb-1">{student.name}</h1>
              <p className="text-[#888888] text-sm">{student.ageGroup} · Module {student.currentModule}</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{completedClasses.length}</div>
                <div className="text-xs text-[#888888] mt-0.5">Classes</div>
              </div>
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{earnedKeys.length}</div>
                <div className="text-xs text-[#888888] mt-0.5">Keys 🔑</div>
              </div>
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold" style={{ color: ageColor }}>{student.currentModule}</div>
                <div className="text-xs text-[#888888] mt-0.5">Module</div>
              </div>
            </div>

            {/* Current module */}
            {currentModule && (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-xs text-[#888888] uppercase tracking-wider mb-2">Current Module</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentModule.icon}</span>
                  <div>
                    <p className="font-semibold text-white">{currentModule.title}</p>
                    <p className="text-xs text-[#888888] mt-0.5 line-clamp-2">{currentModule.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming class */}
            {upcomingClasses[0] && (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-xs text-[#888888] uppercase tracking-wider mb-2">Next Class</p>
                <p className="font-semibold text-white">{formatDate(upcomingClasses[0].date)}</p>
                <p className="text-sm text-[#888888]">{formatTime12h(upcomingClasses[0].time)} · {upcomingClasses[0].duration} min</p>
                {upcomingClasses[0].nextClassFocus && (
                  <p className="text-xs text-[#C9A84C] mt-2">Focus: {upcomingClasses[0].nextClassFocus}</p>
                )}
              </div>
            )}

            {/* Motivational quote */}
            <div className="rounded-xl p-4" style={{ background: `${ageColor}10`, border: `1px solid ${ageColor}20` }}>
              <p className="text-sm text-white italic leading-relaxed">&quot;{quote}&quot;</p>
            </div>

            {/* Quick links */}
            <div className="space-y-2">
              {[
                { id: 'module' as Tab, emoji: '🎹', label: `Module ${student.currentModule}: ${currentModule?.title ?? ''}`, sub: 'View skills, goals & checklist' },
                { id: 'homework' as Tab, emoji: '📚', label: 'See my homework', sub: lastClass?.homeworkAssigned ? lastClass.homeworkAssigned.slice(0, 50) + '...' : 'Check latest homework' },
                { id: 'songs' as Tab, emoji: '🎵', label: 'My songs', sub: `${student.assignedSongs.length} songs assigned` },
                { id: 'progress' as Tab, emoji: '⭐', label: 'My progress & keys', sub: `${earnedKeys.length} key${earnedKeys.length !== 1 ? 's' : ''} earned` },
              ].map(({ id, emoji, label, sub }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="w-full flex items-center gap-3 p-3.5 bg-[#111111] border border-[#2a2a2a] rounded-xl hover:border-[#3a3a3a] transition-colors text-left group"
                >
                  <span className="text-xl">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{label}</p>
                    <p className="text-xs text-[#555555] truncate">{sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#555555] group-hover:text-white transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── MODULE TAB ──────────────────────────────────────────── */}
        {activeTab === 'module' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">Current Module 🎹</h2>

            {/* Current module hero */}
            {currentModule && (
              <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ageColor}20, ${ageColor}05)`, border: `1px solid ${ageColor}30` }}>
                <div className="absolute -top-6 -right-6 text-7xl opacity-20">{currentModule.icon}</div>
                <p className="text-xs uppercase tracking-wider mb-1 font-semibold" style={{ color: ageColor }}>
                  Module {currentModule.id} of 8
                </p>
                <h3 className="text-xl font-bold text-white mb-2">{currentModule.title}</h3>
                <p className="text-sm text-[#aaa] leading-relaxed">{currentModule.description}</p>
                <p className="text-xs text-[#888888] mt-3">Estimated: {currentModule.estimatedWeeks}</p>
              </div>
            )}

            {/* Key skills */}
            {currentModule && (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
                <p className="text-xs text-[#888888] uppercase tracking-wider mb-3">What You&apos;re Learning</p>
                <div className="space-y-2">
                  {currentModule.keySkills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: `${ageColor}30`, color: ageColor }}>
                        {i + 1}
                      </div>
                      <p className="text-sm text-white">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress checklist */}
            {currentModule?.progressChecklist && (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
                <p className="text-xs text-[#888888] uppercase tracking-wider mb-3">My Goals — I Need to Be Able To:</p>
                <div className="space-y-2">
                  {currentModule.progressChecklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 bg-[#1a1a1a] rounded-lg">
                      <div className="w-4 h-4 rounded border-2 border-[#3a3a3a] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-white leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#555555] mt-3">✓ Complete all goals to unlock the next module!</p>
              </div>
            )}

            {/* Quiz del módulo */}
            {moduleQuiz && (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4" style={{ color: ageColor }} />
                  <p className="text-sm font-semibold text-white">Quiz del Módulo {student.currentModule}</p>
                </div>
                <p className="text-xs text-[#888888] mb-3">
                  Pon a prueba lo que aprendiste — {moduleQuiz.questions.length} preguntas.
                </p>
                {myQuizResult && (
                  <div className="flex items-center gap-2 mb-3 p-2.5 bg-[#1a1a1a] rounded-lg">
                    <span className="text-lg">{myQuizResult.percent >= 80 ? '🏆' : myQuizResult.percent >= 60 ? '👍' : '💪'}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">Tu mejor resultado: {myQuizResult.percent}%</p>
                      <p className="text-xs text-[#555555]">{myQuizResult.score} de {myQuizResult.total} correctas</p>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full py-2.5 rounded-lg font-semibold text-sm text-black transition-colors"
                  style={{ background: ageColor }}
                >
                  {myQuizResult ? 'Volver a intentar' : 'Empezar el quiz'}
                </button>
              </div>
            )}

            {/* Next module teaser */}
            {nextModule ? (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 opacity-60">
                <p className="text-xs text-[#888888] uppercase tracking-wider mb-3">🔒 Next Module — Coming Soon</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl grayscale">🔒</span>
                  <div>
                    <p className="font-semibold text-[#888888]">Module {nextModule.id}: {nextModule.title}</p>
                    <p className="text-xs text-[#555555] mt-0.5">Keep working — you&apos;re almost there!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl p-5" style={{ background: `${ageColor}10`, border: `1px solid ${ageColor}30` }}>
                <p className="text-sm font-semibold text-center" style={{ color: ageColor }}>
                  🏆 You&apos;ve reached the final module! You&apos;re an advanced musician.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ─── PRACTICA TAB ────────────────────────────────────────── */}
        {activeTab === 'practice' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">Mi Práctica 🎯</h2>

            {/* Racha */}
            <div
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${ageColor}20, ${ageColor}05)`, border: `1px solid ${ageColor}30` }}
            >
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Flame className="w-7 h-7" style={{ color: ageColor }} />
                    <span className="text-4xl font-bold text-white">{streak}</span>
                  </div>
                  <p className="text-xs text-[#888888] mt-1">días seguidos</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {streak === 0
                      ? '¡Empieza tu racha hoy!'
                      : streak < 3
                      ? '¡Buen comienzo! Sigue así.'
                      : streak < 7
                      ? '¡Vas increíble! No la rompas.'
                      : '¡Eres imparable! 🔥'}
                  </p>
                  <p className="text-xs text-[#888888] mt-0.5">
                    {practiceLog.totalMinutes} minutos practicados en total
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogPractice}
                disabled={didPracticeToday}
                className="w-full mt-4 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                style={{ background: didPracticeToday ? '#1a1a1a' : ageColor, color: didPracticeToday ? '#888' : '#000' }}
              >
                {didPracticeToday ? '✓ ¡Ya practicaste hoy!' : 'Registrar práctica de hoy (+15 min)'}
              </button>
            </div>

            {/* Metrónomo */}
            <div>
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-2 font-semibold">Metrónomo</p>
              <Metronome accent={ageColor} />
            </div>

            {/* Entrenadores */}
            <div>
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-2 font-semibold">Entrenadores</p>
              <div className="space-y-2">
                <button
                  onClick={() => setShowEarTrainer(true)}
                  className="w-full flex items-center gap-3 p-4 bg-[#111111] border border-[#2a2a2a] rounded-xl hover:border-[#3a3a3a] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${ageColor}20` }}>
                    <Ear className="w-5 h-5" style={{ color: ageColor }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Entrenador de Oído</p>
                    <p className="text-xs text-[#888888]">Adivina intervalos y acordes de oído</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#555555]" />
                </button>
                <button
                  onClick={() => setShowReadingTrainer(true)}
                  className="w-full flex items-center gap-3 p-4 bg-[#111111] border border-[#2a2a2a] rounded-xl hover:border-[#3a3a3a] transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${ageColor}20` }}>
                    <BookOpen className="w-5 h-5" style={{ color: ageColor }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">Entrenador de Lectura</p>
                    <p className="text-xs text-[#888888]">Identifica las notas en el pentagrama</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#555555]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── PROGRESS TAB ────────────────────────────────────────── */}
        {activeTab === 'progress' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">My Progress ⭐</h2>

            {/* Module progress */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-3">Module Journey</p>
              <div className="space-y-2">
                {MODULES.map((mod) => {
                  const done = mod.id < student.currentModule;
                  const current = mod.id === student.currentModule;
                  return (
                    <div key={mod.id} className={`flex items-center gap-3 p-3 rounded-lg ${current ? 'bg-[#C9A84C]/10 border border-[#C9A84C]/20' : 'bg-[#1a1a1a]'}`}>
                      <span className="text-lg">{done ? '✅' : current ? mod.icon : '🔒'}</span>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${done ? 'text-[#888888] line-through' : current ? 'text-[#C9A84C]' : 'text-[#555555]'}`}>
                          {mod.title}
                        </p>
                      </div>
                      {current && <span className="text-xs text-[#C9A84C] font-semibold">Current</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Keys earned */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-3">Keys Earned 🔑</p>
              {earnedKeys.length === 0 ? (
                <p className="text-[#555555] text-sm">Complete your first class to earn your first key!</p>
              ) : (
                <div className="space-y-3">
                  {earnedKeys.map((key) => (
                    <div key={key.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                      <span className="text-2xl">{key.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{key.name}</p>
                        <p className="text-xs text-[#888888]">{key.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-3">Stats</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{completedClasses.length}</div>
                  <div className="text-xs text-[#888888]">Classes completed</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-[#C9A84C]">{student.currentModule}</div>
                  <div className="text-xs text-[#888888]">Current module</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{student.assignedSongs.length}</div>
                  <div className="text-xs text-[#888888]">Songs assigned</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">{earnedKeys.length}</div>
                  <div className="text-xs text-[#888888]">Keys earned</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── HOMEWORK TAB ────────────────────────────────────────── */}
        {activeTab === 'homework' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">My Homework 📚</h2>

            {lastClass ? (
              <>
                <div className="rounded-xl p-5" style={{ background: `${ageColor}10`, border: `1px solid ${ageColor}20` }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: ageColor }}>Latest homework — {formatDate(lastClass.date)}</p>
                  <p className="text-white leading-relaxed">{lastClass.homeworkAssigned || 'No homework assigned.'}</p>
                </div>

                {lastClass.nextClassFocus && (
                  <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                    <p className="text-xs text-[#888888] uppercase tracking-wider mb-1">Focus for next class</p>
                    <p className="text-white text-sm">{lastClass.nextClassFocus}</p>
                  </div>
                )}

                {lastClass.achievement && (
                  <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                    <p className="text-xs text-[#888888] uppercase tracking-wider mb-1">🏆 Achievement from last class</p>
                    <p className="text-white text-sm">{lastClass.achievement}</p>
                  </div>
                )}

                {lastClass.whatWeWorkedOn && (
                  <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                    <p className="text-xs text-[#888888] uppercase tracking-wider mb-1">What we covered</p>
                    <p className="text-white text-sm">{lastClass.whatWeWorkedOn}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <span className="text-5xl">📚</span>
                <p className="text-[#888888] mt-4">No classes yet — homework will appear here after your first class!</p>
              </div>
            )}

            {/* All past homework */}
            {completedClasses.length > 1 && (
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
                <p className="text-xs text-[#888888] uppercase tracking-wider mb-3">Previous Homework</p>
                <div className="space-y-3">
                  {completedClasses.slice(1, 5).map((c) => (
                    <div key={c.id} className="border-b border-[#2a2a2a] pb-3 last:border-0 last:pb-0">
                      <p className="text-xs text-[#888888]">{formatDate(c.date)}</p>
                      <p className="text-sm text-white mt-0.5">{c.homeworkAssigned || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── SONGS TAB ───────────────────────────────────────────── */}
        {activeTab === 'songs' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">My Songs 🎵</h2>
            {student.assignedSongs.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-5xl">🎵</span>
                <p className="text-[#888888] mt-4">No songs assigned yet. Your teacher will add songs here!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {student.assignedSongs.map((song, i) => (
                  <div key={i} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: `${ageColor}20` }}>
                        🎹
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{song}</p>
                        <p className="text-xs text-[#888888]">Assigned song</p>
                      </div>
                    </div>
                    <a
                      href={musescoreUrl(song, '')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      style={{ background: `${ageColor}20`, color: ageColor }}
                    >
                      Sheet <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── CLASSES TAB ─────────────────────────────────────────── */}
        {activeTab === 'classes' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">My Classes 📅</h2>

            {upcomingClasses.length > 0 && (
              <div>
                <p className="text-xs text-[#888888] uppercase tracking-wider mb-3">Upcoming</p>
                {upcomingClasses.map((c) => (
                  <div key={c.id} className="bg-[#111111] border border-blue-500/30 rounded-xl p-4 mb-2">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">{formatDate(c.date)}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Upcoming</span>
                    </div>
                    <p className="text-sm text-[#888888]">{formatTime12h(c.time)} · {c.duration} min</p>
                    {c.nextClassFocus && <p className="text-xs text-[#C9A84C] mt-1">Focus: {c.nextClassFocus}</p>}
                  </div>
                ))}
              </div>
            )}

            <div>
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-3">History ({completedClasses.length} classes)</p>
              {completedClasses.length === 0 ? (
                <p className="text-[#555555] text-sm text-center py-8">No completed classes yet</p>
              ) : (
                <div className="space-y-3">
                  {completedClasses.map((c) => {
                    const mod = MODULES.find((m) => m.id === c.module);
                    return (
                      <div key={c.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-white text-sm">{formatDate(c.date)}</p>
                          <span className="text-xs text-[#888888]">{c.duration} min</span>
                        </div>
                        <p className="text-xs text-[#888888]">{mod?.title}</p>
                        {c.achievement && <p className="text-xs text-emerald-400 mt-1">🏆 {c.achievement}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── CONTACT TAB ─────────────────────────────────────────── */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">Contact 📞</h2>

            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${ageColor}20` }}>
                <Music className="w-8 h-8" style={{ color: ageColor }} />
              </div>
              <h3 className="text-lg font-bold text-white">{settings.studioName}</h3>
              <p className="text-[#888888] text-sm mt-1">{settings.teacherName}</p>
              <p className="text-[#555555] text-xs mt-0.5">{settings.location}</p>
            </div>

            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 space-y-4">
              <p className="text-xs text-[#888888] uppercase tracking-wider">Quick Contact</p>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-colors"
              >
                <span className="text-2xl">💬</span>
                <div>
                  <p className="font-semibold text-white text-sm">Message on WhatsApp</p>
                  <p className="text-xs text-[#888888]">Tap to message your teacher</p>
                </div>
              </a>
            </div>

            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-xs text-[#888888] uppercase tracking-wider mb-3">Your Profile</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#888888]">Name</span>
                  <span className="text-white">{student.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Age group</span>
                  <span className="text-white">{student.ageGroup}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Level</span>
                  <span className="text-white">{student.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888888]">Goals</span>
                  <span className="text-white text-right max-w-[200px]">{student.goals || '—'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 bg-[#111111] border border-[#2a2a2a] rounded-xl text-[#888888] hover:text-white hover:border-[#3a3a3a] transition-colors text-sm flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        )}
      </div>

      {/* Quiz modal */}
      <Modal
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        title={`Quiz — Módulo ${student.currentModule}`}
        size="md"
      >
        {moduleQuiz && (
          <Quiz
            moduleId={student.currentModule}
            moduleTitle={currentModule?.title || ''}
            questions={moduleQuiz.questions}
            studentId={student.id}
            accentColor={ageColor}
          />
        )}
      </Modal>

      {/* Entrenador de oído */}
      <Modal isOpen={showEarTrainer} onClose={() => setShowEarTrainer(false)} title="Entrenador de Oído" size="sm">
        <EarTrainer accent={ageColor} />
      </Modal>

      {/* Entrenador de lectura */}
      <Modal isOpen={showReadingTrainer} onClose={() => setShowReadingTrainer(false)} title="Entrenador de Lectura" size="sm">
        <ReadingTrainer accent={ageColor} />
      </Modal>
    </div>
  );
}
