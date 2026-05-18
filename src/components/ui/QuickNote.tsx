'use client';

import { useState } from 'react';
import { StickyNote, X, Send } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

export default function QuickNote() {
  const { students, updateStudent } = useApp();
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!selectedStudent || !note.trim()) return;
    setSaving(true);
    const student = students.find((s) => s.id === selectedStudent);
    if (student) {
      const timestamp = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
      const newNote = student.notes
        ? `${student.notes}\n\n[${timestamp}] ${note.trim()}`
        : `[${timestamp}] ${note.trim()}`;
      updateStudent(selectedStudent, { notes: newNote });
    }
    setNote('');
    setSelectedStudent('');
    setSaving(false);
    setOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-5 md:bottom-6 z-50 w-12 h-12 rounded-full bg-[#C9A84C] text-black shadow-lg hover:bg-[#d4b56a] transition-all hover:scale-110 flex items-center justify-center"
        title="Quick Note"
      >
        <StickyNote className="w-5 h-5" />
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md mx-4 mb-4 md:mb-0 bg-[#111111] border border-[#2a2a2a] rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-[#C9A84C]" /> Quick Note
              </h3>
              <button onClick={() => setOpen(false)} className="text-[#888888] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
              >
                <option value="">Select student...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <textarea
                placeholder="Add a quick note about this student..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-24 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors resize-none"
              />

              <button
                onClick={handleSave}
                disabled={!selectedStudent || !note.trim() || saving}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
