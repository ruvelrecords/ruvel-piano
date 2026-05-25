'use client';

import { useState } from 'react';
import { playChord } from '@/lib/audio';
import { Volume2, RotateCcw } from 'lucide-react';

const CHORDS = [
  { name: 'Mayor', intervals: [0, 4, 7], emoji: '😊' },
  { name: 'Menor', intervals: [0, 3, 7], emoji: '😢' },
  { name: 'Disminuido', intervals: [0, 3, 6], emoji: '😬' },
  { name: 'Aumentado', intervals: [0, 4, 8], emoji: '🤔' },
  { name: 'Mayor 7', intervals: [0, 4, 7, 11], emoji: '✨' },
  { name: 'Menor 7', intervals: [0, 3, 7, 10], emoji: '🌧️' },
  { name: 'Dominante 7', intervals: [0, 4, 7, 10], emoji: '🔥' },
];

export default function ChordIdentifier({ accent = '#C9A84C' }: { accent?: string }) {
  const [target, setTarget] = useState<number | null>(null);
  const [root, setRoot] = useState(60);
  const [answered, setAnswered] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const play = (t = target, r = root) => {
    if (t === null) return;
    playChord(CHORDS[t].intervals.map((i) => r + i));
  };

  const next = () => {
    const t = Math.floor(Math.random() * CHORDS.length);
    const r = 55 + Math.floor(Math.random() * 8);
    setTarget(t);
    setRoot(r);
    setAnswered(null);
    setTimeout(() => play(t, r), 200);
  };

  const guess = (i: number) => {
    if (answered !== null || target === null) return;
    setAnswered(i);
    setScore((s) => ({ correct: s.correct + (i === target ? 1 : 0), total: s.total + 1 }));
  };

  return (
    <div>
      {score.total > 0 && (
        <p className="text-center text-xs text-[#888] mb-3">
          Aciertos: <span className="text-white font-semibold">{score.correct}</span> de {score.total}
        </p>
      )}

      {target === null ? (
        <button onClick={next} className="w-full py-3 rounded-lg font-semibold text-sm text-black" style={{ background: accent }}>
          Empezar juego
        </button>
      ) : (
        <>
          <button
            onClick={() => play()}
            className="w-full py-3 mb-3 rounded-lg font-semibold text-sm bg-[#1a1a1a] border border-[#2a2a2a] text-white flex items-center justify-center gap-2 hover:bg-[#2a2a2a]"
          >
            <Volume2 className="w-4 h-4" /> Escuchar el acorde
          </button>

          <div className="grid grid-cols-2 gap-2">
            {CHORDS.map((c, i) => {
              const isTarget = i === target;
              const isPicked = i === answered;
              let style = 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#444]';
              if (answered !== null) {
                if (isTarget) style = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300';
                else if (isPicked) style = 'bg-rose-500/15 border-rose-500/50 text-rose-300';
                else style = 'bg-[#1a1a1a] border-[#2a2a2a] text-[#555]';
              }
              return (
                <button
                  key={c.name}
                  onClick={() => guess(i)}
                  disabled={answered !== null}
                  className={`py-2.5 rounded-lg border text-xs font-medium transition-colors ${style}`}
                >
                  <span className="mr-1">{c.emoji}</span>{c.name}
                </button>
              );
            })}
          </div>

          {answered !== null && (
            <button onClick={next} className="w-full mt-3 py-3 rounded-lg font-semibold text-sm text-black flex items-center justify-center gap-2" style={{ background: accent }}>
              <RotateCcw className="w-4 h-4" /> Siguiente acorde
            </button>
          )}
        </>
      )}
    </div>
  );
}
