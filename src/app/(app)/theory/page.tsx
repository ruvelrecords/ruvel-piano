'use client';

import { useState } from 'react';
import {
  INTERVALS,
  CHORD_TYPES,
  SCALES,
  MODES,
  CIRCLE_OF_FIFTHS,
  KEY_EMOTIONS,
  PROGRESSIONS,
  GLOSSARY,
  CHORD_INTERVALS,
  SCALE_INTERVALS,
  ROOT_NOTES,
} from '@/lib/theory';
import { playChord, playSequence, playNote } from '@/lib/audio';
import PianoKeyboard from '@/components/PianoKeyboard';
import { Ruler, Layers, ListMusic, Moon, Circle, Heart, Sigma, BookA, Piano, Play } from 'lucide-react';

type TheoryTab =
  | 'piano'
  | 'intervals'
  | 'chords'
  | 'scales'
  | 'modes'
  | 'circle'
  | 'keys'
  | 'progressions'
  | 'glossary';

type PianoMode = 'chord' | 'scale' | 'free';

export default function TheoryPage() {
  const [tab, setTab] = useState<TheoryTab>('piano');

  // Estado del explorador de piano
  const [pianoMode, setPianoMode] = useState<PianoMode>('chord');
  const [rootMidi, setRootMidi] = useState(60); // Do4
  const [chordIdx, setChordIdx] = useState(0);
  const [scaleIdx, setScaleIdx] = useState(0);

  const chordType = CHORD_INTERVALS[chordIdx];
  const scaleType = SCALE_INTERVALS[scaleIdx];

  const highlightedNotes =
    pianoMode === 'chord'
      ? chordType.intervals.map((i) => rootMidi + i)
      : pianoMode === 'scale'
      ? scaleType.intervals.map((i) => rootMidi + i)
      : [];

  const playCurrent = () => {
    if (pianoMode === 'chord') playChord(highlightedNotes);
    else if (pianoMode === 'scale') playSequence(highlightedNotes);
  };

  const tabs: { id: TheoryTab; label: string; icon: React.ReactNode }[] = [
    { id: 'piano', label: 'Piano Interactivo', icon: <Piano className="w-3.5 h-3.5" /> },
    { id: 'intervals', label: 'Intervalos', icon: <Ruler className="w-3.5 h-3.5" /> },
    { id: 'chords', label: 'Acordes', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'scales', label: 'Escalas', icon: <ListMusic className="w-3.5 h-3.5" /> },
    { id: 'modes', label: 'Modos', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'circle', label: 'Círculo de Quintas', icon: <Circle className="w-3.5 h-3.5" /> },
    { id: 'keys', label: 'Tonalidades', icon: <Heart className="w-3.5 h-3.5" /> },
    { id: 'progressions', label: 'Progresiones', icon: <Sigma className="w-3.5 h-3.5" /> },
    { id: 'glossary', label: 'Glosario', icon: <BookA className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Manual de Teoría</h1>
        <p className="text-[#888888] text-sm mt-0.5">
          Referencia completa — consulta cualquier concepto en cualquier momento
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-[#C9A84C] text-black'
                : 'bg-[#111111] border border-[#2a2a2a] text-[#888888] hover:text-white'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── PIANO INTERACTIVO ───────────────────────────────────────────── */}
      {tab === 'piano' && (
        <div>
          <p className="text-sm text-[#888888] mb-4">
            Toca el teclado para oír las notas. Elige un <strong className="text-white">acorde</strong> o una{' '}
            <strong className="text-white">escala</strong> para verlos resaltados y escucharlos.
          </p>

          {/* Selector de modo */}
          <div className="flex gap-2 mb-4">
            {([
              { id: 'chord', label: 'Acordes' },
              { id: 'scale', label: 'Escalas' },
              { id: 'free', label: 'Libre' },
            ] as { id: PianoMode; label: string }[]).map((m) => (
              <button
                key={m.id}
                onClick={() => setPianoMode(m.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pianoMode === m.id
                    ? 'bg-[#C9A84C] text-black'
                    : 'bg-[#111111] border border-[#2a2a2a] text-[#888888] hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Selector de nota raíz */}
          {pianoMode !== 'free' && (
            <div className="mb-3">
              <p className="text-xs uppercase tracking-wider text-[#888888] font-semibold mb-2">Nota raíz</p>
              <div className="flex flex-wrap gap-1.5">
                {ROOT_NOTES.map((r) => (
                  <button
                    key={r.midi}
                    onClick={() => {
                      setRootMidi(r.midi);
                      playNote(r.midi);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      rootMidi === r.midi
                        ? 'bg-[#C9A84C] text-black'
                        : 'bg-[#111111] border border-[#2a2a2a] text-[#888888] hover:text-white'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de tipo de acorde/escala */}
          {pianoMode === 'chord' && (
            <div className="mb-3">
              <p className="text-xs uppercase tracking-wider text-[#888888] font-semibold mb-2">Tipo de acorde</p>
              <div className="flex flex-wrap gap-1.5">
                {CHORD_INTERVALS.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setChordIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      chordIdx === i
                        ? 'bg-[#C9A84C] text-black'
                        : 'bg-[#111111] border border-[#2a2a2a] text-[#888888] hover:text-white'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          {pianoMode === 'scale' && (
            <div className="mb-3">
              <p className="text-xs uppercase tracking-wider text-[#888888] font-semibold mb-2">Tipo de escala</p>
              <div className="flex flex-wrap gap-1.5">
                {SCALE_INTERVALS.map((s, i) => (
                  <button
                    key={s.name}
                    onClick={() => setScaleIdx(i)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      scaleIdx === i
                        ? 'bg-[#C9A84C] text-black'
                        : 'bg-[#111111] border border-[#2a2a2a] text-[#888888] hover:text-white'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botón de reproducir */}
          {pianoMode !== 'free' && (
            <button
              onClick={playCurrent}
              className="flex items-center gap-2 px-4 py-2 mb-4 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] transition-colors"
            >
              <Play className="w-4 h-4" />
              {pianoMode === 'chord' ? 'Escuchar el acorde' : 'Escuchar la escala'}
            </button>
          )}

          {/* El teclado */}
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
            <PianoKeyboard
              startMidi={60}
              octaves={2}
              highlighted={highlightedNotes}
              roots={pianoMode !== 'free' ? [rootMidi] : []}
              showLabels={pianoMode === 'free'}
            />
          </div>
          <p className="text-xs text-[#555555] mt-3">
            💡 Consejo: usa esto en clase para mostrarle al estudiante exactamente qué teclas forman cada acorde o escala.
          </p>
        </div>
      )}

      {/* ── INTERVALOS ──────────────────────────────────────────────────── */}
      {tab === 'intervals' && (
        <div>
          <p className="text-sm text-[#888888] mb-4">
            Un <strong className="text-white">intervalo</strong> es la distancia entre dos notas, medida en semitonos.
            Cada uno tiene un sonido reconocible — asócialo a su canción de referencia para identificarlo de oído.
          </p>
          <div className="space-y-2">
            {INTERVALS.map((iv) => (
              <div key={iv.short} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="w-12 h-12 rounded-xl bg-[#C9A84C]/15 text-[#C9A84C] font-bold flex items-center justify-center flex-shrink-0">
                    {iv.short}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">
                      {iv.name} <span className="text-[#555555] font-normal">· {iv.nameEn}</span>
                    </p>
                    <p className="text-xs text-[#888888] mt-0.5">{iv.sound}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888]">
                    {iv.semitones} semitono{iv.semitones !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="mt-2 text-xs text-[#C9A84C]">🎵 Referencia: {iv.referenceSong}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACORDES ─────────────────────────────────────────────────────── */}
      {tab === 'chords' && (
        <div>
          <p className="text-sm text-[#888888] mb-4">
            Todo acorde se construye apilando intervalos sobre una <strong className="text-white">raíz</strong>.
            Aprende la fórmula y podrás construir cualquier acorde desde cualquier nota.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CHORD_TYPES.map((c) => (
              <div key={c.symbol} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-white">{c.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-[#C9A84C]/15 text-[#C9A84C] font-mono font-bold">
                    {c.symbol}
                  </span>
                </div>
                <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-lg p-2.5 mb-2">
                  <p className="text-xs text-[#C9A84C] font-semibold">📐 {c.formula}</p>
                </div>
                <p className="text-xs text-[#888888]">Ejemplo: <span className="text-white">{c.example}</span></p>
                <p className="text-xs text-[#888888] mt-1">Sonido: {c.sound}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ESCALAS ─────────────────────────────────────────────────────── */}
      {tab === 'scales' && (
        <div>
          <p className="text-sm text-[#888888] mb-4">
            Una <strong className="text-white">escala</strong> es una secuencia de notas que sube hasta la octava.
            T = tono (2 semitonos), S = semitono.
          </p>
          <div className="space-y-2">
            {SCALES.map((s) => (
              <div key={s.name} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-sm font-semibold text-white mb-2">{s.name}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-[#C9A84C]/10 border border-[#C9A84C]/20 text-[#C9A84C] font-mono">
                    {s.formula}
                  </span>
                </div>
                <p className="text-xs text-[#888888]">Ejemplo: <span className="text-white">{s.example}</span></p>
                <p className="text-xs text-[#888888] mt-1">Sonido: {s.sound}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODOS ───────────────────────────────────────────────────────── */}
      {tab === 'modes' && (
        <div>
          <p className="text-sm text-[#888888] mb-4">
            Un <strong className="text-white">modo</strong> es la escala mayor empezando desde un grado distinto.
            Mismas notas, distinto «hogar» = distinto color emocional.
          </p>
          <div className="space-y-2">
            {MODES.map((m) => (
              <div key={m.name} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="w-9 h-9 rounded-lg bg-[#C9A84C]/15 text-[#C9A84C] font-bold flex items-center justify-center flex-shrink-0">
                    {m.degree}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white">{m.name}</p>
                    <p className="text-xs text-[#888888] mt-0.5">{m.character}</p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-[#1a1a1a] text-[#888888]">
                    {m.formula}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-md bg-[#1a1a1a] text-[#888888]">
                    Desde Do: teclas blancas {m.exampleFromC}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CÍRCULO DE QUINTAS ──────────────────────────────────────────── */}
      {tab === 'circle' && (
        <div>
          <p className="text-sm text-[#888888] mb-4">
            El <strong className="text-white">Círculo de Quintas</strong> organiza las 12 tonalidades.
            En sentido horario sube una 5ª y agrega un sostenido; en antihorario agrega un bemol.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-[#C9A84C] font-semibold mb-2">Orden de Sostenidos ♯</p>
              <p className="text-sm text-white font-mono">{CIRCLE_OF_FIFTHS.sharpsOrder.join(' · ')}</p>
              <p className="text-xs text-[#555555] mt-2">Truco: el último sostenido + 1 semitono = la tónica.</p>
            </div>
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
              <p className="text-xs uppercase tracking-wider text-[#C9A84C] font-semibold mb-2">Orden de Bemoles ♭</p>
              <p className="text-sm text-white font-mono">{CIRCLE_OF_FIFTHS.flatsOrder.join(' · ')}</p>
              <p className="text-xs text-[#555555] mt-2">Truco: el penúltimo bemol ES la tónica.</p>
            </div>
          </div>
          <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 gap-px bg-[#2a2a2a] text-xs">
              <div className="bg-[#1a1a1a] px-3 py-2 font-semibold text-[#888888]">Tonalidad mayor</div>
              <div className="bg-[#1a1a1a] px-3 py-2 font-semibold text-[#888888]">Menor relativa</div>
              <div className="bg-[#1a1a1a] px-3 py-2 font-semibold text-[#888888]">Armadura</div>
              {CIRCLE_OF_FIFTHS.keys.map((k) => (
                <div key={k.key} className="contents">
                  <div className="bg-[#111111] px-3 py-2 text-white font-medium">{k.key} mayor</div>
                  <div className="bg-[#111111] px-3 py-2 text-[#888888]">{k.minor}</div>
                  <div className="bg-[#111111] px-3 py-2 text-[#888888]">{k.accidentals}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TONALIDADES (emociones) ─────────────────────────────────────── */}
      {tab === 'keys' && (
        <div>
          <p className="text-sm text-[#888888] mb-4">
            Cada tonalidad tiene un <strong className="text-white">carácter emocional</strong> propio.
            Los compositores eligen la tonalidad por el ánimo que transmite (la «teoría del afecto»).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {KEY_EMOTIONS.map((k) => (
              <div key={k.key} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-sm font-semibold text-[#C9A84C]">{k.key}</p>
                <p className="text-xs text-[#888888] mt-1">{k.emotion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROGRESIONES ────────────────────────────────────────────────── */}
      {tab === 'progressions' && (
        <div>
          <p className="text-sm text-[#888888] mb-4">
            Las <strong className="text-white">progresiones</strong> se escriben con números romanos para que
            funcionen en cualquier tonalidad. Mayúsculas = acordes mayores, minúsculas = menores.
          </p>
          <div className="space-y-2">
            {PROGRESSIONS.map((p) => (
              <div key={p.name} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-sm font-semibold text-white">{p.name}</p>
                <div className="flex flex-wrap gap-2 my-2">
                  <span className="text-xs px-2 py-1 rounded-md bg-[#C9A84C]/15 text-[#C9A84C] font-mono font-bold">
                    {p.numerals}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-md bg-[#1a1a1a] text-[#888888]">
                    En Do: {p.exampleInC}
                  </span>
                </div>
                <p className="text-xs text-[#888888]">Se usa en: {p.usedIn}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── GLOSARIO ────────────────────────────────────────────────────── */}
      {tab === 'glossary' && (
        <div>
          <p className="text-sm text-[#888888] mb-4">
            Glosario bilingüe de términos musicales — español e inglés.
          </p>
          <div className="space-y-2">
            {GLOSSARY.map((g) => (
              <div key={g.term} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4">
                <p className="text-sm font-semibold text-white">
                  {g.term} <span className="text-[#555555] font-normal">· {g.termEn}</span>
                </p>
                <p className="text-xs text-[#888888] mt-1">{g.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
