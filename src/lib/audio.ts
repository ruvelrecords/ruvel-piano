// ─── RÜVEL — Motor de Audio (Web Audio API) ─────────────────────────────────
// Síntesis de un tono tipo piano con varios armónicos y envolvente.

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
  }
  return ctx;
}

// MIDI 69 = La4 = 440 Hz
export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

const NOTE_NAMES_EN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES_ES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

export function midiToNameEn(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES_EN[midi % 12]}${octave}`;
}

export function midiToNameEs(midi: number): string {
  return NOTE_NAMES_ES[midi % 12];
}

export function isBlackKey(midi: number): boolean {
  return [1, 3, 6, 8, 10].includes(midi % 12);
}

// Reproduce una nota con un tono tipo piano
export function playNote(midi: number, duration = 1.4, velocity = 0.32): void {
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === 'suspended') audio.resume();

  const now = audio.currentTime;
  const freq = midiToFreq(midi);

  const master = audio.createGain();
  master.connect(audio.destination);
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(velocity, now + 0.008);
  master.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  // Armónicos para un timbre más rico
  const partials: { ratio: number; gain: number; type: OscillatorType }[] = [
    { ratio: 1, gain: 1.0, type: 'triangle' },
    { ratio: 2, gain: 0.28, type: 'sine' },
    { ratio: 3, gain: 0.12, type: 'sine' },
    { ratio: 4, gain: 0.06, type: 'sine' },
  ];

  partials.forEach((p) => {
    const osc = audio.createOscillator();
    osc.type = p.type;
    osc.frequency.value = freq * p.ratio;
    const g = audio.createGain();
    g.gain.value = p.gain;
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  });
}

// Reproduce varias notas a la vez (un acorde)
export function playChord(midis: number[], duration = 1.8): void {
  midis.forEach((m) => playNote(m, duration, 0.24));
}

// Reproduce notas en secuencia (una escala o melodía)
export function playSequence(midis: number[], gapMs = 320, noteDuration = 0.9): void {
  midis.forEach((m, i) => {
    setTimeout(() => playNote(m, noteDuration), i * gapMs);
  });
}

// Reanuda el AudioContext (debe llamarse tras un gesto del usuario)
export function resumeAudio(): void {
  const audio = getCtx();
  if (audio && audio.state === 'suspended') audio.resume();
}

// Clic del metrónomo — acentuado en el tiempo 1
export function playClick(accent = false): void {
  const audio = getCtx();
  if (!audio) return;
  if (audio.state === 'suspended') audio.resume();
  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'square';
  osc.frequency.value = accent ? 1600 : 1000;
  gain.gain.setValueAtTime(accent ? 0.22 : 0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}
