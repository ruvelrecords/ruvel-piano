// ─── RÜVEL — Tutoriales curados por módulo ──────────────────────────────────
// Búsquedas en YouTube y MuseScore. NO usamos URLs específicas (los videos
// se eliminan) — usamos búsquedas que siempre devuelven resultados frescos.

export interface Tutorial {
  id: string;
  module: number;
  title: string;
  description: string;
  youtubeSearch: string;
  kind: 'tutorial' | 'theory' | 'exercise';
}

const yt = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

export const TUTORIALS: Tutorial[] = [
  // ─── M1 — Primer Contacto ────────────────────────────────────────────────
  { id: 't1_1', module: 1, kind: 'tutorial', title: 'Postura correcta al piano', description: 'Cómo sentarte, posición de manos y muñeca relajada', youtubeSearch: 'piano postura correcta principiantes' },
  { id: 't1_2', module: 1, kind: 'tutorial', title: 'Números de dedos 1-5', description: 'Aprende la digitación básica de ambas manos', youtubeSearch: 'piano numeros de dedos digitacion principiantes' },
  { id: 't1_3', module: 1, kind: 'tutorial', title: 'Encontrar Do en el teclado', description: 'La geografía del teclado y los grupos de teclas negras', youtubeSearch: 'como encontrar do piano teclado grupos teclas negras' },

  // ─── M2 — Acordes Mágicos ────────────────────────────────────────────────
  { id: 't2_1', module: 2, kind: 'tutorial', title: 'Los 4 acordes mágicos: Do Sol Lam Fa', description: 'La progresión que toca cientos de canciones', youtubeSearch: '4 acordes magicos piano do sol lam fa' },
  { id: 't2_2', module: 2, kind: 'tutorial', title: 'Fórmula del acorde mayor', description: 'Cómo construir cualquier acorde mayor', youtubeSearch: 'formula acorde mayor piano construccion' },
  { id: 't2_3', module: 2, kind: 'tutorial', title: 'Transiciones suaves entre acordes', description: 'Técnica para cambiar de acorde sin pausas', youtubeSearch: 'transiciones acordes piano suaves principiantes' },

  // ─── M3 — Ritmo y Groove ─────────────────────────────────────────────────
  { id: 't3_1', module: 3, kind: 'tutorial', title: 'Cómo usar el metrónomo', description: 'La herramienta más importante para el ritmo', youtubeSearch: 'como usar metronomo piano principiantes' },
  { id: 't3_2', module: 3, kind: 'tutorial', title: 'Patrones de mano izquierda básicos', description: 'Raíz-quinta y otros patrones simples', youtubeSearch: 'patrones mano izquierda piano principiantes raiz quinta' },
  { id: 't3_3', module: 3, kind: 'tutorial', title: 'Compás 4/4 explicado', description: 'Entiende el compás más común de la música pop', youtubeSearch: 'compas 4/4 piano explicacion ritmo' },

  // ─── M4 — Intervalos ─────────────────────────────────────────────────────
  { id: 't4_1', module: 4, kind: 'theory', title: 'Qué son los intervalos musicales', description: 'Segundas, terceras, quintas y octavas', youtubeSearch: 'intervalos musicales piano teoria' },
  { id: 't4_2', module: 4, kind: 'tutorial', title: 'Reconocer intervalos de oído', description: 'Asocia cada intervalo a una canción famosa', youtubeSearch: 'reconocer intervalos de oido canciones famosas' },

  // ─── M5 — La Escala Mayor ────────────────────────────────────────────────
  { id: 't5_1', module: 5, kind: 'theory', title: 'Fórmula de la escala mayor T-T-S-T-T-T-S', description: 'La regla universal para construir cualquier escala mayor', youtubeSearch: 'formula escala mayor piano tono semitono' },
  { id: 't5_2', module: 5, kind: 'tutorial', title: 'Digitación: paso del pulgar', description: 'Técnica para tocar escalas con fluidez', youtubeSearch: 'piano digitacion escalas paso del pulgar' },

  // ─── M6 — Mundo Mayor y Menor ────────────────────────────────────────────
  { id: 't6_1', module: 6, kind: 'theory', title: 'Diferencia entre acordes mayores y menores', description: 'Cómo el sonido cambia con un solo semitono', youtubeSearch: 'diferencia acordes mayores menores piano' },
  { id: 't6_2', module: 6, kind: 'tutorial', title: 'Los 12 acordes mayores y menores', description: 'Aprende a construir cualquier acorde tríada', youtubeSearch: '12 acordes mayores menores piano construccion' },

  // ─── M7 — Armaduras y Círculo de Quintas ─────────────────────────────────
  { id: 't7_1', module: 7, kind: 'theory', title: 'Círculo de Quintas explicado', description: 'El mapa maestro de todas las tonalidades', youtubeSearch: 'circulo de quintas piano explicacion completa' },
  { id: 't7_2', module: 7, kind: 'theory', title: 'Cómo leer armaduras (sostenidos y bemoles)', description: 'Identifica la tonalidad de una canción al instante', youtubeSearch: 'como leer armaduras piano sostenidos bemoles' },

  // ─── M8 — Inversiones y Voicings ─────────────────────────────────────────
  { id: 't8_1', module: 8, kind: 'tutorial', title: 'Inversiones de acordes explicadas', description: 'Posición fundamental, 1ª y 2ª inversión', youtubeSearch: 'inversiones acordes piano explicacion' },
  { id: 't8_2', module: 8, kind: 'tutorial', title: 'Conducción de voces (voice leading)', description: 'El truco para que los acordes suenen profesionales', youtubeSearch: 'voice leading piano conduccion voces' },

  // ─── M9 — Ambas Manos ────────────────────────────────────────────────────
  { id: 't9_1', module: 9, kind: 'tutorial', title: 'Cómo coordinar ambas manos', description: 'Técnica progresiva para principiantes', youtubeSearch: 'piano coordinacion ambas manos principiantes' },
  { id: 't9_2', module: 9, kind: 'exercise', title: 'Hanon ejercicio #1', description: 'El ejercicio clásico para independencia de dedos', youtubeSearch: 'hanon ejercicio 1 piano tutorial' },
  { id: 't9_3', module: 9, kind: 'exercise', title: 'Ejercicios de independencia de manos', description: 'Patrones simples para ganar coordinación', youtubeSearch: 'ejercicios independencia manos piano principiantes' },

  // ─── M10 — Lectura Musical ───────────────────────────────────────────────
  { id: 't10_1', module: 10, kind: 'theory', title: 'Cómo leer partituras desde cero', description: 'Clave de Sol, líneas y espacios', youtubeSearch: 'como leer partituras piano principiantes' },
  { id: 't10_2', module: 10, kind: 'theory', title: 'Clave de Fa para la mano izquierda', description: 'Aprende a leer el bajo', youtubeSearch: 'clave de fa piano mano izquierda principiantes' },
  { id: 't10_3', module: 10, kind: 'exercise', title: 'Lectura a primera vista — ejercicios', description: 'Práctica diaria para mejorar la lectura', youtubeSearch: 'lectura primera vista piano ejercicios' },

  // ─── M11 — Acordes de Séptima ────────────────────────────────────────────
  { id: 't11_1', module: 11, kind: 'theory', title: 'Acordes de séptima: maj7, m7, dom7', description: 'El color de la armonía jazz y soul', youtubeSearch: 'acordes de septima maj7 m7 dom7 piano' },
  { id: 't11_2', module: 11, kind: 'tutorial', title: 'Cómo usar acordes con color en el pop', description: 'Aplica séptimas y extensiones a canciones reales', youtubeSearch: 'acordes con color pop piano septimas extensiones' },

  // ─── M12 — Escalas Menores y Modos ───────────────────────────────────────
  { id: 't12_1', module: 12, kind: 'theory', title: 'Las 3 escalas menores explicadas', description: 'Natural, armónica y melódica', youtubeSearch: 'escalas menores piano natural armonica melodica' },
  { id: 't12_2', module: 12, kind: 'theory', title: 'Los 7 modos griegos en piano', description: 'Dórico, Frigio, Lidio, Mixolidio...', youtubeSearch: 'modos griegos piano dorico frigio lidio mixolidio' },

  // ─── M13 — Armonía y Progresiones ────────────────────────────────────────
  { id: 't13_1', module: 13, kind: 'theory', title: 'Números romanos en música', description: 'I-IV-V-vi y el lenguaje universal de la armonía', youtubeSearch: 'numeros romanos musica armonia piano' },
  { id: 't13_2', module: 13, kind: 'theory', title: 'Cadencias y resoluciones', description: 'Auténtica, plagal y rota — la puntuación musical', youtubeSearch: 'cadencias musicales autentica plagal piano' },

  // ─── M14 — Pedal, Dinámica y Expresión ───────────────────────────────────
  { id: 't14_1', module: 14, kind: 'tutorial', title: 'Cómo usar el pedal de resonancia', description: 'Técnica del pedal legato sincopado', youtubeSearch: 'pedal resonancia piano tecnica legato sincopado' },
  { id: 't14_2', module: 14, kind: 'tutorial', title: 'Dinámica: tocar fuerte y suave', description: 'Control del volumen y fraseo musical', youtubeSearch: 'dinamica piano fraseo musical principiantes' },

  // ─── M15 — Dominio de Canciones ──────────────────────────────────────────
  { id: 't15_1', module: 15, kind: 'tutorial', title: 'Cómo aprender una canción nueva', description: 'Método de práctica por secciones', youtubeSearch: 'como aprender cancion nueva piano metodo seccional' },
  { id: 't15_2', module: 15, kind: 'tutorial', title: 'Memorizar piezas largas', description: 'Técnicas efectivas para músicos', youtubeSearch: 'memorizar piezas piano tecnicas memorizacion' },

  // ─── M16 — Exprésate ─────────────────────────────────────────────────────
  { id: 't16_1', module: 16, kind: 'tutorial', title: 'Improvisar con la escala pentatónica', description: 'Empieza a crear tu propia música', youtubeSearch: 'improvisar piano escala pentatonica principiantes' },
  { id: 't16_2', module: 16, kind: 'tutorial', title: 'Componer melodías originales', description: 'Trucos para tu primera composición', youtubeSearch: 'componer melodias piano principiantes' },
];

export function getTutorialsForModule(moduleId: number): Tutorial[] {
  return TUTORIALS.filter((t) => t.module === moduleId);
}

export function getTutorialUrl(t: Tutorial): string {
  return yt(t.youtubeSearch);
}

// ─── Ejercicios Hanon clásicos (links rápidos) ──────────────────────────────
export const HANON_EXERCISES = [
  { num: 1, title: 'Hanon No. 1 — Preparación', description: '5 dedos sin pulgar bajo' },
  { num: 2, title: 'Hanon No. 2', description: 'Extensión de 4-5' },
  { num: 3, title: 'Hanon No. 3', description: 'Independencia 3-4' },
  { num: 4, title: 'Hanon No. 4', description: 'Articulación' },
  { num: 5, title: 'Hanon No. 5', description: 'Velocidad de 3-4-5' },
  { num: 20, title: 'Hanon No. 20', description: 'Trinos en 3-4' },
];

export function hanonUrl(num: number): string {
  return yt(`hanon ejercicio ${num} piano tutorial`);
}
