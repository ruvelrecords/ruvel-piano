'use client';

import { useState } from 'react';
import { QuizQuestion, QuizResult, QuizResultsStore } from '@/lib/quizzes';
import { getStorage, setStorage } from '@/lib/storage';
import { Check, X, Trophy } from 'lucide-react';

interface QuizProps {
  moduleId: number;
  moduleTitle: string;
  questions: QuizQuestion[];
  studentId?: string; // si se pasa, guarda el resultado
  accentColor?: string;
  onFinish?: (result: QuizResult) => void;
}

export default function Quiz({
  moduleId,
  moduleTitle,
  questions,
  studentId,
  accentColor = '#C9A84C',
  onFinish,
}: QuizProps) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[idx];

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      const total = questions.length;
      const percent = Math.round((score / total) * 100);
      const result: QuizResult = { score, total, percent, date: new Date().toISOString() };
      if (studentId) {
        const store = getStorage<QuizResultsStore>('quiz_results', {});
        if (!store[studentId]) store[studentId] = {};
        store[studentId][moduleId] = result;
        setStorage('quiz_results', store);
      }
      setFinished(true);
      onFinish?.(result);
    }
  };

  // ── Pantalla de resultado ──
  if (finished) {
    const percent = Math.round((score / questions.length) * 100);
    const msg =
      percent >= 80
        ? '¡Excelente! Dominas este módulo. 🎉'
        : percent >= 60
        ? '¡Bien! Vas por buen camino. 👍'
        : 'Sigue practicando — repasa el módulo y vuelve a intentarlo. 💪';
    return (
      <div className="text-center py-4">
        <div
          className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4"
          style={{ background: `${accentColor}20` }}
        >
          <Trophy className="w-10 h-10" style={{ color: accentColor }} />
        </div>
        <p className="text-3xl font-bold text-white">{percent}%</p>
        <p className="text-sm text-[#888888] mt-1">
          {score} de {questions.length} correctas
        </p>
        <p className="text-sm text-white mt-4 leading-relaxed">{msg}</p>
      </div>
    );
  }

  // ── Pantalla de pregunta ──
  return (
    <div>
      {/* Progreso */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-[#888888]">
          Pregunta {idx + 1} de {questions.length}
        </span>
        <span className="text-xs text-[#888888]">
          Módulo {moduleId} · {moduleTitle}
        </span>
      </div>
      <div className="h-1.5 bg-[#1a1a1a] rounded-full mb-4 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${((idx + (answered ? 1 : 0)) / questions.length) * 100}%`, background: accentColor }}
        />
      </div>

      {/* Pregunta */}
      <p className="text-base font-semibold text-white mb-4">{q.q}</p>

      {/* Opciones */}
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const isCorrect = i === q.correct;
          const isSelected = i === selected;
          let style = 'border-[#2a2a2a] bg-[#1a1a1a] text-white hover:border-[#444]';
          if (answered) {
            if (isCorrect) style = 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300';
            else if (isSelected) style = 'border-rose-500/50 bg-rose-500/15 text-rose-300';
            else style = 'border-[#2a2a2a] bg-[#1a1a1a] text-[#555555]';
          }
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={answered}
              className={`w-full flex items-center justify-between gap-2 p-3 rounded-lg border text-sm text-left transition-colors ${style}`}
            >
              <span>{opt}</span>
              {answered && isCorrect && <Check className="w-4 h-4 flex-shrink-0" />}
              {answered && isSelected && !isCorrect && <X className="w-4 h-4 flex-shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explicación */}
      {answered && (
        <div className="mt-3 p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
          <p className="text-xs text-[#888888]">
            <span className="font-semibold" style={{ color: accentColor }}>
              {selected === q.correct ? '¡Correcto! ' : 'Explicación: '}
            </span>
            {q.explanation}
          </p>
        </div>
      )}

      {/* Botón siguiente */}
      {answered && (
        <button
          onClick={next}
          className="w-full mt-4 py-2.5 rounded-lg font-semibold text-sm text-black transition-colors"
          style={{ background: accentColor }}
        >
          {idx + 1 < questions.length ? 'Siguiente pregunta' : 'Ver resultado'}
        </button>
      )}
    </div>
  );
}
