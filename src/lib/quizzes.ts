// ─── RÜVEL — Quizzes por Módulo (autoevaluación bilingüe) ───────────────────

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number; // índice de la opción correcta
  explanation: string;
}

export interface ModuleQuiz {
  moduleId: number;
  questions: QuizQuestion[];
}

export const MODULE_QUIZZES: ModuleQuiz[] = [
  {
    moduleId: 1,
    questions: [
      { q: '¿Qué número de dedo es el pulgar?', options: ['1', '5', '3'], correct: 0, explanation: 'El pulgar es el dedo 1 en ambas manos.' },
      { q: '¿Dónde está la nota Do (C) respecto a las teclas negras?', options: ['A la derecha del grupo de 3 negras', 'A la izquierda del grupo de 2 negras', 'En el medio de las 3 negras'], correct: 1, explanation: 'El Do está justo a la izquierda del grupo de 2 teclas negras.' },
      { q: '¿Cuáles son los 3 puntos de la postura correcta?', options: ['Cabeza, codos, rodillas', 'Pies, espalda, muñecas', 'Hombros, dedos, pies'], correct: 1, explanation: 'La Regla de los 3 Puntos: pies, espalda y muñecas.' },
      { q: '¿Cómo deben estar los dedos al tocar?', options: ['Planos y estirados', 'Curvos, como sosteniendo un huevo', 'Rígidos'], correct: 1, explanation: 'Los dedos van curvos — la "mano de huevo".' },
      { q: 'Las teclas negras vienen en grupos de...', options: ['2 y 3', '1 y 4', 'Siempre de 2'], correct: 0, explanation: 'Las teclas negras se agrupan en 2 y en 3, repitiéndose por el teclado.' },
    ],
  },
  {
    moduleId: 2,
    questions: [
      { q: '¿Cuál es la fórmula del acorde MAYOR?', options: ['Raíz + 3 + 4 semitonos', 'Raíz + 4 + 3 semitonos', 'Raíz + 5 + 2 semitonos'], correct: 1, explanation: 'El acorde mayor = raíz + 4 semitonos + 3 semitonos.' },
      { q: '¿Cuál es la fórmula del acorde MENOR?', options: ['Raíz + 3 + 4 semitonos', 'Raíz + 4 + 3 semitonos', 'Raíz + 2 + 5 semitonos'], correct: 0, explanation: 'El acorde menor = raíz + 3 semitonos + 4 semitonos (los números se invierten).' },
      { q: '¿Qué notas forman el acorde de Do mayor?', options: ['Do-Fa-La', 'Do-Mi-Sol', 'Do-Re-Mi'], correct: 1, explanation: 'Do mayor = Do + Mi + Sol.' },
      { q: 'Los 4 acordes mágicos son...', options: ['Do, Re, Mi, Fa', 'Do, Sol, Lam, Fa', 'Do, Fa, Sol, Sim'], correct: 1, explanation: 'Los 4 acordes mágicos: Do, Sol, Lam y Fa.' },
      { q: '¿Cómo se llama la progresión Do-Sol-Lam-Fa?', options: ['I-IV-V-I', 'I-V-vi-IV', 'ii-V-I'], correct: 1, explanation: 'Es la progresión I-V-vi-IV, base de cientos de canciones pop.' },
    ],
  },
  {
    moduleId: 3,
    questions: [
      { q: '¿Qué es el pulso?', options: ['El latido constante de la música', 'El patrón de la melodía', 'El volumen'], correct: 0, explanation: 'El pulso es el latido constante y regular de la música.' },
      { q: '¿A cuántos BPM se suele empezar a practicar con metrónomo?', options: ['120 BPM', '60 BPM', '200 BPM'], correct: 1, explanation: 'Se empieza a 60 BPM — un clic por segundo.' },
      { q: 'El error rítmico más común de los principiantes es...', options: ['Tocar muy lento', 'Apurarse (tocar antes del clic)', 'No usar la mano izquierda'], correct: 1, explanation: 'La mayoría se apura — tocan antes del clic por anticipación.' },
      { q: '¿Qué es el patrón raíz-quinta?', options: ['Tocar solo la raíz', 'Alternar la raíz y la 5ª del acorde', 'Tocar el acorde completo'], correct: 1, explanation: 'El patrón raíz-quinta alterna la nota raíz y la quinta del acorde.' },
      { q: 'En un compás de 4/4, la negra dura...', options: ['1 tiempo', '4 tiempos', 'Medio tiempo'], correct: 0, explanation: 'En 4/4, la negra (quarter note) dura 1 tiempo.' },
    ],
  },
  {
    moduleId: 4,
    questions: [
      { q: '¿Qué es un intervalo?', options: ['Un tipo de acorde', 'La distancia entre dos notas', 'Una escala'], correct: 1, explanation: 'Un intervalo es la distancia entre dos notas, medida en semitonos.' },
      { q: '¿Cuántos semitonos tiene una 3ª mayor?', options: ['3 semitonos', '4 semitonos', '5 semitonos'], correct: 1, explanation: 'La 3ª mayor tiene 4 semitonos; la 3ª menor tiene 3.' },
      { q: '¿Qué intervalo define si un acorde es alegre o triste?', options: ['La quinta', 'La tercera', 'La octava'], correct: 1, explanation: 'La 3ª es el "interruptor de emoción": mayor = alegre, menor = triste.' },
      { q: '¿Cuántos semitonos tiene una octava?', options: ['8', '12', '7'], correct: 1, explanation: 'La octava tiene 12 semitonos.' },
      { q: 'Un acorde mayor está formado por...', options: ['Dos 3ªs menores', 'Una 3ª mayor + una 3ª menor', 'Dos 5ªs justas'], correct: 1, explanation: 'El acorde mayor = 3ª mayor + 3ª menor apiladas.' },
    ],
  },
  {
    moduleId: 5,
    questions: [
      { q: '¿Cuál es la fórmula de la escala mayor?', options: ['T-T-S-T-T-T-S', 'S-T-S-T-S-T-S', 'T-S-T-T-S-T-T'], correct: 0, explanation: 'La escala mayor = Tono-Tono-Semitono-Tono-Tono-Tono-Semitono.' },
      { q: '¿Qué tiene de especial la escala de Do mayor?', options: ['Tiene 3 sostenidos', 'Son todas teclas blancas', 'No tiene tónica'], correct: 1, explanation: 'Do mayor son todas las teclas blancas — por eso es la más fácil para empezar.' },
      { q: '¿Cómo se llama el primer grado de la escala?', options: ['Dominante', 'Tónica', 'Sensible'], correct: 1, explanation: 'El grado 1 es la tónica — el "hogar" de la tonalidad.' },
      { q: '¿Qué técnica permite tocar las 8 notas de la escala con 5 dedos?', options: ['El salto de octava', 'El paso del pulgar', 'El glissando'], correct: 1, explanation: 'El paso del pulgar por debajo de la mano permite continuar la escala.' },
      { q: 'La escala de Sol mayor necesita...', options: ['Un Fa sostenido (Fa#)', 'Un Si bemol', 'Ninguna alteración'], correct: 0, explanation: 'Sol mayor necesita Fa# para que la fórmula T-T-S-T-T-T-S funcione.' },
    ],
  },
  {
    moduleId: 6,
    questions: [
      { q: 'Para convertir un acorde mayor en menor, ¿qué nota cambias?', options: ['La raíz', 'La nota del medio (la 3ª), bajándola un semitono', 'La quinta'], correct: 1, explanation: 'Baja la 3ª (nota del medio) un semitono para obtener el acorde menor.' },
      { q: '¿Cuántos acordes mayores existen en total?', options: ['7', '12', '24'], correct: 1, explanation: 'Hay 12 acordes mayores, uno por cada nota.' },
      { q: '¿Qué notas forman el acorde de Re mayor?', options: ['Re-Fa-La', 'Re-Fa#-La', 'Re-Sol-Si'], correct: 1, explanation: 'Re mayor = Re + Fa# + La (aplicando la fórmula 4+3).' },
      { q: 'Un acorde mayor suena... y uno menor suena...', options: ['Triste / alegre', 'Brillante / profundo', 'Igual / igual'], correct: 1, explanation: 'Mayor = brillante y alegre; menor = profundo y emotivo.' },
      { q: '¿Qué notas forman el acorde de Mim (Mi menor)?', options: ['Mi-Sol-Si', 'Mi-Sol#-Si', 'Mi-Fa-La'], correct: 0, explanation: 'Mi menor = Mi + Sol + Si (fórmula menor 3+4).' },
    ],
  },
  {
    moduleId: 7,
    questions: [
      { q: '¿Qué es una armadura (key signature)?', options: ['El tempo de la pieza', 'Los sostenidos/bemoles al inicio del pentagrama', 'El compás'], correct: 1, explanation: 'La armadura son los sostenidos o bemoles al inicio que definen la tonalidad.' },
      { q: '¿Cuál es el orden de los sostenidos?', options: ['Fa-Do-Sol-Re-La-Mi-Si', 'Si-Mi-La-Re-Sol-Do-Fa', 'Do-Re-Mi-Fa-Sol-La-Si'], correct: 0, explanation: 'El orden de sostenidos: Fa-Do-Sol-Re-La-Mi-Si.' },
      { q: 'En el Círculo de Quintas, ir en sentido horario...', options: ['Agrega un bemol', 'Agrega un sostenido', 'No cambia nada'], correct: 1, explanation: 'En sentido horario subes una 5ª y agregas un sostenido.' },
      { q: '¿Cuál es la tonalidad menor relativa de Do mayor?', options: ['Re menor', 'La menor', 'Mi menor'], correct: 1, explanation: 'Do mayor y La menor comparten armadura (0 alteraciones).' },
      { q: 'El orden de los bemoles es...', options: ['El mismo que los sostenidos', 'El inverso de los sostenidos', 'Aleatorio'], correct: 1, explanation: 'Los bemoles van en el orden inverso: Si-Mi-La-Re-Sol-Do-Fa.' },
    ],
  },
  {
    moduleId: 8,
    questions: [
      { q: '¿Qué es una inversión de acorde?', options: ['Un acorde nuevo', 'El mismo acorde con las notas reordenadas', 'Un acorde tocado al revés en el tiempo'], correct: 1, explanation: 'Una inversión es el mismo acorde con las notas reordenadas (otra nota en el bajo).' },
      { q: 'Do mayor en 1ª inversión es...', options: ['Do-Mi-Sol', 'Mi-Sol-Do', 'Sol-Do-Mi'], correct: 1, explanation: '1ª inversión de Do mayor = Mi-Sol-Do (la 3ª en el bajo).' },
      { q: '¿Cuántas posiciones tiene una tríada?', options: ['2', '3', '4'], correct: 1, explanation: 'Una tríada de 3 notas tiene 3 posiciones: fundamental, 1ª y 2ª inversión.' },
      { q: '¿Qué es la conducción de voces (voice leading)?', options: ['Tocar más fuerte', 'Mover la menor cantidad de notas posible entre acordes', 'Cantar mientras tocas'], correct: 1, explanation: 'Voice leading = mover lo mínimo posible al cambiar de acorde.' },
      { q: '¿Para qué sirven las inversiones?', options: ['Para tocar más rápido', 'Para transiciones de acordes suaves', 'Para cambiar de tonalidad'], correct: 1, explanation: 'Las inversiones permiten cambios de acorde suaves, sin saltos torpes.' },
    ],
  },
  {
    moduleId: 9,
    questions: [
      { q: 'En el piano, cada mano debe...', options: ['Hacer exactamente lo mismo', 'Trabajar de forma independiente', 'Tocar solo por turnos'], correct: 1, explanation: 'Cada mano es su propio "jugador" — independencia de manos.' },
      { q: '¿Cuál es la mejor forma de practicar una canción nueva?', options: ['Las dos manos juntas desde el inicio', 'Cada mano por separado primero', 'Solo la mano derecha siempre'], correct: 1, explanation: 'Practica cada mano por separado hasta que sea automática, luego combina.' },
      { q: 'La Regla 90/10 dice que...', options: ['90% es talento', 'El 90% de los problemas de manos juntas se resuelven con práctica de manos separadas', 'Practica 90 minutos'], correct: 1, explanation: 'El 90% de los problemas de "manos juntas" se resuelven practicando manos separadas.' },
      { q: '¿A qué velocidad se debe empezar a combinar las manos?', options: ['Al 100% del tempo', 'Al 30-50% del tempo', 'Lo más rápido posible'], correct: 1, explanation: 'Combina las manos al 30-50% del tempo objetivo — lento.' },
      { q: 'Practicar lento sirve para...', options: ['Perder el tiempo', 'Construir precisión y memoria muscular', 'Aburrir al estudiante'], correct: 1, explanation: 'La práctica lenta construye precisión; la velocidad llega después sola.' },
    ],
  },
  {
    moduleId: 10,
    questions: [
      { q: 'La clave de Sol se usa para...', options: ['La mano izquierda / notas graves', 'La mano derecha / notas agudas', 'El pedal'], correct: 1, explanation: 'La clave de Sol es para la mano derecha y las notas agudas.' },
      { q: 'Las líneas de la clave de Sol son...', options: ['Fa-La-Do-Mi', 'Mi-Sol-Si-Re-Fa', 'Sol-Si-Re-Fa-La'], correct: 1, explanation: 'Líneas de la clave de Sol: Mi-Sol-Si-Re-Fa.' },
      { q: '¿Cuántos tiempos dura una redonda?', options: ['1 tiempo', '2 tiempos', '4 tiempos'], correct: 2, explanation: 'La redonda (whole note) dura 4 tiempos.' },
      { q: 'La clave de Fa se usa para...', options: ['La mano izquierda / notas graves', 'La mano derecha', 'Las teclas negras'], correct: 0, explanation: 'La clave de Fa es para la mano izquierda y las notas graves.' },
      { q: 'Antes de tocar una pieza nueva a primera vista debes...', options: ['Tocar lo más rápido posible', 'Nombrar las notas y aplaudir el ritmo', 'Memorizarla entera'], correct: 1, explanation: 'El proceso: escanea, nombra las notas, aplaude el ritmo, toca lento.' },
    ],
  },
  {
    moduleId: 11,
    questions: [
      { q: '¿Qué agrega un acorde de séptima a una tríada?', options: ['Una 4ª nota', 'Otra octava', 'Un silencio'], correct: 0, explanation: 'El acorde de séptima agrega una 4ª nota: la séptima.' },
      { q: 'El acorde Domaj7 (Cmaj7) está formado por...', options: ['Do-Mi-Sol-Sib', 'Do-Mi-Sol-Si', 'Do-Mib-Sol-Sib'], correct: 1, explanation: 'Cmaj7 = Do-Mi-Sol-Si (tríada mayor + 7ª mayor).' },
      { q: 'El acorde de séptima de dominante (dom7)...', options: ['Suena resuelto y estable', 'Crea tensión y "quiere resolver"', 'Es lo mismo que un acorde mayor'], correct: 1, explanation: 'El dom7 crea tensión y jala hacia la tónica.' },
      { q: '¿Qué tipo de acorde es la base del R&B y el neo-soul?', options: ['El acorde aumentado', 'El acorde m7 (séptima menor)', 'El acorde disminuido'], correct: 1, explanation: 'El m7 es el caballo de batalla del R&B y el neo-soul.' },
      { q: 'Un acorde sus4...', options: ['Reemplaza la 3ª por la 4ª', 'Agrega una 7ª', 'Quita la quinta'], correct: 0, explanation: 'El sus4 reemplaza la 3ª por la 4ª — suena abierto, sin resolver.' },
    ],
  },
  {
    moduleId: 12,
    questions: [
      { q: '¿Cuántas versiones de escala menor existen?', options: ['1', '3', '5'], correct: 1, explanation: 'Tres: menor natural, menor armónica y menor melódica.' },
      { q: 'La escala menor armónica eleva...', options: ['El 7º grado', 'El 1er grado', 'El 4º grado'], correct: 0, explanation: 'La menor armónica eleva el 7º grado, creando un sonido exótico.' },
      { q: '¿Qué es un modo?', options: ['Un tipo de acorde', 'La escala mayor empezando desde otro grado', 'Un tempo'], correct: 1, explanation: 'Un modo es la escala mayor empezando desde un grado distinto.' },
      { q: 'El modo Dórico empieza desde el grado...', options: ['1', '2', '5'], correct: 1, explanation: 'El Dórico empieza desde el 2º grado de la escala mayor.' },
      { q: 'El modo Mixolidio suena...', options: ['Triste y oscuro', 'Mayor pero "bluesy"', 'Igual que el menor'], correct: 1, explanation: 'El Mixolidio es un mayor con la 7ª bajada — suena bluesy.' },
    ],
  },
  {
    moduleId: 13,
    questions: [
      { q: 'En números romanos, una mayúscula (I, IV, V) indica...', options: ['Un acorde menor', 'Un acorde mayor', 'Un silencio'], correct: 1, explanation: 'Mayúscula = acorde mayor; minúscula = acorde menor.' },
      { q: '¿Cuál es la función del acorde V (dominante)?', options: ['Estabilidad / hogar', 'Tensión que quiere resolver', 'No tiene función'], correct: 1, explanation: 'El V (dominante) crea tensión y quiere resolver al I.' },
      { q: 'La cadencia auténtica es...', options: ['IV-I', 'V-I', 'I-V'], correct: 1, explanation: 'La cadencia auténtica V-I es la resolución más fuerte.' },
      { q: 'En la tonalidad de Do, el acorde vi es...', options: ['Fa mayor', 'La menor', 'Sol mayor'], correct: 1, explanation: 'El vi de Do es Lam (La menor).' },
      { q: '¿Por qué se usan números romanos en vez de nombres de acordes?', options: ['Por tradición', 'Para que la progresión funcione en cualquier tonalidad', 'Son más cortos'], correct: 1, explanation: 'Los números romanos hacen la armonía universal, independiente de la tonalidad.' },
    ],
  },
  {
    moduleId: 14,
    questions: [
      { q: '¿Cuál pedal es el de resonancia (sustain)?', options: ['El de la izquierda', 'El del medio', 'El de la derecha'], correct: 2, explanation: 'El pedal de resonancia es el de la derecha.' },
      { q: 'En la técnica del pedal legato, ¿qué haces primero?', options: ['Bajar el pedal', 'Tocar la nota', 'Levantar el pie'], correct: 1, explanation: 'Pedal legato: toca la nota PRIMERO, luego baja el pedal.' },
      { q: '¿Qué significa "pp" en dinámica?', options: ['Muy fuerte', 'Muy suave (pianissimo)', 'Tempo rápido'], correct: 1, explanation: 'pp = pianissimo = muy suave.' },
      { q: 'Staccato significa tocar las notas...', options: ['Conectadas y suaves', 'Cortas y separadas', 'Muy fuerte'], correct: 1, explanation: 'Staccato = notas cortas y separadas, "rebotando".' },
      { q: 'Un crescendo es...', options: ['Tocar cada vez más fuerte', 'Tocar cada vez más suave', 'Acelerar'], correct: 0, explanation: 'Crescendo = aumentar el volumen gradualmente.' },
    ],
  },
  {
    moduleId: 15,
    questions: [
      { q: 'Al aprender una canción completa, conviene...', options: ['Tocarla entera una y otra vez', 'Dividirla en secciones (A, B, C)', 'Empezar por el final'], correct: 1, explanation: 'Divide la canción en secciones y domina cada una por separado.' },
      { q: '¿Dónde suelen tropezar los estudiantes en una canción?', options: ['En la primera nota', 'En la unión entre secciones (la "costura")', 'Al final'], correct: 1, explanation: 'La "costura" entre secciones es donde casi todos tropiezan.' },
      { q: 'En una interpretación, si te equivocas debes...', options: ['Parar y empezar de nuevo', 'Seguir tocando sin parar', 'Disculparte'], correct: 1, explanation: 'En una interpretación nunca paras — sigues tocando y te recuperas.' },
      { q: '¿Cuál es una buena forma de evaluar tu progreso?', options: ['Grabarte y escucharte', 'Tocar más rápido', 'No practicar'], correct: 0, explanation: 'Grabarte te da una visión honesta de tu progreso y tus errores.' },
      { q: 'La práctica por secciones consiste en...', options: ['Tocar solo tus partes favoritas', 'Dominar cada sección antes de conectarlas', 'Saltarte las partes difíciles'], correct: 1, explanation: 'Domina cada sección por separado, luego conéctalas.' },
    ],
  },
  {
    moduleId: 16,
    questions: [
      { q: '¿Cuántas notas tiene la escala pentatónica?', options: ['7', '5', '12'], correct: 1, explanation: 'La pentatónica tiene 5 notas ("penta" = cinco).' },
      { q: 'La pentatónica mayor de Do es...', options: ['Do-Re-Mi-Fa-Sol', 'Do-Re-Mi-Sol-La', 'Do-Mi-Sol-Si-Re'], correct: 1, explanation: 'Pentatónica mayor de Do = Do-Re-Mi-Sol-La (sin Fa ni Si).' },
      { q: '¿Por qué la pentatónica es ideal para improvisar?', options: ['Es la más difícil', 'Sus 5 notas siempre suenan bien sobre los acordes', 'Solo usa teclas negras'], correct: 1, explanation: 'En la pentatónica no hay "notas malas" — siempre suena bien.' },
      { q: '¿Qué es la "llamada y respuesta"?', options: ['Un tipo de escala', 'Una conversación musical: uno toca, el otro responde', 'Un acorde'], correct: 1, explanation: 'Llamada y respuesta: un músico toca una frase, el otro responde.' },
      { q: 'Al componer tu propia pieza, lo más importante es...', options: ['Que sea perfecta', 'Que sea tuya y la grabes/anotes', 'Que sea muy larga'], correct: 1, explanation: 'La composición no necesita ser perfecta — necesita ser tuya.' },
    ],
  },
];

export function getQuizForModule(moduleId: number): ModuleQuiz | undefined {
  return MODULE_QUIZZES.find((q) => q.moduleId === moduleId);
}

// ── Resultados de quizzes (localStorage) ────────────────────────────────────
export interface QuizResult {
  score: number;
  total: number;
  percent: number;
  date: string;
}

// Estructura: { [studentId]: { [moduleId]: QuizResult } }
export type QuizResultsStore = Record<string, Record<number, QuizResult>>;
