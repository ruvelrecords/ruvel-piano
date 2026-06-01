// ─── RÜVEL — Internacionalización (Español / Inglés) ───────────────────────
// Diccionario de strings del portal de estudiante + login.
// El idioma se guarda por dispositivo (no se sincroniza con la nube) para que
// cada estudiante elija el suyo. Default: el idioma del navegador.

export type Lang = 'es' | 'en';

export const LANG_STORAGE_KEY = 'ruvel_lang';

type Dict = Record<string, string>;

const es: Dict = {
  // Login
  loading: 'Cargando...',
  tab_teacher: 'Profesor',
  tab_student: 'Estudiante',
  username_teacher: 'Usuario',
  username_student: 'Tu Nombre / Usuario',
  password: 'Contraseña',
  pin_label: 'PIN de 4 dígitos',
  forgot_pin: '¿Olvidaste tu PIN? Contacta a tu profe.',
  remember_me: 'Recuérdame',
  err_username: 'Por favor ingresa tu usuario.',
  err_password: 'Por favor ingresa tu contraseña.',
  err_pin: 'Por favor ingresa tu PIN de 4 dígitos.',
  signing_in: 'Ingresando...',
  sign_in_teacher: 'Entrar como Profesor',
  enter_pin: 'Entrar con PIN',
  ph_teacher: 'profesor',
  ph_student: 'ej. luciana',

  // Top bar / general
  portal_subtitle: 'Portal del Estudiante',
  logout: 'Salir',
  logout_full: 'Cerrar sesión',
  guide_button: 'Guía',

  // Tabs
  tab_welcome: 'Inicio',
  tab_module: 'Módulo',
  tab_practice: 'Práctica',
  tab_songs: 'Canciones',
  tab_piano: 'Piano',
  tab_staff: 'Pentagrama',
  tab_games: 'Juegos',
  tab_tutorials: 'Tutoriales',
  tab_theory: 'Teoría',
  tab_classes: 'Clases',
  tab_homework: 'Tarea',
  tab_progress: 'Progreso',
  tab_contact: 'Contacto',

  // Welcome
  welcome_back: '¡Bienvenido de vuelta! 👋',
  stat_classes: 'Clases',
  stat_streak: 'Racha',
  current_module_label: 'Módulo Actual',
  next_class: 'Próxima Clase',
  explore_app: 'Explora tu app',
  sc_songs: '156 Canciones',
  sc_piano: 'Piano con sonido',
  sc_staff: 'Pentagrama',
  sc_games: 'Juegos',
  sc_tutorials: 'Tutoriales',
  sc_theory: 'Teoría',

  // Module
  module_heading: 'Módulo Actual 🎹',
  module_x_of: 'Módulo {id} de 16 · {phase}',
  est_duration: 'Duración estimada: {weeks}',
  what_learning: 'Lo que estás aprendiendo',
  my_goals: 'Mis metas — debo ser capaz de:',
  quiz_title: 'Quiz del Módulo {n}',
  quiz_desc: '{n} preguntas para poner a prueba lo que aprendiste.',
  best_result: 'Tu mejor resultado: {p}%',
  correct_of: '{score} de {total} correctas',
  retry_quiz: 'Volver a intentar',
  start_quiz: 'Empezar el quiz',
  next_module: '🔒 Próximo módulo',
  module_n_title: 'Módulo {id}: {title}',

  // Practice
  practice_heading: 'Mi Práctica 🎯',
  days_in_row: 'días seguidos',
  streak_0: '¡Empieza tu racha hoy!',
  streak_low: '¡Buen comienzo!',
  streak_mid: '¡Vas increíble!',
  streak_high: '¡Imparable! 🔥',
  total_practiced: '{min} min practicados en total',
  practiced_today: '✓ ¡Ya practicaste hoy!',
  log_practice: 'Registrar práctica (+15 min)',
  metronome: 'Metrónomo',
  hanon: 'Ejercicios Hanon',

  // Songs
  songs_heading: 'Canciones 🎵',
  songs_desc: '{n} canciones para tocar en piano. Filtra por tu módulo, dificultad o busca por nombre.',
  assigned_by_teacher: '⭐ Asignadas por tu profe',

  // Piano
  piano_heading: 'Piano Interactivo 🎼',
  piano_desc: 'Explora acordes, escalas y toca libre. Toca cualquier tecla para escucharla.',

  // Staff
  staff_heading: 'Pentagrama 🎶',
  staff_desc: 'Construye escalas, acordes y melodías en el pentagrama. Reprodúcelas para escucharlas.',

  // Games
  games_heading: 'Juegos 🎮',
  games_desc: 'Diviértete mientras entrenas tu oído y tu lectura musical.',
  game_chord: 'Acordes',
  game_chord_d: 'Identifica acordes de oído',
  game_rhythm: 'Ritmo',
  game_rhythm_d: 'Sigue el patrón a tiempo',
  game_memory: 'Memory',
  game_memory_d: 'Empareja notas y nombres',
  game_speed: 'Speed Reading',
  game_speed_d: 'Lee notas contra reloj',
  game_ear: 'Entrenador de Oído',
  game_ear_d: 'Intervalos y acordes',
  game_reading: 'Lectura básica',
  game_reading_d: 'Nombra notas del pentagrama',

  // Tutorials
  tutorials_heading: 'Tutoriales 📺',
  tutorials_desc: 'Videos curados de YouTube para tu módulo actual:',
  no_tutorials: 'No hay tutoriales específicos para este módulo todavía.',
  kind_theory: 'Teoría',
  kind_exercise: 'Ejercicio',
  kind_tutorial: 'Tutorial',

  // Theory
  theory_heading: 'Teoría 📚',
  theory_desc: 'Consulta rápida de los conceptos del método. Para más profundidad, mira los tutoriales o pregunta en clase.',

  // Classes
  back_to_classes: 'Volver a mis clases',
  what_we_worked: 'Lo que trabajamos',
  homework_label: 'Tarea',
  next_class_focus: 'Foco próxima clase',
  class_material: '📎 Material de la clase',
  classes_heading: 'Mis Clases 📅',
  upcoming: 'Próximas',
  upcoming_badge: 'Próxima',
  history: 'Historial ({n})',
  no_completed: 'Aún no hay clases completadas',
  materials_count: '📎 {n} material(es)',

  // Homework
  homework_heading: 'Mi Tarea 📝',
  last_homework: 'Última tarea — {date}',
  no_homework_assigned: 'Sin tarea asignada.',
  material_last_class: '📎 Material de la última clase',
  no_classes_homework: 'Aún no tienes clases. La tarea aparecerá aquí.',

  // Progress
  progress_heading: 'Mi Progreso ⭐',
  your_path: 'Tu camino',
  keys_earned: 'Llaves ganadas 🔑',
  no_keys: 'Completa tu primera clase para ganar tu primera llave.',

  // Contact
  contact_heading: 'Contacto 📞',
  whatsapp_msg: 'Mensaje por WhatsApp',
  talk_to_teacher: 'Habla con tu profe',

  // Modal titles
  m_ear: 'Entrenador de Oído',
  m_reading: 'Lectura básica',
  m_chord: 'Identificador de Acordes',
  m_rhythm: 'Juego de Ritmo',
  m_memory: 'Memory de Notas',
  m_speed: 'Speed Reading',
  m_quiz: 'Quiz — Módulo {n}',
};

