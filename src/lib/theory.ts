// ─── RÜVEL — Manual de Teoría (referencia bilingüe ES/EN) ───────────────────

// ── DATOS PARA EL PIANO INTERACTIVO ─────────────────────────────────────────
// Intervalos en semitonos desde la raíz.
export const CHORD_INTERVALS: { name: string; intervals: number[] }[] = [
  { name: 'Mayor', intervals: [0, 4, 7] },
  { name: 'Menor', intervals: [0, 3, 7] },
  { name: 'Disminuido', intervals: [0, 3, 6] },
  { name: 'Aumentado', intervals: [0, 4, 8] },
  { name: 'sus2', intervals: [0, 2, 7] },
  { name: 'sus4', intervals: [0, 5, 7] },
  { name: 'Séptima mayor (maj7)', intervals: [0, 4, 7, 11] },
  { name: 'Séptima menor (m7)', intervals: [0, 3, 7, 10] },
  { name: 'Séptima de dominante (7)', intervals: [0, 4, 7, 10] },
];

export const SCALE_INTERVALS: { name: string; intervals: number[] }[] = [
  { name: 'Mayor', intervals: [0, 2, 4, 5, 7, 9, 11, 12] },
  { name: 'Menor natural', intervals: [0, 2, 3, 5, 7, 8, 10, 12] },
  { name: 'Menor armónica', intervals: [0, 2, 3, 5, 7, 8, 11, 12] },
  { name: 'Pentatónica mayor', intervals: [0, 2, 4, 7, 9, 12] },
  { name: 'Pentatónica menor', intervals: [0, 3, 5, 7, 10, 12] },
  { name: 'Blues', intervals: [0, 3, 5, 6, 7, 10, 12] },
  { name: 'Cromática', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
];

// Nombres de notas raíz (Do4 = MIDI 60)
export const ROOT_NOTES: { name: string; midi: number }[] = [
  { name: 'Do', midi: 60 },
  { name: 'Do#', midi: 61 },
  { name: 'Re', midi: 62 },
  { name: 'Re#', midi: 63 },
  { name: 'Mi', midi: 64 },
  { name: 'Fa', midi: 65 },
  { name: 'Fa#', midi: 66 },
  { name: 'Sol', midi: 67 },
  { name: 'Sol#', midi: 68 },
  { name: 'La', midi: 69 },
  { name: 'La#', midi: 70 },
  { name: 'Si', midi: 71 },
];

// ── INTERVALOS ──────────────────────────────────────────────────────────────
export interface IntervalInfo {
  name: string;
  nameEn: string;
  short: string;
  semitones: number;
  sound: string;
  referenceSong: string;
}

export const INTERVALS: IntervalInfo[] = [
  { name: 'Unísono', nameEn: 'Unison', short: '1ª', semitones: 0, sound: 'La misma nota — sin distancia', referenceSong: 'Dos voces cantando lo mismo' },
  { name: 'Segunda menor', nameEn: 'Minor 2nd', short: '2ªm', semitones: 1, sound: 'Tenso, inquietante, choca', referenceSong: 'Tema de Tiburón (Jaws)' },
  { name: 'Segunda mayor', nameEn: 'Major 2nd', short: '2ªM', semitones: 2, sound: 'Paso natural, suave', referenceSong: 'Cumpleaños feliz (inicio)' },
  { name: 'Tercera menor', nameEn: 'Minor 3rd', short: '3ªm', semitones: 3, sound: 'Triste, melancólico', referenceSong: 'Greensleeves / "Hey Jude" (eh-eh-eh)' },
  { name: 'Tercera mayor', nameEn: 'Major 3rd', short: '3ªM', semitones: 4, sound: 'Alegre, brillante', referenceSong: 'When the Saints Go Marching In' },
  { name: 'Cuarta justa', nameEn: 'Perfect 4th', short: '4ªJ', semitones: 5, sound: 'Fuerte, estable, heroico', referenceSong: 'Here Comes the Bride' },
  { name: 'Tritono (4ª aumentada)', nameEn: 'Tritone', short: 'TT', semitones: 6, sound: 'Inestable, diabólico, tenso', referenceSong: 'The Simpsons ("The Simp-sons")' },
  { name: 'Quinta justa', nameEn: 'Perfect 5th', short: '5ªJ', semitones: 7, sound: 'Abierto, poderoso, épico', referenceSong: 'Star Wars (Tema principal)' },
  { name: 'Sexta menor', nameEn: 'Minor 6th', short: '6ªm', semitones: 8, sound: 'Nostálgico, anhelante', referenceSong: 'The Entertainer (Joplin)' },
  { name: 'Sexta mayor', nameEn: 'Major 6th', short: '6ªM', semitones: 9, sound: 'Dulce, esperanzador', referenceSong: 'My Bonnie Lies Over the Ocean' },
  { name: 'Séptima menor', nameEn: 'Minor 7th', short: '7ªm', semitones: 10, sound: 'Suave, jazzy, sin resolver', referenceSong: 'Star Trek (Tema)' },
  { name: 'Séptima mayor', nameEn: 'Major 7th', short: '7ªM', semitones: 11, sound: 'Soñador, tenso, brillante', referenceSong: 'Take On Me (a-ha, salto del coro)' },
  { name: 'Octava', nameEn: 'Octave', short: '8ª', semitones: 12, sound: 'La misma nota, más aguda — completo', referenceSong: 'Somewhere Over the Rainbow' },
];

// ── TIPOS DE ACORDES ────────────────────────────────────────────────────────
export interface ChordTypeInfo {
  name: string;
  symbol: string;
  formula: string;
  example: string;
  sound: string;
}

export const CHORD_TYPES: ChordTypeInfo[] = [
  { name: 'Mayor (Major)', symbol: 'C', formula: 'Raíz + 4 + 3 semitonos', example: 'Do-Mi-Sol (C-E-G)', sound: 'Brillante, alegre, estable' },
  { name: 'Menor (Minor)', symbol: 'Cm', formula: 'Raíz + 3 + 4 semitonos', example: 'Do-Mib-Sol (C-Eb-G)', sound: 'Triste, profundo, emotivo' },
  { name: 'Disminuido (Diminished)', symbol: 'C°', formula: 'Raíz + 3 + 3 semitonos', example: 'Do-Mib-Solb', sound: 'Tenso, dramático, inestable' },
  { name: 'Aumentado (Augmented)', symbol: 'C+', formula: 'Raíz + 4 + 4 semitonos', example: 'Do-Mi-Sol#', sound: 'Extraño, flotante, de ensueño' },
  { name: 'Suspendido 4 (sus4)', symbol: 'Csus4', formula: 'Raíz + 5 + 2 semitonos', example: 'Do-Fa-Sol', sound: 'Abierto, sin resolver, expectante' },
  { name: 'Suspendido 2 (sus2)', symbol: 'Csus2', formula: 'Raíz + 2 + 5 semitonos', example: 'Do-Re-Sol', sound: 'Fresco, ambiguo, aireado' },
  { name: 'Séptima mayor (maj7)', symbol: 'Cmaj7', formula: 'Mayor + 7ª mayor (raíz +4+3+4)', example: 'Do-Mi-Sol-Si', sound: 'Soñador, suave, hermoso (lo-fi)' },
  { name: 'Séptima menor (m7)', symbol: 'Cm7', formula: 'Menor + 7ª menor (raíz +3+4+3)', example: 'Do-Mib-Sol-Sib', sound: 'Suave, cool, jazzy (R&B)' },
  { name: 'Séptima de dominante (dom7)', symbol: 'C7', formula: 'Mayor + 7ª menor (raíz +4+3+3)', example: 'Do-Mi-Sol-Sib', sound: 'Tenso, "quiere resolver" (blues)' },
  { name: 'Séptima menor con 5ª bemol (m7b5)', symbol: 'Cm7♭5', formula: 'Disminuido + 7ª menor', example: 'Do-Mib-Solb-Sib', sound: 'Oscuro, jazzy, medio tono (ii del jazz)' },
  { name: 'Séptima disminuida (dim7)', symbol: 'C°7', formula: 'Disminuido + 7ª disminuida', example: 'Do-Mib-Solb-Sibb', sound: 'Máxima tensión, suspenso de cine' },
  { name: 'Novena agregada (add9)', symbol: 'Cadd9', formula: 'Mayor + la 9ª (la 2ª una octava arriba)', example: 'Do-Mi-Sol-Re', sound: 'Brillante, moderno, abierto (pop)' },
];

// ── ESCALAS ─────────────────────────────────────────────────────────────────
export interface ScaleInfo {
  name: string;
  formula: string;
  example: string;
  sound: string;
}

export const SCALES: ScaleInfo[] = [
  { name: 'Mayor (Major)', formula: 'T-T-S-T-T-T-S', example: 'Do-Re-Mi-Fa-Sol-La-Si-Do', sound: 'Alegre, brillante, completa' },
  { name: 'Menor natural (Natural Minor)', formula: 'T-S-T-T-S-T-T', example: 'La-Si-Do-Re-Mi-Fa-Sol-La', sound: 'Triste, oscura, melancólica' },
  { name: 'Menor armónica (Harmonic Minor)', formula: 'T-S-T-T-S-T+S-S', example: 'La-Si-Do-Re-Mi-Fa-Sol#-La', sound: 'Exótica, dramática, oriental/española' },
  { name: 'Menor melódica (Melodic Minor)', formula: 'T-S-T-T-T-T-S (subiendo)', example: 'La-Si-Do-Re-Mi-Fa#-Sol#-La', sound: 'Suave, sofisticada, jazz' },
  { name: 'Pentatónica mayor (Major Pentatonic)', formula: '5 notas: grados 1-2-3-5-6', example: 'Do-Re-Mi-Sol-La', sound: 'Alegre, sin notas "malas", folk' },
  { name: 'Pentatónica menor (Minor Pentatonic)', formula: '5 notas: grados 1-♭3-4-5-♭7', example: 'La-Do-Re-Mi-Sol', sound: 'Bluesy, rock, expresiva' },
  { name: 'Blues', formula: 'Pentatónica menor + la "blue note" (♭5)', example: 'La-Do-Re-Mib-Mi-Sol', sound: 'Blues, sucia, con actitud' },
  { name: 'Cromática (Chromatic)', formula: 'Los 12 semitonos seguidos', example: 'Do-Do#-Re-Re#-Mi-Fa...', sound: 'Tensa, deslizante, de transición' },
];

// ── MODOS ───────────────────────────────────────────────────────────────────
export interface ModeInfo {
  name: string;
  degree: number;
  exampleFromC: string;
  character: string;
  formula: string;
}

export const MODES: ModeInfo[] = [
  { name: 'Jónico (Ionian)', degree: 1, exampleFromC: 'Do a Do', character: 'Alegre — es la escala mayor', formula: 'La escala mayor' },
  { name: 'Dórico (Dorian)', degree: 2, exampleFromC: 'Re a Re', character: 'Cool, jazzy, esperanzador (menor "con luz")', formula: 'Menor con la 6ª elevada' },
  { name: 'Frigio (Phrygian)', degree: 3, exampleFromC: 'Mi a Mi', character: 'Oscuro, español, tenso', formula: 'Menor con la 2ª bajada' },
  { name: 'Lidio (Lydian)', degree: 4, exampleFromC: 'Fa a Fa', character: 'Mágico, de ensueño, espacial', formula: 'Mayor con la 4ª elevada' },
  { name: 'Mixolidio (Mixolydian)', degree: 5, exampleFromC: 'Sol a Sol', character: 'Bluesy, terrenal, de rock/funk', formula: 'Mayor con la 7ª bajada' },
  { name: 'Eólico (Aeolian)', degree: 6, exampleFromC: 'La a La', character: 'Triste — es la menor natural', formula: 'La escala menor natural' },
  { name: 'Locrio (Locrian)', degree: 7, exampleFromC: 'Si a Si', character: 'Inestable, inquietante (raro de usar)', formula: 'Menor con la 2ª y 5ª bajadas' },
];

// ── CÍRCULO DE QUINTAS ──────────────────────────────────────────────────────
export const CIRCLE_OF_FIFTHS = {
  sharpsOrder: ['Fa#', 'Do#', 'Sol#', 'Re#', 'La#', 'Mi#', 'Si#'],
  flatsOrder: ['Sib', 'Mib', 'Lab', 'Reb', 'Solb', 'Dob', 'Fab'],
  // Recorrido horario desde Do
  keys: [
    { key: 'Do', minor: 'La m', accidentals: '0 alteraciones' },
    { key: 'Sol', minor: 'Mi m', accidentals: '1 sostenido (Fa#)' },
    { key: 'Re', minor: 'Si m', accidentals: '2 sostenidos (Fa#, Do#)' },
    { key: 'La', minor: 'Fa# m', accidentals: '3 sostenidos' },
    { key: 'Mi', minor: 'Do# m', accidentals: '4 sostenidos' },
    { key: 'Si', minor: 'Sol# m', accidentals: '5 sostenidos' },
    { key: 'Fa#', minor: 'Re# m', accidentals: '6 sostenidos' },
    { key: 'Reb', minor: 'Sib m', accidentals: '5 bemoles' },
    { key: 'Lab', minor: 'Fa m', accidentals: '4 bemoles' },
    { key: 'Mib', minor: 'Do m', accidentals: '3 bemoles' },
    { key: 'Sib', minor: 'Sol m', accidentals: '2 bemoles (Sib, Mib)' },
    { key: 'Fa', minor: 'Re m', accidentals: '1 bemol (Sib)' },
  ],
};

// ── EMOCIÓN DE LAS TONALIDADES ──────────────────────────────────────────────
export interface KeyEmotionInfo {
  key: string;
  emotion: string;
}

export const KEY_EMOTIONS: KeyEmotionInfo[] = [
  { key: 'Do mayor', emotion: 'Puro, simple, inocente — la tonalidad "en blanco"' },
  { key: 'Sol mayor', emotion: 'Pastoral, calmado, alegre y sereno' },
  { key: 'Re mayor', emotion: 'Brillante, triunfal, festivo — música de victoria' },
  { key: 'La mayor', emotion: 'Confiado, luminoso, optimista' },
  { key: 'Mi mayor', emotion: 'Radiante, audaz, lleno de energía' },
  { key: 'Fa mayor', emotion: 'Cálido, pastoral, tranquilo y amable' },
  { key: 'Sib mayor', emotion: 'Noble, elegante, esperanzador' },
  { key: 'Mib mayor', emotion: 'Heroico, profundo, majestuoso' },
  { key: 'La menor', emotion: 'Introspectivo, natural, suavemente triste' },
  { key: 'Mi menor', emotion: 'Melancólico, pensativo, anhelante' },
  { key: 'Re menor', emotion: 'Solemne, serio — "la más triste de las tonalidades"' },
  { key: 'Do menor', emotion: 'Dramático, intenso, heroico-trágico' },
];

// ── PROGRESIONES COMUNES ────────────────────────────────────────────────────
export interface ProgressionInfo {
  name: string;
  numerals: string;
  exampleInC: string;
  usedIn: string;
}

export const PROGRESSIONS: ProgressionInfo[] = [
  { name: 'La progresión del pop', numerals: 'I - V - vi - IV', exampleInC: 'Do - Sol - Lam - Fa', usedIn: 'Cientos de éxitos: Let Her Go, Someone Like You' },
  { name: 'La progresión 50s / doo-wop', numerals: 'I - vi - IV - V', exampleInC: 'Do - Lam - Fa - Sol', usedIn: 'Stand By Me, Earth Angel' },
  { name: 'El ii-V-I del jazz', numerals: 'ii - V - I', exampleInC: 'Rem - Sol - Do', usedIn: 'La base del jazz: Autumn Leaves, Fly Me to the Moon' },
  { name: 'La progresión andaluza', numerals: 'i - ♭VII - ♭VI - V', exampleInC: 'Lam - Sol - Fa - Mi', usedIn: 'Flamenco, "Hit the Road Jack"' },
  { name: 'El blues de 12 compases', numerals: 'I - I - I - I - IV - IV - I - I - V - IV - I - V', exampleInC: 'Do7 ... Fa7 ... Sol7 ...', usedIn: 'Todo el blues y el primer rock & roll' },
  { name: 'Canon (Pachelbel)', numerals: 'I - V - vi - iii - IV - I - IV - V', exampleInC: 'Do-Sol-Lam-Mim-Fa-Do-Fa-Sol', usedIn: 'Canon en Re, "Basket Case", "Graduation"' },
];

// ── GLOSARIO BILINGÜE ───────────────────────────────────────────────────────
export interface GlossaryTerm {
  term: string;
  termEn: string;
  definition: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: 'Semitono', termEn: 'Semitone / Half step', definition: 'La distancia más pequeña entre dos teclas vecinas (incluyendo negras).' },
  { term: 'Tono', termEn: 'Whole step', definition: 'La distancia de dos semitonos.' },
  { term: 'Intervalo', termEn: 'Interval', definition: 'La distancia entre dos notas, medida en semitonos.' },
  { term: 'Acorde', termEn: 'Chord', definition: 'Tres o más notas tocadas a la vez.' },
  { term: 'Tríada', termEn: 'Triad', definition: 'Un acorde de tres notas (raíz, tercera y quinta).' },
  { term: 'Inversión', termEn: 'Inversion', definition: 'El mismo acorde con las notas reordenadas, otra nota en el bajo.' },
  { term: 'Escala', termEn: 'Scale', definition: 'Una secuencia ordenada de notas que sube hasta la octava.' },
  { term: 'Tónica', termEn: 'Tonic', definition: 'La primera nota de la escala — el "hogar" de la tonalidad.' },
  { term: 'Dominante', termEn: 'Dominant', definition: 'El quinto grado de la escala — crea tensión hacia la tónica.' },
  { term: 'Armadura', termEn: 'Key signature', definition: 'Los sostenidos o bemoles al inicio del pentagrama que definen la tonalidad.' },
  { term: 'Cadencia', termEn: 'Cadence', definition: 'Una secuencia de acordes que crea un punto de reposo — la puntuación musical.' },
  { term: 'Pulso', termEn: 'Pulse / Beat', definition: 'El latido constante y regular de la música.' },
  { term: 'Compás', termEn: 'Time signature / Bar', definition: 'La organización de los pulsos en grupos (4/4, 3/4, 6/8).' },
  { term: 'Legato', termEn: 'Legato', definition: 'Tocar las notas conectadas y suaves, sin separación.' },
  { term: 'Staccato', termEn: 'Staccato', definition: 'Tocar las notas cortas y separadas, "rebotando".' },
  { term: 'Dinámica', termEn: 'Dynamics', definition: 'El volumen de la música — de pianissimo (pp) a fortissimo (ff).' },
  { term: 'Modo', termEn: 'Mode', definition: 'Una escala que empieza desde un grado distinto de la escala mayor.' },
  { term: 'Transposición', termEn: 'Transposition', definition: 'Mover una pieza completa a otra tonalidad.' },
  { term: 'Pentatónica', termEn: 'Pentatonic', definition: 'Una escala de 5 notas, base de la improvisación.' },
  { term: 'Solfeo', termEn: 'Solfège', definition: 'El sistema Do-Re-Mi para nombrar y cantar las notas.' },
];
