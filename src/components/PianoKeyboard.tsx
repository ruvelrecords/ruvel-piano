'use client';

import { useState } from 'react';
import { playNote, isBlackKey, midiToNameEs, midiToNameEn } from '@/lib/audio';

interface PianoKeyboardProps {
  startMidi?: number; // nota inicial (48 = Do3)
  octaves?: number; // cuántas octavas mostrar
  highlighted?: number[]; // notas MIDI a resaltar
  roots?: number[]; // notas raíz (resaltadas en dorado)
  onKeyPress?: (midi: number) => void;
  showLabels?: boolean; // mostrar nombre en todas las teclas
  labelLang?: 'es' | 'en';
  height?: number;
}

export default function PianoKeyboard({
  startMidi = 48,
  octaves = 2,
  highlighted = [],
  roots = [],
  onKeyPress,
  showLabels = false,
  labelLang = 'es',
  height = 170,
}: PianoKeyboardProps) {
  const [pressed, setPressed] = useState<number | null>(null);

  const totalKeys = octaves * 12 + 1;
  const allMidi: number[] = [];
  for (let i = 0; i < totalKeys; i++) allMidi.push(startMidi + i);
  const whiteMidi = allMidi.filter((m) => !isBlackKey(m));
  const blackMidi = allMidi.filter((m) => isBlackKey(m));
  const W = whiteMidi.length;

  const press = (midi: number) => {
    playNote(midi);
    setPressed(midi);
    setTimeout(() => setPressed((p) => (p === midi ? null : p)), 220);
    onKeyPress?.(midi);
  };

  const label = (m: number) => (labelLang === 'es' ? midiToNameEs(m) : midiToNameEn(m));

  return (
    <div className="relative w-full select-none" style={{ height }}>
      {/* Teclas blancas */}
      <div className="flex h-full gap-px">
        {whiteMidi.map((m) => {
          const isHi = highlighted.includes(m);
          const isRoot = roots.includes(m);
          return (
            <button
              key={m}
              onClick={() => press(m)}
              className="flex-1 rounded-b-md border border-[#2a2a2a] flex items-end justify-center pb-2 transition-colors active:opacity-80"
              style={{
                background: isRoot
                  ? '#C9A84C'
                  : isHi
                  ? '#ecdfb3'
                  : pressed === m
                  ? '#dddddd'
                  : '#fafafa',
              }}
            >
              {(showLabels || isHi || isRoot) && (
                <span
                  className="text-[10px] font-semibold pointer-events-none"
                  style={{ color: isRoot ? '#000' : '#555555' }}
                >
                  {label(m)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Teclas negras */}
      {blackMidi.map((m) => {
        const lowerWhite = m - 1;
        const wi = whiteMidi.indexOf(lowerWhite);
        if (wi < 0) return null;
        const isHi = highlighted.includes(m);
        const isRoot = roots.includes(m);
        const leftPct = ((wi + 1) / W) * 100;
        const widthPct = (100 / W) * 0.62;
        return (
          <button
            key={m}
            onClick={() => press(m)}
            className="absolute top-0 rounded-b-md transition-colors z-10 active:opacity-80 flex items-end justify-center pb-1"
            style={{
              left: `calc(${leftPct}% - ${widthPct / 2}%)`,
              width: `${widthPct}%`,
              height: '62%',
              background: isRoot
                ? '#C9A84C'
                : isHi
                ? '#b89a3a'
                : pressed === m
                ? '#444444'
                : '#1a1a1a',
              border: '1px solid #000000',
            }}
          >
            {(isHi || isRoot) && (
              <span
                className="text-[8px] font-semibold pointer-events-none"
                style={{ color: isRoot ? '#000' : '#fff' }}
              >
                {label(m)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
