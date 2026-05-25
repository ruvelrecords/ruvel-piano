'use client';

import { useState } from 'react';
import { playSequence, playNote } from '@/lib/audio';
import { Play, Trash2, Music as MusicIcon } from 'lucide-react';

// ─── RÜVEL — Pentagrama interactivo ─────────────────────────────────────────
// Click en el pentagrama para colocar notas. Toolbar para clave, accidentes,
// borrar y reproducir. Soporta clave de Sol, Fa y pentagrama doble.

type Clef = 'treble' | 'bass' | 'grand';
type Accidental = 'natural' | 'sharp' | 'flat';

interface StaffNote {
  id: string;
  // step = 0 es la línea inferior del pentagrama actual
  // En treble: step 0 = Mi4 (E4 = midi 64)
  // En bass:   step 0 = Sol2 (G2 = midi 43)
  step: number;
  staff: 'treble' | 'bass'; // a qué pentagrama pertenece (para grand staff)
  accidental: Accidental;
  x: number; // posición horizontal en el SVG (calculada por orden)
}

const STAFF_WIDTH = 600;
const STAFF_HEIGHT_SINGLE = 140;
const STAFF_HEIGHT_GRAND = 280;
const NOTE_START_X = 80;
const NOTE_SPACING = 42;
const LINE_GAP = 10; // distancia entre líneas
const NOTE_RADIUS_X = 7;
const NOTE_RADIUS_Y = 5.5;

// Convierte step (en la clave) + accidental a MIDI
function stepToMidi(step: number, clef: 'treble' | 'bass', accidental: Accidental): number {
  // Treble: step 0 = E4 (64). Cada step son los grados diatónicos sobre C major
  // Bass:   step 0 = G2 (43)
  const baseMidi = clef === 'treble' ? 64 : 43;
  // pattern de semitonos desde E (treble) o G (bass) subiendo por la escala mayor de C
  const trebleSemis = [0, 2, 3, 5, 7, 8, 10, 12]; // E F G A B C D E
  const bassSemis = [0, 2, 4, 5, 7, 9, 10, 12]; // G A B C D E F G
  const pattern = clef === 'treble' ? trebleSemis : bassSemis;
  const octaves = Math.floor(step / 7);
  const idx = ((step % 7) + 7) % 7;
  let midi = baseMidi + octaves * 12 + pattern[idx];
  if (accidental === 'sharp') midi += 1;
  if (accidental === 'flat') midi -= 1;
  return midi;
}

// Y position del centro de la nota en el SVG, dado el step y la y base del pentagrama
function stepToY(step: number, staffTopY: number): number {
  // step 0 = línea inferior del pentagrama (y = staffTopY + 4*LINE_GAP)
  // cada step sube LINE_GAP/2
  return staffTopY + 4 * LINE_GAP - (step * LINE_GAP) / 2;
}

// Inverse — y a step (para click)
function yToStep(y: number, staffTopY: number): number {
  const stepF = (staffTopY + 4 * LINE_GAP - y) * 2 / LINE_GAP;
  return Math.round(stepF);
}

