'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Calendar, Plus, Share2, Copy, Check, Trash2 } from 'lucide-react';
import { MODULES } from '@/lib/constants';
import { formatDate, formatTime12h, getStatusBadge, getInitials, getAgeGroupColor, todayISO } from '@/lib/utils';
import { ClassEntry, ClassStatus } from '@/lib/types';
import Modal from '@/components/ui/Modal';

const DURATIONS = [30, 45, 60, 90];
const STATUSES: ClassStatus[] = ['Completed', 'Scheduled', 'Cancelled', 'Rescheduled'];

const TOPIC_OPTIONS = [
  'Posture & technique', 'Finger numbers', 'Keyboard geography',
  'C major chord', 'G major chord', 'Am chord', 'F major chord',
  'All 4 magic chords', 'Chord transitions', 'Chord formula',
  'Melody by ear', 'Sheet music reading', 'Solfège (Do Re Mi)',
  'Rhythm & pulse', 'Metronome practice', 'Left hand patterns',
  'Hands together', 'Note values', 'Sight reading',
  'Song performance', 'Improvisation', 'Music theory', 'Scales',
];

const ENERGY_LEVELS = ['Low', 'Medium', 'High'] as const;

interface ClassForm {
  studentId: string;
  date: string;
  time: string;
  duration: number;
  status: ClassStatus;
  module: number;
  // What we did
  topics: string[];
  songsWorkedOn: string[];
  whatWeWorkedOn: string;
  // Performance
  energyLevel: 'Low' | 'Medium' | 'High';
  sessionRating: 1 | 2 | 3 | 4 | 5;
  achievement: string;
  needsWork: string;
  // Next steps
  homeworkAssigned: string;
  teacherNotes: string;
  nextClassFocus: string;
}

const emptyForm = (): ClassForm => ({
  studentId: '',
  date: todayISO(),
  time: '15:00',
  duration: 60,
  status: 'Completed',
  module: 1,
  topics: [],
  songsWorkedOn: [],
  whatWeWorkedOn: '',
  energyLevel: 'Medium',
  sessionRating: 4,
  achievement: '',
  needsWork: '',
  homeworkAssigned: '',
  teacherNotes: '',
  nextClassFocus: '',
});

