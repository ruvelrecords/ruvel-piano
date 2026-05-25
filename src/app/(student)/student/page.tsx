'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
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
  Piano, Music2, Gamepad2, Library, Video, Sparkles, ChevronLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type Tab =
  | 'welcome' | 'module' | 'practice' | 'songs' | 'piano' | 'theory'
  | 'staff' | 'games' | 'tutorials' | 'classes' | 'progress' | 'homework' | 'contact';

type GameId = 'chord' | 'rhythm' | 'memory' | 'speed' | 'ear' | 'reading';

export default function StudentPage() {
  const { session, logout } = useAuth();
  const { students, classes, settings } = useApp();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('welcome');
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResultsStore>({});
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const [practiceLog, setPracticeLog] = useState<PracticeLog>({ dates: [], totalMinutes: 0 });
  const [practiceRefresh, setPracticeRefresh] = useState(0);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

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
    { id: 'welcome', label: 'Inicio', emoji: '🏠' },
    { id: 'module', label: 'Módulo', emoji: '🎹' },
    { id: 'practice', label: 'Práctica', emoji: '🎯' },
    { id: 'songs', label: 'Canciones', emoji: '🎵' },
    { id: 'piano', label: 'Piano', emoji: '🎼' },
    { id: 'staff', label: 'Pentagrama', emoji: '🎶' },
    { id: 'games', label: 'Juegos', emoji: '🎮' },
    { id: 'tutorials', label: 'Tutoriales', emoji: '📺' },
    { id: 'theory', label: 'Teoría', emoji: '📚' },
    { id: 'classes', label: 'Clases', emoji: '📅' },
    { id: 'homework', label: 'Tarea', emoji: '📝' },
    { id: 'progress', label: 'Progreso', emoji: '⭐' },
    { id: 'contact', label: 'Contacto', emoji: '📞' },
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
              <p className="text-[#888] text-xs">Portal del Estudiante</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-[#888] hover:text-white transition-colors text-xs">
            <LogOut className="w-3.5 h-3.5" /> Salir
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-[57px] z-30 bg-[#111] border-b border-[#2a2a2a] overflow-x-auto">
        <div className="max-w-xl mx-auto flex gap-1 px-3 py-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === t.id ? 'text-black font-bold' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
              }`}
              style={activeTab === t.id ? { background: ageColor } : {}}
            >
              <span>{t.emoji}</span> {t.label}
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
              <p className="text-sm font-medium mb-1" style={{ color: ageColor }}>¡Bienvenido de vuelta! 👋</p>
              <h1 className="text-2xl font-bold text-white mb-1">{student.name}</h1>
              <p className="text-[#888] text-sm">{student.ageGroup} · Módulo {student.currentModule}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-white">{completedClasses.length}</div>
                <div className="text-xs text-[#888] mt-0.5">Clases</div>
              </div>
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold" style={{ color: ageColor }}>{streak}🔥</div>
                <div className="text-xs text-[#888] mt-0.5">Racha</div>
              </div>
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3 text-center">
                <div className="text-2xl font-bold" style={{ color: ageColor }}>M{student.currentModule}</div>
                <div className="text-xs text-[#888] mt-0.5">Módulo</div>
              </div>
            </div>

            {currentModule && (
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-xs text-[#888] uppercase tracking-wider mb-2">Módulo Actual</p>
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
                <p className="text-xs text-[#888] uppercase tracking-wider mb-2">Próxima Clase</p>
                <p className="font-semibold text-white">{formatDate(upcomingClasses[0].date)}</p>
                <p className="text-sm text-[#888]">{formatTime12h(upcomingClasses[0].time)} · {upcomingClasses[0].duration} min</p>
              </div>
            )}

            <div className="rounded-xl p-4" style={{ background: `${ageColor}10`, border: `1px solid ${ageColor}20` }}>
              <p className="text-sm text-white italic leading-relaxed">&quot;{quote}&quot;</p>
            </div>

            {/* Atajos a TODO */}
            <div>
              <p className="text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">Explora tu app</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'songs' as Tab, icon: Library, label: '156 Canciones', color: 'bg-rose-500/10 border-rose-500/30 text-rose-300' },
                  { id: 'piano' as Tab, icon: Piano, label: 'Piano con sonido', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' },
                  { id: 'staff' as Tab, icon: Music2, label: 'Pentagrama', color: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' },
                  { id: 'games' as Tab, icon: Gamepad2, label: 'Juegos', color: 'bg-purple-500/10 border-purple-500/30 text-purple-300' },
                  { id: 'tutorials' as Tab, icon: Video, label: 'Tutoriales', color: 'bg-blue-500/10 border-blue-500/30 text-blue-300' },
                  { id: 'theory' as Tab, icon: BookOpen, label: 'Teoría', color: 'bg-amber-500/10 border-amber-500/30 text-amber-300' },
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
            <h2 className="text-xl font-bold text-white">Módulo Actual 🎹</h2>

            <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ageColor}20, ${ageColor}05)`, border: `1px solid ${ageColor}30` }}>
              <div className="absolute -top-6 -right-6 text-7xl opacity-20">{currentModule.icon}</div>
              <p className="text-xs uppercase tracking-wider mb-1 font-semibold" style={{ color: ageColor }}>
                Módulo {currentModule.id} de 16 · {currentModule.phase}
              </p>
              <h3 className="text-xl font-bold text-white mb-2">{currentModule.title}</h3>
              <p className="text-sm text-[#aaa] leading-relaxed">{currentModule.description}</p>
              <p className="text-xs text-[#888] mt-3">Duración estimada: {currentModule.estimatedWeeks}</p>
            </div>

            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-xs text-[#888] uppercase tracking-wider mb-3">Lo que estás aprendiendo</p>
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
                <p className="text-xs text-[#888] uppercase tracking-wider mb-3">Mis metas — debo ser capaz de:</p>
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
                  <p className="text-sm font-semibold text-white">Quiz del Módulo {student.currentModule}</p>
                </div>
                <p className="text-xs text-[#888] mb-3">{moduleQuiz.questions.length} preguntas para poner a prueba lo que aprendiste.</p>
                {myQuizResult && (
                  <div className="flex items-center gap-2 mb-3 p-2.5 bg-[#1a1a1a] rounded-lg">
                    <span className="text-lg">{myQuizResult.percent >= 80 ? '🏆' : myQuizResult.percent >= 60 ? '👍' : '💪'}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">Tu mejor resultado: {myQuizResult.percent}%</p>
                      <p className="text-xs text-[#555]">{myQuizResult.score} de {myQuizResult.total} correctas</p>
                    </div>
                  </div>
                )}
                <button onClick={() => setShowQuiz(true)} className="w-full py-2.5 rounded-lg font-semibold text-sm text-black" style={{ background: ageColor }}>
                  {myQuizResult ? 'Volver a intentar' : 'Empezar el quiz'}
                </button>
              </div>
            )}

            {nextModule && (
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5 opacity-60">
                <p className="text-xs text-[#888] uppercase tracking-wider mb-3">🔒 Próximo módulo</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl grayscale">🔒</span>
                  <div>
                    <p className="font-semibold text-[#888]">Módulo {nextModule.id}: {nextModule.title}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── PRÁCTICA ────────────────────────────────────────── */}
        {activeTab === 'practice' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">Mi Práctica 🎯</h2>

            <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${ageColor}20, ${ageColor}05)`, border: `1px solid ${ageColor}30` }}>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    <Flame className="w-7 h-7" style={{ color: ageColor }} />
                    <span className="text-4xl font-bold text-white">{streak}</span>
                  </div>
                  <p className="text-xs text-[#888] mt-1">días seguidos</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">
                    {streak === 0 ? '¡Empieza tu racha hoy!' : streak < 3 ? '¡Buen comienzo!' : streak < 7 ? '¡Vas increíble!' : '¡Imparable! 🔥'}
                  </p>
                  <p className="text-xs text-[#888] mt-0.5">{practiceLog.totalMinutes} min practicados en total</p>
                </div>
              </div>
              <button
                onClick={handleLogPractice}
                disabled={didPracticeToday}
                className="w-full mt-4 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
                style={{ background: didPracticeToday ? '#1a1a1a' : ageColor, color: didPracticeToday ? '#888' : '#000' }}
              >
                {didPracticeToday ? '✓ ¡Ya practicaste hoy!' : 'Registrar práctica (+15 min)'}
              </button>
            </div>

            <div>
              <p className="text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">Metrónomo</p>
              <Metronome accent={ageColor} />
            </div>

            <div>
              <p className="text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">Ejercicios Hanon</p>
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
            <h2 className="text-xl font-bold text-white">Canciones 🎵</h2>
            <p className="text-xs text-[#888]">
              {SONGS.length} canciones para tocar en piano. Filtra por tu módulo, dificultad o busca por nombre.
            </p>

            {student.assignedSongs.length > 0 && (
              <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-xs text-[#888] uppercase mb-2">⭐ Asignadas por tu profe</p>
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
            <h2 className="text-xl font-bold text-white">Piano Interactivo 🎼</h2>
            <p className="text-xs text-[#888]">
              Explora acordes, escalas y toca libre. Click en cualquier tecla para escucharla.
            </p>
            <PianoExplorer accent={ageColor} />
          </div>
        )}

        {/* ─── PENTAGRAMA ─────────────────────────────────────── */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Pentagrama 🎶</h2>
            <p className="text-xs text-[#888]">
              Construye escalas, acordes y melodías en el pentagrama. Reprodúcelas para escucharlas.
            </p>
            <StaffBuilder accent={ageColor} />
          </div>
        )}

        {/* ─── JUEGOS ─────────────────────────────────────────── */}
        {activeTab === 'games' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Juegos 🎮</h2>
            <p className="text-xs text-[#888]">Diviértete mientras entrenas tu oído y tu lectura musical.</p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'chord' as GameId, emoji: '🎹', title: 'Acordes', desc: 'Identifica acordes de oído' },
                { id: 'rhythm' as GameId, emoji: '🥁', title: 'Ritmo', desc: 'Sigue el patrón a tiempo' },
                { id: 'memory' as GameId, emoji: '🧠', title: 'Memory', desc: 'Empareja notas y nombres' },
                { id: 'speed' as GameId, emoji: '⚡', title: 'Speed Reading', desc: 'Lee notas contra reloj' },
                { id: 'ear' as GameId, emoji: '👂', title: 'Entrenador de Oído', desc: 'Intervalos y acordes' },
                { id: 'reading' as GameId, emoji: '📖', title: 'Lectura básica', desc: 'Nombra notas del pentagrama' },
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
            <h2 className="text-xl font-bold text-white">Tutoriales 📺</h2>
            <p className="text-xs text-[#888]">
              Videos curados de YouTube para tu módulo actual: <span className="text-white">M{student.currentModule} — {currentModule?.title}</span>
            </p>

            {tutorials.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-[#333] mx-auto mb-3" />
                <p className="text-sm text-[#555]">No hay tutoriales específicos para este módulo todavía.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tutorials.map((t) => (
                  <a
                    key={t.id}
                    href={getTutorialUrl(t)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-[#111] border border-[#2a2a2a] rounded-xl hover:border-[#3a3a3a] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${ageColor}20` }}>
                      {t.kind === 'theory' ? <BookOpen className="w-5 h-5" style={{ color: ageColor }} /> :
                       t.kind === 'exercise' ? <Sparkles className="w-5 h-5" style={{ color: ageColor }} /> :
                       <Video className="w-5 h-5" style={{ color: ageColor }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{t.title}</p>
                      <p className="text-xs text-[#888]">{t.description}</p>
                      <p className="text-[10px] text-[#555] uppercase mt-0.5">
                        {t.kind === 'theory' ? 'Teoría' : t.kind === 'exercise' ? 'Ejercicio' : 'Tutorial'}
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
            <h2 className="text-xl font-bold text-white">Teoría 📚</h2>
            <p className="text-xs text-[#888]">
              Consulta rápida de los conceptos del método. Para más profundidad, mira los tutoriales o pregunta en clase.
            </p>

            {MODULES.map((m) => (
              <div key={m.id} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs uppercase text-[#888] font-semibold">Módulo {m.id} · {m.phase}</p>
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
                  <ChevronLeft className="w-4 h-4" /> Volver a mis clases
                </button>
                <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4">
                  <p className="text-sm font-bold text-white">{formatDate(selectedClass.date)}</p>
                  <p className="text-xs text-[#888]">{formatTime12h(selectedClass.time)} · {selectedClass.duration} min · Módulo {selectedClass.module}</p>
                  {selectedClass.whatWeWorkedOn && (
                    <div className="mt-3 p-3 bg-[#1a1a1a] rounded-lg">
                      <p className="text-xs uppercase text-[#888] mb-1">Lo que trabajamos</p>
                      <p className="text-sm text-white">{selectedClass.whatWeWorkedOn}</p>
                    </div>
                  )}
                  {selectedClass.homeworkAssigned && (
                    <div className="mt-2 p-3 rounded-lg" style={{ background: `${ageColor}10`, border: `1px solid ${ageColor}30` }}>
                      <p className="text-xs uppercase mb-1" style={{ color: ageColor }}>Tarea</p>
                      <p className="text-sm text-white">{selectedClass.homeworkAssigned}</p>
                    </div>
                  )}
                  {selectedClass.nextClassFocus && (
                    <div className="mt-2 p-3 bg-[#1a1a1a] rounded-lg">
                      <p className="text-xs uppercase text-[#888] mb-1">Foco próxima clase</p>
                      <p className="text-sm text-white">{selectedClass.nextClassFocus}</p>
                    </div>
                  )}
                </div>

                {selectedClass.materials && selectedClass.materials.length > 0 && (
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">📎 Material de la clase</p>
                    <ClassMaterialViewer materials={selectedClass.materials} />
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white">Mis Clases 📅</h2>

                {upcomingClasses.length > 0 && (
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-wider mb-3">Próximas</p>
                    {upcomingClasses.map((c) => (
                      <button key={c.id} onClick={() => setSelectedClassId(c.id)} className="w-full text-left bg-[#111] border border-blue-500/30 rounded-xl p-4 mb-2 hover:border-blue-500/50">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-white">{formatDate(c.date)}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">Próxima</span>
                        </div>
                        <p className="text-sm text-[#888]">{formatTime12h(c.time)} · {c.duration} min</p>
                        {c.materials && c.materials.length > 0 && (
                          <p className="text-xs mt-1" style={{ color: ageColor }}>📎 {c.materials.length} material{c.materials.length !== 1 ? 'es' : ''} disponible{c.materials.length !== 1 ? 's' : ''}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                <div>
                  <p className="text-xs text-[#888] uppercase tracking-wider mb-3">Historial ({completedClasses.length})</p>
                  {completedClasses.length === 0 ? (
                    <p className="text-[#555] text-sm text-center py-8">Aún no hay clases completadas</p>
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
                              <p className="text-xs mt-1" style={{ color: ageColor }}>📎 {c.materials.length} material{c.materials.length !== 1 ? 'es' : ''}</p>
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
            <h2 className="text-xl font-bold text-white">Mi Tarea 📝</h2>
            {lastClass ? (
              <>
                <div className="rounded-xl p-5" style={{ background: `${ageColor}10`, border: `1px solid ${ageColor}20` }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: ageColor }}>Última tarea — {formatDate(lastClass.date)}</p>
                  <p className="text-white leading-relaxed">{lastClass.homeworkAssigned || 'Sin tarea asignada.'}</p>
                </div>
                {lastClass.materials && lastClass.materials.length > 0 && (
                  <div>
                    <p className="text-xs text-[#888] uppercase tracking-wider mb-2 font-semibold">📎 Material de la última clase</p>
                    <ClassMaterialViewer materials={lastClass.materials} />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <span className="text-5xl">📝</span>
                <p className="text-[#888] mt-4">Aún no tienes clases. La tarea aparecerá aquí.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── PROGRESO ───────────────────────────────────────── */}
        {activeTab === 'progress' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">Mi Progreso ⭐</h2>

            <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-5">
              <p className="text-xs text-[#888] uppercase tracking-wider mb-3">Tu camino</p>
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
              <p className="text-xs text-[#888] uppercase tracking-wider mb-3">Llaves ganadas 🔑</p>
              {earnedKeys.length === 0 ? (
                <p className="text-[#555] text-sm">Completa tu primera clase para ganar tu primera llave.</p>
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
            <h2 className="text-xl font-bold text-white">Contacto 📞</h2>
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
                <p className="font-semibold text-white text-sm">Mensaje por WhatsApp</p>
                <p className="text-xs text-[#888]">Habla con tu profe</p>
              </div>
            </a>
            <button onClick={handleLogout} className="w-full py-3 bg-[#111] border border-[#2a2a2a] rounded-xl text-[#888] hover:text-white text-sm flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Cerrar sesión
            </button>
          </div>
        )}
      </div>

      {/* Modales */}
      <Modal isOpen={showQuiz} onClose={() => setShowQuiz(false)} title={`Quiz — Módulo ${student.currentModule}`} size="md">
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

      <Modal isOpen={activeGame === 'ear'} onClose={() => setActiveGame(null)} title="Entrenador de Oído" size="sm">
        <EarTrainer accent={ageColor} />
      </Modal>
      <Modal isOpen={activeGame === 'reading'} onClose={() => setActiveGame(null)} title="Lectura básica" size="sm">
        <ReadingTrainer accent={ageColor} />
      </Modal>
      <Modal isOpen={activeGame === 'chord'} onClose={() => setActiveGame(null)} title="Identificador de Acordes" size="sm">
        <ChordIdentifier accent={ageColor} />
      </Modal>
      <Modal isOpen={activeGame === 'rhythm'} onClose={() => setActiveGame(null)} title="Juego de Ritmo" size="sm">
        <RhythmGame accent={ageColor} />
      </Modal>
      <Modal isOpen={activeGame === 'memory'} onClose={() => setActiveGame(null)} title="Memory de Notas" size="md">
        <NoteMemory accent={ageColor} />
      </Modal>
      <Modal isOpen={activeGame === 'speed'} onClose={() => setActiveGame(null)} title="Speed Reading" size="sm">
        <SpeedReading accent={ageColor} />
      </Modal>
    </div>
  );
}
