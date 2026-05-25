'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { MODULES, RUVEL_KEYS, MOTIVATIONAL_QUOTES } from '@/lib/constants';
import { formatDate, formatAUD, getInitials, getAgeGroupColor, getLevelBadge, getAgeGroupBg, getStatusBadge, formatTime12h } from '@/lib/utils';
import { ArrowLeft, Music, Star, Trash2, Edit2, X, ChevronDown, ChevronUp, Copy, Check, MessageCircle, Pencil, Save } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import ClassMaterialEditor from '@/components/ClassMaterialEditor';
import { AgeGroup, Level, ClassEntry, ClassStatus } from '@/lib/types';
import { getStorage } from '@/lib/storage';
import { QuizResultsStore } from '@/lib/quizzes';
import { getPracticeLog, getStreak } from '@/lib/practice';

const TABS = ['Overview', 'Classes', 'Payments', 'Progress', 'Next Class', 'Notes', 'Student View'];
const AGE_GROUPS: AgeGroup[] = ['Kids (6-12)', 'Youth (13-17)', 'Adults (18+)'];
const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced'];
const STATUSES: ClassStatus[] = ['Completed', 'Scheduled', 'Cancelled', 'Rescheduled'];

export default function StudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { students, classes, payments, assignKey, removeKey, updateStudent, deleteStudent, updateClass, deleteClass, getCompletedClassCount } = useApp();

  const student = students.find((s) => s.id === params.id);
  const [tab, setTab] = useState('Overview');
  const [notes, setNotes] = useState('');
  const [notesTimer, setNotesTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showClassEditModal, setShowClassEditModal] = useState(false);
  const [showClassDeleteConfirm, setShowClassDeleteConfirm] = useState<string | null>(null);
  const [editingClassId, setEditingClassId] = useState<string | null>(null);
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);
  const [reportCopied, setReportCopied] = useState(false);
  const [quizResultsAll, setQuizResultsAll] = useState<QuizResultsStore>({});

  useEffect(() => {
    setQuizResultsAll(getStorage<QuizResultsStore>('quiz_results', {}));
  }, []);

  // Class plan state (Next Class tab)
  const [classPlan, setClassPlan] = useState<string[]>([]);
  const [planCopied, setPlanCopied] = useState(false);
  const [homework, setHomework] = useState({ songs: '', exercises: '', apps: '', goal: '' });
  const [hwCopied, setHwCopied] = useState(false);

  const [editForm, setEditForm] = useState<{
    name: string; age: string; ageGroup: AgeGroup; level: Level;
    goals: string; parentName: string; parentPhone: string; parentEmail: string;
    currentModule: string; schedule: string;
  }>({ name: '', age: '', ageGroup: 'Kids (6-12)', level: 'Beginner', goals: '', parentName: '', parentPhone: '', parentEmail: '', currentModule: '1', schedule: '' });

  const [pricingForm, setPricingForm] = useState({ priceSingle: '', price4Pack: '', price8Pack: '' });

  const [classEditForm, setClassEditForm] = useState<{
    date: string; time: string; duration: string; status: ClassStatus; module: string;
    whatWeWorkedOn: string; homeworkAssigned: string; teacherNotes: string; nextClassFocus: string;
    achievement: string; energyLevel: string; sessionRating: string;
    materials: import('@/lib/types').ClassMaterial[];
  }>({
    date: '', time: '', duration: '', status: 'Completed', module: '1',
    whatWeWorkedOn: '', homeworkAssigned: '', teacherNotes: '', nextClassFocus: '',
    achievement: '', energyLevel: '', sessionRating: '',
    materials: [],
  });

  useEffect(() => {
    if (student) {
      setNotes(student.notes);
      setEditForm({
        name: student.name, age: String(student.age), ageGroup: student.ageGroup,
        level: student.level, goals: student.goals, parentName: student.parentName,
        parentPhone: student.parentPhone, parentEmail: student.parentEmail,
        currentModule: String(student.currentModule),
        schedule: student.schedule || '',
      });
      setPricingForm({
        priceSingle: String(student.priceSingle ?? ''),
        price4Pack: String(student.price4Pack ?? ''),
        price8Pack: String(student.price8Pack ?? ''),
      });
    }
  }, [student]);

  if (!student) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-[#888888] mb-4">Student not found</p>
          <button onClick={() => router.back()} className="text-[#C9A84C] hover:underline">← Go back</button>
        </div>
      </div>
    );
  }

  const studentClasses = classes.filter((c) => c.studentId === student.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const completedClasses = studentClasses.filter((c) => c.status === 'Completed');
  const scheduledClasses = studentClasses.filter((c) => c.status === 'Scheduled');
  const studentPayments = payments.filter((p) => p.studentId === student.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const totalPaid = studentPayments.reduce((s, p) => s + p.amount, 0);
  const classesRemaining = studentPayments.reduce((s, p) => s + p.classesRemaining, 0);
  const currentModule = MODULES.find((m) => m.id === student.currentModule);
  const completedCount = getCompletedClassCount(student.id);
  const lastClass = completedClasses[0];
  const nextClass = scheduledClasses[0];

  const handleNotesChange = (val: string) => {
    setNotes(val);
    if (notesTimer) clearTimeout(notesTimer);
    const timer = setTimeout(() => {
      updateStudent(student.id, { notes: val });
    }, 1000);
    setNotesTimer(timer);
  };

  const handleDelete = () => {
    deleteStudent(student.id);
    router.push('/students');
  };

  const handleEdit = () => {
    updateStudent(student.id, {
      name: editForm.name, age: parseInt(editForm.age) || 0,
      ageGroup: editForm.ageGroup, level: editForm.level,
      goals: editForm.goals, parentName: editForm.parentName,
      parentPhone: editForm.parentPhone, parentEmail: editForm.parentEmail,
      currentModule: parseInt(editForm.currentModule) || 1,
      schedule: editForm.schedule || undefined,
    });
    setShowEditModal(false);
  };

  const handlePricingSave = () => {
    updateStudent(student.id, {
      priceSingle: pricingForm.priceSingle ? parseFloat(pricingForm.priceSingle) : undefined,
      price4Pack: pricingForm.price4Pack ? parseFloat(pricingForm.price4Pack) : undefined,
      price8Pack: pricingForm.price8Pack ? parseFloat(pricingForm.price8Pack) : undefined,
    });
    setShowPricingModal(false);
  };

  const openClassEdit = (c: ClassEntry) => {
    setEditingClassId(c.id);
    setClassEditForm({
      date: c.date,
      time: c.time || '',
      duration: String(c.duration),
      status: c.status,
      module: String(c.module),
      whatWeWorkedOn: c.whatWeWorkedOn || '',
      homeworkAssigned: c.homeworkAssigned || '',
      teacherNotes: c.teacherNotes || '',
      nextClassFocus: c.nextClassFocus || '',
      achievement: c.achievement || '',
      energyLevel: c.energyLevel || '',
      sessionRating: String(c.sessionRating || ''),
      materials: c.materials || [],
    });
    setShowClassEditModal(true);
  };

  const handleClassEditSave = () => {
    if (!editingClassId) return;
    updateClass(editingClassId, {
      date: classEditForm.date,
      time: classEditForm.time,
      duration: parseInt(classEditForm.duration) || 60,
      status: classEditForm.status,
      module: parseInt(classEditForm.module) || 1,
      whatWeWorkedOn: classEditForm.whatWeWorkedOn,
      homeworkAssigned: classEditForm.homeworkAssigned,
      teacherNotes: classEditForm.teacherNotes,
      nextClassFocus: classEditForm.nextClassFocus,
      achievement: classEditForm.achievement,
      energyLevel: classEditForm.energyLevel as 'Low' | 'Medium' | 'High' | undefined,
      sessionRating: classEditForm.sessionRating ? parseInt(classEditForm.sessionRating) as 1|2|3|4|5 : undefined,
      materials: classEditForm.materials,
    });
    setShowClassEditModal(false);
    setEditingClassId(null);
  };

  // Build report card text for a class
  const buildReportText = (c: ClassEntry) => {
    return `📚 RÜVEL Piano — Class Report
👤 Student: ${student.name}
📅 Date: ${formatDate(c.date)} at ${formatTime12h(c.time || '')}
📖 Module: ${MODULES.find((m) => m.id === c.module)?.title || `Module ${c.module}`}
${c.whatWeWorkedOn ? `\n✅ Today we worked on:\n${c.whatWeWorkedOn}` : ''}${c.achievement ? `\n\n🏆 Achievement: ${c.achievement}` : ''}${c.homeworkAssigned ? `\n\n📝 Homework:\n${c.homeworkAssigned}` : ''}${c.nextClassFocus ? `\n\n🎯 Next class focus: ${c.nextClassFocus}` : ''}

Keep practicing! 🔑 RÜVEL Piano Method`;
  };

  // Generate suggested class plan
  const generateClassPlan = () => {
    const mod = currentModule;
    const duration = nextClass?.duration || 60;
    const plan = [
      `⏱ 0-5 min: Warm up — ${mod?.exercises[0] || 'Finger warmups and scales'}`,
      `⏱ 5-15 min: Review — ${lastClass?.homeworkAssigned ? 'Check last homework: ' + lastClass.homeworkAssigned.slice(0, 60) : 'Review from last class'}`,
      `⏱ 15-${Math.round(duration * 0.6)} min: New content — ${mod?.exercises[1] || 'New technique or concept'}`,
      `⏱ ${Math.round(duration * 0.6)}-${Math.round(duration * 0.85)} min: Song practice — ${student.assignedSongs[0] || 'Work on assigned song'}`,
      `⏱ ${Math.round(duration * 0.85)}-${duration} min: Homework & wrap up`,
    ];
    setClassPlan(plan);
  };

  const copyPlan = () => {
    const text = `RÜVEL Piano — Class Plan for ${student.name}\n${formatDate(nextClass?.date || '')}\n\n` + classPlan.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setPlanCopied(true);
      setTimeout(() => setPlanCopied(false), 2000);
    });
  };

  const generateHomeworkWhatsApp = () => {
    const msg = `Hi${student.parentName ? ' ' + student.parentName : ''}! 🎹\n\nHomework for ${student.name} this week:\n${homework.songs ? `🎵 Practice: ${homework.songs}\n` : ''}${homework.exercises ? `📝 Exercises: ${homework.exercises}\n` : ''}${homework.apps ? `📱 Apps/tools: ${homework.apps}\n` : ''}${homework.goal ? `🎯 Goal: ${homework.goal}\n` : ''}${nextClass ? `\nNext class: ${formatDate(nextClass.date)} at ${formatTime12h(nextClass.time || '')}` : ''}\n\nKeep it up! — RÜVEL Piano`;
    navigator.clipboard.writeText(msg).then(() => {
      setHwCopied(true);
      setTimeout(() => setHwCopied(false), 2000);
    });
  };

  // Suggested games for Next Class (curated per age group / module)
  const ALL_SUGGESTED = [
    { id: 'chord_challenge', name: 'Chord Challenge', emoji: '🎹', description: 'Build chords from the formula — great for Module 2+', duration: '10 min', forModules: [2,3,4,5,6,7,8] },
    { id: 'note_flash', name: 'Note Name Flash', emoji: '⚡', description: 'Speed round naming notes on the keyboard', duration: '5 min', forModules: [1,2,3] },
    { id: 'animal_song', name: 'Animal Note Song', emoji: '🐱', description: 'Perfect for Kids — use animal names for notes', duration: '10 min', forModules: [1,2] },
    { id: 'rhythm_clapper', name: 'Rhythm Clapper', emoji: '👏', description: 'Clap and echo rhythm patterns before playing', duration: '5 min', forModules: [1,2,3] },
    { id: 'chord_story', name: 'Chord Story Game', emoji: '📖', description: 'Play a chord to match the emotion in a story', duration: '15 min', forModules: [2,3,4] },
    { id: 'major_minor', name: 'Major or Minor?', emoji: '🎵', description: 'Ear training — guess major or minor', duration: '10 min', forModules: [4,5,6,7,8] },
    { id: 'improv_dice', name: 'Improv Dice', emoji: '🎲', description: 'Roll and improvise — fun for all levels', duration: '10 min', forModules: [5,6,7,8] },
    { id: 'interval_quiz', name: 'Interval Quiz', emoji: '📐', description: 'Test interval recognition by ear', duration: '10 min', forModules: [4,5,6,7,8] },
  ];
  const suggestedGames = ALL_SUGGESTED.filter((g) => g.forModules.includes(student.currentModule)).slice(0, 3);

  const inputCls = 'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors';
  const selectCls = 'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors';
  const labelCls = 'block text-xs text-[#888888] mb-1.5 font-medium';
  const manualKeys = RUVEL_KEYS.filter((k) => k.type === 'manual');

  const generateProgressReport = () => {
    const completed = classes.filter((c) => c.studentId === student.id && c.status === 'Completed');
    const mod = MODULES.find((m) => m.id === student.currentModule);
    const keys = RUVEL_KEYS.filter((k) => student.keysEarned.includes(k.id));
    const qr = quizResultsAll[student.id] || {};
    const quizEntries = Object.entries(qr).sort((a, b) => Number(a[0]) - Number(b[0]));
    const pl = getPracticeLog(student.id);
    const streak = getStreak(pl.dates);

    let report = `📊 *Reporte de Progreso — ${student.name}*\n\n`;
    report += `🎹 Módulo actual: ${student.currentModule} — ${mod?.title || ''}\n`;
    report += `✅ Clases completadas: ${completed.length}\n`;
    report += `🔑 Llaves ganadas: ${keys.length}`;
    if (keys.length > 0) report += ` (${keys.map((k) => k.name).join(', ')})`;
    report += `\n🔥 Racha de práctica: ${streak} día${streak !== 1 ? 's' : ''}\n`;
    if (pl.totalMinutes > 0) report += `⏱️ Minutos practicados: ${pl.totalMinutes}\n`;
    if (quizEntries.length > 0) {
      report += `\n📝 *Resultados de quizzes:*\n`;
      quizEntries.forEach(([mid, r]) => {
        report += `  • Módulo ${mid}: ${r.percent}%\n`;
      });
    }
    report += `\n¡${student.name} va por excelente camino! 🎶\n— Método RÜVEL Piano`;

    navigator.clipboard?.writeText(report);
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2500);
  };

  const quotesByGroup = {
    'Kids (6-12)': MOTIVATIONAL_QUOTES.kids,
    'Youth (13-17)': MOTIVATIONAL_QUOTES.youth,
    'Adults (18+)': MOTIVATIONAL_QUOTES.adults,
  };
  const quotes = quotesByGroup[student.ageGroup];
  const quote = quotes[Math.floor((new Date().getDate()) % quotes.length)];
  const nextModule = MODULES.find((m) => m.id === student.currentModule + 1);

  const practiceItems = [
    `${currentModule?.exercises[0] || 'Finger warmups'} (5 min)`,
    `Review last week's homework (10 min)`,
    `Work on current song (10 min)`,
    `Chord transitions: C → G → Am → F (5 min)`,
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#2a2a2a] px-6 py-4">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors mb-4 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </button>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0" style={{ background: getAgeGroupColor(student.ageGroup) }}>
              {getInitials(student.name)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{student.name}</h1>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getLevelBadge(student.level)}`}>{student.level}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getAgeGroupBg(student.ageGroup)}`}>{student.ageGroup}</span>
                <span className="text-xs text-[#888888]">Age {student.age}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setShowEditModal(true)} className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#888888] hover:text-white transition-colors" title="Edit student">
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="p-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#888888] hover:text-red-400 transition-colors" title="Delete student">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#111111] border-b border-[#2a2a2a] px-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-[#888888] hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="p-6 max-w-4xl mx-auto">

        {/* ── OVERVIEW ── */}
        {tab === 'Overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <h3 className="text-xs text-[#888888] uppercase tracking-wider mb-3 font-medium">Current Module</h3>
                {currentModule ? (
                  <>
                    <p className="text-[#C9A84C] font-semibold">Module {currentModule.id} — {currentModule.title}</p>
                    <p className="text-sm text-[#888888] mt-1">{currentModule.description.slice(0, 80)}...</p>
                    <button onClick={() => { if (nextModule) updateStudent(student.id, { currentModule: nextModule.id }); }} disabled={!nextModule} className="mt-3 text-xs text-[#C9A84C] hover:underline disabled:text-[#555555] disabled:no-underline">
                      {nextModule ? `→ Advance to Module ${nextModule.id}` : 'All modules completed'}
                    </button>
                  </>
                ) : (
                  <p className="text-[#555555]">Not assigned</p>
                )}
              </div>

              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <h3 className="text-xs text-[#888888] uppercase tracking-wider mb-3 font-medium">Goals</h3>
                <p className="text-sm text-white">{student.goals || <span className="text-[#555555]">No goals set</span>}</p>
                {student.schedule && (
                  <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
                    <p className="text-xs text-[#888888]">Class Schedule</p>
                    <p className="text-sm text-[#C9A84C] mt-1">📅 {student.schedule}</p>
                  </div>
                )}
                {student.parentName && (
                  <div className="mt-3 pt-3 border-t border-[#2a2a2a]">
                    <p className="text-xs text-[#888888]">Parent / Guardian</p>
                    <p className="text-sm text-white mt-1">{student.parentName}</p>
                    {student.parentPhone && <p className="text-xs text-[#888888]">{student.parentPhone}</p>}
                    {student.parentEmail && <p className="text-xs text-[#888888]">{student.parentEmail}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Pricing card */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs text-[#888888] uppercase tracking-wider font-medium">💰 Personal Rates</h3>
                <button onClick={() => setShowPricingModal(true)} className="p-1.5 text-[#888888] hover:text-[#C9A84C] transition-colors" title="Edit rates">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="text-white">${student.priceSingle ?? '—'}<span className="text-[#888888] text-xs ml-1">/class</span></span>
                <span className="text-white">${student.price4Pack ?? '—'}<span className="text-[#888888] text-xs ml-1">4-pack</span></span>
                <span className="text-white">${student.price8Pack ?? '—'}<span className="text-[#888888] text-xs ml-1">8-pack</span></span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{completedCount}</p>
                <p className="text-xs text-[#888888] mt-1">Classes done</p>
              </div>
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-[#C9A84C]">{formatAUD(totalPaid)}</p>
                <p className="text-xs text-[#888888] mt-1">Total paid</p>
              </div>
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{classesRemaining}</p>
                <p className="text-xs text-[#888888] mt-1">Classes left</p>
              </div>
            </div>

            {/* Assigned songs */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
              <h3 className="text-xs text-[#888888] uppercase tracking-wider mb-3 font-medium flex items-center gap-2">
                <Music className="w-3.5 h-3.5" /> Assigned Songs
              </h3>
              {student.assignedSongs.length === 0 ? (
                <p className="text-[#555555] text-sm">No songs assigned yet</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {student.assignedSongs.map((song) => (
                    <span key={song} className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-sm text-white">{song}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Next class */}
            {nextClass && (
              <div className="bg-[#1a1a1a] border border-[#C9A84C]/20 rounded-xl p-4">
                <h3 className="text-xs text-[#C9A84C] uppercase tracking-wider mb-2 font-medium">Next Class</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{formatDate(nextClass.date)} at {formatTime12h(nextClass.time || '')}</p>
                    <p className="text-sm text-[#888888]">{nextClass.duration} min · {MODULES.find((m) => m.id === nextClass.module)?.title}</p>
                    {nextClass.nextClassFocus && <p className="text-xs text-[#888888] mt-1">Focus: {nextClass.nextClassFocus}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CLASSES ── */}
        {tab === 'Classes' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-white">{studentClasses.length} class record{studentClasses.length !== 1 ? 's' : ''}</h2>
            </div>
            {studentClasses.length === 0 ? (
              <div className="text-center py-12"><p className="text-[#555555]">No classes logged yet</p></div>
            ) : (
              studentClasses.map((c) => {
                const mod = MODULES.find((m) => m.id === c.module);
                const isOpen = expandedClassId === c.id;
                return (
                  <div key={c.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2 p-4">
                      <button onClick={() => setExpandedClassId(isOpen ? null : c.id)} className="flex-1 flex items-center justify-between text-left">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white text-sm">{formatDate(c.date)}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(c.status)}`}>{c.status}</span>
                          </div>
                          <p className="text-xs text-[#888888] mt-0.5">
                            {mod?.title || `Module ${c.module}`} · {c.duration} min{c.time ? ` · ${formatTime12h(c.time)}` : ''}
                          </p>
                        </div>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-[#555555]" /> : <ChevronDown className="w-4 h-4 text-[#555555]" />}
                      </button>
                      {/* Edit & Delete buttons */}
                      <button onClick={() => openClassEdit(c)} className="p-1.5 text-[#555555] hover:text-[#C9A84C] transition-colors flex-shrink-0" title="Edit class">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setShowClassDeleteConfirm(c.id)} className="p-1.5 text-[#555555] hover:text-red-400 transition-colors flex-shrink-0" title="Delete class">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-0 border-t border-[#2a2a2a] space-y-3 mt-1">
                        {c.whatWeWorkedOn && <div><p className="text-xs text-[#888888]">What we covered</p><p className="text-sm text-white mt-1">{c.whatWeWorkedOn}</p></div>}
                        {c.achievement && <div><p className="text-xs text-[#888888]">🏆 Achievement</p><p className="text-sm text-emerald-400 mt-1">{c.achievement}</p></div>}
                        {c.homeworkAssigned && <div><p className="text-xs text-[#888888]">Homework</p><p className="text-sm text-white mt-1">{c.homeworkAssigned}</p></div>}
                        {c.teacherNotes && <div><p className="text-xs text-[#888888]">Teacher notes (private)</p><p className="text-sm text-[#888888] mt-1 italic">{c.teacherNotes}</p></div>}
                        {c.nextClassFocus && <div><p className="text-xs text-[#888888]">Next class focus</p><p className="text-sm text-[#C9A84C] mt-1">{c.nextClassFocus}</p></div>}
                        {c.status === 'Completed' && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(buildReportText(c)).then(() => { setCopiedReport(true); setTimeout(() => setCopiedReport(false), 2000); });
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs hover:bg-green-500/20 transition-colors mt-2"
                          >
                            {copiedReport ? <Check className="w-3 h-3" /> : <MessageCircle className="w-3 h-3" />}
                            {copiedReport ? 'Copied!' : 'Copy WhatsApp Report'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {tab === 'Payments' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-xs text-[#888888]">Total Paid</p>
                <p className="text-2xl font-bold text-[#C9A84C] mt-1">{formatAUD(totalPaid)}</p>
              </div>
              <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-xs text-[#888888]">Classes Remaining</p>
                <p className="text-2xl font-bold text-white mt-1">{classesRemaining}</p>
              </div>
            </div>
            {studentPayments.length === 0 ? (
              <div className="text-center py-12 bg-[#111111] border border-[#2a2a2a] rounded-xl"><p className="text-[#555555]">No payments recorded</p></div>
            ) : (
              <div className="space-y-3">
                {studentPayments.map((p) => {
                  const pct = p.classesTotal > 0 ? ((p.classesTotal - p.classesRemaining) / p.classesTotal) * 100 : 0;
                  return (
                    <div key={p.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold text-white">{formatAUD(p.amount)}</span>
                          <span className="text-xs text-[#888888] ml-2">{p.type} · {p.method}</span>
                        </div>
                        <span className="text-xs text-[#888888]">{formatDate(p.date)}</span>
                      </div>
                      {p.classesTotal > 1 && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-[#888888] mb-1">
                            <span>{p.classesTotal - p.classesRemaining} / {p.classesTotal} classes used</span>
                            <span>{p.classesRemaining} remaining</span>
                          </div>
                          <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
                            <div className="h-full bg-[#C9A84C] rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      )}
                      {p.notes && <p className="text-xs text-[#555555] mt-2">{p.notes}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PROGRESS ── */}
        {tab === 'Progress' && (
          <div className="space-y-5">
            {/* Reporte de progreso */}
            <div className="bg-[#111111] border border-[#C9A84C]/30 rounded-xl p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#C9A84C]" /> Reporte de Progreso
                  </h3>
                  <p className="text-xs text-[#888888] mt-1">
                    Genera un resumen completo listo para enviar a los padres por WhatsApp.
                  </p>
                </div>
                <button
                  onClick={generateProgressReport}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    reportCopied
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#C9A84C] text-black hover:bg-[#d4b56a]'
                  }`}
                >
                  {reportCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {reportCopied ? '¡Copiado! Pégalo en WhatsApp' : 'Generar reporte'}
                </button>
              </div>
            </div>

            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4">RÜVEL Method Progress</h3>
              <div className="space-y-3">
                {MODULES.map((mod) => {
                  const done = mod.id < student.currentModule;
                  const current = mod.id === student.currentModule;
                  return (
                    <div key={mod.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${done ? 'bg-[#C9A84C]/5 border-[#C9A84C]/20' : current ? 'bg-[#1a1a1a] border-[#C9A84C]/40' : 'bg-[#0a0a0a] border-[#1a1a1a]'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${done ? 'bg-[#C9A84C] text-black' : current ? 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/50' : 'bg-[#1a1a1a] text-[#555555]'}`}>
                        {done ? '✓' : mod.id}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${done ? 'text-[#C9A84C]' : current ? 'text-white' : 'text-[#555555]'}`}>{mod.title}</p>
                        <p className="text-xs text-[#555555]">{mod.estimatedWeeks}</p>
                      </div>
                      {current && <span className="text-xs bg-[#C9A84C]/20 text-[#C9A84C] px-2 py-0.5 rounded-full border border-[#C9A84C]/30">Current</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-[#C9A84C]" /> Keys Earned
              </h3>
              {student.keysEarned.length === 0 ? (
                <p className="text-[#555555] text-sm mb-4">No keys earned yet</p>
              ) : (
                <div className="flex flex-wrap gap-3 mb-5">
                  {RUVEL_KEYS.filter((k) => student.keysEarned.includes(k.id)).map((k) => (
                    <div key={k.id} className="flex items-center gap-2 px-3 py-2 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-lg">
                      <span className="text-lg">{k.emoji}</span>
                      <div>
                        <p className="text-xs font-semibold text-[#C9A84C]">{k.name}</p>
                        <p className="text-[10px] text-[#888888]">{k.description}</p>
                      </div>
                      <button onClick={() => removeKey(student.id, k.id)} className="ml-1 text-[#555555] hover:text-red-400 transition-colors" title="Remove key">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <p className="text-xs text-[#888888] mb-2 font-medium">Assign a Key</p>
                <div className="flex flex-wrap gap-2">
                  {manualKeys.filter((k) => !student.keysEarned.includes(k.id)).map((k) => (
                    <button key={k.id} onClick={() => assignKey(student.id, k.id)} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-xs text-[#888888] hover:text-white hover:border-[#C9A84C]/30 transition-colors">
                      <span>{k.emoji}</span> {k.name}
                    </button>
                  ))}
                  {manualKeys.every((k) => student.keysEarned.includes(k.id)) && <p className="text-xs text-[#555555]">All manual keys assigned!</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── NEXT CLASS ── */}
        {tab === 'Next Class' && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-white">Class Preparation 🎹</h2>

            {/* Section A — Student Snapshot */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider text-[#C9A84C]">A — Student Snapshot</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <p className="text-xs text-[#888888]">Last class</p>
                    <p className="text-sm text-white mt-1 font-medium">{lastClass ? formatDate(lastClass.date) : 'None yet'}</p>
                    {lastClass?.whatWeWorkedOn && <p className="text-xs text-[#888888] mt-1 line-clamp-2">{lastClass.whatWeWorkedOn}</p>}
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <p className="text-xs text-[#888888]">Current module</p>
                    <p className="text-sm text-[#C9A84C] mt-1 font-medium">{currentModule?.icon} {currentModule?.title}</p>
                    <p className="text-xs text-[#888888] mt-1">Module {student.currentModule} of 8</p>
                  </div>
                </div>
                {lastClass?.homeworkAssigned && (
                  <div className="bg-[#1a1a1a] rounded-lg p-3">
                    <p className="text-xs text-[#888888]">Last homework assigned</p>
                    <p className="text-sm text-white mt-1">{lastClass.homeworkAssigned}</p>
                  </div>
                )}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-white">{completedCount}</p>
                    <p className="text-xs text-[#888888]">Classes done</p>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-[#C9A84C]">{student.keysEarned.length}</p>
                    <p className="text-xs text-[#888888]">Keys earned</p>
                  </div>
                  <div className="bg-[#1a1a1a] rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-white">{lastClass?.energyLevel || '—'}</p>
                    <p className="text-xs text-[#888888]">Last energy</p>
                  </div>
                </div>
                {nextClass && (
                  <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-lg p-3">
                    <p className="text-xs text-[#C9A84C] font-semibold">📅 Next class: {formatDate(nextClass.date)} at {formatTime12h(nextClass.time || '')} ({nextClass.duration} min)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Section B — Suggested Class Plan */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
              <h3 className="font-semibold text-white mb-1 text-sm uppercase tracking-wider text-[#C9A84C]">B — Suggested Class Plan</h3>
              <p className="text-xs text-[#888888] mb-4">For {nextClass?.duration || 60} min class · {currentModule?.title}</p>

              {classPlan.length === 0 ? (
                <button onClick={generateClassPlan} className="w-full py-3 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] rounded-xl text-sm font-medium hover:bg-[#C9A84C]/20 transition-colors">
                  ✨ Generate Class Plan
                </button>
              ) : (
                <div className="space-y-2">
                  {classPlan.map((line, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <textarea
                        value={line}
                        onChange={(e) => {
                          const updated = [...classPlan];
                          updated[i] = e.target.value;
                          setClassPlan(updated);
                        }}
                        className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A84C] resize-none"
                        rows={2}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 mt-3">
                    <button onClick={copyPlan} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${planCopied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888] hover:text-white'}`}>
                      {planCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {planCopied ? 'Copied!' : 'Copy Plan'}
                    </button>
                    <button onClick={generateClassPlan} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888] hover:text-white rounded-lg text-xs transition-colors">
                      ↺ Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Section C — Suggested Games */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider text-[#C9A84C]">C — Suggested Games</h3>
              {suggestedGames.length === 0 ? (
                <p className="text-[#555555] text-sm">No games found. Check the Games page.</p>
              ) : (
                <div className="space-y-3">
                  {suggestedGames.map((game) => (
                    <div key={game.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 flex items-center gap-3">
                      <span className="text-2xl flex-shrink-0">{game.emoji || '🎮'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{game.name}</p>
                        <p className="text-xs text-[#888888] line-clamp-1">{game.description}</p>
                        {game.duration && <p className="text-xs text-[#555555] mt-0.5">⏱ {game.duration}</p>}
                      </div>
                      <a href="/games" className="px-3 py-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C] rounded-lg text-xs font-medium hover:bg-[#C9A84C]/20 transition-colors flex-shrink-0">
                        Open →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section D — Homework Builder */}
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider text-[#C9A84C]">D — Homework Builder</h3>
              <div className="space-y-3">
                <div>
                  <label className={labelCls}>🎵 Songs to practice</label>
                  <input className={inputCls} placeholder="e.g. Happy Birthday — verse and chorus" value={homework.songs} onChange={(e) => setHomework({ ...homework, songs: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>📝 Exercises</label>
                  <input className={inputCls} placeholder="e.g. Hanon No.1 at 60 BPM, 10x each hand" value={homework.exercises} onChange={(e) => setHomework({ ...homework, exercises: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>📱 Apps / tools</label>
                  <input className={inputCls} placeholder="e.g. Simply Piano, metronome app" value={homework.apps} onChange={(e) => setHomework({ ...homework, apps: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>🎯 Goal for next class</label>
                  <input className={inputCls} placeholder="e.g. Play C-G-Am-F progression smoothly" value={homework.goal} onChange={(e) => setHomework({ ...homework, goal: e.target.value })} />
                </div>
                <button
                  onClick={generateHomeworkWhatsApp}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors ${hwCopied ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {hwCopied ? <Check className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                  {hwCopied ? 'Copied! Paste in WhatsApp' : 'Generate WhatsApp Homework Message'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── NOTES ── */}
        {tab === 'Notes' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-white">Teacher Notes</h2>
              <span className="text-xs text-[#555555]">Auto-saves as you type</span>
            </div>
            <textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Write your notes about this student here..."
              className="w-full h-[400px] bg-[#111111] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors resize-none leading-relaxed"
            />
          </div>
        )}

        {/* ── STUDENT VIEW ── */}
        {tab === 'Student View' && (
          <div className="max-w-sm mx-auto">
            <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 100%)', border: '1px solid #2a2a4a' }}>
              <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(155,89,182,0.1))' }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white mx-auto mb-3 shadow-lg" style={{ background: `linear-gradient(135deg, ${getAgeGroupColor(student.ageGroup)}, #9B59B6)` }}>
                  {getInitials(student.name)}
                </div>
                <h2 className="text-2xl font-bold text-white">{student.name}</h2>
                <p className="text-[#C9A84C] text-sm mt-1">{student.ageGroup} · {student.level}</p>
              </div>
              <div className="p-5 space-y-4">
                <div className="bg-black/30 rounded-xl p-4 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#2a2a2a" strokeWidth="6" />
                      <circle cx="40" cy="40" r="34" fill="none" stroke="#C9A84C" strokeWidth="6" strokeDasharray={`${(student.currentModule / 8) * 213.6} 213.6`} className="progress-ring-circle" strokeLinecap="round" />
                      <text x="40" y="40" textAnchor="middle" dy="0.3em" fill="white" fontSize="16" fontWeight="bold">{student.currentModule}/8</text>
                    </svg>
                  </div>
                  <p className="text-[#C9A84C] font-semibold">{currentModule?.icon} {currentModule?.title}</p>
                  <p className="text-xs text-[#888888] mt-1">Module {student.currentModule} of 8</p>
                </div>
                {completedClasses[0]?.homeworkAssigned && (
                  <div className="bg-black/30 rounded-xl p-4">
                    <p className="text-xs text-[#9B59B6] font-semibold uppercase tracking-wider mb-2">This Week&apos;s Homework 📚</p>
                    <p className="text-sm text-white">{completedClasses[0].homeworkAssigned}</p>
                  </div>
                )}
                <div className="bg-black/30 rounded-xl p-4">
                  <p className="text-xs text-[#FF6B35] font-semibold uppercase tracking-wider mb-3">Practice Checklist ✅</p>
                  <div className="space-y-2">
                    {practiceItems.map((item, i) => (
                      <label key={i} className="flex items-start gap-2 cursor-pointer group">
                        <div className="w-4 h-4 rounded border border-[#3a3a5a] mt-0.5 flex-shrink-0 group-hover:border-[#C9A84C] transition-colors" />
                        <span className="text-xs text-[#888888] group-hover:text-white transition-colors">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {student.assignedSongs.length > 0 && (
                  <div className="bg-black/30 rounded-xl p-4">
                    <p className="text-xs text-[#27AE60] font-semibold uppercase tracking-wider mb-2">Your Songs 🎵</p>
                    {student.assignedSongs.map((song) => (
                      <div key={song} className="flex items-center gap-2 py-1">
                        <Music className="w-3 h-3 text-[#888888]" />
                        <span className="text-xs text-white">{song}</span>
                      </div>
                    ))}
                  </div>
                )}
                {student.keysEarned.length > 0 && (
                  <div className="bg-black/30 rounded-xl p-4">
                    <p className="text-xs text-[#C9A84C] font-semibold uppercase tracking-wider mb-3">Your Keys 🔑</p>
                    <div className="flex flex-wrap gap-2">
                      {RUVEL_KEYS.filter((k) => student.keysEarned.includes(k.id)).map((k) => (
                        <div key={k.id} className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
                          <span>{k.emoji}</span>
                          <span className="text-[10px] text-[#C9A84C] font-medium">{k.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="rounded-xl p-4 text-center" style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(155,89,182,0.1))', border: '1px solid rgba(255,107,53,0.2)' }}>
                  <p className="text-sm text-white italic">&ldquo;{quote}&rdquo;</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── MODALS ── */}

      {/* Edit Student Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit ${student.name}`} size="lg"
        footer={
          <>
            <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button onClick={handleEdit} className="px-5 py-2 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a]">Save Changes</button>
          </>
        }>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Name</label>
              <input className={inputCls} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Age</label>
              <input className={inputCls} type="number" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Age Group</label>
              <select className={selectCls} value={editForm.ageGroup} onChange={(e) => setEditForm({ ...editForm, ageGroup: e.target.value as AgeGroup })}>
                {AGE_GROUPS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Level</label>
              <select className={selectCls} value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value as Level })}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Current Module</label>
              <select className={selectCls} value={editForm.currentModule} onChange={(e) => setEditForm({ ...editForm, currentModule: e.target.value })}>
                {MODULES.map((m) => <option key={m.id} value={m.id}>Module {m.id} — {m.title}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Schedule</label>
              <input className={inputCls} placeholder="e.g. Fridays at 4:00 PM" value={editForm.schedule} onChange={(e) => setEditForm({ ...editForm, schedule: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Goals</label>
            <textarea className={`${inputCls} h-16 resize-none`} value={editForm.goals} onChange={(e) => setEditForm({ ...editForm, goals: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Parent name</label>
              <input className={inputCls} placeholder="Parent name" value={editForm.parentName} onChange={(e) => setEditForm({ ...editForm, parentName: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Phone</label>
              <input className={inputCls} placeholder="Phone" value={editForm.parentPhone} onChange={(e) => setEditForm({ ...editForm, parentPhone: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input className={inputCls} placeholder="Email" value={editForm.parentEmail} onChange={(e) => setEditForm({ ...editForm, parentEmail: e.target.value })} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Pricing Modal */}
      <Modal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} title={`💰 ${student.name}'s Rates`} size="sm"
        footer={
          <>
            <button onClick={() => setShowPricingModal(false)} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button onClick={handlePricingSave} className="px-5 py-2 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a]">Save Rates</button>
          </>
        }>
        <div className="space-y-3">
          <p className="text-xs text-[#888888]">Set personal rates for this student. Leave blank to use default rates.</p>
          <div>
            <label className={labelCls}>Single class rate (AUD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-sm">$</span>
              <input className={`${inputCls} pl-6`} type="number" placeholder="e.g. 50" value={pricingForm.priceSingle} onChange={(e) => setPricingForm({ ...pricingForm, priceSingle: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>4-class pack rate (AUD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-sm">$</span>
              <input className={`${inputCls} pl-6`} type="number" placeholder="e.g. 180" value={pricingForm.price4Pack} onChange={(e) => setPricingForm({ ...pricingForm, price4Pack: e.target.value })} />
            </div>
          </div>
          <div>
            <label className={labelCls}>8-class pack rate (AUD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] text-sm">$</span>
              <input className={`${inputCls} pl-6`} type="number" placeholder="e.g. 360" value={pricingForm.price8Pack} onChange={(e) => setPricingForm({ ...pricingForm, price8Pack: e.target.value })} />
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Class Modal */}
      <Modal isOpen={showClassEditModal} onClose={() => { setShowClassEditModal(false); setEditingClassId(null); }} title="Edit Class" size="lg"
        footer={
          <>
            <button onClick={() => { setShowClassEditModal(false); setEditingClassId(null); }} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button onClick={handleClassEditSave} className="px-5 py-2 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] flex items-center gap-2">
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </>
        }>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Date</label>
              <input type="date" className={inputCls} value={classEditForm.date} onChange={(e) => setClassEditForm({ ...classEditForm, date: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Time</label>
              <input type="time" className={inputCls} value={classEditForm.time} onChange={(e) => setClassEditForm({ ...classEditForm, time: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Duration (min)</label>
              <input type="number" className={inputCls} value={classEditForm.duration} onChange={(e) => setClassEditForm({ ...classEditForm, duration: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select className={selectCls} value={classEditForm.status} onChange={(e) => setClassEditForm({ ...classEditForm, status: e.target.value as ClassStatus })}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Module</label>
              <select className={selectCls} value={classEditForm.module} onChange={(e) => setClassEditForm({ ...classEditForm, module: e.target.value })}>
                {MODULES.map((m) => <option key={m.id} value={m.id}>{m.id} — {m.title}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>What we worked on</label>
            <textarea className={`${inputCls} h-16 resize-none`} value={classEditForm.whatWeWorkedOn} onChange={(e) => setClassEditForm({ ...classEditForm, whatWeWorkedOn: e.target.value })} placeholder="Topics covered this class..." />
          </div>
          <div>
            <label className={labelCls}>Achievement 🏆</label>
            <input className={inputCls} value={classEditForm.achievement} onChange={(e) => setClassEditForm({ ...classEditForm, achievement: e.target.value })} placeholder="Student's win or milestone..." />
          </div>
          <div>
            <label className={labelCls}>Homework assigned</label>
            <textarea className={`${inputCls} h-16 resize-none`} value={classEditForm.homeworkAssigned} onChange={(e) => setClassEditForm({ ...classEditForm, homeworkAssigned: e.target.value })} placeholder="Practice tasks for the week..." />
          </div>
          <div>
            <label className={labelCls}>Next class focus</label>
            <input className={inputCls} value={classEditForm.nextClassFocus} onChange={(e) => setClassEditForm({ ...classEditForm, nextClassFocus: e.target.value })} placeholder="What to prepare for next time..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Energy level</label>
              <select className={selectCls} value={classEditForm.energyLevel} onChange={(e) => setClassEditForm({ ...classEditForm, energyLevel: e.target.value })}>
                <option value="">—</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Session rating (1-5)</label>
              <select className={selectCls} value={classEditForm.sessionRating} onChange={(e) => setClassEditForm({ ...classEditForm, sessionRating: e.target.value })}>
                <option value="">—</option>
                {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} ⭐</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Teacher notes (private)</label>
            <textarea className={`${inputCls} h-16 resize-none`} value={classEditForm.teacherNotes} onChange={(e) => setClassEditForm({ ...classEditForm, teacherNotes: e.target.value })} placeholder="Private notes (not shown to student)..." />
          </div>
          <div>
            <label className={labelCls}>📎 Material multimedia (video / PDF / partitura / imagen)</label>
            <p className="text-[10px] text-[#666] mb-2">El estudiante lo ve en su portal, en la sección Clases y Tarea.</p>
            <ClassMaterialEditor
              materials={classEditForm.materials}
              onChange={(next) => setClassEditForm({ ...classEditForm, materials: next })}
              accent="#C9A84C"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Class Confirm */}
      <Modal isOpen={!!showClassDeleteConfirm} onClose={() => setShowClassDeleteConfirm(null)} title="Delete Class?" size="sm"
        footer={
          <>
            <button onClick={() => setShowClassDeleteConfirm(null)} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button onClick={() => { if (showClassDeleteConfirm) { deleteClass(showClassDeleteConfirm); setShowClassDeleteConfirm(null); } }} className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600">Delete</button>
          </>
        }>
        <p className="text-[#888888] text-sm">This class record will be permanently deleted.</p>
      </Modal>

      {/* Delete Student Confirm */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Remove Student?" size="sm"
        footer={
          <>
            <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button onClick={handleDelete} className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600">Remove</button>
          </>
        }>
        <p className="text-[#888888] text-sm">This will remove <strong className="text-white">{student.name}</strong> and all their classes, payments and data. This cannot be undone.</p>
      </Modal>

    </div>
  );
}
