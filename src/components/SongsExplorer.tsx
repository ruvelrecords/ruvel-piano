'use client';

import { useState, useMemo } from 'react';
import { SONGS, MODULES } from '@/lib/constants';
import { musescoreUrl } from '@/lib/utils';
import { ExternalLink, Search, Music } from 'lucide-react';

const DIFFS = ['Todas', 'Beginner', 'Intermediate', 'Advanced'] as const;
type Diff = (typeof DIFFS)[number];

export default function SongsExplorer({ accent = '#C9A84C', currentModule }: { accent?: string; currentModule?: number }) {
  const [query, setQuery] = useState('');
  const [diff, setDiff] = useState<Diff>('Todas');
  const [moduleFilter, setModuleFilter] = useState<number | 'all'>(currentModule ?? 'all');

  const filtered = useMemo(() => {
    return SONGS.filter((s) => {
      if (diff !== 'Todas' && s.difficulty !== diff) return false;
      if (moduleFilter !== 'all' && s.module !== moduleFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!s.title.toLowerCase().includes(q) && !s.artist.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [query, diff, moduleFilter]);

  const youtubeUrl = (s: typeof SONGS[number]) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(`${s.title} ${s.artist} piano tutorial`)}`;

  return (
    <div>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar canción o artista..."
          className="w-full pl-9 pr-3 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#3a3a3a]"
        />
      </div>

      {/* Dificultad */}
      <div className="flex gap-1.5 mb-2 overflow-x-auto pb-1">
        {DIFFS.map((d) => (
          <button
            key={d}
            onClick={() => setDiff(d)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              diff === d ? 'text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888]'
            }`}
            style={diff === d ? { background: accent } : {}}
          >
            {d === 'Beginner' ? 'Principiante' : d === 'Intermediate' ? 'Intermedio' : d === 'Advanced' ? 'Avanzado' : d}
          </button>
        ))}
      </div>

      {/* Módulo */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
        <button
          onClick={() => setModuleFilter('all')}
          className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
            moduleFilter === 'all' ? 'text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888]'
          }`}
          style={moduleFilter === 'all' ? { background: accent } : {}}
        >
          Todos los módulos
        </button>
        {MODULES.map((m) => (
          <button
            key={m.id}
            onClick={() => setModuleFilter(m.id)}
            className={`px-3 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${
              moduleFilter === m.id ? 'text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888]'
            }`}
            style={moduleFilter === m.id ? { background: accent } : {}}
          >
            M{m.id}
          </button>
        ))}
      </div>

      <p className="text-xs text-[#555] mb-3">
        {filtered.length} canción{filtered.length !== 1 ? 'es' : ''} de {SONGS.length}
      </p>

      {/* Lista */}
      <div className="space-y-2">
        {filtered.map((s) => (
          <div key={s.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: `${accent}20` }}>
                <Music className="w-4 h-4" style={{ color: accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{s.title}</p>
                <p className="text-xs text-[#888] truncate">{s.artist}</p>
                <div className="flex gap-1 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[#888]">M{s.module}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[#888]">{s.difficulty === 'Beginner' ? 'Princ.' : s.difficulty === 'Intermediate' ? 'Inter.' : 'Avan.'}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[#888]">{s.genre}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-2.5">
              <a
                href={youtubeUrl(s)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
              >
                ▶ Tutorial <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={musescoreUrl(s.title, s.artist)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium"
                style={{ background: `${accent}20`, color: accent }}
              >
                Partitura <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Music className="w-10 h-10 text-[#333] mx-auto mb-3" />
            <p className="text-sm text-[#555]">No se encontraron canciones con esos filtros</p>
          </div>
        )}
      </div>
    </div>
  );
}
