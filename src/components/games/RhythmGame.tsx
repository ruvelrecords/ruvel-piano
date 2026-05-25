'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { playClick } from '@/lib/audio';
import { Play, RotateCcw } from 'lucide-react';

// Juego de ritmo: el sistema toca un patrón de 4 negras a un tempo.
// El estudiante presiona ESPACIO en cada beat. Se evalúa la precisión.

export default function RhythmGame({ accent = '#C9A84C' }: { accent?: string }) {
  const [bpm, setBpm] = useState(80);
  const [phase, setPhase] = useState<'idle' | 'listen' | 'play' | 'result'>('idle');
  const [currentBeat, setCurrentBeat] = useState(0);
  const [, setHitCount] = useState(0); // solo para forzar re-render
  const [score, setScore] = useState({ perfect: 0, good: 0, miss: 0 });
  const startRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hitsRef = useRef<number[]>([]);
  const phaseRef = useRef<'idle' | 'listen' | 'play' | 'result'>('idle');

  const beatMs = 60000 / bpm;
  const totalBeats = 4;

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const startListen = () => {
    setPhase('listen'); phaseRef.current = 'listen';
    setCurrentBeat(0);
    hitsRef.current = [];
    setHitCount(0);
    let beat = 0;
    playClick(true);
    setCurrentBeat(1);
    intervalRef.current = setInterval(() => {
      beat++;
      if (beat >= totalBeats) {
        cleanup();
        setTimeout(() => startPlay(), beatMs);
      } else {
        playClick(false);
        setCurrentBeat(beat + 1);
      }
    }, beatMs);
  };

  const startPlay = () => {
    setPhase('play'); phaseRef.current = 'play';
    setCurrentBeat(0);
    hitsRef.current = [];
    setHitCount(0);
    startRef.current = performance.now();
    let beat = 0;
    setCurrentBeat(1);
    intervalRef.current = setInterval(() => {
      beat++;
      if (beat >= totalBeats) {
        cleanup();
        setTimeout(() => evaluate(), beatMs);
      } else {
        setCurrentBeat(beat + 1);
      }
    }, beatMs);
  };

  const evaluate = () => {
    const expected = Array.from({ length: totalBeats }, (_, i) => i * beatMs);
    let perfect = 0, good = 0, miss = 0;
    const usedHits = new Set<number>();
    const hits = hitsRef.current;
    expected.forEach((exp) => {
      let bestIdx = -1, bestDiff = Infinity;
      hits.forEach((h, i) => {
        if (usedHits.has(i)) return;
        const d = Math.abs(h - exp);
        if (d < bestDiff) { bestDiff = d; bestIdx = i; }
      });
      if (bestIdx >= 0 && bestDiff < beatMs * 0.5) {
        usedHits.add(bestIdx);
        if (bestDiff < beatMs * 0.15) perfect++;
        else good++;
      } else {
        miss++;
      }
    });
    setScore({ perfect, good, miss });
    setPhase('result'); phaseRef.current = 'result';
  };

  const tap = useCallback(() => {
    if (phaseRef.current !== 'play') return;
    const t = performance.now() - startRef.current;
    hitsRef.current.push(t);
    setHitCount((c) => c + 1);
    playClick(false);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tap]);

  const reset = () => {
    cleanup();
    setPhase('idle'); phaseRef.current = 'idle';
    setCurrentBeat(0);
    hitsRef.current = [];
    setHitCount(0);
    setScore({ perfect: 0, good: 0, miss: 0 });
  };

  return (
    <div>
      {/* Selector de BPM */}
      {phase === 'idle' && (
        <div className="mb-4">
          <p className="text-xs text-[#888] mb-2">Velocidad: <span className="text-white font-bold">{bpm} BPM</span></p>
          <input
            type="range"
            min={50}
            max={140}
            value={bpm}
            onChange={(e) => setBpm(+e.target.value)}
            className="w-full"
            style={{ accentColor: accent }}
          />
        </div>
      )}

      {/* Beats visual */}
      <div className="flex justify-center gap-3 mb-4">
        {[1, 2, 3, 4].map((b) => (
          <div
            key={b}
            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold transition-all ${
              currentBeat === b ? 'scale-125' : ''
            }`}
            style={{
              borderColor: currentBeat === b ? accent : '#2a2a2a',
              background: currentBeat === b ? `${accent}30` : '#1a1a1a',
              color: currentBeat === b ? accent : '#555',
            }}
          >
            {b}
          </div>
        ))}
      </div>

      {phase === 'idle' && (
        <button onClick={startListen} className="w-full py-3 rounded-lg font-semibold text-sm text-black flex items-center justify-center gap-2" style={{ background: accent }}>
          <Play className="w-4 h-4" /> Empezar — primero escucha
        </button>
      )}

      {phase === 'listen' && (
        <p className="text-center text-sm text-[#888]">👂 Escucha el patrón...</p>
      )}

      {phase === 'play' && (
        <div className="text-center">
          <button
            onClick={tap}
            className="w-full py-6 rounded-xl font-bold text-lg text-black"
            style={{ background: accent }}
          >
            🥁 TOCA AQUÍ (o presiona ESPACIO)
          </button>
          <p className="text-xs text-[#888] mt-2">¡Sigue el ritmo!</p>
        </div>
      )}

      {phase === 'result' && (
        <div>
          <div className="bg-[#1a1a1a] rounded-xl p-4 mb-3 space-y-2">
            <p className="text-center text-sm font-semibold text-white mb-2">Resultado</p>
            <div className="flex justify-between text-sm">
              <span className="text-emerald-300">✨ Perfectos</span>
              <span className="text-white font-bold">{score.perfect}/4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-300">👍 Buenos</span>
              <span className="text-white font-bold">{score.good}/4</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-rose-300">❌ Fallados</span>
              <span className="text-white font-bold">{score.miss}/4</span>
            </div>
          </div>
          <button onClick={reset} className="w-full py-3 rounded-lg font-semibold text-sm text-black flex items-center justify-center gap-2" style={{ background: accent }}>
            <RotateCcw className="w-4 h-4" /> Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
