'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

// Notas en la clave de Sol. step 0 = línea inferior (Mi4).
const NOTES = [
  { name: 'Do', step: -2 }, // Do4 central (línea adicional)
  { name: 'Re', step: -1 },
  { name: 'Mi', step: 0 },
  { name: 'Fa', step: 1 },
  { name: 'Sol', step: 2 },
  { name: 'La', step: 3 },
  { name: 'Si', step: 4 },
  { name: 'Do', step: 5 },
  { name: 'Re', step: 6 },
  { name: 'Mi', step: 7 },
  { name: 'Fa', step: 8 },
  { name: 'Sol', step: 9 },
];

const NAMES = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];

export default function ReadingTrainer({ accent = '#C9A84C' }: { accent?: string }) {
  const [current, setCurrent] = useState<number | null>(null);
  const [answered, setAnswered] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const note = current !== null ? NOTES[current] : null;
  const yFor = (step: number) => 104 - step * 8;

  const newQuestion = () => {
    setCurrent(Math.floor(Math.random() * NOTES.length));
    setAnswered(null);
  };

  const guess = (name: string) => {
    if (answered !== null || !note) return;
    setAnswered(name);
    setScore((s) => ({ correct: s.correct + (name === note.name ? 1 : 0), total: s.total + 1 }));
  };

  return (
    <div>
      {score.total > 0 && (
        <p className="text-center text-xs text-[#888888] mb-3">
          Aciertos: <span className="text-white font-semibold">{score.correct}</span> de {score.total}
        </p>
      )}

      {/* Pentagrama */}
      <div className="bg-white rounded-xl p-3 mb-4">
        <svg viewBox="0 0 240 150" className="w-full" style={{ maxHeight: 150 }}>
          {/* Líneas del pentagrama */}
          {[0, 2, 4, 6, 8].map((step) => (
            <line key={step} x1={16} y1={yFor(step)} x2={224} y2={yFor(step)} stroke="#333" strokeWidth={1.5} />
          ))}
          {/* Clave de Sol */}
          <text x={20} y={96} fontSize={56} fill="#333" fontFamily="serif">
            𝄞
          </text>
          {/* Nota */}
          {note && (
            <>
              {/* Línea adicional para Do central */}
              {note.step <= -2 && (
                <line x1={116} y1={yFor(-2)} x2={152} y2={yFor(-2)} stroke="#333" strokeWidth={1.5} />
              )}
              <ellipse cx={134} cy={yFor(note.step)} rx={9} ry={6.5} fill="#1a1a1a" transform={`rotate(-18 134 ${yFor(note.step)})`} />
              {/* Plica */}
              <line
                x1={note.step >= 4 ? 125 : 143}
                y1={yFor(note.step)}
                x2={note.step >= 4 ? 125 : 143}
                y2={note.step >= 4 ? yFor(note.step) + 42 : yFor(note.step) - 42}
                stroke="#1a1a1a"
                strokeWidth={2}
              />
            </>
          )}
        </svg>
      </div>

      {current === null ? (
        <button
          onClick={newQuestion}
          className="w-full py-3 rounded-lg font-semibold text-sm text-black"
          style={{ background: accent }}
        >
          Empezar entrenamiento
        </button>
      ) : (
        <>
          <p className="text-center text-sm text-[#888888] mb-3">¿Qué nota es?</p>
          <div className="grid grid-cols-4 gap-2">
            {NAMES.map((name) => {
              const isCorrect = note?.name === name;
              const isPicked = answered === name;
              let style = 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#444]';
              if (answered !== null) {
                if (isCorrect) style = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300';
                else if (isPicked) style = 'bg-rose-500/15 border-rose-500/50 text-rose-300';
                else style = 'bg-[#1a1a1a] border-[#2a2a2a] text-[#555555]';
              }
              return (
                <button
                  key={name}
                  onClick={() => guess(name)}
                  disabled={answered !== null}
                  className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${style}`}
                >
                  {name}
                </button>
              );
            })}
          </div>
          {answered !== null && (
            <button
              onClick={newQuestion}
              className="w-full mt-3 py-3 rounded-lg font-semibold text-sm text-black flex items-center justify-center gap-2"
              style={{ background: accent }}
            >
              <RotateCcw className="w-4 h-4" /> Siguiente nota
            </button>
          )}
        </>
      )}
    </div>
  );
}
