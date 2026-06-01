'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useLang } from '@/contexts/LanguageContext';
import LangToggle from '@/components/LangToggle';
import StudentGuide from '@/components/StudentGuide';
import { MODULES, RUVEL_KEYS, MOTIVATIONAL_QUOTES, SONGS } from '@/lib/constants';
import { formatDate, formatTime12h } from '@/lib/utils';
import { getQuizForModule, QuizResultsStore, QuizResult } from '@/lib/quizzes';
import { getStorage } from '@/lib/storage';
import { getPracticeLog, logPractice, getStreak, practicedToday, PracticeLog } from '@/lib/practice';
import { getTutorialsForModule, getTutorialUrl, HANON_EXERCISES, hanonUrl } from '@/lib/tutorials';
import Quiz from '@/components/Quiz';
import Metronome from '@/components/Metronome';
import EarTrainer from '@/components/EarTrainer';
import ReadingTrainer from '@/components/ReadingTrainer';
import StaffBuilder from '@/components/StaffBuilder';
import PianoExplorer from '@/components/PianoExplorer';
import SongsExplorer from '@/components/SongsExplorer';
import ClassMaterialViewer from '@/components/ClassMaterialViewer';
import ChordIdentifier from '@/components/games/ChordIdentifier';
import RhythmGame from '@/components/games/RhythmGame';
import NoteMemory from '@/components/games/NoteMemory';
import SpeedReading from '@/components/games/SpeedReading';
import Modal from '@/components/ui/Modal';
import {
  Music, LogOut, ExternalLink, GraduationCap, Flame, BookOpen,
  Piano, Music2, Gamepad2, Library, Video, Sparkles, ChevronLeft, HelpCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type Tab =
  | 'welcome' | 'module' | 'practice' | 'songs' | 'piano' | 'theory'
  | 'staff' | 'games' | 'tutorials' | 'classes' | 'progress' | 'homework' | 'contact';

type GameId = 'chord' | 'rhythm' | 'memory' | 'speed' | 'ear' | 'reading';

export default function StudentPage() {
  const { session, logout } = useAuth();
  const { students, classes, settings } = useApp();
  const { t } = useLang();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('welcome');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResultsStore>({});
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [practiceLog, setPracticeLog] = useState<PracticeLog>({ dates: [], totalMinutes: 0 });
  const [practiceRefresh, setPracticeRefresh] = useState(0);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    setQuizResults(getStorage<QuizResultsStore>('quiz_results', {}));
  }, [showQuiz]);

  // Mostrar la guía de bienvenida la primera vez que entra cada estudiante
  useEffect(() => {
    if (!session?.studentId) return;
    const flag = `ruvel_welcomed_${session.studentId}`;
    try {
      if (!localStorage.getItem(flag)) {
        setShowGuide(true);
        localStorage.setItem(flag, '1');
      }
    } catch {
      /* ignore */
    }
  }, [session?.studentId]);

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
  const tutorials = getTutorialsForModule(student.currentModule);

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

  const ageColor = student.ageGroup === 'Kids (6-12)' ? '#FF6B35' : student.ageGroup === 'Youth (13-17)' ? '#9B59B6' : '#C9A84C';

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'welcome', label: t('tab_welcome'), emoji: '🏠' },
    { id: 'module', label: t('tab_module'), emoji: '🎹' },
    { id: 'practice', label: t('tab_practice'), emoji: '🎯' },
    { id: 'songs', label: t('tab_songs'), emoji: '🎵' },
    { id: 'piano', label: t('tab_piano'), emoji: '🎼' },
    { id: 'staff', label: t('tab_staff'), emoji: '🎶' },
    { id: 'games', label: t('tab_games'), emoji: '🎮' },
    { id: 'tutorials', label: t('tab_tutorials'), emoji: '📺' },
    { id: 'theory', label: t('tab_theory'), emoji: '📚' },
    { id: 'classes', label: t('tab_classes'), emoji: '📅' },
    { id: 'homework', label: t('tab_homework'), emoji: '📝' },
    { id: 'progress', label: t('tab_progress'), emoji: '⭐' },
    { id: 'contact', label: t('tab_contact'), emoji: '📞' },
  ];

  const selectedClass = selectedClassId ? myClasses.find((c) => c.id === selectedClassId) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-[#111] border-b border-[#2a2a2a] px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: ageColor }}>
              {student.name[0]}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{student.name}</p>
              <p className="text-[#888] text-xs">{t('portal_subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LangToggle />
            <button onClick={() => setShowGuide(true)} className="flex items-center gap-1 text-[#888] hover:text-white transition-colors text-xs" title={t('guide_button')}>
              <HelpCircle className="w-4 h-4" />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-[#888] hover:text-white transition-colors text-xs">
              <LogOut className="w-3.5 h-3.5" /> {t('logout')}
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-30 bg-[#111] border-b border-[#2a2a2a] overflow-x-auto">
        <div className="max-w-xl mx-auto flex gap-1 px-3 py-2">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setActiveTab(tb.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tb.id ? 'text-black font-bold' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
              }`}
              style={activeTab === tb.id ? { background: ageColor } : {}}
            >
              <span>{tb.emoji}</span> {tb.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 pb-16">
        {/* ─── INICIO ──────────────────────────────────────────── */}
        {activeTab === 'welcome' && (
          <div className="space-y-5">
            <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ageColor}20, ${ageColor}05)`, border: `1px solid ${ageColor}30` }}>
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: ageColor }} />
              <p className="text-sm font-medium mb-1" style={{ color: ageColor }}>{t('welcome_back')}</p>
              <h1 className="text-2xl font-bold text-white mb-1">{student.name}</h1>
              <p className="text-[#888] text-sm">{student.ageGroup} · {t('tab_module')} {student.currentModule}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{completedClasses.length}</div>
                <div className="text-xs text-[#888] mt-0.5">{t('stat_classes')}</div>
              </div>
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold" style={{ color: ageColor }}>{streak}🔥</div>
                <div className="text-xs text-[#888] mt-0.5">{t('stat_streak')}</div>
              </div>
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold" style={{ color: ageColor }}>M{student.currentModule}</div>
                <div className="text-xs text-[#888] mt-0.5">{t('tab_module')}</div>
              </div>
            </div>

            {currentModule && (
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-xs text-[#888] uppercase tracking-wider mb-2">{t('current_module_label')}</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentModule.icon}</span>
                  <div>
                    <p className="font-semibold text-white">{currentModule.title}</p>
                    <p className="text-xs text-[#888] mt-0.5 line-clamp-2">{currentModule.description}</p>
                  </div>
                </div>
              </div>
            )}

            {upcomingClasses[0] && (
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-xs text-[#888] uppercase tracking-wider mb-2">{t('next_class')}</p>
                <p className="font-semibold text-white">{formatDate(upcomingClasses[0].date)}</p>
                <p className="text-sm text-[#888]">{formatTime12h(upcomingClasses[0].time)} · {upcomingClasses[0].duration} min</p>
              </div>
            )}

            <div className="rounded-xl p-4" style={{ background: `${ageColor}10`, border: `1px solid ${ageColor}20` }}>
              <p className="text-sm text-white italic leading-relaxed">&quot;{quote}&quot;</p>
            </div>

            {/* Atajos a TODO */}
            <div>
              <p className="text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">{t('explore_app')}</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'songs' as Tab, icon: Library, label: t('sc_songs'), color: 'bg-rose-500/10 border-rose-500/30 text-rose-300' },
                  { id: 'piano' as Tab, icon: Piano, label: t('sc_piano'), color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' },
                  { id: 'staff' as Tab, icon: Music2, label: t('sc_staff'), color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' },
                  { id: 'games' as Tab, icon: Gamepad2, label: t('sc_games'), color: 'bg-purple-500/10 border-purple-500/30 text-purple-300' },
                  { id: 'tutorials' as Tab, icon: Video, label: t('sc_tutorials'), color: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
                  { id: 'theory' as Tab, icon: BookOpen, label: t('sc_theory'), color: 'bg-amber-500/10 border-amber-500/30 text-amber-300' },
                ].map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setActiveTab(q.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border ${q.color} text-left hover:scale-[1.02] transition-transform`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs font-semibold">{q.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ─── MÓDULO ──────────────────────────────────────────── */}
        {activeTab === 'module' && currentModule && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">{t('module_heading')}</h2>

            <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ageColor}20, ${ageColor}05)`, border: `1px solid ${ageColor}30` }}>
              <div className="absolute -top-6 -right-6 text-7xl opacity-20">{currentModule.icon}</div>
              <p className="text-xs uppercase tracking-wider mb-1 font-semibold" style={{ color: ageColor }}>
                {t('module_x_of', { id: currentModule.id, phase: currentModule.phase })}
              </p>
              <h3 className="text-xl font-bold text-white mb-2">{currentModule.title}</h3>
              <p className="text-sm text-[#aaa] leading-relaxed">{currentModule.description}</p>
              <p className="text-xs text-[#888] mt-3">{t('est_duration', { weeks: currentModule.estimatedWeeks })}</p>
            </div>

            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-xs text-[#888] uppercase tracking-wider mb-3">{t('what_learning')}</p>
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

            {currentModule.progressChecklist && (
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
                <p className="text-xs text-[#888] uppercase tracking-wider mb-3">{t('my_goals')}</p>
                <div className="space-y-2">
                  {currentModule.progressChecklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 bg-[#1a1a1a] rounded-lg">
                      <div className="w-4 h-4 rounded border-2 border-[#3a3a3a] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-white leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {moduleQuiz && (
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4" style={{ color: ageColor }} />
                  <p className="text-sm font-semibold text-white">{t('quiz_title', { n: student.currentModule })}</p>
                </div>
                <p className="text-xs text-[#888] mb-3">{t('quiz_desc', { n: moduleQuiz.questions.length })}</p>
                {myQuizResult && (
                  <div className="flex items-center gap-2 mb-3 p-2.5 bg-[#1a1a1a] rounded-lg">
                    <span className="text-lg">{myQuizResult.percent >= 80 ? '🏆' : myQuizResult.percent >= 60 ? '👍' : '💪'}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{t('best_result', { p: myQuizResult.percent })}</p>
                      <p className="text-xs text-[#555]">{t('correct_of', { score: myQuizResult.score, total: myQuizResult.total })}</p>
                    </div>
                  </div>
                )}
                <button onClick={() => setShowQuiz(true)} className="w-full py-2.5 rounded-lg font-semibold text-sm text-black" style={{ background: ageColor }}>
                  {myQuizResult ? t('retry_quiz') : t('start_quiz')}
                </button>
              </div>
            )}

            {nextModule && (
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5 opacity-60">
                <p className="text-xs text-[#888] uppercase tracking-wider mb-3">{t('next_module')}</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl grayscale">🔒</span>
                  <div>
                    <p className="font-semibold text-[#888]">{t('module_n_title', { id: nextModule.id, title: nextModule.title })}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── PRÁCTICA ────────────────────────────────────────── */}
        {activeTab === 'practice' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">{t('practice_heading')}</h2>

            <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ageColor}20, ${ageColor}05)`, border: `1px solid ${ageColor}30` }}>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Flame className="w-7 h-7" style={{ color: ageColor }} />
                    <span className="text-4xl font-bold text-white">{streak}</span>
                  </div>
                  <p className="text-xs text-[#888] mt-1">{t('days_in_row')}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {streak === 0 ? t('streak_0') : streak < 3 ? t('streak_low') : streak < 7 ? t('streak_mid') : t('streak_high')}
                  </p>
                  <p className="text-xs text-[#888] mt-0.5">{t('total_practiced', { min: practiceLog.totalMinutes })}</p>
                </div>
              </div>
              <button
                onClick={handleLogPractice}
                disabled={didPracticeToday}
                className="w-full mt-4 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                style={{ background: didPracticeToday ? '#1a1a1a' : ageColor, color: didPracticeToday ? '#888' : '#000' }}
              >
                {didPracticeToday ? t('practiced_today') : t('log_practice')}
              </button>
            </div>

            <div>
              <p className="text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">{t('metronome')}</p>
              <Metronome accent={ageColor} />
            </div>

            <div>
              <p className="text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">{t('hanon')}</p>
              <div className="space-y-2">
                {HANON_EXERCISES.slice(0, 5).map((h) => (
                  <a
                    key={h.num}
                    href={hanonUrl(h.num)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-[#111] border border-[#2a2a2a] rounded-xl hover:border-[#3a3a3a] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${ageColor}20`, color: ageColor }}>
                      {h.num}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{h.title}</p>
                      <p className="text-xs text-[#888]">{h.description}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#555]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── CANCIONES ──────────────────────────────────────── */}
        {activeTab === 'songs' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">{t('songs_heading')}</h2>
            <p className="text-xs text-[#888]">
              {t('songs_desc', { n: SONGS.length })}
            </p>

            {student.assignedSongs.length > 0 && (
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-xs text-[#888] uppercase mb-2">{t('assigned_by_teacher')}</p>
                <div className="space-y-1">
                  {student.assignedSongs.map((s, i) => (
                    <p key={i} className="text-sm text-white">• {s}</p>
                  ))}
                </div>
              </div>
            )}

            <SongsExplorer accent={ageColor} currentModule={student.currentModule} />
          </div>
        )}

        {/* ─── PIANO ──────────────────────────────────────────── */}
        {activeTab === 'piano' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">{t('piano_heading')}</h2>
            <p className="text-xs text-[#888]">
              {t('piano_desc')}
            </p>
            <PianoExplorer accent={ageColor} />
          </div>
        )}

        {/* ─── PENTAGRAMA ─────────────────────────────────────── */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">{t('staff_heading')}</h2>
            <p className="text-xs text-[#888]">
              {t('staff_desc')}
            </p>
            <StaffBuilder accent={ageColor} />
          </div>
        )}

        {/* ─── JUEGOS ─────────────────────────────────────────── */}
        {activeTab === 'games' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">{t('games_heading')}</h2>
            <p className="text-xs text-[#888]">{t('games_desc')}</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'chord' as GameId, emoji: '🎹', title: t('game_chord'), desc: t('game_chord_d') },
                { id: 'rhythm' as GameId, emoji: '🥁', title: t('game_rhythm'), desc: t('game_rhythm_d') },
                { id: 'memory' as GameId, emoji: '🧠', title: t('game_memory'), desc: t('game_memory_d') },
                { id: 'speed' as GameId, emoji: '⚡', title: t('game_speed'), desc: t('game_speed_d') },
                { id: 'ear' as GameId, emoji: '👂', title: t('game_ear'), desc: t('game_ear_d') },
                { id: 'reading' as GameId, emoji: '📖', title: t('game_reading'), desc: t('game_reading_d') },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGame(g.id)}
                  className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition-colors text-left"
                >
                  <div className="text-3xl mb-2">{g.emoji}</div>
                  <p className="text-sm font-bold text-white">{g.title}</p>
                  <p className="text-[10px] text-[#888] mt-0.5">{g.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ─── TUTORIALES ─────────────────────────────────────── */}
        {activeTab === 'tutorials' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">{t('tutorials_heading')}</h2>
            <p className="text-xs text-[#888]">
              {t('tutorials_desc')} <span className="text-white">M{student.currentModule} — {currentModule?.title}</span>
            </p>

            {tutorials.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-[#333] mx-auto mb-3" />
                <p className="text-sm text-[#555]">{t('no_tutorials')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tutorials.map((tut) => (
                  <a
                    key={tut.id}
                    href={getTutorialUrl(tut)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-[#111] border border-[#2a2a2a] rounded-xl hover:border-[#3a3a3a] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${ageColor}20` }}>
                      {tut.kind === 'theory' ? <BookOpen className="w-5 h-5" style={{ color: ageColor }} /> :
                       tut.kind === 'exercise' ? <Sparkles className="w-5 h-5" style={{ color: ageColor }} /> :
                       <Video className="w-5 h-5" style={{ color: ageColor }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{tut.title}</p>
                      <p className="text-xs text-[#888]">{tut.description}</p>
                      <p className="text-[10px] text-[#555] uppercase mt-0.5">
                        {tut.kind === 'theory' ? t('kind_theory') : tut.kind === 'exercise' ? t('kind_exercise') : t('kind_tutorial')}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#555] flex-shrink-0 mt-1" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── TEORÍA ─────────────────────────────────────────── */}
        {activeTab === 'theory' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">{t('theory_heading')}</h2>
            <p className="text-xs text-[#888]">
              {t('theory_desc')}
            </p>

            {MODULES.map((m) => (
              <div key={m.id} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs uppercase text-[#888] font-semibold">{t('tab_module')} {m.id} · {m.phase}</p>
                    <p className="text-sm font-bold text-white">{m.title}</p>
                    <p className="text-xs text-[#aaa] mt-1 leading-relaxed">{m.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.keySkills.slice(0, 4).map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] text-[#aaa]">
                          {s.split('(')[0].trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── CLASES ─────────────────────────────────────────── */}
        {activeTab === 'classes' && (
          <div className="space-y-5">
            {selectedClass ? (
              <>
                <button onClick={() => setSelectedClassId(null)} className="flex items-center gap-1 text-sm text-[#888] hover:text-white">
                  <ChevronLeft className="w-4 h-4" /> {t('back_to_classes')}
                </button>
                <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                  <p className="text-sm font-bold text-white">{formatDate(selectedClass.date)}</p>
                  <p className="text-xs text-[#888]">{formatTime12h(selectedClass.time)} · {selectedClass.duration} min · {t('tab_module')} {selectedClass.module}</p>
                  {selectedClass.whatWeWorkedOn && (
                    <div className="mt-3 p-3 bg-[#1a1a1a] rounded-lg">
                      <p className="text-xs uppercase text-[#888] mb-1">{t('what_we_worked')}</p>
                      <p className="text-sm text-white">{selectedClass.whatWeWorkedOn}</p>
                    </div>
                  )}
                  {selectedClass.homeworkAssigned && (
                    <div className="mt-2 p-3 rounded-lg" style={{ background: `${ageColor}10`, border: `1px solid ${ageColor}30` }}>
                      <p className="text-xs uppercase mb-1" style={{ color: ageColor }}>{t('homework_label')}</p>
                      <p className="text-sm text-white">{selectedClass.homeworkAssigned}</p>
                    </div>
                  )}
                  {selectedClass.nextClassFocus && (
                    <div className="mt-2 p-3 bg-[#1a1a1a] rounded-lg">
                      <p className="text-xs uppercase text-[#888] mb-1">{t('next_class_focus')}</p>
                      <p className="text-sm text-white">{selectedClass.nextClassFocus}</p>
                    </div>
                  )}
                </div>

                {selectedClass.materials && selectedClass.materials.length > 0 && (
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">{t('class_material')}</p>
                    <ClassMaterialViewer materials={selectedClass.materials} />
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white">{t('classes_heading')}</h2>

                {upcomingClasses.length > 0 && (
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-wider mb-3">{t('upcoming')}</p>
                    {upcomingClasses.map((c) => (
                      <button key={c.id} onClick={() => setSelectedClassId(c.id)} className="w-full text-left bg-[#111] border border-blue-500/30 rounded-xl p-4 mb-2 hover:border-blue-500/50">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-white">{formatDate(c.date)}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{t('upcoming_badge')}</span>
                        </div>
                        <p className="text-sm text-[#888]">{formatTime12h(c.time)} · {c.duration} min</p>
                        {c.materials && c.materials.length > 0 && (
                          <p className="text-xs mt-1" style={{ color: ageColor }}>{t('materials_count', { n: c.materials.length })}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <div>
                  <p className="text-xs text-[#888] uppercase tracking-wider mb-3">{t('history', { n: completedClasses.length })}</p>
                  {completedClasses.length === 0 ? (
                    <p className="text-[#555] text-sm text-center py-8">{t('no_completed')}</p>
                  ) : (
                    <div className="space-y-2">
                      {completedClasses.map((c) => {
                        const mod = MODULES.find((m) => m.id === c.module);
                        return (
                          <button key={c.id} onClick={() => setSelectedClassId(c.id)} className="w-full text-left bg-[#111] border border-[#2a2a2a] rounded-xl p-3 hover:border-[#3a3a3a]">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-white text-sm">{formatDate(c.date)}</p>
                              <span className="text-xs text-[#888]">M{c.module}</span>
                            </div>
                            <p className="text-xs text-[#888]">{mod?.title}</p>
                            {c.materials && c.materials.length > 0 && (
                              <p className="text-xs mt-1" style={{ color: ageColor }}>{t('materials_count', { n: c.materials.length })}</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── TAREA ──────────────────────────────────────────── */}
        {activeTab === 'homework' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">{t('homework_heading')}</h2>
            {lastClass ? (
              <>
                <div className="rounded-xl p-5" style={{ background: `${ageColor}10`, border: `1px solid ${ageColor}20` }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: ageColor }}>{t('last_homework', { date: formatDate(lastClass.date) })}</p>
                  <p className="text-white leading-relaxed">{lastClass.homeworkAssigned || t('no_homework_assigned')}</p>
                </div>
                {lastClass.materials && lastClass.materials.length > 0 && (
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">{t('material_last_class')}</p>
                    <ClassMaterialViewer materials={lastClass.materials} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <span className="text-5xl">📝</span>
                <p className="text-[#888] mt-4">{t('no_classes_homework')}</p>
              </div>
            )}
          </div>
        )}

        {/* ─── PROGRESO ───────────────────────────────────────── */}
        {activeTab === 'progress' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">{t('progress_heading')}</h2>

            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-xs text-[#888] uppercase tracking-wider mb-3">{t('your_path')}</p>
              <div className="space-y-1.5">
                {MODULES.map((mod) => {
                  const done = mod.id < student.currentModule;
                  const current = mod.id === student.currentModule;
                  return (
                    <div key={mod.id} className={`flex items-center gap-3 p-2.5 rounded-lg ${current ? '' : 'bg-[#1a1a1a]'}`} style={current ? { background: `${ageColor}15`, border: `1px solid ${ageColor}30` } : {}}>
                      <span className="text-base">{done ? '✅' : current ? mod.icon : '🔒'}</span>
                      <p className={`text-xs flex-1 ${done ? 'text-[#888] line-through' : current ? 'text-white font-semibold' : 'text-[#555]'}`}>
                        M{mod.id}. {mod.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-xs text-[#888] uppercase tracking-wider mb-3">{t('keys_earned')}</p>
              {earnedKeys.length === 0 ? (
                <p className="text-[#555] text-sm">{t('no_keys')}</p>
              ) : (
                <div className="space-y-2">
                  {earnedKeys.map((k) => (
                    <div key={k.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                      <span className="text-xl">{k.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-white">{k.name}</p>
                        <p className="text-xs text-[#888]">{k.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── CONTACTO ───────────────────────────────────────── */}
        {activeTab === 'contact' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">{t('contact_heading')}</h2>
            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${ageColor}20` }}>
                <Music className="w-8 h-8" style={{ color: ageColor }} />
              </div>
              <h3 className="text-lg font-bold text-white">{settings.studioName}</h3>
              <p className="text-[#888] text-sm mt-1">{settings.teacherName}</p>
              <p className="text-[#555] text-xs mt-0.5">{settings.location}</p>
            </div>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-colors"
            >
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-semibold text-white text-sm">{t('whatsapp_msg')}</p>
                <p className="text-xs text-[#888]">{t('talk_to_teacher')}</p>
              </div>
            </a>
            <button onClick={handleLogout} className="w-full py-3 bg-[#111] border border-[#2a2a2a] rounded-xl text-[#888] hover:text-white text-sm flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> {t('logout_full')}
            </button>
          </div>
        )}
      </div>

      {/* Modales */}
      <StudentGuide
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        studentName={student.name}
        accent={ageColor}
      />

      <Modal isOpen={showQuiz} onClose={() => setShowQuiz(false)} title={t('m_quiz', { n: student.currentModule })} size="md">
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

      <Modal isOpen={activeGame === 'ear'} onClose={() => setActiveGame(null)} title={t('m_ear')} size="sm">
        <EarTrainer accent={ageColor} />
      </Modal>
      <Modal isOpen={activeGame === 'reading'} onClose={() => setActiveGame(null)} title={t('m_reading')} size="sm">
        <ReadingTrainer accent={ageColor} />
      </Modal>
      <Modal isOpen={activeGame === 'chord'} onClose={() => setActiveGame(null)} title={t('m_chord')} size="sm">
        <ChordIdentifier accent={ageColor} />
      </Modal>
      <Modal isOpen={activeGame === 'rhythm'} onClose={() => setActiveGame(null)} title={t('m_rhythm')} size="sm">
        <RhythmGame accent={ageColor} />
      </Modal>
      <Modal isOpen={activeGame === 'memory'} onClose={() => setActiveGame(null)} title={t('m_memory')} size="md">
        <NoteMemory accent={ageColor} />
      </Modal>
      <Modal isOpen={activeGame === 'speed'} onClose={() => setActiveGame(null)} title={t('m_speed')} size="sm">
        <SpeedReading accent={ageColor} />
      </Modal>
    </div>
  );
}
