'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw } from 'lucide-react';

// Carrera de lectura: aparece una nota en el pentagrama y el estudiante
// debe nombrarla antes de que se acabe el tiempo. Sube velocidad cada acierto.

const NOTES = [
  { name: 'Do', step: -2 },
  { name: 'Re', step: -1 },
  { name: 'Mi', step: 0 },
  { name: 'Fa', step: 1 },
  { name: 'Sol', step: 2 },
  { name: 'La', step: 3 },
  { name: 'Si', step: 4 },
  { name: 'Do', step: 5 },
  { name: 'Re', step: 6 },
  { name: 'Mi', step: 7 },
];
const NAMES = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];

const yFor = (step: number) => 80 - step * 7;

export default function SpeedReading({ accent = '#C9A84C' }: { accent?: string }) {
  const [phase, setPhase] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentTime = Math.max(1.2, 5 - score * 0.2); // se acelera

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const nextNote = () => {
    setCurrentIdx(Math.floor(Math.random() * NOTES.length));
    setTimeLeft(currentTime);
  };

  const start = () => {
    setScore(0);
    setPhase('playing');
    nextNote();
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const tick = 100;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.1) {
          // Tiempo terminado — game over
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase('gameover');
          setBestScore((b) => Math.max(b, score));
          return 0;
        }
        return t - tick / 1000;
      });
    }, tick);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, score]);

  const guess = (name: string) => {
    if (phase !== 'playing') return;
    if (NOTES[currentIdx].name === name) {
      setScore((s) => s + 1);
      nextNote();
    } else {
      // Fallo = game over
      if (timerRef.current) clearInterval(timerRef.current);
      setBestScore((b) => Math.max(b, score));
      setPhase('gameover');
    }
  };

  const note = NOTES[currentIdx];
  const percent = (timeLeft / currentTime) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-[#888]">
          Puntaje: <span className="text-white font-bold">{score}</span>
          {bestScore > 0 && <span className="ml-2 text-[#555]">· Mejor: {bestScore}</span>}
        </p>
        {phase === 'playing' && (
          <p className="text-xs text-[#888]">⏱ {timeLeft.toFixed(1)}s</p>
        )}
      </div>

      {/* Pentagrama */}
      <div className="bg-white rounded-xl p-3 mb-3" style={{ minHeight: 140 }}>
        <svg viewBox="0 0 200 140" className="w-full" style={{ maxHeight: 140 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={16} y1={52 + i * 7} x2={184} y2={52 + i * 7} stroke="#333" strokeWidth={1.2} />
          ))}
          <text x={18} y={84} fontSize={42} fill="#333" fontFamily="serif">𝄞</text>
          {phase === 'playing' && (
            <>
              {note.step <= -2 && (
                <line x1={92} y1={yFor(-2)} x2={120} y2={yFor(-2)} stroke="#333" strokeWidth={1.2} />
              )}
              <ellipse cx={106} cy={yFor(note.step)} rx={8} ry={6} fill="#1a1a1a" transform={`rotate(-20 106 ${yFor(note.step)})`} />
              <line
                x1={note.step >= 4 ? 99 : 113}
                y1={yFor(note.step)}
                x2={note.step >= 4 ? 99 : 113}
                y2={note.step >= 4 ? yFor(note.step) + 38 : yFor(note.step) - 38}
                stroke="#1a1a1a"
                strokeWidth={1.8}
              />
            </>
          )}
        </svg>
      </div>

      {/* Barra de tiempo */}
      {phase === 'playing' && (
        <div className="h-2 bg-[#1a1a1a] rounded-full mb-3 overflow-hidden">
          <div
            className="h-full transition-all duration-100"
            style={{ width: `${percent}%`, background: percent > 40 ? accent : '#ef4444' }}
          />
        </div>
      )}

      {phase === 'idle' && (
        <button onClick={start} className="w-full py-3 rounded-lg font-semibold text-sm text-black flex items-center justify-center gap-2" style={{ background: accent }}>
          <Play className="w-4 h-4" /> Empezar la carrera
        </button>
      )}

      {phase === 'playing' && (
        <div className="grid grid-cols-4 gap-2">
          {NAMES.map((name) => (
            <button
              key={name}
              onClick={() => guess(name)}
              className="py-2.5 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] text-white text-sm font-medium hover:border-[#444]"
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {phase === 'gameover' && (
        <div>
          <div className="bg-[#1a1a1a] rounded-xl p-4 text-center mb-3">
            <p className="text-3xl mb-1">{score >= 10 ? '🏆' : score >= 5 ? '👍' : '💪'}</p>
            <p className="text-sm text-white">Acertaste <span className="font-bold">{score}</span> notas</p>
            {score === bestScore && score > 0 && (
              <p className="text-xs mt-1" style={{ color: accent }}>¡Nuevo récord!</p>
            )}
          </div>
          <button onClick={start} className="w-full py-3 rounded-lg font-semibold text-sm text-black flex items-center justify-center gap-2" style={{ background: accent }}>
            <RotateCcw className="w-4 h-4" /> Otra vez
          </button>
        </div>
      )}
    </div>
  );
}