const en: Dict = {
  // Login
  loading: 'Loading...',
  tab_teacher: 'Teacher',
  tab_student: 'Student',
  username_teacher: 'Username',
  username_student: 'Your Name / Username',
  password: 'Password',
  pin_label: '4-Digit PIN',
  forgot_pin: 'Forgot your PIN? Contact your teacher.',
  remember_me: 'Remember me',
  err_username: 'Please enter your username.',
  err_password: 'Please enter your password.',
  err_pin: 'Please enter your 4-digit PIN.',
  signing_in: 'Signing in...',
  sign_in_teacher: 'Sign In as Teacher',
  enter_pin: 'Enter with PIN',
  ph_teacher: 'teacher',
  ph_student: 'e.g. luciana',

  // Top bar / general
  portal_subtitle: 'Student Portal',
  logout: 'Log out',
  logout_full: 'Log out',
  guide_button: 'Guide',

  // Tabs
  tab_welcome: 'Home',
  tab_module: 'Module',
  tab_practice: 'Practice',
  tab_songs: 'Songs',
  tab_piano: 'Piano',
  tab_staff: 'Staff',
  tab_games: 'Games',
  tab_tutorials: 'Tutorials',
  tab_theory: 'Theory',
  tab_classes: 'Classes',
  tab_homework: 'Homework',
  tab_progress: 'Progress',
  tab_contact: 'Contact',

  // Welcome
  welcome_back: 'Welcome back! 👋',
  stat_classes: 'Classes',
  stat_streak: 'Streak',
  current_module_label: 'Current Module',
  next_class: 'Next Class',
  explore_app: 'Explore your app',
  sc_songs: '156 Songs',
  sc_piano: 'Piano with sound',
  sc_staff: 'Staff',
  sc_games: 'Games',
  sc_tutorials: 'Tutorials',
  sc_theory: 'Theory',

  // Module
  module_heading: 'Current Module 🎹',
  module_x_of: 'Module {id} of 16 · {phase}',
  est_duration: 'Estimated duration: {weeks}',
  what_learning: "What you're learning",
  my_goals: 'My goals — I should be able to:',
  quiz_title: 'Module {n} Quiz',
  quiz_desc: '{n} questions to test what you learned.',
  best_result: 'Your best result: {p}%',
  correct_of: '{score} of {total} correct',
  retry_quiz: 'Try again',
  start_quiz: 'Start the quiz',
  next_module: '🔒 Next module',
  module_n_title: 'Module {id}: {title}',

  // Practice
  practice_heading: 'My Practice 🎯',
  days_in_row: 'days in a row',
  streak_0: 'Start your streak today!',
  streak_low: 'Great start!',
  streak_mid: "You're doing amazing!",
  streak_high: 'Unstoppable! 🔥',
  total_practiced: '{min} min practiced in total',
  practiced_today: '✓ You already practiced today!',
  log_practice: 'Log practice (+15 min)',
  metronome: 'Metronome',
  hanon: 'Hanon Exercises',

  // Songs
  songs_heading: 'Songs 🎵',
  songs_desc: '{n} songs to play on piano. Filter by your module, difficulty, or search by name.',
  assigned_by_teacher: '⭐ Assigned by your teacher',

  // Piano
  piano_heading: 'Interactive Piano 🎼',
  piano_desc: 'Explore chords, scales and play freely. Tap any key to hear it.',

  // Staff
  staff_heading: 'Staff 🎶',
  staff_desc: 'Build scales, chords and melodies on the staff. Play them back to hear them.',

  // Games
  games_heading: 'Games 🎮',
  games_desc: 'Have fun while training your ear and your music reading.',
  game_chord: 'Chords',
  game_chord_d: 'Identify chords by ear',
  game_rhythm: 'Rhythm',
  game_rhythm_d: 'Follow the pattern in time',
  game_memory: 'Memory',
  game_memory_d: 'Match notes and names',
  game_speed: 'Speed Reading',
  game_speed_d: 'Read notes against the clock',
  game_ear: 'Ear Trainer',
  game_ear_d: 'Intervals and chords',
  game_reading: 'Basic Reading',
  game_reading_d: 'Name notes on the staff',

  // Tutorials
  tutorials_heading: 'Tutorials 📺',
  tutorials_desc: 'Curated YouTube videos for your current module:',
  no_tutorials: 'No specific tutorials for this module yet.',
  kind_theory: 'Theory',
  kind_exercise: 'Exercise',
  kind_tutorial: 'Tutorial',

  // Theory
  theory_heading: 'Theory 📚',
  theory_desc: "Quick reference of the method's concepts. For more depth, watch the tutorials or ask in class.",

  // Classes
  back_to_classes: 'Back to my classes',
  what_we_worked: 'What we worked on',
  homework_label: 'Homework',
  next_class_focus: 'Next class focus',
  class_material: '📎 Class material',
  classes_heading: 'My Classes 📅',
  upcoming: 'Upcoming',
  upcoming_badge: 'Upcoming',
  history: 'History ({n})',
  no_completed: 'No completed classes yet',
  materials_count: '📎 {n} material(s)',

  // Homework
  homework_heading: 'My Homework 📝',
  last_homework: 'Last homework — {date}',
  no_homework_assigned: 'No homework assigned.',
  material_last_class: '📎 Material from last class',
  no_classes_homework: 'You have no classes yet. Homework will appear here.',

  // Progress
  progress_heading: 'My Progress ⭐',
  your_path: 'Your path',
  keys_earned: 'Keys earned 🔑',
  no_keys: 'Complete your first class to earn your first key.',

  // Contact
  contact_heading: 'Contact 📞',
  whatsapp_msg: 'WhatsApp message',
  talk_to_teacher: 'Talk to your teacher',

  // Modal titles
  m_ear: 'Ear Trainer',
  m_reading: 'Basic Reading',
  m_chord: 'Chord Identifier',
  m_rhythm: 'Rhythm Game',
  m_memory: 'Note Memory',
  m_speed: 'Speed Reading',
  m_quiz: 'Quiz — Module {n}',
};

