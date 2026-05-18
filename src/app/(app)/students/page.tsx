'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import { Search, Plus, Users } from 'lucide-react';
import { getInitials, getAgeGroupColor, getLevelBadge, getAgeGroupBg, getActivityStatus } from '@/lib/utils';
import { AgeGroup, Level, Student } from '@/lib/types';
import Modal from '@/components/ui/Modal';

const AGE_GROUPS: AgeGroup[] = ['Kids (6-12)', 'Youth (13-17)', 'Adults (18+)'];
const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced'];

function ActivityDot({ studentId, classes }: { studentId: string; classes: { studentId: string; date: string; status: string }[] }) {
  const lastCompleted = classes
    .filter((c) => c.studentId === studentId && c.status === 'Completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  const status = getActivityStatus(lastCompleted?.date || null);

  const colors = {
    active: 'bg-emerald-400',
    warning: 'bg-yellow-400',
    inactive: 'bg-red-400',
  };
  const titles = {
    active: 'Active (class within 2 weeks)',
    warning: '2+ weeks without class',
    inactive: '1+ month without class',
  };

  return (
    <span
      className={`w-2 h-2 rounded-full flex-shrink-0 ${colors[status]}`}
      title={titles[status]}
    />
  );
}

interface StudentFormData {
  name: string;
  age: string;
  ageGroup: AgeGroup;
  level: Level;
  goals: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  notes: string;
}

const emptyForm: StudentFormData = {
  name: '',
  age: '',
  ageGroup: 'Kids (6-12)',
  level: 'Beginner',
  goals: '',
  parentName: '',
  parentPhone: '',
  parentEmail: '',
  notes: '',
};

export default function StudentsPage() {
  const { students, classes, addStudent } = useApp();
  const [search, setSearch] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterAge, setFilterAge] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<StudentFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = students.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    const matchLevel = !filterLevel || s.level === filterLevel;
    const matchAge = !filterAge || s.ageGroup === filterAge;
    return matchSearch && matchLevel && matchAge;
  });

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    setSaving(true);
    addStudent({
      name: form.name.trim(),
      age: parseInt(form.age) || 0,
      ageGroup: form.ageGroup,
      level: form.level,
      goals: form.goals,
      parentName: form.parentName,
      parentPhone: form.parentPhone,
      parentEmail: form.parentEmail,
      notes: form.notes,
      currentModule: 1,
      assignedSongs: [],
    });
    setForm(emptyForm);
    setShowModal(false);
    setSaving(false);
  };

  const inputCls = 'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors';
  const selectCls = 'w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors';
  const labelCls = 'block text-xs text-[#888888] mb-1.5 font-medium';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Students</h1>
          <p className="text-[#888888] text-sm mt-0.5">{students.length} student{students.length !== 1 ? 's' : ''} enrolled</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] transition-colors"
        >
          <Plus className="w-4 h-4" /> New Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
          >
            <option value="">All Levels</option>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
          <select
            value={filterAge}
            onChange={(e) => setFilterAge(e.target.value)}
            className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C] transition-colors"
          >
            <option value="">All Ages</option>
            {AGE_GROUPS.map((a) => <option key={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Students grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            {search || filterLevel || filterAge ? 'No students match your filters' : 'No students yet'}
          </h3>
          <p className="text-[#555555] text-sm mb-6">
            {search || filterLevel || filterAge ? 'Try adjusting your search or filters' : 'Add your first student to get started'}
          </p>
          {!search && !filterLevel && !filterAge && (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] transition-colors"
            >
              + Add Student
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student) => (
            <StudentCard key={student.id} student={student} classes={classes} />
          ))}
        </div>
      )}

      {/* Add student modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setForm(emptyForm); }}
        title="Add New Student"
        size="lg"
        footer={
          <>
            <button onClick={() => { setShowModal(false); setForm(emptyForm); }} className="px-4 py-2 text-sm text-[#888888] hover:text-white transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!form.name.trim() || saving}
              className="px-5 py-2 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Adding...' : 'Add Student'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Full Name *</label>
              <input className={inputCls} placeholder="Student name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Age</label>
              <input className={inputCls} type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Age Group</label>
              <select className={selectCls} value={form.ageGroup} onChange={(e) => setForm({ ...form, ageGroup: e.target.value as AgeGroup })}>
                {AGE_GROUPS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Level</label>
              <select className={selectCls} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Level })}>
                {LEVELS.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Goals</label>
            <textarea className={`${inputCls} h-16 resize-none`} placeholder="What does the student want to achieve?" value={form.goals} onChange={(e) => setForm({ ...form, goals: e.target.value })} />
          </div>

          <div className="border-t border-[#2a2a2a] pt-3">
            <p className="text-xs text-[#888888] mb-3 font-medium uppercase tracking-wider">Parent / Guardian (optional)</p>
            <div className="grid grid-cols-1 gap-3">
              <input className={inputCls} placeholder="Parent name" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputCls} placeholder="Phone" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} />
                <input className={inputCls} placeholder="Email" value={form.parentEmail} onChange={(e) => setForm({ ...form, parentEmail: e.target.value })} />
              </div>
            </div>
          </div>

          <div>
            <label className={labelCls}>Initial Notes</label>
            <textarea className={`${inputCls} h-20 resize-none`} placeholder="Any notes about this student..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StudentCard({ student, classes }: { student: Student; classes: { studentId: string; date: string; status: string }[] }) {
  const completedClasses = classes.filter((c) => c.studentId === student.id && c.status === 'Completed').length;

  return (
    <Link href={`/students/${student.id}`}>
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#C9A84C]/40 transition-all duration-200 hover:bg-[#1a1a1a] cursor-pointer group">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: getAgeGroupColor(student.ageGroup) }}
          >
            {getInitials(student.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white group-hover:text-[#C9A84C] transition-colors truncate">{student.name}</h3>
              <ActivityDot studentId={student.id} classes={classes} />
            </div>
            <p className="text-xs text-[#888888]">Age {student.age}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getLevelBadge(student.level)}`}>
            {student.level}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getAgeGroupBg(student.ageGroup)}`}>
            {student.ageGroup}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-[#555555]">
          <span>{completedClasses} class{completedClasses !== 1 ? 'es' : ''}</span>
          {student.keysEarned.length > 0 && (
            <span className="flex gap-0.5">
              {student.keysEarned.slice(0, 3).map((k, i) => <span key={i}>🔑</span>)}
              {student.keysEarned.length > 3 && <span>+{student.keysEarned.length - 3}</span>}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
