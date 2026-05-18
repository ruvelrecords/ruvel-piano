'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Gamepad2,
  Star,
  Zap,
  Music,
  ArrowLeft,
  RotateCcw,
  Check,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = 'All' | 'Interactive' | 'Activity Cards';
type DifficultyFilter = 'All' | 'Beginner' | 'All Ages';

interface InteractiveGame {
  id: number;
  type: 'interactive';
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Advanced';
  ageGroup: 'Kids' | 'Youth' | 'Adults' | 'Any';
  emoji: string;
}

interface ActivityCard {
  id: number;
  type: 'activity';
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Advanced' | 'All Ages';
  ageGroup: 'Kids' | 'Youth' | 'Adults' | 'Any';
  emoji: string;
}

type GameEntry = InteractiveGame | ActivityCard;

// ─── Game Data ────────────────────────────────────────────────────────────────

const INTERACTIVE_GAMES: InteractiveGame[] = [
  { id: 1, type: 'interactive', title: 'Chord Challenge', description: 'Identify chord notes on a piano keyboard. Pick the right keys for each chord name and track your score.', difficulty: 'Beginner', ageGroup: 'Any', emoji: '🎹' },
  { id: 2, type: 'interactive', title: 'Theory Quiz', description: '10 multiple-choice questions about note names, chord formulas, and intervals. See your score at the end.', difficulty: 'Beginner', ageGroup: 'Any', emoji: '🎓' },
  { id: 3, type: 'interactive', title: 'Improv Dice', description: 'Roll 3 dice for a random Key, Mood, and Tempo. Then improvise for 60 seconds with what you get!', difficulty: 'Beginner', ageGroup: 'Any', emoji: '🎲' },
  { id: 4, type: 'interactive', title: 'Note Name Flash', description: 'A letter flashes on screen — identify which number it is in the C major scale. 30-second countdown.', difficulty: 'Beginner', ageGroup: 'Any', emoji: '⚡' },
  { id: 5, type: 'interactive', title: 'Major or Minor?', description: 'Read a chord quality description and tap MAJOR or MINOR. 10 fast rounds to test your ear knowledge.', difficulty: 'Beginner', ageGroup: 'Any', emoji: '🎵' },
  { id: 6, type: 'interactive', title: 'Finger Number Race', description: 'A finger number flashes (1–5). Click the correct finger circle before time runs out. 15-second game.', difficulty: 'Beginner', ageGroup: 'Kids', emoji: '✋' },
  { id: 7, type: 'interactive', title: 'Rhythm Clapper', description: 'Watch a rhythm pattern of filled and empty circles, then click to match it. 5 rounds of rhythm fun.', difficulty: 'Beginner', ageGroup: 'Any', emoji: '🥁' },
  { id: 8, type: 'interactive', title: 'Interval Quiz', description: 'Two note names appear — pick the correct interval (2nd through octave). 8 questions to test your theory.', difficulty: 'Beginner', ageGroup: 'Youth', emoji: '📏' },
  { id: 9, type: 'interactive', title: 'Key Signature Quiz', description: 'A key name appears — pick how many sharps or flats. 8 questions covering the most common keys.', difficulty: 'Beginner', ageGroup: 'Youth', emoji: '🔑' },
  { id: 10, type: 'interactive', title: 'Solfège Flashcard', description: 'A solfège syllable appears (Do/Re/Mi…) — pick the matching note name. 10 rapid-fire rounds.', difficulty: 'Beginner', ageGroup: 'Any', emoji: '🎤' },
  { id: 11, type: 'interactive', title: 'Chord Builder', description: 'Given a root and quality, select 3 notes from a 12-note grid to build the chord using semitone formulas.', difficulty: 'Advanced', ageGroup: 'Adults', emoji: '🏗️' },
  { id: 12, type: 'interactive', title: 'Speed Note Race', description: 'Notes are described as staff positions (Line 1, Space 2…). Type the note name as fast as you can. 60 seconds.', difficulty: 'Beginner', ageGroup: 'Youth', emoji: '🏎️' },
  { id: 13, type: 'interactive', title: 'Music Trivia', description: '8 multiple-choice questions about music history and facts. From Beethoven to modern genres.', difficulty: 'Beginner', ageGroup: 'Any', emoji: '🧠' },
];

const ACTIVITY_CARDS: ActivityCard[] = [
  { id: 14, type: 'activity', title: 'Chord Story Game', description: 'Improvise a story where each character has an assigned chord. When their name is said, play their chord!', difficulty: 'Beginner', ageGroup: 'Kids', emoji: '📖' },
  { id: 15, type: 'activity', title: 'Musical Freeze Dance', description: 'Play music and move around. When it stops, freeze in a musical pose — curved fingers, seated posture.', difficulty: 'All Ages', ageGroup: 'Kids', emoji: '🕺' },
  { id: 16, type: 'activity', title: 'Animal Note Song', description: 'Map each note C–G to a different animal. Create a melody that tells an animal story.', difficulty: 'Beginner', ageGroup: 'Kids', emoji: '🦁' },
  { id: 17, type: 'activity', title: 'Conductor Game', description: 'One player conducts with hand gestures. Others follow — louder, softer, faster, slower.', difficulty: 'All Ages', ageGroup: 'Any', emoji: '🎼' },
  { id: 18, type: 'activity', title: 'Rhythm Echo', description: 'Teacher claps a rhythm pattern, student echoes it back exactly. Add complexity each round.', difficulty: 'Beginner', ageGroup: 'Any', emoji: '👏' },
  { id: 19, type: 'activity', title: 'Note Value Rap', description: 'Use note value syllables (ta, ti-ti, tiri-tiri) to rap a rhythm over a backing track.', difficulty: 'Beginner', ageGroup: 'Kids', emoji: '🎤' },
  { id: 20, type: 'activity', title: 'Compose a Mood', description: 'Compose 4 bars that express a specific emotion. Play it and see if others can guess the mood.', difficulty: 'All Ages', ageGroup: 'Youth', emoji: '🎨' },
  { id: 21, type: 'activity', title: 'Piano Snake', description: 'Improvise starting from any note. Each note must be a step away from the last — no jumps allowed!', difficulty: 'Beginner', ageGroup: 'Any', emoji: '🐍' },
  { id: 22, type: 'activity', title: 'Song Detective', description: 'Teacher plays a short melody fragment. Student identifies the song. Start familiar, then go obscure.', difficulty: 'All Ages', ageGroup: 'Any', emoji: '🔍' },
  { id: 23, type: 'activity', title: 'The Telephone Melody', description: 'Player 1 plays a short melody into the ear of player 2, who plays it to player 3. How does it change?', difficulty: 'All Ages', ageGroup: 'Any', emoji: '📞' },
  { id: 24, type: 'activity', title: 'Staff Drawing Race', description: 'Draw the treble clef staff from memory and label all lines and spaces. Who finishes correctly first?', difficulty: 'Beginner', ageGroup: 'Youth', emoji: '✏️' },
  { id: 25, type: 'activity', title: 'Chord Name Relay', description: 'Name all 12 major chords as fast as possible. Timer starts — beat your personal record each week.', difficulty: 'All Ages', ageGroup: 'Adults', emoji: '⚡' },
  { id: 26, type: 'activity', title: 'Blindfold Navigation', description: 'Close your eyes. Teacher calls a note — find it on the keyboard using only touch and muscle memory.', difficulty: 'All Ages', ageGroup: 'Any', emoji: '🙈' },
  { id: 27, type: 'activity', title: 'Composition Challenge', description: 'Write a complete 4-bar piece in exactly 10 minutes. Any key, any style — just finish it!', difficulty: 'All Ages', ageGroup: 'Adults', emoji: '📝' },
  { id: 28, type: 'activity', title: 'Two-Hand Warm Up', description: 'Hands alternate moving up and down the keyboard in a mirrored pattern. Great for coordination.', difficulty: 'Beginner', ageGroup: 'Any', emoji: '🙌' },
  { id: 29, type: 'activity', title: 'Circle of Fifths Walk', description: 'Name each key as you walk around the full circle of fifths. Say the key name and its relative minor.', difficulty: 'All Ages', ageGroup: 'Adults', emoji: '🔄' },
  { id: 30, type: 'activity', title: 'Emotion Improvisation', description: 'Teacher calls out an emotion. Student has 60 seconds to convey it purely through piano improvisation.', difficulty: 'All Ages', ageGroup: 'Youth', emoji: '😤' },
  { id: 31, type: 'activity', title: 'Genre Switching', description: 'Play the same simple melody in 3 different genres: classical, blues, then pop. Feel the contrast!', difficulty: 'All Ages', ageGroup: 'Adults', emoji: '🎸' },
  { id: 32, type: 'activity', title: 'The Wrong Note Game', description: 'Teacher plays a familiar song with deliberate wrong notes. Student raises their hand when they hear one.', difficulty: 'All Ages', ageGroup: 'Any', emoji: '❌' },
];

