'use client';

import { useState, useRef, useEffect } from 'react';
import { playClick } from '@/lib/audio';
import { Play, Pause, Minus, Plus } from 'lucide-react';

interface MetronomeProps {
  accent?: string;
  beatsPerBar?: number;
}

export default function Metronome({ accent = '#C9A84C', beatsPerBar = 4 }: MetronomeProps) {
  const [bpm, setBpm] = useState(80);
  const [playing, setPlaying] = useState(false);
  const [beat, setBeat] = useState(-1);
  const intervalRef = useRef<number | null>(null);
  const beatRef = useRef(0);

  useEffect(() => {
    if (playing) {
      const ms = 60000 / bpm;
      beatRef.current = 0;
      playClick(true);
      setBeat(0);
      intervalRef.current = window.setInterval(() => {
        beatRef.current = (beatRef.current + 1) % beatsPerBar;
        playClick(beatRef.current === 0);
        setBeat(beatRef.current);
      }, ms);
    } else {
      setBeat(-1);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, bpm, beatsPerBar]);

  const changeBpm = (delta: number) => {
    setBpm((b) => Math.min(240, Math.max(40, b + delta)));
  };

  const tempoName =
    bpm < 60 ? 'Largo' : bpm < 76 ? 'Adagio' : bpm < 108 ? 'Andante' : bpm < 120 ? 'Moderato' : bpm < 168 ? 'Allegro' : 'Presto';

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
      <div className="text-center mb-4">
        <p className="text-5xl font-bold text-white tabular-nums">{bpm}</p>
        <p className="text-xs text-[#888888] mt-1">BPM · {tempoName}</p>
      </div>

      {/* Indicador de tiempos */}
      <div className="flex justify-center gap-2 mb-4">
        {Array.from({ length: beatsPerBar }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full transition-colors"
            style={{
              background: beat === i ? (i === 0 ? accent : '#fff') : '#2a2a2a',
            }}
          />
        ))}
      </div>

      {/* Control de BPM */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => changeBpm(-5)}
          className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white flex items-center justify-center hover:bg-[#2a2a2a]"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="range"
          min={40}
          max={240}
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          className="flex-1 accent-[#C9A84C]"
        />
        <button
          onClick={() => changeBpm(5)}
          className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white flex items-center justify-center hover:bg-[#2a2a2a]"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Botón play/pause */}
      <button
        onClick={() => setPlaying((p) => !p)}
        className="w-full py-3 rounded-lg font-semibold text-sm text-black flex items-center justify-center gap-2 transition-colors"
        style={{ background: accent }}
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {playing ? 'Detener' : 'Iniciar metrónomo'}
      </button>
    </div>
  );
}
