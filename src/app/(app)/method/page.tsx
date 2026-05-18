'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { MODULES, SONGS } from '@/lib/constants';
import { MODULE_CLASS_PLANS } from '@/lib/modulePlans';
import { getStorage, setStorage } from '@/lib/storage';
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  UserPlus,
  BookOpen,
  Dumbbell,
  Music,
  CheckSquare,
  ExternalLink,
  MessageSquare,
  Lightbulb,
  Pencil,
  BookMarked,
  StickyNote,
  Clock,
  Target,
  GraduationCap,
} from 'lucide-react';
import Modal from '@/components/ui/Modal';

type AgeTab = 'kids' | 'youth' | 'adults';
type ModuleTab = 'guide' | 'exercises' | 'songs' | 'checklist';

export default function MethodPage() {
  const { students, updateStudent } = useApp();
  const [activeAge, setActiveAge] = useState<AgeTab>('kids');
  const [expandedModule, setExpandedModule] = useState<number | null>(1);
  const [activeModuleTabs, setActiveModuleTabs] = useState<Record<number, ModuleTab>>({});
  const [assignModal, setAssignModal] = useState<{ moduleId: number } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState('');

  // Expanded steps per module
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

  // Teacher sticky notes: keyed by `${moduleId}_${stepIndex}`
  const [stickyNotes, setStickyNotes] = useState<Record<string, string>>({});

  // Load sticky notes from localStorage
  useEffect(() => {
    const saved = getStorage<Record<string, string>>('method_sticky_notes', {});
    setStickyNotes(saved);
  }, []);

  const saveStickyNote = useCallback(
    (key: string, value: string) => {
      const updated = { ...stickyNotes, [key]: value };
      setStickyNotes(updated);
      setStorage('method_sticky_notes', updated);
    },
    [stickyNotes]
  );

  const toggleStep = (moduleId: number, stepIndex: number) => {
    const key = `${moduleId}_${stepIndex}`;
    setExpandedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isStepOpen = (moduleId: number, stepIndex: number) =>
    !!expandedSteps[`${moduleId}_${stepIndex}`];

  const handleAssign = () => {
    if (!selectedStudent || !assignModal) return;
    updateStudent(selectedStudent, { currentModule: assignModal.moduleId });
    setAssignModal(null);
    setSelectedStudent('');
  };

  const getModuleTab = (modId: number): ModuleTab => activeModuleTabs[modId] || 'guide';
  const setModuleTab = (modId: number, tab: ModuleTab) => {
    setActiveModuleTabs((prev) => ({ ...prev, [modId]: tab }));
  };

  const openYouTube = (search: string) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(search)}`;
    window.open(url, '_blank', 'noopener');
  };

  const ageTabs: { id: AgeTab; label: string }[] = [
    { id: 'kids', label: 'Kids (6-12)' },
    { id: 'youth', label: 'Youth (13-17)' },
    { id: 'adults', label: 'Adults (18+)' },
  ];

  const moduleTabs: { id: ModuleTab; label: string; icon: React.ReactNode }[] = [
    { id: 'guide', label: 'Class Guide', icon: <BookOpen className="w-3 h-3" /> },
    { id: 'exercises', label: 'Exercises', icon: <Dumbbell className="w-3 h-3" /> },
    { id: 'songs', label: 'Songs', icon: <Music className="w-3 h-3" /> },
    { id: 'checklist', label: 'Checklist', icon: <CheckSquare className="w-3 h-3" /> },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Método RÜVEL</h1>
          <p className="text-[#888888] text-sm mt-0.5">16 módulos · Guías de clase de 60 min · Tu copiloto de enseñanza en tiempo real</p>
        </div>
        <Link
          href="/theory"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] text-sm font-medium hover:bg-[#C9A84C]/20 transition-colors flex-shrink-0"
        >
          <GraduationCap className="w-4 h-4" />
          <span className="hidden sm:inline">Manual de Teoría</span>
        </Link>
      </div>

      {/* Age group tabs */}
      <div className="flex gap-2 mb-6">
        {ageTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveAge(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeAge === t.id
                ? 'bg-[#C9A84C] text-black'
                : 'bg-[#111111] border border-[#2a2a2a] text-[#888888] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Module cards */}
      <div className="space-y-3">
        {MODULES.map((mod, modIdx) => {
          const isOpen = expandedModule === mod.id;
          const ageContent = mod[activeAge];
          const currentTab = getModuleTab(mod.id);
          const moduleSongs = SONGS.filter((s) => s.module === mod.id);
          const classPlan = MODULE_CLASS_PLANS.find((p) => p.moduleId === mod.id);
          const showPhaseDivider = modIdx === 0 || MODULES[modIdx - 1].phase !== mod.phase;

          return (
            <div key={mod.id}>
              {showPhaseDivider && (
                <div className="flex items-center gap-3 pt-3 pb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C9A84C]">{mod.phase}</span>
                  <div className="flex-1 h-px bg-[#2a2a2a]" />
                </div>
              )}
              <div
                className={`bg-[#111111] border rounded-xl overflow-hidden transition-all ${
                  isOpen ? 'border-[#C9A84C]/40' : 'border-[#2a2a2a]'
                }`}
              >
              {/* Module header */}
              <button
                onClick={() => setExpandedModule(isOpen ? null : mod.id)}
                className="w-full flex items-center gap-4 p-5 text-left"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    isOpen ? 'bg-[#C9A84C]/20' : 'bg-[#1a1a1a]'
                  }`}
                >
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#888888] font-medium">MODULE {mod.id}</span>
                    <span className="text-xs text-[#555555]">·</span>
                    <span className="text-xs text-[#555555]">{mod.estimatedWeeks}</span>
                  </div>
                  <h3 className={`font-semibold mt-0.5 ${isOpen ? 'text-[#C9A84C]' : 'text-white'}`}>
                    {mod.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAssignModal({ moduleId: mod.id });
                    }}
                    className="p-1.5 rounded-lg bg-[#1a1a1a] text-[#888888] hover:text-white hover:bg-[#2a2a2a] transition-colors"
                    title="Assign to student"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                  </button>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#555555]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#555555]" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {isOpen && (
                <div className="border-t border-[#2a2a2a]">
                  {/* Description + age approach */}
                  <div className="px-5 pt-4 pb-3">
                    <p className="text-sm text-[#888888] mb-3">{mod.description}</p>
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4">
                      <h4 className="text-xs text-[#C9A84C] uppercase tracking-wider font-medium mb-2">
                        {ageTabs.find((t) => t.id === activeAge)?.label} Approach
                      </h4>
                      <p className="text-sm font-medium text-white mb-2">{ageContent.approach}</p>
                      <p className="text-sm text-[#888888]">{ageContent.notes}</p>
                    </div>
                  </div>

                  {/* 4 sub-tabs */}
                  <div className="px-5 pb-2">
                    <div className="flex gap-1 bg-[#0a0a0a] rounded-lg p-1 border border-[#1a1a1a]">
                      {moduleTabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setModuleTab(mod.id, tab.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            currentTab === tab.id
                              ? 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30'
                              : 'text-[#555555] hover:text-white'
                          }`}
                        >
                          {tab.icon}
                          <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab content */}
                  <div className="px-5 pb-5 pt-3">
                    {/* ── CLASS GUIDE TAB ──────────────────────────────── */}
                    {currentTab === 'guide' && classPlan && (
                      <div className="space-y-3">
                        {/* Plan header */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex items-center gap-2 text-xs text-[#888888]">
                            <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
                            <span>{classPlan.totalMinutes}-min class plan</span>
                            <span className="text-[#444]">·</span>
                            <span>{classPlan.steps.length} steps</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 p-3 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-lg mb-4">
                          <Target className="w-3.5 h-3.5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-[#C9A84C]">{classPlan.intro}</p>
                        </div>

                        {/* Steps */}
                        {classPlan.steps.map((step, idx) => {
                          const stepOpen = isStepOpen(mod.id, idx);
                          const noteKey = `${mod.id}_${idx}`;
                          const note = stickyNotes[noteKey] || '';

                          return (
                            <div
                              key={idx}
                              className={`border rounded-xl overflow-hidden transition-all ${
                                stepOpen
                                  ? 'border-[#C9A84C]/30 bg-[#0f0f0f]'
                                  : 'border-[#2a2a2a] bg-[#111111]'
                              }`}
                            >
                              {/* Step header */}
                              <button
                                onClick={() => toggleStep(mod.id, idx)}
                                className="w-full flex items-center gap-3 p-4 text-left"
                              >
                                <span className="w-7 h-7 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-bold flex items-center justify-center flex-shrink-0">
                                  {idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-white">{step.title}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888]">
                                    {step.duration} min
                                  </span>
                                  {stepOpen ? (
                                    <ChevronUp className="w-3.5 h-3.5 text-[#555555]" />
                                  ) : (
                                    <ChevronRight className="w-3.5 h-3.5 text-[#555555]" />
                                  )}
                                </div>
                              </button>

                              {/* Step expanded content */}
                              {stepOpen && (
                                <div className="border-t border-[#2a2a2a] p-4 space-y-4">
                                  {/* What to Say */}
                                  <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                                      <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400">
                                        What to Say
                                      </span>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                      <p className="text-sm text-white leading-relaxed italic">
                                        {step.whatToSay}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Key Points */}
                                  <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <BookMarked className="w-3.5 h-3.5 text-emerald-400" />
                                      <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400">
                                        Key Points
                                      </span>
                                    </div>
                                    <ul className="space-y-1.5">
                                      {step.keyPoints.map((point, pi) => (
                                        <li key={pi} className="flex items-start gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5" />
                                          <span className="text-sm text-white">{point}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Formula Box (gold) */}
                                  {step.formula && (
                                    <div className="bg-[#C9A84C]/15 border border-[#C9A84C]/40 rounded-xl p-4">
                                      <div className="flex items-center gap-1.5 mb-2">
                                        <span className="text-[#C9A84C] text-sm">📐</span>
                                        <span className="text-[10px] uppercase tracking-wider font-bold text-[#C9A84C]">
                                          Formula / Rule to Remember
                                        </span>
                                      </div>
                                      <p className="text-sm font-semibold text-[#C9A84C] whitespace-pre-line leading-relaxed">
                                        {step.formula}
                                      </p>
                                    </div>
                                  )}

                                  {/* Class Exercise */}
                                  <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <Dumbbell className="w-3.5 h-3.5 text-purple-400" />
                                      <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-400">
                                        Class Exercise
                                      </span>
                                    </div>
                                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                                      <p className="text-sm text-white leading-relaxed">{step.classExercise}</p>
                                    </div>
                                  </div>

                                  {/* Homework */}
                                  {step.homework && (
                                    <div>
                                      <div className="flex items-center gap-1.5 mb-2">
                                        <Pencil className="w-3.5 h-3.5 text-orange-400" />
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-orange-400">
                                          Homework to Assign
                                        </span>
                                      </div>
                                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                                        <p className="text-sm text-white leading-relaxed">{step.homework}</p>
                                      </div>
                                    </div>
                                  )}

                                  {/* Teacher Tip */}
                                  <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                                      <span className="text-[10px] uppercase tracking-wider font-semibold text-yellow-400">
                                        Teacher Tip
                                      </span>
                                    </div>
                                    <p className="text-sm text-[#aaa] leading-relaxed">{step.teacherTip}</p>
                                  </div>

                                  {/* Recursos externos */}
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <button
                                      onClick={() => openYouTube(step.youtubeSearch)}
                                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-[#888888] hover:text-white hover:border-[#444] transition-colors"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      <span>YouTube</span>
                                    </button>
                                    {step.musescoreSearch && (
                                      <a
                                        href={`https://musescore.com/sheetmusic?text=${encodeURIComponent(step.musescoreSearch)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-[#888888] hover:text-white hover:border-[#444] transition-colors"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                        <span>MuseScore</span>
                                      </a>
                                    )}
                                  </div>

                                  {/* Teacher Sticky Note */}
                                  <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                      <StickyNote className="w-3.5 h-3.5 text-[#C9A84C]" />
                                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#888888]">
                                        My Notes (saved automatically)
                                      </span>
                                    </div>
                                    <textarea
                                      value={note}
                                      onChange={(e) => saveStickyNote(noteKey, e.target.value)}
                                      placeholder="Add your personal notes, adjustments, or observations for this step..."
                                      rows={3}
                                      className="w-full bg-[#1a1500] border border-[#C9A84C]/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#C9A84C]/50 resize-none"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Key Skills at bottom */}
                        <div className="mt-4 pt-3 border-t border-[#2a2a2a]">
                          <h4 className="text-xs text-[#888888] uppercase tracking-wider font-medium mb-2">Key Skills This Module</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {mod.keySkills.map((skill) => (
                              <span
                                key={skill}
                                className="text-xs px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fallback guide if no class plan */}
                    {currentTab === 'guide' && !classPlan && (
                      <div className="space-y-2">
                        {mod.lessonGuide && mod.lessonGuide.length > 0 ? (
                          mod.lessonGuide.map((step, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                              <span className="w-6 h-6 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <p className="text-sm text-white leading-relaxed">{step}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-[#555555] text-sm">Lesson guide coming soon for this module.</p>
                        )}
                      </div>
                    )}

                    {/* ── EXERCISES TAB ────────────────────────────────── */}
                    {currentTab === 'exercises' && (
                      <div className="space-y-2">
                        <h4 className="text-xs text-[#888888] uppercase tracking-wider font-medium mb-3">
                          Practice Exercises
                        </h4>
                        {mod.exercises.map((ex, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-sm text-white">{ex}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── SONGS TAB ────────────────────────────────────── */}
                    {currentTab === 'songs' && (
                      <div>
                        <h4 className="text-xs text-[#888888] uppercase tracking-wider font-medium mb-3">
                          Songs for This Module ({moduleSongs.length})
                        </h4>
                        {moduleSongs.length === 0 ? (
                          <p className="text-[#555555] text-sm">No songs linked to this module yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {moduleSongs.map((song) => (
                              <div
                                key={song.id}
                                className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-sm">🎵</span>
                                  <div className="min-w-0">
                                    <p className="text-sm text-white font-medium truncate">{song.title}</p>
                                    <p className="text-xs text-[#888888]">{song.artist}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${
                                      song.difficulty === 'Beginner'
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        : song.difficulty === 'Intermediate'
                                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                    }`}
                                  >
                                    {song.difficulty}
                                  </span>
                                  <button
                                    onClick={() =>
                                      openYouTube(`${song.title} ${song.artist} piano tutorial`)
                                    }
                                    className="p-1.5 rounded-lg bg-[#1a1a1a] text-[#888888] hover:text-white hover:bg-[#2a2a2a] transition-colors"
                                    title="Search tutorial on YouTube"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── CHECKLIST TAB ────────────────────────────────── */}
                    {currentTab === 'checklist' && (
                      <div>
                        <h4 className="text-xs text-[#888888] uppercase tracking-wider font-medium mb-3">
                          Completion Criteria — Student must be able to:
                        </h4>
                        {mod.progressChecklist && mod.progressChecklist.length > 0 ? (
                          <div className="space-y-2">
                            {mod.progressChecklist.map((item, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                                <div className="w-5 h-5 rounded border-2 border-[#2a2a2a] flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-white">{item}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[#555555] text-sm">Checklist coming soon for this module.</p>
                        )}
                        <p className="text-xs text-[#555555] mt-4">
                          ✓ All boxes ticked = student is ready for the next module
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign to student modal */}
      <Modal
        isOpen={!!assignModal}
        onClose={() => {
          setAssignModal(null);
          setSelectedStudent('');
        }}
        title={`Assign Module ${assignModal?.moduleId || ''}`}
        size="sm"
        footer={
          <>
            <button
              onClick={() => {
                setAssignModal(null);
                setSelectedStudent('');
              }}
              className="px-4 py-2 text-sm text-[#888888] hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedStudent}
              className="px-5 py-2 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] disabled:opacity-50"
            >
              Assign
            </button>
          </>
        }
      >
        <div>
          <p className="text-sm text-[#888888] mb-3">
            Move a student to{' '}
            <strong className="text-white">
              Module {assignModal?.moduleId} —{' '}
              {MODULES.find((m) => m.id === assignModal?.moduleId)?.title}
            </strong>
          </p>
          <select
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select student...</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (currently Module {s.currentModule})
              </option>
            ))}
          </select>
        </div>
      </Modal>
    </div>
  );
}