const ALL_GAMES: GameEntry[] = [...INTERACTIVE_GAMES, ...ACTIVITY_CARDS];

// ─── Color Helpers ─────────────────────────────────────────────────────────────

const AGE_COLORS: Record<string, string> = {
  Kids: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Youth: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Adults: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Any: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const AGE_LABELS: Record<string, string> = {
  Kids: 'Kids',
  Youth: 'Youth',
  Adults: 'Adults',
  Any: 'Any Age',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'All Ages': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Advanced: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

// ─── Game 1: Chord Challenge ──────────────────────────────────────────────────

const CHORD_DATA: Record<string, number[]> = {
  C: [0, 4, 7], G: [7, 11, 2], Am: [9, 0, 4], F: [5, 9, 0],
  Dm: [2, 5, 9], Em: [4, 7, 11], Bm: [11, 2, 6],
};
const CHORD_NAMES = Object.keys(CHORD_DATA);
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function ChordChallengeGame({ onBack }: { onBack: () => void }) {
  const [chordList] = useState(() => [...CHORD_NAMES].sort(() => Math.random() - 0.5));
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const currentChord = chordList[round];
  const correct = CHORD_DATA[currentChord] ?? [];

  const toggle = (idx: number) => {
    if (feedback !== 'idle') return;
    setSelected(prev =>
      prev.includes(idx) ? prev.filter(n => n !== idx) : prev.length < 3 ? [...prev, idx] : prev
    );
  };

  const check = () => {
    const sortedSel = [...selected].sort((a, b) => a - b);
    const sortedCor = [...correct].sort((a, b) => a - b);
    const isCorrect = sortedSel.join(',') === sortedCor.join(',');
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (round + 1 >= chordList.length) { setDone(true); return; }
      setRound(r => r + 1);
      setSelected([]);
      setFeedback('idle');
    }, 900);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="text-6xl">{score >= 6 ? '🏆' : score >= 4 ? '🎯' : '💪'}</div>
      <div className="text-center">
        <p className="text-4xl font-black text-[#C9A84C]">{score}/{chordList.length}</p>
        <p className="text-[#888888] mt-1">{score >= 6 ? 'Chord master!' : score >= 4 ? 'Nice work!' : 'Keep practicing!'}</p>
      </div>
      <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </button>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-4 text-sm text-[#888888]">
        <span>Round {round + 1}/{chordList.length}</span>
        <span className="text-[#C9A84C] font-bold">Score: {score}</span>
      </div>
      <div className={`text-center py-8 rounded-2xl mb-6 border transition-colors ${
        feedback === 'correct' ? 'bg-emerald-500/10 border-emerald-500/40' :
        feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' :
        'bg-[#1a1a1a] border-[#2a2a2a]'
      }`}>
        <p className="text-sm text-[#888888] mb-2">Pick the 3 notes for:</p>
        <p className="text-6xl font-black text-[#C9A84C]">{currentChord}</p>
        {feedback === 'correct' && <p className="text-emerald-400 text-sm mt-2 font-semibold">Correct! ✓</p>}
        {feedback === 'wrong' && <p className="text-red-400 text-sm mt-2">Not quite — correct: {correct.map(n => NOTE_NAMES[n]).join(' – ')}</p>}
      </div>
      <div className="grid grid-cols-6 gap-2 mb-6">
        {NOTE_NAMES.map((note, idx) => (
          <button
            key={idx}
            onClick={() => toggle(idx)}
            className={`py-3 rounded-xl text-xs font-bold border transition-all ${
              selected.includes(idx)
                ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                : 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#C9A84C]/50'
            } ${note.includes('#') ? 'text-[10px]' : ''}`}
          >
            {note}
          </button>
        ))}
      </div>
      <button
        onClick={check}
        disabled={selected.length !== 3 || feedback !== 'idle'}
        className="w-full py-3.5 bg-[#C9A84C] text-black rounded-xl font-bold text-lg hover:bg-[#d4b56a] transition-colors disabled:opacity-40"
      >
        <Check className="inline w-5 h-5 mr-2" />Check Answer
      </button>
    </div>
  );
}

// ─── Game 2: Theory Quiz ──────────────────────────────────────────────────────

const THEORY_QUESTIONS = [
  { q: 'How many semitones are in a perfect 5th?', opts: ['5', '6', '7', '8'], a: 2 },
  { q: 'What is the formula for a minor chord?', opts: ['Root + 4 + 3', 'Root + 3 + 4', 'Root + 2 + 5', 'Root + 5 + 2'], a: 1 },
  { q: 'Which note comes after G in the musical alphabet?', opts: ['H', 'A', 'B', 'C'], a: 1 },
  { q: 'How many notes are in a standard major scale?', opts: ['5', '6', '7', '8'], a: 2 },
  { q: 'What does "forte" mean?', opts: ['Soft', 'Fast', 'Loud', 'Slow'], a: 2 },
  { q: 'The I–V–vi–IV in C major uses which chords?', opts: ['C-G-Am-F', 'C-F-Am-G', 'Am-F-C-G', 'G-C-F-Am'], a: 0 },
  { q: 'Solfège "Mi" equals which English note?', opts: ['C', 'D', 'E', 'F'], a: 2 },
  { q: 'In 4/4 time, a half note gets how many beats?', opts: ['1', '2', '3', '4'], a: 1 },
  { q: 'Which clef is used for high piano notes?', opts: ['Bass clef', 'Alto clef', 'Treble clef', 'Tenor clef'], a: 2 },
  { q: 'A sharp (♯) does what to a note?', opts: ['Lowers half step', 'Raises half step', 'Doubles length', 'Makes it silent'], a: 1 },
];

function TheoryQuizGame({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = THEORY_QUESTIONS[current];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === q.a) setScore(s => s + 1);
  };

  const next = () => {
    if (current + 1 >= THEORY_QUESTIONS.length) { setDone(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
    setAnswered(false);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="text-6xl">{score >= 9 ? '🏆' : score >= 7 ? '🎯' : '💪'}</div>
      <div className="text-center">
        <p className="text-4xl font-black text-[#C9A84C]">{score}/{THEORY_QUESTIONS.length}</p>
        <p className="text-[#888888] mt-1">{score === 10 ? 'Perfect! Theory master!' : score >= 7 ? 'Excellent knowledge!' : 'Keep studying!'}</p>
      </div>
      <button onClick={onBack} className="flex items-center gap-2 px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">
        <ArrowLeft className="w-4 h-4" /> Back to Games
      </button>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between text-sm text-[#888888] mb-3">
        <span>Q{current + 1}/{THEORY_QUESTIONS.length}</span>
        <span className="text-[#C9A84C] font-bold">Score: {score}</span>
      </div>
      <div className="h-1.5 bg-[#2a2a2a] rounded-full mb-6">
        <div className="h-full bg-[#C9A84C] rounded-full transition-all" style={{ width: `${(current / THEORY_QUESTIONS.length) * 100}%` }} />
      </div>
      <p className="text-white font-medium mb-5 text-base leading-relaxed">{q.q}</p>
      <div className="space-y-2 mb-5">
        {q.opts.map((opt, i) => {
          let cls = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ';
          if (!answered) cls += 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#C9A84C]/40 cursor-pointer';
          else if (i === q.a) cls += 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
          else if (i === selected) cls += 'bg-red-500/20 border-red-500/50 text-red-400';
          else cls += 'bg-[#1a1a1a] border-[#2a2a2a] text-[#555555]';
          return (
            <button key={i} className={cls} onClick={() => handleAnswer(i)}>
              <span className="font-bold text-[#888888] mr-2">{['A', 'B', 'C', 'D'][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <button onClick={next} className="w-full py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">
          {current + 1 >= THEORY_QUESTIONS.length ? 'See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

// ─── Game 3: Improv Dice ──────────────────────────────────────────────────────

const DICE_KEYS = ['C major', 'G major', 'D major', 'A minor', 'E minor', 'F major', 'D minor', 'B minor'];
const DICE_MOODS = ['Happy & bright ☀️', 'Dark & mysterious 🌑', 'Chill & relaxed 😌', 'Energetic ⚡', 'Romantic & slow 🌹', 'Playful & silly 🎭', 'Epic & dramatic 🎬', 'Sad & emotional 💧'];
const DICE_TEMPOS = ['Very slow (♩=50)', 'Slow (♩=70)', 'Medium (♩=90)', 'Upbeat (♩=110)', 'Fast (♩=130)', 'Very fast (♩=150)'];

function ImprovDiceGame({ onBack }: { onBack: () => void }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<{ key: string; mood: string; tempo: string } | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const roll = () => {
    setRolling(true);
    setResult(null);
    setTimerActive(false);
    setTimeLeft(60);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => {
      setResult({
        key: DICE_KEYS[Math.floor(Math.random() * DICE_KEYS.length)],
        mood: DICE_MOODS[Math.floor(Math.random() * DICE_MOODS.length)],
        tempo: DICE_TEMPOS[Math.floor(Math.random() * DICE_TEMPOS.length)],
      });
      setRolling(false);
    }, 800);
  };

  const startTimer = () => {
    setTimerActive(true);
    setTimeLeft(60);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); setTimerActive(false); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const timerColor = timeLeft > 30 ? '#C9A84C' : timeLeft > 10 ? '#F39C12' : '#E74C3C';

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex justify-center gap-4 mb-8">
        {['🎵', '🎭', '⏱️'].map((e, i) => (
          <div key={i} className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl border transition-all ${rolling ? 'animate-bounce border-[#C9A84C]/50 bg-[#C9A84C]/10' : 'border-[#2a2a2a] bg-[#1a1a1a]'}`} style={{ animationDelay: `${i * 0.1}s` }}>
            {e}
          </div>
        ))}
      </div>
      {result && !rolling && (
        <div className="space-y-3 mb-6">
          {[{ label: 'KEY', value: result.key, color: '#C9A84C' }, { label: 'MOOD', value: result.mood, color: '#9B59B6' }, { label: 'TEMPO', value: result.tempo, color: '#FF6B35' }].map(({ label, value, color }) => (
            <div key={label} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a]">
              <span className="text-xs font-black w-12 flex-shrink-0" style={{ color }}>{label}</span>
              <span className="text-sm text-white font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}
      {result && !rolling && (
        <div className="mb-5">
          {timerActive ? (
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#888888]">Improvise!</span>
                <span className="font-bold" style={{ color: timerColor }}>{timeLeft}s</span>
              </div>
              <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(timeLeft / 60) * 100}%`, background: timerColor }} />
              </div>
              {timeLeft === 0 && <p className="text-center text-[#C9A84C] text-sm mt-2 font-semibold">Time&apos;s up! 🎉</p>}
            </div>
          ) : (
            <button onClick={startTimer} className="w-full py-2.5 bg-purple-500/20 border border-purple-500/40 text-purple-400 rounded-xl text-sm font-medium hover:bg-purple-500/30 transition-colors">
              ▶ Start 60-Second Timer
            </button>
          )}
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888] rounded-xl font-medium hover:text-white hover:border-[#444] transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button onClick={roll} disabled={rolling} className="flex-1 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a] transition-colors disabled:opacity-50">
          {rolling ? '🎲 Rolling...' : result ? '🎲 Re-Roll' : '🎲 Roll the Dice!'}
        </button>
      </div>
    </div>
  );
}

// ─── Game 4: Note Name Flash ──────────────────────────────────────────────────

const NOTE_SCALE = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

function NoteNameFlashGame({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [currentNote, setCurrentNote] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [total, setTotal] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextNote = useCallback(() => {
    setCurrentNote(NOTE_SCALE[Math.floor(Math.random() * NOTE_SCALE.length)]);
    setFeedback('idle');
  }, []);

  const startGame = () => {
    setScore(0);
    setTotal(0);
    setTimeLeft(30);
    setPhase('playing');
    nextNote();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleAnswer = (num: number) => {
    if (feedback !== 'idle') return;
    const correctNum = NOTE_SCALE.indexOf(currentNote) + 1;
    const isCorrect = num === correctNum;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(nextNote, 500);
  };

  if (phase === 'ready') return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6 text-center">
      <p className="text-[#888888]">A note letter flashes. Pick its number in the C major scale (C=1, D=2… B=7). You have 30 seconds!</p>
      <button onClick={startGame} className="px-8 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">Start Game</button>
    </div>
  );

  if (phase === 'done') return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
      <div className="text-6xl">{score >= total * 0.8 ? '🏆' : '💪'}</div>
      <div className="text-center">
        <p className="text-4xl font-black text-[#C9A84C]">{score}/{total}</p>
        <p className="text-[#888888] mt-1">correct answers in 30 seconds</p>
      </div>
      <div className="flex gap-3">
        <button onClick={startGame} className="px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">
          <RotateCcw className="inline w-4 h-4 mr-1" />Play Again
        </button>
        <button onClick={onBack} className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl font-medium hover:bg-[#2a2a2a]">
          <ArrowLeft className="inline w-4 h-4 mr-1" />Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex justify-between text-sm text-[#888888] mb-4">
        <span className="text-[#C9A84C] font-bold">{score}/{total} correct</span>
        <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : ''}`}>{timeLeft}s</span>
      </div>
      <div className={`text-center py-12 rounded-2xl mb-6 border transition-colors ${
        feedback === 'correct' ? 'bg-emerald-500/10 border-emerald-500/40' :
        feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' :
        'bg-[#1a1a1a] border-[#2a2a2a]'
      }`}>
        <p className="text-9xl font-black text-[#C9A84C]">{currentNote}</p>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
          <button key={n} onClick={() => handleAnswer(n)} className="py-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] text-white font-bold hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/10 transition-all text-lg">
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Game 5: Major or Minor? ──────────────────────────────────────────────────

const MAJOR_MINOR_ROUNDS = [
  { desc: 'Bright and happy sounding, like a sunny day', answer: 'Major' },
  { desc: 'Sad and introspective, like a rainy afternoon', answer: 'Minor' },
  { desc: 'Uses root + 4 semitones + 3 semitones', answer: 'Major' },
  { desc: 'Uses root + 3 semitones + 4 semitones', answer: 'Minor' },
  { desc: 'The chord C – E – G', answer: 'Major' },
  { desc: 'The chord A – C – E', answer: 'Minor' },
  { desc: 'Happy birthday song quality', answer: 'Major' },
  { desc: 'The chord D – F – A', answer: 'Minor' },
  { desc: 'The chord G – B – D', answer: 'Major' },
  { desc: 'Dark and tense, often used in horror films', answer: 'Minor' },
];

function MajorOrMinorGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [done, setDone] = useState(false);

  const handlePick = (pick: 'Major' | 'Minor') => {
    if (feedback !== 'idle') return;
    const isCorrect = pick === MAJOR_MINOR_ROUNDS[round].answer;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (round + 1 >= MAJOR_MINOR_ROUNDS.length) { setDone(true); return; }
      setRound(r => r + 1);
      setFeedback('idle');
    }, 800);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
      <div className="text-6xl">{score >= 8 ? '🏆' : '💪'}</div>
      <div className="text-center">
        <p className="text-4xl font-black text-[#C9A84C]">{score}/{MAJOR_MINOR_ROUNDS.length}</p>
        <p className="text-[#888888] mt-1">correct</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => { setRound(0); setScore(0); setFeedback('idle'); setDone(false); }} className="px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">
          <RotateCcw className="inline w-4 h-4 mr-1" />Again
        </button>
        <button onClick={onBack} className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl hover:bg-[#2a2a2a]">
          <ArrowLeft className="inline w-4 h-4 mr-1" />Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex justify-between text-sm text-[#888888] mb-4">
        <span>Round {round + 1}/{MAJOR_MINOR_ROUNDS.length}</span>
        <span className="text-[#C9A84C] font-bold">Score: {score}</span>
      </div>
      <div className={`text-center p-8 rounded-2xl mb-8 border transition-colors ${
        feedback === 'correct' ? 'bg-emerald-500/10 border-emerald-500/40' :
        feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' :
        'bg-[#1a1a1a] border-[#2a2a2a]'
      }`}>
        <p className="text-[#888888] text-sm mb-2">This chord/scale sounds like…</p>
        <p className="text-white font-medium text-lg leading-relaxed">{MAJOR_MINOR_ROUNDS[round].desc}</p>
        {feedback !== 'idle' && (
          <p className={`text-sm font-bold mt-3 ${feedback === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
            {feedback === 'correct' ? '✓ Correct!' : `✗ It's ${MAJOR_MINOR_ROUNDS[round].answer}`}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {(['Major', 'Minor'] as const).map(opt => (
          <button key={opt} onClick={() => handlePick(opt)} disabled={feedback !== 'idle'}
            className={`py-6 rounded-2xl text-xl font-black border transition-all ${
              opt === 'Major'
                ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400 hover:bg-yellow-500/30'
                : 'bg-purple-500/20 border-purple-500/40 text-purple-400 hover:bg-purple-500/30'
            } disabled:opacity-50`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Game 6: Finger Number Race ───────────────────────────────────────────────

function FingerNumberRaceGame({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [target, setTarget] = useState(1);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextRound = useCallback(() => {
    setTarget(Math.ceil(Math.random() * 5));
    setFeedback('idle');
  }, []);

  const startGame = () => {
    setScore(0); setTotal(0); setTimeLeft(15); setPhase('playing');
    nextRound();
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleClick = (n: number) => {
    if (feedback !== 'idle') return;
    const isCorrect = n === target;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTotal(t => t + 1);
    if (isCorrect) setScore(s => s + 1);
    setTimeout(nextRound, 400);
  };

  const fingerLabels = ['Thumb\n1', 'Index\n2', 'Middle\n3', 'Ring\n4', 'Pinky\n5'];

  if (phase === 'ready') return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6 text-center">
      <p className="text-[#888888]">A finger number flashes. Click the correct finger as fast as you can! 15 seconds.</p>
      <button onClick={startGame} className="px-8 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">Start!</button>
    </div>
  );

  if (phase === 'done') return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
      <div className="text-6xl">{score >= total * 0.8 ? '🏆' : '💪'}</div>
      <p className="text-4xl font-black text-[#C9A84C]">{score}/{total}</p>
      <div className="flex gap-3">
        <button onClick={startGame} className="px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">
          <RotateCcw className="inline w-4 h-4 mr-1" />Again
        </button>
        <button onClick={onBack} className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl hover:bg-[#2a2a2a]">
          <ArrowLeft className="inline w-4 h-4 mr-1" />Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex justify-between text-sm mb-4">
        <span className="text-[#C9A84C] font-bold">{score}/{total}</span>
        <span className={`font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-[#888888]'}`}>{timeLeft}s</span>
      </div>
      <div className={`text-center py-10 rounded-2xl mb-6 border ${
        feedback === 'correct' ? 'bg-emerald-500/10 border-emerald-500/40' :
        feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' :
        'bg-[#1a1a1a] border-[#2a2a2a]'
      }`}>
        <p className="text-[#888888] text-sm mb-2">Click finger number:</p>
        <p className="text-9xl font-black text-[#C9A84C]">{target}</p>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => handleClick(n)}
            className="flex flex-col items-center py-4 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/10 transition-all">
            <div className="w-10 h-10 rounded-full border-2 border-[#C9A84C]/60 flex items-center justify-center text-[#C9A84C] font-black text-lg mb-1">{n}</div>
            <span className="text-[9px] text-[#555555] leading-tight text-center whitespace-pre">{fingerLabels[n - 1]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Game 7: Rhythm Clapper ───────────────────────────────────────────────────

const RHYTHM_PATTERNS = [
  [true, false, true, false],
  [true, true, false, true],
  [false, true, true, false],
  [true, false, false, true],
  [true, true, true, false],
];

function RhythmClapperGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState(0);
  const [pattern] = useState(() => RHYTHM_PATTERNS);
  const [userPattern, setUserPattern] = useState<boolean[]>([false, false, false, false]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [done, setDone] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggle = (i: number) => {
    if (submitted) return;
    setUserPattern(prev => { const n = [...prev]; n[i] = !n[i]; return n; });
  };

  const checkRound = () => {
    setSubmitted(true);
    const correct = pattern[round];
    const isCorrect = correct.every((v, i) => v === userPattern[i]);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (round + 1 >= pattern.length) { setDone(true); return; }
      setRound(r => r + 1);
      setUserPattern([false, false, false, false]);
      setFeedback('idle');
      setSubmitted(false);
    }, 900);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
      <div className="text-6xl">{score >= 4 ? '🏆' : '💪'}</div>
      <p className="text-4xl font-black text-[#C9A84C]">{score}/{pattern.length}</p>
      <div className="flex gap-3">
        <button onClick={() => { setRound(0); setScore(0); setUserPattern([false,false,false,false]); setFeedback('idle'); setDone(false); setSubmitted(false); }} className="px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">
          <RotateCcw className="inline w-4 h-4 mr-1" />Again
        </button>
        <button onClick={onBack} className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl hover:bg-[#2a2a2a]">
          <ArrowLeft className="inline w-4 h-4 mr-1" />Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex justify-between text-sm mb-4">
        <span className="text-[#888888]">Round {round + 1}/{pattern.length}</span>
        <span className="text-[#C9A84C] font-bold">Score: {score}</span>
      </div>
      <div className="p-5 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] mb-4">
        <p className="text-xs text-[#888888] mb-3">Match this pattern (● = clap, ○ = rest):</p>
        <div className="flex justify-center gap-4">
          {pattern[round].map((beat, i) => (
            <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 ${beat ? 'bg-[#C9A84C]/20 border-[#C9A84C] text-[#C9A84C]' : 'bg-[#111111] border-[#333333] text-[#333333]'}`}>
              {beat ? '●' : '○'}
            </div>
          ))}
        </div>
      </div>
      <div className={`p-5 rounded-2xl border mb-5 transition-colors ${
        feedback === 'correct' ? 'bg-emerald-500/10 border-emerald-500/40' :
        feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' :
        'bg-[#111111] border-[#2a2a2a]'
      }`}>
        <p className="text-xs text-[#888888] mb-3">Your pattern (click to toggle):</p>
        <div className="flex justify-center gap-4">
          {userPattern.map((beat, i) => (
            <button key={i} onClick={() => toggle(i)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 transition-all ${beat ? 'bg-[#C9A84C]/20 border-[#C9A84C] text-[#C9A84C]' : 'bg-[#1a1a1a] border-[#444444] text-[#444444] hover:border-[#888888]'}`}>
              {beat ? '●' : '○'}
            </button>
          ))}
        </div>
      </div>
      {feedback !== 'idle' && (
        <p className={`text-center text-sm font-semibold mb-3 ${feedback === 'correct' ? 'text-emerald-400' : 'text-red-400'}`}>
          {feedback === 'correct' ? '✓ Perfect match!' : '✗ Not quite — try again next round'}
        </p>
      )}
      <button onClick={checkRound} disabled={submitted} className="w-full py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a] transition-colors disabled:opacity-40">
        Check Pattern
      </button>
    </div>
  );
}

// ─── Game 8: Interval Quiz ────────────────────────────────────────────────────

const INTERVAL_QUESTIONS = [
  { from: 'C', to: 'E', answer: '3rd' },
  { from: 'C', to: 'G', answer: '5th' },
  { from: 'D', to: 'A', answer: '5th' },
  { from: 'E', to: 'B', answer: '5th' },
  { from: 'C', to: 'F', answer: '4th' },
  { from: 'A', to: 'G', answer: '7th' },
  { from: 'C', to: 'C', answer: 'Octave' },
  { from: 'D', to: 'E', answer: '2nd' },
];
const INTERVAL_OPTS = ['2nd', '3rd', '4th', '5th', '6th', '7th', 'Octave'];

function IntervalQuizGame({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const q = INTERVAL_QUESTIONS[current];

  const handlePick = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= INTERVAL_QUESTIONS.length) { setDone(true); return; }
      setCurrent(c => c + 1);
      setSelected(null);
    }, 800);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
      <div className="text-6xl">{score >= 7 ? '🏆' : '💪'}</div>
      <p className="text-4xl font-black text-[#C9A84C]">{score}/{INTERVAL_QUESTIONS.length}</p>
      <div className="flex gap-3">
        <button onClick={() => { setCurrent(0); setScore(0); setSelected(null); setDone(false); }} className="px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">
          <RotateCcw className="inline w-4 h-4 mr-1" />Again
        </button>
        <button onClick={onBack} className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl hover:bg-[#2a2a2a]">
          <ArrowLeft className="inline w-4 h-4 mr-1" />Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex justify-between text-sm mb-4">
        <span className="text-[#888888]">Q{current + 1}/{INTERVAL_QUESTIONS.length}</span>
        <span className="text-[#C9A84C] font-bold">Score: {score}</span>
      </div>
      <div className="text-center py-10 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] mb-6">
        <p className="text-[#888888] text-sm mb-3">What interval is:</p>
        <p className="text-5xl font-black text-[#C9A84C]">{q.from} → {q.to}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {INTERVAL_OPTS.map(opt => {
          let cls = 'py-3 rounded-xl border text-sm font-semibold transition-all ';
          if (!selected) cls += 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#C9A84C]/50';
          else if (opt === q.answer) cls += 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
          else if (opt === selected) cls += 'bg-red-500/20 border-red-500/50 text-red-400';
          else cls += 'bg-[#1a1a1a] border-[#2a2a2a] text-[#555555]';
          return <button key={opt} className={cls} onClick={() => handlePick(opt)}>{opt}</button>;
        })}
      </div>
    </div>
  );
}

// ─── Game 9: Key Signature Quiz ───────────────────────────────────────────────

const KEY_SIG_QUESTIONS = [
  { key: 'C major', answer: '0 sharps/flats', opts: ['0 sharps/flats', '1 sharp', '2 sharps', '1 flat'] },
  { key: 'G major', answer: '1 sharp', opts: ['0 sharps/flats', '1 sharp', '2 sharps', '1 flat'] },
  { key: 'D major', answer: '2 sharps', opts: ['1 sharp', '2 sharps', '3 sharps', '2 flats'] },
  { key: 'A major', answer: '3 sharps', opts: ['2 sharps', '3 sharps', '4 sharps', '1 flat'] },
  { key: 'F major', answer: '1 flat', opts: ['0 sharps/flats', '1 sharp', '1 flat', '2 flats'] },
  { key: 'Bb major', answer: '2 flats', opts: ['1 flat', '2 flats', '3 flats', '1 sharp'] },
  { key: 'Eb major', answer: '3 flats', opts: ['2 flats', '3 flats', '4 flats', '2 sharps'] },
  { key: 'A minor', answer: '0 sharps/flats', opts: ['0 sharps/flats', '1 sharp', '1 flat', '2 sharps'] },
];

function KeySigQuizGame({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const q = KEY_SIG_QUESTIONS[current];

  const handlePick = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= KEY_SIG_QUESTIONS.length) { setDone(true); return; }
      setCurrent(c => c + 1);
      setSelected(null);
    }, 800);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
      <div className="text-6xl">{score >= 7 ? '🏆' : '💪'}</div>
      <p className="text-4xl font-black text-[#C9A84C]">{score}/{KEY_SIG_QUESTIONS.length}</p>
      <div className="flex gap-3">
        <button onClick={() => { setCurrent(0); setScore(0); setSelected(null); setDone(false); }} className="px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">
          <RotateCcw className="inline w-4 h-4 mr-1" />Again
        </button>
        <button onClick={onBack} className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl hover:bg-[#2a2a2a]">
          <ArrowLeft className="inline w-4 h-4 mr-1" />Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex justify-between text-sm mb-4">
        <span className="text-[#888888]">Q{current + 1}/{KEY_SIG_QUESTIONS.length}</span>
        <span className="text-[#C9A84C] font-bold">Score: {score}</span>
      </div>
      <div className="text-center py-10 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] mb-6">
        <p className="text-[#888888] text-sm mb-3">How many sharps or flats in:</p>
        <p className="text-5xl font-black text-[#C9A84C]">{q.key}</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {q.opts.map(opt => {
          let cls = 'py-3 rounded-xl border text-sm font-semibold transition-all ';
          if (!selected) cls += 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#C9A84C]/50';
          else if (opt === q.answer) cls += 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
          else if (opt === selected) cls += 'bg-red-500/20 border-red-500/50 text-red-400';
          else cls += 'bg-[#1a1a1a] border-[#2a2a2a] text-[#555555]';
          return <button key={opt} className={cls} onClick={() => handlePick(opt)}>{opt}</button>;
        })}
      </div>
    </div>
  );
}

// ─── Game 10: Solfège Flashcard ───────────────────────────────────────────────

const SOLFEGE_DATA = [
  { syllable: 'Do', note: 'C' },
  { syllable: 'Re', note: 'D' },
  { syllable: 'Mi', note: 'E' },
  { syllable: 'Fa', note: 'F' },
  { syllable: 'Sol', note: 'G' },
  { syllable: 'La', note: 'A' },
  { syllable: 'Si', note: 'B' },
];

function SolfegeFlashcardGame({ onBack }: { onBack: () => void }) {
  const [queue] = useState(() => [...Array(10)].map(() => SOLFEGE_DATA[Math.floor(Math.random() * SOLFEGE_DATA.length)]));
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const current = queue[round];

  const handlePick = (note: string) => {
    if (selected) return;
    setSelected(note);
    if (note === current.note) setScore(s => s + 1);
    setTimeout(() => {
      if (round + 1 >= queue.length) { setDone(true); return; }
      setRound(r => r + 1);
      setSelected(null);
    }, 700);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
      <div className="text-6xl">{score >= 9 ? '🏆' : '💪'}</div>
      <p className="text-4xl font-black text-[#C9A84C]">{score}/{queue.length}</p>
      <div className="flex gap-3">
        <button onClick={onBack} className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl hover:bg-[#2a2a2a]">
          <ArrowLeft className="inline w-4 h-4 mr-1" />Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex justify-between text-sm mb-4">
        <span className="text-[#888888]">Round {round + 1}/{queue.length}</span>
        <span className="text-[#C9A84C] font-bold">Score: {score}</span>
      </div>
      <div className="text-center py-12 bg-[#1a1a1a] rounded-2xl border border-[#2a2a2a] mb-6">
        <p className="text-[#888888] text-sm mb-2">This solfège syllable is:</p>
        <p className="text-8xl font-black text-[#C9A84C]">{current.syllable}</p>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(note => {
          let cls = 'py-3 rounded-xl border text-sm font-bold transition-all ';
          if (!selected) cls += 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#C9A84C]/50';
          else if (note === current.note) cls += 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
          else if (note === selected) cls += 'bg-red-500/20 border-red-500/50 text-red-400';
          else cls += 'bg-[#1a1a1a] border-[#2a2a2a] text-[#555555]';
          return <button key={note} className={cls} onClick={() => handlePick(note)}>{note}</button>;
        })}
      </div>
    </div>
  );
}

// ─── Game 11: Chord Builder ───────────────────────────────────────────────────

const CHORD_BUILDER_QUESTIONS = [
  { root: 'C', quality: 'Major', semitones: [0, 4, 7] },
  { root: 'G', quality: 'Major', semitones: [7, 11, 2] },
  { root: 'D', quality: 'Minor', semitones: [2, 5, 9] },
  { root: 'A', quality: 'Minor', semitones: [9, 0, 4] },
  { root: 'F', quality: 'Major', semitones: [5, 9, 0] },
];

function ChordBuilderGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = CHORD_BUILDER_QUESTIONS[round];

  const toggle = (idx: number) => {
    if (feedback !== 'idle') return;
    setSelected(prev => prev.includes(idx) ? prev.filter(n => n !== idx) : prev.length < 3 ? [...prev, idx] : prev);
  };

  const check = () => {
    const correct = [...q.semitones].sort((a, b) => a - b);
    const userSorted = [...selected].sort((a, b) => a - b);
    const isCorrect = correct.join(',') === userSorted.join(',');
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => {
      if (round + 1 >= CHORD_BUILDER_QUESTIONS.length) { setDone(true); return; }
      setRound(r => r + 1);
      setSelected([]);
      setFeedback('idle');
    }, 900);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
      <div className="text-6xl">{score >= 4 ? '🏆' : '💪'}</div>
      <p className="text-4xl font-black text-[#C9A84C]">{score}/{CHORD_BUILDER_QUESTIONS.length}</p>
      <div className="flex gap-3">
        <button onClick={() => { setRound(0); setScore(0); setSelected([]); setFeedback('idle'); setDone(false); }} className="px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">
          <RotateCcw className="inline w-4 h-4 mr-1" />Again
        </button>
        <button onClick={onBack} className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl hover:bg-[#2a2a2a]">
          <ArrowLeft className="inline w-4 h-4 mr-1" />Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between text-sm mb-4">
        <span className="text-[#888888]">Round {round + 1}/{CHORD_BUILDER_QUESTIONS.length}</span>
        <span className="text-[#C9A84C] font-bold">Score: {score}</span>
      </div>
      <div className={`text-center py-6 rounded-2xl border mb-4 transition-colors ${
        feedback === 'correct' ? 'bg-emerald-500/10 border-emerald-500/40' :
        feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' :
        'bg-[#1a1a1a] border-[#2a2a2a]'
      }`}>
        <p className="text-[#888888] text-sm mb-1">Build this chord (pick 3 notes):</p>
        <p className="text-4xl font-black text-[#C9A84C]">{q.root} {q.quality}</p>
        {feedback === 'correct' && <p className="text-emerald-400 text-sm mt-2">✓ Correct!</p>}
        {feedback === 'wrong' && <p className="text-red-400 text-sm mt-2">Not quite — correct: {q.semitones.map(s => NOTE_NAMES[s]).join(' – ')}</p>}
      </div>
      <div className="grid grid-cols-6 gap-2 mb-5">
        {NOTE_NAMES.map((note, idx) => (
          <button key={idx} onClick={() => toggle(idx)}
            className={`py-3 rounded-xl text-xs font-bold border transition-all ${
              selected.includes(idx)
                ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                : 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#C9A84C]/50'
            } ${note.includes('#') ? 'text-[10px]' : ''}`}
          >
            {note}
          </button>
        ))}
      </div>
      <p className="text-xs text-[#888888] text-center mb-3">Major = +4 +3 semitones &nbsp;|&nbsp; Minor = +3 +4 semitones from root</p>
      <button onClick={check} disabled={selected.length !== 3 || feedback !== 'idle'}
        className="w-full py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a] disabled:opacity-40">
        Check Chord
      </button>
    </div>
  );
}

// ─── Game 12: Speed Note Race ─────────────────────────────────────────────────

const STAFF_NOTES = [
  { desc: 'Treble Line 1 (bottom)', note: 'E' },
  { desc: 'Treble Space 1', note: 'F' },
  { desc: 'Treble Line 2', note: 'G' },
  { desc: 'Treble Space 2', note: 'A' },
  { desc: 'Treble Line 3 (middle)', note: 'B' },
  { desc: 'Treble Space 3', note: 'C' },
  { desc: 'Treble Line 4', note: 'D' },
  { desc: 'Treble Space 4', note: 'E' },
  { desc: 'Treble Line 5 (top)', note: 'F' },
  { desc: 'Bass Line 1 (bottom)', note: 'G' },
  { desc: 'Bass Space 1', note: 'A' },
  { desc: 'Bass Line 2', note: 'B' },
  { desc: 'Bass Space 2', note: 'C' },
  { desc: 'Bass Line 3 (middle)', note: 'D' },
];

function SpeedNoteRaceGame({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'playing' | 'done'>('ready');
  const [queue] = useState(() => [...Array(30)].map(() => STAFF_NOTES[Math.floor(Math.random() * STAFF_NOTES.length)]));
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [flash, setFlash] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startGame = () => {
    setIdx(0); setInput(''); setScore(0); setTimeLeft(60); setFlash('idle'); setPhase('playing');
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); setPhase('done'); return 0; }
        return t - 1;
      });
    }, 1000);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().trim();
    setInput(val);
    if (val.length === 1 && /^[A-G]$/.test(val)) {
      const isCorrect = val === queue[idx].note;
      setFlash(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) setScore(s => s + 1);
      setTimeout(() => {
        setIdx(i => Math.min(i + 1, queue.length - 1));
        setInput('');
        setFlash('idle');
        inputRef.current?.focus();
      }, 300);
    }
  };

  if (phase === 'ready') return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6 text-center">
      <p className="text-[#888888]">A staff position appears. Type the note name (A–G) as fast as you can! 60 seconds.</p>
      <button onClick={startGame} className="px-8 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">Start Race!</button>
    </div>
  );

  if (phase === 'done') return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
      <div className="text-6xl">{score >= 20 ? '🏆' : score >= 12 ? '🎯' : '💪'}</div>
      <div className="text-center">
        <p className="text-4xl font-black text-[#C9A84C]">{score}</p>
        <p className="text-[#888888] mt-1">correct in 60 seconds</p>
      </div>
      <div className="flex gap-3">
        <button onClick={startGame} className="px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">
          <RotateCcw className="inline w-4 h-4 mr-1" />Again
        </button>
        <button onClick={onBack} className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl hover:bg-[#2a2a2a]">
          <ArrowLeft className="inline w-4 h-4 mr-1" />Back
        </button>
      </div>
    </div>
  );

  const current = queue[Math.min(idx, queue.length - 1)];

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex justify-between text-sm mb-4">
        <span className="text-[#C9A84C] font-bold">{score} correct</span>
        <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-[#888888]'}`}>{timeLeft}s</span>
      </div>
      <div className="h-1.5 bg-[#2a2a2a] rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-[#C9A84C] rounded-full transition-all duration-1000" style={{ width: `${(timeLeft / 60) * 100}%` }} />
      </div>
      <div className={`text-center py-10 rounded-2xl border mb-6 transition-colors ${
        flash === 'correct' ? 'bg-emerald-500/10 border-emerald-500/40' :
        flash === 'wrong' ? 'bg-red-500/10 border-red-500/40' :
        'bg-[#1a1a1a] border-[#2a2a2a]'
      }`}>
        <p className="text-[#888888] text-sm mb-2">Name the note at:</p>
        <p className="text-2xl font-bold text-white">{current.desc}</p>
      </div>
      <input
        ref={inputRef}
        value={input}
        onChange={handleInput}
        maxLength={1}
        placeholder="Type note (A–G)…"
        className="w-full py-4 text-center text-xl font-bold bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-white placeholder-[#444] focus:outline-none focus:border-[#C9A84C]/50"
      />
    </div>
  );
}

// ─── Game 13: Music Trivia ────────────────────────────────────────────────────

const TRIVIA_QUESTIONS = [
  { q: 'How many symphonies did Beethoven write?', opts: ['7', '8', '9', '10'], a: 2 },
  { q: 'Which instrument has 88 keys?', opts: ['Organ', 'Piano', 'Harpsichord', 'Accordion'], a: 1 },
  { q: 'What does "a cappella" mean?', opts: ['Very fast', 'Without instruments', 'Softly', 'With strings'], a: 1 },
  { q: 'Who composed "Für Elise"?', opts: ['Mozart', 'Chopin', 'Beethoven', 'Bach'], a: 2 },
  { q: 'What is the lowest male singing voice called?', opts: ['Tenor', 'Baritone', 'Bass', 'Alto'], a: 2 },
  { q: 'How many strings does a standard guitar have?', opts: ['4', '5', '6', '7'], a: 2 },
  { q: 'Which time signature is "common time"?', opts: ['2/4', '3/4', '4/4', '6/8'], a: 2 },
  { q: 'What does "Da Capo" (D.C.) mean?', opts: ['From the middle', 'From the top', 'From the sign', 'To the end'], a: 1 },
];

function MusicTriviaGame({ onBack }: { onBack: () => void }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const q = TRIVIA_QUESTIONS[current];

  const handlePick = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.a) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= TRIVIA_QUESTIONS.length) { setDone(true); return; }
      setCurrent(c => c + 1);
      setSelected(null);
    }, 900);
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[350px] gap-6">
      <div className="text-6xl">{score >= 7 ? '🏆' : score >= 5 ? '🎯' : '💪'}</div>
      <div className="text-center">
        <p className="text-4xl font-black text-[#C9A84C]">{score}/{TRIVIA_QUESTIONS.length}</p>
        <p className="text-[#888888] mt-1">{score === 8 ? 'Music genius!' : score >= 6 ? 'Music buff!' : 'Keep learning!'}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => { setCurrent(0); setScore(0); setSelected(null); setDone(false); }} className="px-6 py-3 bg-[#C9A84C] text-black rounded-xl font-bold hover:bg-[#d4b56a]">
          <RotateCcw className="inline w-4 h-4 mr-1" />Again
        </button>
        <button onClick={onBack} className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-white rounded-xl hover:bg-[#2a2a2a]">
          <ArrowLeft className="inline w-4 h-4 mr-1" />Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between text-sm mb-3">
        <span className="text-[#888888]">Q{current + 1}/{TRIVIA_QUESTIONS.length}</span>
        <span className="text-[#C9A84C] font-bold">Score: {score}</span>
      </div>
      <div className="h-1.5 bg-[#2a2a2a] rounded-full mb-5">
        <div className="h-full bg-[#C9A84C] rounded-full transition-all" style={{ width: `${(current / TRIVIA_QUESTIONS.length) * 100}%` }} />
      </div>
      <p className="text-white font-medium text-base mb-5 leading-relaxed">{q.q}</p>
      <div className="space-y-2">
        {q.opts.map((opt, i) => {
          let cls = 'w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ';
          if (selected === null) cls += 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#C9A84C]/40';
          else if (i === q.a) cls += 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400';
          else if (i === selected) cls += 'bg-red-500/20 border-red-500/50 text-red-400';
          else cls += 'bg-[#1a1a1a] border-[#2a2a2a] text-[#555555]';
          return (
            <button key={i} className={cls} onClick={() => handlePick(i)}>
              <span className="font-bold text-[#888888] mr-2">{['A', 'B', 'C', 'D'][i]}.</span>{opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Game Router Component ────────────────────────────────────────────────────

function GamePlayer({ gameId, onBack }: { gameId: number; onBack: () => void }) {
  const game = INTERACTIVE_GAMES.find(g => g.id === gameId);

  return (
    <div style={{ background: '#0a0a0a' }} className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Game header */}
        <div className="flex items-center gap-3 mb-8">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-[#111111] border border-[#2a2a2a] text-[#888888] rounded-xl hover:text-white hover:border-[#444] transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Games
          </button>
          {game && (
            <div>
              <h2 className="text-white font-bold">{game.emoji} {game.title}</h2>
            </div>
          )}
        </div>

        {/* Game content */}
        {gameId === 1 && <ChordChallengeGame onBack={onBack} />}
        {gameId === 2 && <TheoryQuizGame onBack={onBack} />}
        {gameId === 3 && <ImprovDiceGame onBack={onBack} />}
        {gameId === 4 && <NoteNameFlashGame onBack={onBack} />}
        {gameId === 5 && <MajorOrMinorGame onBack={onBack} />}
        {gameId === 6 && <FingerNumberRaceGame onBack={onBack} />}
        {gameId === 7 && <RhythmClapperGame onBack={onBack} />}
        {gameId === 8 && <IntervalQuizGame onBack={onBack} />}
        {gameId === 9 && <KeySigQuizGame onBack={onBack} />}
        {gameId === 10 && <SolfegeFlashcardGame onBack={onBack} />}
        {gameId === 11 && <ChordBuilderGame onBack={onBack} />}
        {gameId === 12 && <SpeedNoteRaceGame onBack={onBack} />}
        {gameId === 13 && <MusicTriviaGame onBack={onBack} />}
      </div>
    </div>
  );
}

// ─── Main Games Page ──────────────────────────────────────────────────────────

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
  const [activeGameId, setActiveGameId] = useState<number | null>(null);

  // When a game is active, show the full game player
  if (activeGameId !== null) {
    return <GamePlayer gameId={activeGameId} onBack={() => setActiveGameId(null)} />;
  }

  const filtered = ALL_GAMES.filter(g => {
    const tabMatch =
      activeTab === 'All' ||
      (activeTab === 'Interactive' && g.type === 'interactive') ||
      (activeTab === 'Activity Cards' && g.type === 'activity');

    const diffMatch =
      difficultyFilter === 'All' ||
      g.difficulty === difficultyFilter;

    return tabMatch && diffMatch;
  });

  const interactiveCount = INTERACTIVE_GAMES.length;
  const activityCount = ACTIVITY_CARDS.length;

  return (
    <div style={{ background: '#0a0a0a' }} className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6">

        {/* Header */}
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-1">
            <Gamepad2 className="w-6 h-6 text-[#C9A84C]" />
            <h1 className="text-2xl sm:text-3xl font-black text-white">Games &amp; Activities</h1>
          </div>
          <p className="text-[#888888] text-sm">
            <span className="text-[#C9A84C] font-semibold">{interactiveCount} interactive</span>
            {' '}·{' '}
            <span className="text-white font-semibold">{activityCount} activity cards</span>
            {' '}·{' '}
            {ALL_GAMES.length} total
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(['All', 'Interactive', 'Activity Cards'] as FilterTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-[#C9A84C] text-black'
                  : 'bg-[#111111] border border-[#2a2a2a] text-[#888888] hover:text-white hover:border-[#444]'
              }`}
            >
              {tab}
              {tab === 'Interactive' && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-black/20 text-black' : 'bg-[#C9A84C]/20 text-[#C9A84C]'}`}>
                  {interactiveCount}
                </span>
              )}
              {tab === 'Activity Cards' && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-black/20 text-black' : 'bg-[#2a2a2a] text-[#888888]'}`}>
                  {activityCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Difficulty filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {(['All', 'Beginner', 'All Ages'] as DifficultyFilter[]).map(d => (
            <button
              key={d}
              onClick={() => setDifficultyFilter(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                difficultyFilter === d
                  ? d === 'Beginner' ? 'bg-emerald-500/30 border-emerald-500/60 text-emerald-300'
                    : d === 'All Ages' ? 'bg-blue-500/30 border-blue-500/60 text-blue-300'
                    : 'bg-[#C9A84C]/20 border-[#C9A84C]/50 text-[#C9A84C]'
                  : 'bg-[#111111] border-[#2a2a2a] text-[#555555] hover:text-white'
              }`}
            >
              {d === 'All' ? 'All Difficulties' : d}
            </button>
          ))}
        </div>

        {/* Count line */}
        {filtered.length > 0 && (
          <p className="text-xs text-[#555555] mb-5">Showing {filtered.length} of {ALL_GAMES.length} games</p>
        )}

        {/* Games grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Gamepad2 className="w-14 h-14 text-[#2a2a2a]" />
            <p className="text-[#555555]">No games match this filter combination.</p>
            <button onClick={() => { setActiveTab('All'); setDifficultyFilter('All'); }} className="text-[#C9A84C] text-sm hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(game => (
              <GameCard key={game.id} game={game} onPlay={setActiveGameId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Game Card ────────────────────────────────────────────────────────────────

function GameCard({ game, onPlay }: { game: GameEntry; onPlay: (id: number) => void }) {
  const isInteractive = game.type === 'interactive';

  return (
    <div
      className={`bg-[#111111] rounded-2xl border overflow-hidden flex flex-col transition-all hover:translate-y-[-2px] ${
        isInteractive
          ? 'border-[#C9A84C]/30 hover:border-[#C9A84C]/60'
          : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
      }`}
    >
      {/* Top accent bar for interactive */}
      {isInteractive && (
        <div className="h-0.5 bg-gradient-to-r from-[#C9A84C]/80 via-[#C9A84C] to-[#C9A84C]/80" />
      )}

      <div className="p-4 flex flex-col flex-1">
        {/* Emoji + badges row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-3xl leading-none">{game.emoji}</span>
          <div className="flex flex-col items-end gap-1.5">
            {isInteractive && (
              <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#C9A84C] font-bold">
                <Zap className="w-2.5 h-2.5" /> INTERACTIVE
              </span>
            )}
            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${DIFFICULTY_COLORS[game.difficulty]}`}>
              {game.difficulty}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm mb-1.5 leading-tight">{game.title}</h3>

        {/* Description */}
        <p className="text-[#888888] text-xs leading-relaxed mb-4 flex-1">{game.description}</p>

        {/* Bottom row: age badge + play button */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${AGE_COLORS[game.ageGroup]}`}>
            {AGE_LABELS[game.ageGroup]}
          </span>

          {isInteractive ? (
            <button
              onClick={() => onPlay(game.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A84C] text-black rounded-lg text-xs font-bold hover:bg-[#d4b56a] transition-colors"
            >
              <Star className="w-3 h-3" /> Play
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[#555555] text-[10px]">
              <Music className="w-3 h-3" />
              <span>Activity</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
