'use client';

import { useState } from 'react';
import PianoKeyboard from './PianoKeyboard';
import { playChord, playSequence } from '@/lib/audio';
import { CHORD_INTERVALS, SCALE_INTERVALS, ROOT_NOTES } from '@/lib/theory';
import { Volume2 } from 'lucide-react';

type Mode = 'chord' | 'scale' | 'free';

export default function PianoExplorer({ accent = '#C9A84C' }: { accent?: string }) {
  const [mode, setMode] = useState<Mode>('chord');
  const [rootIdx, setRootIdx] = useState(0); // Do
  const [chordIdx, setChordIdx] = useState(0); // Mayor
  const [scaleIdx, setScaleIdx] = useState(0); // Mayor

  const root = ROOT_NOTES[rootIdx];
  const chord = CHORD_INTERVALS[chordIdx];
  const scale = SCALE_INTERVALS[scaleIdx];

  const highlightedMidis: number[] =
    mode === 'chord'
      ? chord.intervals.map((i) => root.midi + i)
      : mode === 'scale'
      ? scale.intervals.map((i) => root.midi + i)
      : [];

  const play = () => {
    if (mode === 'chord') playChord(chord.intervals.map((i) => root.midi + i));
    else if (mode === 'scale') playSequence(scale.intervals.map((i) => root.midi + i), 250);
  };

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-4">
      {/* Modo */}
      <div className="flex gap-2 mb-3">
        {([
          { id: 'chord' as Mode, label: 'Acorde' },
          { id: 'scale' as Mode, label: 'Escala' },
          { id: 'free' as Mode, label: 'Libre' },
        ]).map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              mode === m.id ? 'text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888]'
            }`}
            style={mode === m.id ? { background: accent } : {}}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Raíz */}
      {mode !== 'free' && (
        <div className="mb-2">
          <p className="text-[10px] uppercase text-[#888] mb-1">Raíz</p>
          <div className="flex flex-wrap gap-1">
            {ROOT_NOTES.map((r, i) => (
              <button
                key={r.name}
                onClick={() => setRootIdx(i)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  rootIdx === i ? 'text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888]'
                }`}
                style={rootIdx === i ? { background: accent } : {}}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tipo de acorde / escala */}
      {mode === 'chord' && (
        <div className="mb-3">
          <p className="text-[10px] uppercase text-[#888] mb-1">Tipo de acorde</p>
          <div className="flex flex-wrap gap-1">
            {CHORD_INTERVALS.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setChordIdx(i)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  chordIdx === i ? 'text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888]'
                }`}
                style={chordIdx === i ? { background: accent } : {}}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'scale' && (
        <div className="mb-3">
          <p className="text-[10px] uppercase text-[#888] mb-1">Tipo de escala</p>
          <div className="flex flex-wrap gap-1">
            {SCALE_INTERVALS.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setScaleIdx(i)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  scaleIdx === i ? 'text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888]'
                }`}
                style={scaleIdx === i ? { background: accent } : {}}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botón play */}
      {mode !== 'free' && (
        <button
          onClick={play}
          className="w-full mb-3 py-2 rounded-lg font-semibold text-xs text-black flex items-center justify-center gap-2"
          style={{ background: accent }}
        >
          <Volume2 className="w-3.5 h-3.5" /> Reproducir {mode === 'chord' ? 'acorde' : 'escala'}
        </button>
      )}

      {/* Teclado */}
      <PianoKeyboard
        startMidi={48}
        octaves={2}
        highlighted={highlightedMidis}
        roots={[root.midi]}
        labelLang="es"
      />

      <p className="text-[10px] text-[#555] text-center mt-2">
        {mode === 'free' ? 'Toca cualquier tecla' : `${root.name} ${mode === 'chord' ? chord.name : scale.name}`}
      </p>
    </div>
  );
}
