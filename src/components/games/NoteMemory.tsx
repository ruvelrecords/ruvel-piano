'use client';

import { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

// Memory de notas: empareja cada nombre de nota con su posición en el pentagrama.
// 7 pares = 14 cartas, grid 4x4 (con 2 vacías).

const NOTES = [
  { name: 'Do', step: -2 }, // C4
  { name: 'Re', step: -1 },
  { name: 'Mi', step: 0 },
  { name: 'Fa', step: 1 },
  { name: 'Sol', step: 2 },
  { name: 'La', step: 3 },
  { name: 'Si', step: 4 },
];

type Card =
  | { id: string; pairKey: string; kind: 'name'; label: string }
  | { id: string; pairKey: string; kind: 'staff'; step: number };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): Card[] {
  const cards: Card[] = [];
  NOTES.forEach((n) => {
    cards.push({ id: `name_${n.name}`, pairKey: n.name, kind: 'name', label: n.name });
    cards.push({ id: `staff_${n.name}`, pairKey: n.name, kind: 'staff', step: n.step });
  });
  return shuffle(cards);
}

// En notación musical, notas adyacentes (línea→espacio→línea) están a media
// distancia de línea. Las 5 líneas del pentagrama están en y = 36,42,48,54,60
// (6 apart). Cada paso diatónico = 3 (mitad).
const yFor = (step: number) => 60 - step * 3;

export default function NoteMemory({ accent = '#C9A84C' }: { accent?: string }) {
  const [deck, setDeck] = useState<Card[]>(() => buildDeck());
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (flipped.length === 2) {
      const [a, b] = flipped.map((id) => deck.find((c) => c.id === id)!);
      if (a.pairKey === b.pairKey) {
        setMatched((prev) => {
          const next = new Set(prev);
          next.add(a.pairKey);
          return next;
        });
        setTimeout(() => setFlipped([]), 600);
      } else {
        setTimeout(() => setFlipped([]), 900);
      }
      setMoves((m) => m + 1);
    }
  }, [flipped, deck]);

  const handleClick = (id: string) => {
    if (flipped.length >= 2) return;
    if (flipped.includes(id)) return;
    const card = deck.find((c) => c.id === id);
    if (!card || matched.has(card.pairKey)) return;
    setFlipped((f) => [...f, id]);
  };

  const reset = () => {
    setDeck(buildDeck());
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
  };

  const isWon = matched.size === NOTES.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-[#888]">
          Pares: <span className="text-white font-semibold">{matched.size}/{NOTES.length}</span> · Movimientos: <span className="text-white font-semibold">{moves}</span>
        </p>
        <button onClick={reset} className="flex items-center gap-1 text-xs text-[#888] hover:text-white">
          <RotateCcw className="w-3.5 h-3.5" /> Reiniciar
        </button>
      </div>

      {isWon && (
        <div className="mb-3 p-3 rounded-lg text-center" style={{ background: `${accent}20`, border: `1px solid ${accent}50` }}>
          <p className="text-lg">🏆</p>
          <p className="text-sm font-bold text-white">¡Ganaste en {moves} movimientos!</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {deck.map((card) => {
          const isFlipped = flipped.includes(card.id) || matched.has(card.pairKey);
          const isMatched = matched.has(card.pairKey);
          return (
            <button
              key={card.id}
              onClick={() => handleClick(card.id)}
              disabled={isFlipped}
              className={`aspect-square rounded-lg flex items-center justify-center border-2 transition-all ${
                isMatched
                  ? 'bg-emerald-500/15 border-emerald-500/50'
                  : isFlipped
                  ? 'bg-white border-[#3a3a3a]'
                  : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              {isFlipped ? (
                card.kind === 'name' ? (
                  <span className="text-base font-bold text-black">{card.label}</span>
                ) : (
                  <svg viewBox="0 0 60 80" className="w-full h-full p-1">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <line key={i} x1={4} y1={36 + i * 6} x2={56} y2={36 + i * 6} stroke="#333" strokeWidth={1} />
                    ))}
                    <text x={6} y={62} fontSize={20} fill="#333" fontFamily="serif">𝄞</text>
                    {card.step <= -2 && (
                      <line x1={32} y1={yFor(-2)} x2={48} y2={yFor(-2)} stroke="#333" strokeWidth={1} />
                    )}
                    <ellipse cx={40} cy={yFor(card.step)} rx={5} ry={4} fill="#1a1a1a" transform={`rotate(-20 40 ${yFor(card.step)})`} />
                  </svg>
                )
              ) : (
                <span className="text-xl opacity-30">?</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