const DICTS: Record<Lang, Dict> = { es, en };

export function translate(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  let str = DICTS[lang][key] ?? DICTS.es[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return str;
}

export function detectLang(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

// ─── Glosario de términos de piano / teoría (ES ↔ EN) ──────────────────────
// Se muestra en la guía. Útil para enseñar en spanglish.
export const PIANO_GLOSSARY: { es: string; en: string }[] = [
  { es: 'Pentagrama', en: 'Staff' },
  { es: 'Clave de Sol', en: 'Treble clef' },
  { es: 'Clave de Fa', en: 'Bass clef' },
  { es: 'Nota', en: 'Note' },
  { es: 'Acorde', en: 'Chord' },
  { es: 'Escala', en: 'Scale' },
  { es: 'Tono / Tonalidad', en: 'Key' },
  { es: 'Compás', en: 'Measure / Bar' },
  { es: 'Cifra de compás', en: 'Time signature' },
  { es: 'Negra', en: 'Quarter note' },
  { es: 'Blanca', en: 'Half note' },
  { es: 'Redonda', en: 'Whole note' },
  { es: 'Corchea', en: 'Eighth note' },
  { es: 'Silencio', en: 'Rest' },
  { es: 'Sostenido (♯)', en: 'Sharp (♯)' },
  { es: 'Bemol (♭)', en: 'Flat (♭)' },
  { es: 'Becuadro (♮)', en: 'Natural (♮)' },
  { es: 'Tonо entero', en: 'Whole step / tone' },
  { es: 'Semitono', en: 'Half step / semitone' },
  { es: 'Intervalo', en: 'Interval' },
  { es: 'Mayor', en: 'Major' },
  { es: 'Menor', en: 'Minor' },
  { es: 'Tónica', en: 'Tonic / Root' },
  { es: 'Tempo', en: 'Tempo' },
  { es: 'Ritmo', en: 'Rhythm' },
  { es: 'Melodía', en: 'Melody' },
  { es: 'Armonía', en: 'Harmony' },
  { es: 'Mano derecha', en: 'Right hand' },
  { es: 'Mano izquierda', en: 'Left hand' },
  { es: 'Digitación', en: 'Fingering' },
  { es: 'Octava', en: 'Octave' },
  { es: 'Arpegio', en: 'Arpeggio' },
  { es: 'Ligadura', en: 'Slur / Tie' },
  { es: 'Pedal', en: 'Pedal' },
];

// Nombres de notas Do-Re-Mi ↔ C-D-E
export const NOTE_NAMES: { es: string; en: string }[] = [
  { es: 'Do', en: 'C' },
  { es: 'Re', en: 'D' },
  { es: 'Mi', en: 'E' },
  { es: 'Fa', en: 'F' },
  { es: 'Sol', en: 'G' },
  { es: 'La', en: 'A' },
  { es: 'Si', en: 'B' },
];