export default function StaffBuilder({ accent = '#C9A84C' }: { accent?: string }) {
  const [clef, setClef] = useState<Clef>('treble');
  const [accidental, setAccidental] = useState<Accidental>('natural');
  const [notes, setNotes] = useState<StaffNote[]>([]);

  const isGrand = clef === 'grand';
  const svgHeight = isGrand ? STAFF_HEIGHT_GRAND : STAFF_HEIGHT_SINGLE;
  const trebleTopY = 20;
  const bassTopY = isGrand ? 180 : 20;

  const handleStaffClick = (e: React.MouseEvent<SVGElement>, staff: 'treble' | 'bass') => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const scaleY = svgHeight / svgRect.height;
    const y = (e.clientY - svgRect.top) * scaleY;

    const staffTopY = staff === 'treble' ? trebleTopY : bassTopY;
    const step = yToStep(y, staffTopY);
    // Rango razonable: -6 a +14 (con líneas adicionales)
    if (step < -6 || step > 14) return;

    const nextX = NOTE_START_X + notes.length * NOTE_SPACING;
    if (nextX > STAFF_WIDTH - 20) return; // no más espacio

    setNotes((prev) => [
      ...prev,
      {
        id: `n${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        step,
        staff: isGrand ? staff : (clef as 'treble' | 'bass'),
        accidental,
        x: nextX,
      },
    ]);
  };

  const removeLastNote = () => setNotes((prev) => prev.slice(0, -1));
  const clearNotes = () => setNotes([]);

  const playAll = async () => {
    if (notes.length === 0) return;
    const midis = notes.map((n) => stepToMidi(n.step, n.staff, n.accidental));
    playSequence(midis, 500);
  };

  const previewNote = (n: StaffNote) => {
    playNote(stepToMidi(n.step, n.staff, n.accidental), 0.6);
  };

  const renderStaff = (staff: 'treble' | 'bass', topY: number) => {
    const lines = [0, 1, 2, 3, 4].map((i) => topY + i * LINE_GAP);
    return (
      <g key={staff}>
        {/* Líneas */}
        {lines.map((y, i) => (
          <line key={i} x1={20} y1={y} x2={STAFF_WIDTH - 10} y2={y} stroke="#333" strokeWidth={1.2} />
        ))}
        {/* Clave */}
        {staff === 'treble' ? (
          <text x={25} y={topY + 4 * LINE_GAP - 4} fontSize={60} fill="#333" fontFamily="serif">𝄞</text>
        ) : (
          <text x={25} y={topY + 2 * LINE_GAP + 8} fontSize={48} fill="#333" fontFamily="serif">𝄢</text>
        )}
        {/* Notas en este pentagrama */}
        {notes.filter((n) => n.staff === staff).map((n) => {
          const ny = stepToY(n.step, topY);
          // Líneas adicionales si la nota está fuera del pentagrama
          const ledgers: number[] = [];
          if (n.step < 0) {
            for (let s = -2; s >= n.step; s -= 2) ledgers.push(stepToY(s, topY));
          } else if (n.step > 8) {
            for (let s = 10; s <= n.step; s += 2) ledgers.push(stepToY(s, topY));
          }
          return (
            <g key={n.id} onClick={() => previewNote(n)} style={{ cursor: 'pointer' }}>
              {ledgers.map((ly, i) => (
                <line key={i} x1={n.x - 12} y1={ly} x2={n.x + 12} y2={ly} stroke="#333" strokeWidth={1.2} />
              ))}
              {/* Accidente */}
              {n.accidental === 'sharp' && <text x={n.x - 22} y={ny + 4} fontSize={22} fill="#333">♯</text>}
              {n.accidental === 'flat' && <text x={n.x - 22} y={ny + 4} fontSize={22} fill="#333">♭</text>}
              {n.accidental === 'natural' && false}
              {/* Cabeza de la nota */}
              <ellipse
                cx={n.x}
                cy={ny}
                rx={NOTE_RADIUS_X}
                ry={NOTE_RADIUS_Y}
                fill="#1a1a1a"
                transform={`rotate(-20 ${n.x} ${ny})`}
              />
              {/* Plica */}
              <line
                x1={n.step >= 4 ? n.x - 6 : n.x + 6}
                y1={ny}
                x2={n.step >= 4 ? n.x - 6 : n.x + 6}
                y2={n.step >= 4 ? ny + 36 : ny - 36}
                stroke="#1a1a1a"
                strokeWidth={1.8}
              />
            </g>
          );
        })}
        {/* Capa invisible para capturar clicks */}
        <rect
          x={60}
          y={topY - 30}
          width={STAFF_WIDTH - 80}
          height={4 * LINE_GAP + 60}
          fill="transparent"
          onClick={(e) => handleStaffClick(e, staff)}
          style={{ cursor: 'crosshair' }}
        />
      </g>
    );
  };

  const noteCount = notes.length;

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Clave */}
        <div className="flex bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-0.5">
          {([
            { id: 'treble' as Clef, label: 'Sol' },
            { id: 'bass' as Clef, label: 'Fa' },
            { id: 'grand' as Clef, label: 'Ambas' },
          ]).map((c) => (
            <button
              key={c.id}
              onClick={() => setClef(c.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                clef === c.id ? 'text-black' : 'text-[#888] hover:text-white'
              }`}
              style={clef === c.id ? { background: accent } : {}}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Accidentes */}
        <div className="flex bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-0.5">
          {([
            { id: 'natural' as Accidental, label: '♮' },
            { id: 'sharp' as Accidental, label: '♯' },
            { id: 'flat' as Accidental, label: '♭' },
          ]).map((a) => (
            <button
              key={a.id}
              onClick={() => setAccidental(a.id)}
              className={`px-3 py-1.5 rounded-md text-base font-bold transition-colors ${
                accidental === a.id ? 'text-black' : 'text-[#888] hover:text-white'
              }`}
              style={accidental === a.id ? { background: accent } : {}}
            >
              {a.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Acciones */}
        <button
          onClick={playAll}
          disabled={noteCount === 0}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40"
          style={{ background: accent, color: '#000' }}
        >
          <Play className="w-3.5 h-3.5" /> Reproducir
        </button>
        <button
          onClick={removeLastNote}
          disabled={noteCount === 0}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:border-[#3a3a3a] disabled:opacity-40"
        >
          Borrar última
        </button>
        <button
          onClick={clearNotes}
          disabled={noteCount === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" /> Limpiar
        </button>
      </div>

      {/* Pentagrama */}
      <div className="bg-white rounded-xl p-3 overflow-x-auto">
        <svg viewBox={`0 0 ${STAFF_WIDTH} ${svgHeight}`} className="w-full" style={{ minWidth: 500 }}>
          {renderStaff(isGrand ? 'treble' : (clef === 'bass' ? 'bass' : 'treble'), trebleTopY)}
          {isGrand && renderStaff('bass', bassTopY)}
        </svg>
      </div>

      {/* Info */}
      <p className="text-xs text-[#888] mt-3 text-center">
        Haz click en el pentagrama para colocar una nota · click en una nota para escucharla
        {noteCount > 0 && <span className="text-white"> · {noteCount} nota{noteCount !== 1 ? 's' : ''}</span>}
      </p>

      {/* Sugerencias rápidas */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            // Escala de Do mayor en treble
            setClef('treble');
            setAccidental('natural');
            const scale: StaffNote[] = [-2, -1, 0, 1, 2, 3, 4, 5].map((step, i) => ({
              id: `n${Date.now()}_${i}`,
              step,
              staff: 'treble',
              accidental: 'natural',
              x: NOTE_START_X + i * NOTE_SPACING,
            }));
            setNotes(scale);
          }}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:border-[#3a3a3a]"
        >
          <MusicIcon className="w-3.5 h-3.5" /> Cargar escala de Do mayor
        </button>
        <button
          onClick={() => {
            // Acorde de Do (Do-Mi-Sol) — en posición fundamental
            setClef('treble');
            setAccidental('natural');
            const chord: StaffNote[] = [-2, 0, 2].map((step, i) => ({
              id: `n${Date.now()}_${i}`,
              step,
              staff: 'treble',
              accidental: 'natural',
              x: NOTE_START_X + i * NOTE_SPACING,
            }));
            setNotes(chord);
          }}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:border-[#3a3a3a]"
        >
          <MusicIcon className="w-3.5 h-3.5" /> Cargar acorde de Do
        </button>
      </div>
    </div>
  );
}
