'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { SONGS, MODULES } from '@/lib/constants';
import { EXERCISES, EXERCISE_CATEGORIES, EXERCISE_DIFFICULTY_COLORS } from '@/lib/exercises';
import { Music, ExternalLink, UserPlus, Search, Dumbbell, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { musescoreUrl } from '@/lib/utils';
import Modal from '@/components/ui/Modal';

type LibraryTab = 'songs' | 'exercises';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const EXERCISE_DIFFS = ['Starter', 'Intermediate', 'Advanced'];
const genreSet = new Set(SONGS.map((s) => s.genre));
const GENRES = Array.from(genreSet).sort();

function ultimateGuitarUrl(title: string, artist: string) {
  const q = encodeURIComponent(`${title} ${artist}`);
  return `https://www.ultimate-guitar.com/search.php?search_type=title&value=${q}`;
}

function youtubeSearchUrl(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export default function LibraryPage() {
  const { students, updateStudent } = useApp();
  const [tab, setTab] = useState<LibraryTab>('songs');

  // Song filters
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [assignModal, setAssignModal] = useState<{ songTitle: string } | null>(null);
  const [selectedStudent, setSelectedStudent] = useState('');

  // Exercise filters & state
  const [exSearch, setExSearch] = useState('');
  const [exCategory, setExCategory] = useState('');
  const [exDiff, setExDiff] = useState('');
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  // ── Song filtering ────────────────────────────────────────────────────────
  const filteredSongs = SONGS.filter((s) => {
    const matchSearch =
      !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.artist.toLowerCase().includes(search.toLowerCase());
    const matchDiff = !filterDiff || s.difficulty === filterDiff;
    const matchGenre = !filterGenre || s.genre === filterGenre;
    const matchModule = !filterModule || s.module === parseInt(filterModule);
    return matchSearch && matchDiff && matchGenre && matchModule;
  });

  // ── Exercise filtering ────────────────────────────────────────────────────
  const filteredExercises = EXERCISES.filter((ex) => {
    const matchSearch =
      !exSearch ||
      ex.title.toLowerCase().includes(exSearch.toLowerCase()) ||
      ex.develops.some((d) => d.toLowerCase().includes(exSearch.toLowerCase()));
    const matchCat = !exCategory || ex.category === exCategory;
    const matchDiff = !exDiff || ex.difficulty === exDiff;
    return matchSearch && matchCat && matchDiff;
  });

  const handleAssign = () => {
    if (!selectedStudent || !assignModal) return;
    const student = students.find((s) => s.id === selectedStudent);
    if (!student) return;
    if (!student.assignedSongs.includes(assignModal.songTitle)) {
      updateStudent(selectedStudent, {
        assignedSongs: [...student.assignedSongs, assignModal.songTitle],
      });
    }
    setAssignModal(null);
    setSelectedStudent('');
  };

  const diffColor: Record<string, string> = {
    Beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Advanced: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  // Group exercises by category for display
  const exercisesByCategory = EXERCISE_CATEGORIES.map((cat) => ({
    category: cat,
    items: filteredExercises.filter((ex) => ex.category === cat),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Library</h1>
        <p className="text-[#888888] text-sm mt-0.5">
          {SONGS.length} songs · {EXERCISES.length} exercises
        </p>
      </div>

      {/* Top-level tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('songs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'songs'
              ? 'bg-[#C9A84C] text-black'
              : 'bg-[#111111] border border-[#2a2a2a] text-[#888888] hover:text-white'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          Songs ({SONGS.length})
        </button>
        <button
          onClick={() => setTab('exercises')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'exercises'
              ? 'bg-[#C9A84C] text-black'
              : 'bg-[#111111] border border-[#2a2a2a] text-[#888888] hover:text-white'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          Exercises ({EXERCISES.length})
        </button>
      </div>

      {/* ── SONGS TAB ────────────────────────────────────────────────────── */}
      {tab === 'songs' && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
              <input
                type="text"
                placeholder="Search songs or artists..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            <select
              value={filterDiff}
              onChange={(e) => setFilterDiff(e.target.value)}
              className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="">All Difficulties</option>
              {DIFFICULTIES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="">All Genres</option>
              {GENRES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="">All Modules</option>
              {MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  Module {m.id} — {m.title}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-[#555555] mb-4">
            {filteredSongs.length} song{filteredSongs.length !== 1 ? 's' : ''} found
          </p>

          {filteredSongs.length === 0 ? (
            <div className="text-center py-16">
              <Music className="w-12 h-12 text-[#2a2a2a] mx-auto mb-3" />
              <p className="text-[#555555]">No songs match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSongs.map((song) => {
                const songModule = MODULES.find((m) => m.id === song.module);
                const assignedTo = students.filter((s) => s.assignedSongs.includes(song.title));
                return (
                  <div
                    key={song.id}
                    className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#333] transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm truncate">{song.title}</h3>
                        <p className="text-xs text-[#888888] mt-0.5 truncate">{song.artist}</p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${
                          diffColor[song.difficulty]
                        }`}
                      >
                        {song.difficulty}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888]">
                        {song.genre}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C]">
                        M{song.module} {songModule?.icon}
                      </span>
                    </div>

                    {assignedTo.length > 0 && (
                      <div className="mb-3 text-xs text-[#888888]">
                        Assigned to: {assignedTo.map((s) => s.name).join(', ')}
                      </div>
                    )}

                    {/* 4 action buttons */}
                    <div className="grid grid-cols-2 gap-1.5">
                      <a
                        href={musescoreUrl(song.title, song.artist)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[11px] text-[#888888] hover:text-white hover:border-[#444] transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> Sheet Music
                      </a>
                      <a
                        href={ultimateGuitarUrl(song.title, song.artist)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[11px] text-[#888888] hover:text-white hover:border-[#444] transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> Chords
                      </a>
                      <a
                        href={youtubeSearchUrl(`${song.title} ${song.artist} piano tutorial`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-[11px] text-[#888888] hover:text-white hover:border-[#444] transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" /> Tutorial
                      </a>
                      <button
                        onClick={() => {
                          setAssignModal({ songTitle: song.title });
                        }}
                        className="flex items-center justify-center gap-1 px-2 py-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-lg text-[11px] text-[#C9A84C] hover:bg-[#C9A84C]/20 transition-colors"
                      >
                        <UserPlus className="w-3 h-3" /> Assign
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── EXERCISES TAB ──────────────────────────────────────────────────── */}
      {tab === 'exercises' && (
        <>
          {/* Exercise filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
              <input
                type="text"
                placeholder="Search exercises or skills..."
                value={exSearch}
                onChange={(e) => setExSearch(e.target.value)}
                className="w-full bg-[#111111] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C]"
              />
            </div>
            <select
              value={exCategory}
              onChange={(e) => setExCategory(e.target.value)}
              className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="">All Categories</option>
              {EXERCISE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={exDiff}
              onChange={(e) => setExDiff(e.target.value)}
              className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
            >
              <option value="">All Levels</option>
              {EXERCISE_DIFFS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <p className="text-sm text-[#555555] mb-6">
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
          </p>

          {filteredExercises.length === 0 ? (
            <div className="text-center py-16">
              <Dumbbell className="w-12 h-12 text-[#2a2a2a] mx-auto mb-3" />
              <p className="text-[#555555]">No exercises match your filters</p>
            </div>
          ) : (
            <div className="space-y-6">
              {exercisesByCategory.map(({ category, items }) => (
                <div key={category}>
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-sm font-semibold text-white">{category}</h2>
                    <div className="flex-1 h-px bg-[#2a2a2a]" />
                    <span className="text-xs text-[#555555]">{items.length}</span>
                  </div>

                  {/* Exercise cards */}
                  <div className="space-y-2">
                    {items.map((ex) => {
                      const isOpen = expandedExercise === ex.id;
                      return (
                        <div
                          key={ex.id}
                          className={`border rounded-xl overflow-hidden transition-all ${
                            isOpen ? 'border-[#C9A84C]/30' : 'border-[#2a2a2a]'
                          } bg-[#111111]`}
                        >
                          {/* Card header */}
                          <button
                            onClick={() => setExpandedExercise(isOpen ? null : ex.id)}
                            className="w-full flex items-center gap-3 p-4 text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-sm font-medium text-white">{ex.title}</h3>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                                    EXERCISE_DIFFICULTY_COLORS[ex.difficulty]
                                  }`}
                                >
                                  {ex.difficulty}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1 text-[#555555]">
                                  <Clock className="w-3 h-3" />
                                  <span className="text-[11px]">{ex.duration} min/session</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {ex.develops.slice(0, 2).map((skill) => (
                                    <span
                                      key={skill}
                                      className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[#888888]"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {ex.develops.length > 2 && (
                                    <span className="text-[10px] text-[#555555]">+{ex.develops.length - 2}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {isOpen ? (
                                <ChevronUp className="w-4 h-4 text-[#555555]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#555555]" />
                              )}
                            </div>
                          </button>

                          {/* Expanded content */}
                          {isOpen && (
                            <div className="border-t border-[#2a2a2a] p-4 space-y-4">
                              {/* Description */}
                              <p className="text-sm text-[#aaa] leading-relaxed">{ex.description}</p>

                              {/* How to practice */}
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-[#C9A84C] font-semibold mb-2">
                                  How to Practice
                                </p>
                                <p className="text-sm text-white leading-relaxed">{ex.howTo}</p>
                              </div>

                              {/* Tempo */}
                              {ex.tempo && (
                                <div className="flex items-center gap-2 p-3 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-lg">
                                  <span className="text-[#C9A84C] text-sm">🎵</span>
                                  <span className="text-sm text-[#C9A84C] font-medium">{ex.tempo}</span>
                                </div>
                              )}

                              {/* Develops */}
                              <div>
                                <p className="text-[10px] uppercase tracking-wider text-[#888888] font-semibold mb-2">
                                  Develops
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {ex.develops.map((skill) => (
                                    <span
                                      key={skill}
                                      className="text-xs px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-white"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Links */}
                              <div className="flex gap-2">
                                <a
                                  href={youtubeSearchUrl(ex.youtubeSearch)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-[#888888] hover:text-white hover:border-[#444] transition-colors"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  YouTube Tutorial
                                </a>
                                {ex.musescoreSearch && (
                                  <a
                                    href={`https://musescore.com/sheetmusic?text=${encodeURIComponent(ex.musescoreSearch)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-[#888888] hover:text-white hover:border-[#444] transition-colors"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Sheet Music
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Assign song modal */}
      <Modal
        isOpen={!!assignModal}
        onClose={() => {
          setAssignModal(null);
          setSelectedStudent('');
        }}
        title="Assign to Student"
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
            Assign <strong className="text-white">{assignModal?.songTitle}</strong> to:
          </p>
          <select
            className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">Select student...</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </Modal>
    </div>
  );
}