export default function ClassesPage() {
  const { students, classes, addClass, deleteClass } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<ClassForm>(emptyForm());
  const [filterStudent, setFilterStudent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [reportCard, setReportCard] = useState<ClassEntry | null>(null);
  const [copied, setCopied] = useState(false);
  const [songInput, setSongInput] = useState('');
  const [formSection, setFormSection] = useState<1 | 2 | 3 | 4>(1);

  const filtered = classes
    .filter((c) => {
      const matchStudent = !filterStudent || c.studentId === filterStudent;
      const matchStatus = !filterStatus || c.status === filterStatus;
      return matchStudent && matchStatus;
    })
    .sort((a, b) => {
      if (a.date !== b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
      return (b.time || '').localeCompare(a.time || '');
    });

  const toggleTopic = (topic: string) => {
    setForm((f) => ({
      ...f,
      topics: f.topics.includes(topic) ? f.topics.filter((t) => t !== topic) : [...f.topics, topic],
    }));
  };

  const addSong = () => {
    if (!songInput.trim()) return;
    setForm((f) => ({ ...f, songsWorkedOn: [...f.songsWorkedOn, songInput.trim()] }));
    setSongInput('');
  };

  const handleSubmit = () => {
    if (!form.studentId) return;
    const data = {
      studentId: form.studentId,
      date: form.date,
      time: form.time,
      duration: form.duration,
      status: form.status,
      module: form.module,
      topics: form.topics,
      songsWorkedOn: form.songsWorkedOn,
      whatWeWorkedOn: form.topics.join(', ') + (form.whatWeWorkedOn ? `. ${form.whatWeWorkedOn}` : ''),
      energyLevel: form.energyLevel,
      sessionRating: form.sessionRating,
      achievement: form.achievement,
      needsWork: form.needsWork,
      homeworkAssigned: form.homeworkAssigned,
      teacherNotes: form.teacherNotes,
      nextClassFocus: form.nextClassFocus,
    };
    addClass(data);

    if (form.status === 'Completed') {
      setReportCard({ ...data, id: '', createdAt: new Date().toISOString() });
    }

    setForm(emptyForm());
    setFormSection(1);
    setShowModal(false);
  };

  const buildReportText = (c: ClassEntry) => {
    const student = students.find((s) => s.id === c.studentId);
    const mod = MODULES.find((m) => m.id === c.module);
    const stars = '⭐'.repeat(c.sessionRating || 4);
    return `🎹 *RÜVEL Piano - Class Report*\n\n👤 Student: ${student?.name || 'Student'}\n📅 Date: ${formatDate(c.date)}\n⏱ Duration: ${c.duration} min\n📚 Module: ${mod?.title || `Module ${c.module}`}\n\n${stars} *Session Rating: ${c.sessionRating}/5*\n⚡ Energy: ${c.energyLevel || 'Medium'}\n\n${c.topics?.length ? `*Topics Covered:*\n${c.topics.map((t) => `• ${t}`).join('\n')}\n\n` : ''}${c.songsWorkedOn?.length ? `*Songs Practised:*\n${c.songsWorkedOn.map((s) => `🎵 ${s}`).join('\n')}\n\n` : ''}${c.achievement ? `🏆 *Achievement:* ${c.achievement}\n\n` : ''}${c.needsWork ? `💪 *Keep Working On:* ${c.needsWork}\n\n` : ''}📝 *Homework:*\n${c.homeworkAssigned || 'Practice from today\'s class.'}\n\n🎯 *Next Class Focus:*\n${c.nextClassFocus || 'Continue progress!'}\n\nPowered by RÜVEL Piano Method 🎹`;
  };

  const copyReport = () => {
    if (!reportCard) return;
    navigator.clipboard.writeText(buildReportText(reportCard));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    if (!reportCard) return;
    const text = encodeURIComponent(buildReportText(reportCard));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const inputCls = 'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors';
  const selectCls = 'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors';
  const labelCls = 'block text-xs text-[#888888] mb-1.5 font-medium';

  const completedCount = classes.filter((c) => c.status === 'Completed').length;
  const scheduledCount = classes.filter((c) => c.status === 'Scheduled').length;

  const sections = ['Class Info', 'What We Did', 'Performance', 'Next Steps'];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Classes</h1>
          <p className="text-[#888888] text-sm mt-0.5">{completedCount} completed · {scheduledCount} upcoming</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setFormSection(1); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] transition-colors"
        >
          <Plus className="w-4 h-4" /> Log Class
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={filterStudent}
          onChange={(e) => setFilterStudent(e.target.value)}
          className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] flex-1"
        >
          <option value="">All Students</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] flex-1"
        >
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Class list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No classes yet</h3>
          <p className="text-[#555555] text-sm mb-6">Log your first class to start tracking progress</p>
          <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a]">
            + Log Class
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const student = students.find((s) => s.id === c.studentId);
            const mod = MODULES.find((m) => m.id === c.module);
            return (
              <div key={c.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#3a3a3a] transition-all">
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ background: getAgeGroupColor(student?.ageGroup || '') }}
                  >
                    {getInitials(student?.name || '?')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white">{student?.name || 'Unknown'}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(c.status)}`}>{c.status}</span>
                      {c.sessionRating && <span className="text-xs text-[#888888]">{'⭐'.repeat(c.sessionRating)}</span>}
                    </div>
                    <p className="text-xs text-[#888888] mt-0.5">
                      {formatDate(c.date)} {c.time ? `at ${formatTime12h(c.time)}` : ''} · {c.duration} min · {mod?.title || `Module ${c.module}`}
                    </p>
                    {c.topics && c.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {c.topics.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-[#888888]">{t}</span>
                        ))}
                        {c.topics.length > 3 && <span className="text-[10px] text-[#555555]">+{c.topics.length - 3} more</span>}
                      </div>
                    )}
                    {c.achievement && <p className="text-xs text-emerald-400 mt-1">🏆 {c.achievement}</p>}
                    {c.homeworkAssigned && <p className="text-xs text-[#C9A84C] mt-1 line-clamp-1">📝 {c.homeworkAssigned}</p>}
                  </div>
                  <div className="flex gap-1.5 ml-2 flex-shrink-0">
                    {c.status === 'Completed' && (
                      <button
                        onClick={() => setReportCard(c)}
                        className="p-1.5 text-[#555555] hover:text-[#C9A84C] hover:bg-[#C9A84C]/10 rounded-lg transition-colors"
                        title="View report card"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="p-1.5 text-[#555555] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete class"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── LOG CLASS MODAL ── */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setForm(emptyForm()); setFormSection(1); }}
        title="Log a Class"
        size="lg"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-1">
              {sections.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setFormSection((i + 1) as 1 | 2 | 3 | 4)}
                  className={`w-2 h-2 rounded-full transition-colors ${formSection === i + 1 ? 'bg-[#C9A84C]' : 'bg-[#2a2a2a]'}`}
                  title={s}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {formSection > 1 && (
                <button onClick={() => setFormSection((formSection - 1) as 1 | 2 | 3 | 4)} className="px-4 py-2 text-sm text-[#888888] hover:text-white transition-colors">
                  ← Back
                </button>
              )}
              {formSection < 4 ? (
                <button
                  onClick={() => setFormSection((formSection + 1) as 1 | 2 | 3 | 4)}
                  disabled={formSection === 1 && !form.studentId}
                  className="px-5 py-2 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!form.studentId}
                  className="px-5 py-2 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Class
                </button>
              )}
            </div>
          </div>
        }
      >
        {/* Section indicator */}
        <div className="flex gap-2 mb-5">
          {sections.map((s, i) => (
            <button
              key={i}
              onClick={() => setFormSection((i + 1) as 1 | 2 | 3 | 4)}
              className={`flex-1 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                formSection === i + 1 ? 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30' : 'bg-[#1a1a1a] text-[#555555]'
              }`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>

        {/* SECTION 1: Class Info */}
        {formSection === 1 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Student *</label>
              <select
                className={selectCls}
                value={form.studentId}
                onChange={(e) => {
                  const student = students.find((s) => s.id === e.target.value);
                  setForm({ ...form, studentId: e.target.value, module: student?.currentModule || 1 });
                }}
              >
                <option value="">Select student...</option>
                {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Time</label>
                <input type="time" className={inputCls} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Duration</label>
                <select className={selectCls} value={form.duration} onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}>
                  {DURATIONS.map((d) => <option key={d} value={d}>{d} min</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select className={selectCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ClassStatus })}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Module Covered</label>
              <select className={selectCls} value={form.module} onChange={(e) => setForm({ ...form, module: parseInt(e.target.value) })}>
                {MODULES.map((m) => <option key={m.id} value={m.id}>Module {m.id} — {m.title}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* SECTION 2: What We Did */}
        {formSection === 2 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Topics Covered</label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {TOPIC_OPTIONS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      form.topics.includes(topic)
                        ? 'bg-[#C9A84C]/20 border-[#C9A84C]/50 text-[#C9A84C]'
                        : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#888888] hover:text-white'
                    }`}
                  >
                    {form.topics.includes(topic) ? '✓ ' : ''}{topic}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>Songs Practised</label>
              <div className="flex gap-2 mb-2">
                <input
                  className={`${inputCls} flex-1`}
                  placeholder="Song name..."
                  value={songInput}
                  onChange={(e) => setSongInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSong()}
                />
                <button onClick={addSong} className="px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[#888888] hover:text-white text-sm">+ Add</button>
              </div>
              {form.songsWorkedOn.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.songsWorkedOn.map((s) => (
                    <span key={s} className="flex items-center gap-1 text-xs px-2 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white">
                      🎵 {s}
                      <button onClick={() => setForm((f) => ({ ...f, songsWorkedOn: f.songsWorkedOn.filter((x) => x !== s) }))} className="text-[#555555] hover:text-red-400 ml-1">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={labelCls}>Additional Notes (optional)</label>
              <textarea
                className={`${inputCls} h-16 resize-none`}
                value={form.whatWeWorkedOn}
                onChange={(e) => setForm({ ...form, whatWeWorkedOn: e.target.value })}
                placeholder="Any other details about the class content..."
              />
            </div>
          </div>
        )}

        {/* SECTION 3: Student Performance */}
        {formSection === 3 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Session Rating</label>
              <div className="flex gap-2">
                {([1, 2, 3, 4, 5] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setForm({ ...form, sessionRating: r })}
                    className={`flex-1 py-2 rounded-lg text-lg transition-all ${form.sessionRating >= r ? 'opacity-100' : 'opacity-30'}`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#555555] mt-1 text-center">{form.sessionRating}/5</p>
            </div>

            <div>
              <label className={labelCls}>Energy Level</label>
              <div className="grid grid-cols-3 gap-2">
                {ENERGY_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setForm({ ...form, energyLevel: level })}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                      form.energyLevel === level
                        ? level === 'High' ? 'bg-green-500/20 border-green-500/40 text-green-400'
                          : level === 'Medium' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400'
                          : 'bg-red-500/20 border-red-500/40 text-red-400'
                        : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#888888]'
                    }`}
                  >
                    {level === 'High' ? '⚡' : level === 'Medium' ? '😊' : '😴'} {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelCls}>🏆 Achievement / Highlight</label>
              <textarea
                className={`${inputCls} h-16 resize-none`}
                value={form.achievement}
                onChange={(e) => setForm({ ...form, achievement: e.target.value })}
                placeholder="What did they do really well today? e.g. Played C-G-Am-F without stopping!"
              />
            </div>

            <div>
              <label className={labelCls}>💪 Needs More Work</label>
              <textarea
                className={`${inputCls} h-14 resize-none`}
                value={form.needsWork}
                onChange={(e) => setForm({ ...form, needsWork: e.target.value })}
                placeholder="What should they focus on practising? e.g. F chord hand shape"
              />
            </div>
          </div>
        )}

        {/* SECTION 4: Next Steps */}
        {formSection === 4 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls}>📝 Homework Assigned</label>
              <textarea
                className={`${inputCls} h-20 resize-none`}
                value={form.homeworkAssigned}
                onChange={(e) => setForm({ ...form, homeworkAssigned: e.target.value })}
                placeholder="Practice tasks for the student to do at home..."
              />
            </div>

            <div>
              <label className={labelCls}>🎯 Next Class Focus</label>
              <input
                className={inputCls}
                value={form.nextClassFocus}
                onChange={(e) => setForm({ ...form, nextClassFocus: e.target.value })}
                placeholder="What to cover in the next class..."
              />
            </div>

            <div>
              <label className={labelCls}>🔒 Teacher Notes (private)</label>
              <textarea
                className={`${inputCls} h-16 resize-none`}
                value={form.teacherNotes}
                onChange={(e) => setForm({ ...form, teacherNotes: e.target.value })}
                placeholder="Private notes — not shown to student..."
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ── REPORT CARD MODAL ── */}
      <Modal
        isOpen={!!reportCard}
        onClose={() => { setReportCard(null); setCopied(false); }}
        title="📋 Class Report Card"
        size="md"
        footer={
          <div className="flex gap-2 w-full">
            <button
              onClick={copyReport}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                copied ? 'bg-emerald-500 text-white' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:bg-[#2a2a2a]'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              💬 Send via WhatsApp
            </button>
          </div>
        }
      >
        {reportCard && (
          <div className="space-y-3">
            <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl p-4 text-sm font-mono text-[#888888] whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
              {buildReportText(reportCard)}
            </div>
            <p className="text-xs text-[#555555] text-center">Copy and paste into WhatsApp, or tap &quot;Send via WhatsApp&quot;</p>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Remove Class?"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button onClick={() => { if (deleteId) { deleteClass(deleteId); setDeleteId(null); } }} className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600">Remove</button>
          </>
        }
      >
        <p className="text-[#888888] text-sm">This class record will be permanently removed.</p>
      </Modal>
    </div>
  );
}
