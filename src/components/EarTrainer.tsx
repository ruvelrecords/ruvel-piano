'use client';

import { useState } from 'react';
import { playChord, playSequence } from '@/lib/audio';
import { Volume2, RotateCcw } from 'lucide-react';

type Mode = 'intervals' | 'chords';

const INTERVAL_CHOICES = [
  { name: '2ª menor', semitones: 1 },
  { name: '2ª mayor', semitones: 2 },
  { name: '3ª menor', semitones: 3 },
  { name: '3ª mayor', semitones: 4 },
  { name: '4ª justa', semitones: 5 },
  { name: '5ª justa', semitones: 7 },
  { name: 'Octava', semitones: 12 },
];

const CHORD_CHOICES = [
  { name: 'Mayor', intervals: [0, 4, 7] },
  { name: 'Menor', intervals: [0, 3, 7] },
  { name: 'Disminuido', intervals: [0, 3, 6] },
  { name: 'Aumentado', intervals: [0, 4, 8] },
];

export default function EarTrainer({ accent = '#C9A84C' }: { accent?: string }) {
  const [mode, setMode] = useState<Mode>('intervals');
  const [target, setTarget] = useState<number | null>(null);
  const [root, setRoot] = useState(60);
  const [answered, setAnswered] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const choices = mode === 'intervals' ? INTERVAL_CHOICES : CHORD_CHOICES;

  const playTarget = (t = target, r = root) => {
    if (t === null) return;
    if (mode === 'intervals') {
      playSequence([r, r + INTERVAL_CHOICES[t].semitones], 480);
    } else {
      playChord(CHORD_CHOICES[t].intervals.map((i) => r + i));
    }
  };

  const newQuestion = () => {
    const list = mode === 'intervals' ? INTERVAL_CHOICES : CHORD_CHOICES;
    const t = Math.floor(Math.random() * list.length);
    const r = 57 + Math.floor(Math.random() * 8);
    setTarget(t);
    setRoot(r);
    setAnswered(null);
    setTimeout(() => playTarget(t, r), 200);
  };

  const guess = (i: number) => {
    if (answered !== null || target === null) return;
    setAnswered(i);
    setScore((s) => ({ correct: s.correct + (i === target ? 1 : 0), total: s.total + 1 }));
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setTarget(null);
    setAnswered(null);
    setScore({ correct: 0, total: 0 });
  };

  return (
    <div>
      {/* Modo */}
      <div className="flex gap-2 mb-4">
        {([
          { id: 'intervals', label: 'Intervalos' },
          { id: 'chords', label: 'Acordes' },
        ] as { id: Mode; label: string }[]).map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m.id ? 'text-black' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888]'
            }`}
            style={mode === m.id ? { background: accent } : {}}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Puntaje */}
      {score.total > 0 && (
        <p className="text-center text-xs text-[#888888] mb-3">
          Aciertos: <span className="text-white font-semibold">{score.correct}</span> de {score.total}
        </p>
      )}

      {target === null ? (
        <button
          onClick={newQuestion}
          className="w-full py-3 rounded-lg font-semibold text-sm text-black"
          style={{ background: accent }}
        >
          Empezar entrenamiento
        </button>
      ) : (
        <>
          {/* Reproducir */}
          <button
            onClick={() => playTarget()}
            className="w-full py-3 mb-3 rounded-lg font-semibold text-sm bg-[#1a1a1a] border border-[#2a2a2a] text-white flex items-center justify-center gap-2 hover:bg-[#2a2a2a]"
          >
            <Volume2 className="w-4 h-4" /> Escuchar otra vez
          </button>

          {/* Opciones */}
          <div className="grid grid-cols-2 gap-2">
            {choices.map((c, i) => {
              const isTarget = i === target;
              const isPicked = i === answered;
              let style = 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#444]';
              if (answered !== null) {
                if (isTarget) style = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300';
                else if (isPicked) style = 'bg-rose-500/15 border-rose-500/50 text-rose-300';
                else style = 'bg-[#1a1a1a] border-[#2a2a2a] text-[#555555]';
              }
              return (
                <button
                  key={c.name}
                  onClick={() => guess(i)}
                  disabled={answered !== null}
                  className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${style}`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Siguiente */}
          {answered !== null && (
            <button
              onClick={newQuestion}
              className="w-full mt-3 py-3 rounded-lg font-semibold text-sm text-black flex items-center justify-center gap-2"
              style={{ background: accent }}
            >
              <RotateCcw className="w-4 h-4" /> Siguiente
            </button>
          )}
        </>
      )}
    </div>
  );
}
