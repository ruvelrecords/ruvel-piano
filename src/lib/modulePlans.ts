// ─── RÜVEL Method — Guías de Clase de 60 min (bilingüe ES/EN) ───────────────
// Cada módulo tiene 5-6 pasos colapsables que el profesor sigue EN TIEMPO REAL.
// Cada paso: qué decir, puntos clave, fórmula (caja dorada), ejercicio de clase,
// tarea, enlace de YouTube/MuseScore y un consejo del profesor.
// Las notas del profesor se guardan por paso en localStorage.

export interface ModuleStep {
  title: string;
  duration: number; // minutos
  whatToSay: string;
  keyPoints: string[];
  formula?: string; // Caja dorada — la regla/concepto a recordar
  classExercise: string;
  homework?: string;
  youtubeSearch: string;
  musescoreSearch?: string;
  teacherTip: string;
}

export interface ModuleClassPlan {
  moduleId: number;
  totalMinutes: number;
  intro: string;
  steps: ModuleStep[];
}

export const MODULE_CLASS_PLANS: ModuleClassPlan[] = [
  // ═══ MÓDULO 1 — PRIMER CONTACTO ════════════════════════════════════════
  {
    moduleId: 1,
    totalMinutes: 60,
    intro: 'Meta: el estudiante se va sabiendo postura, números de dedos, geografía del teclado y Do-Sol con digitación correcta.',
    steps: [
      {
        title: 'La Silla y el Piano — Postura',
        duration: 10,
        whatToSay:
          '"Antes de tocar una sola nota, te voy a preparar perfecto — porque todo lo demás depende de esto. Siéntate. ¿Sientes los dos pies en el piso? El banco va a la altura de tus codos. Relaja los brazos, ligeramente doblados al alcanzar las teclas."',
        keyPoints: [
          'Banco a la altura de los codos — ni muy cerca ni muy lejos',
          'Los dos pies planos en el piso (los niños pueden necesitar un banquito)',
          'Espalda recta pero no rígida',
          'Muñecas al nivel de las teclas — sin caer ni elevarse',
          'Hombros abajo y relajados — cero tensión',
        ],
        formula: 'La Regla de los 3 Puntos: Pies → Espalda → Muñecas. Si uno falla, tocar se vuelve 10× más difícil.',
        classExercise:
          'El estudiante se para y se sienta 3 veces. Cada vez busca la posición perfecta sin que le digan. A la 3ª, que explique cada punto en voz alta.',
        homework: 'Cada vez que te sientes a un piano esta semana, haz el chequeo de 3 puntos antes de tocar una tecla.',
        youtubeSearch: 'piano posture beginners lesson postura piano',
        teacherTip: 'Si se encorva a media clase, no te detengas a sermonear — toca suavemente su hombro. Se autocorrige solo.',
      },
      {
        title: 'Números de Dedos — Tu Nuevo Idioma',
        duration: 8,
        whatToSay:
          '"Saca las dos manos, palmas hacia abajo. Tus pulgares son el número 1, en AMBAS manos. Vamos: 1-2-3-4-5. Ahora al revés: 5-4-3-2-1. Estos números son el idioma que usaremos en cada clase."',
        keyPoints: [
          'Pulgar = 1 en AMBAS manos (la confusión más común)',
          'Meñique = 5 en ambas manos',
          'Nunca izquierda/derecha — siempre por número de dedo',
          'Estos números aparecen en las partituras',
        ],
        classExercise:
          'Tamborilea sobre la tapa del piano: 1-2-3-4-5, luego 5-4-3-2-1. Luego en 5 teclas al azar. Luego con los OJOS CERRADOS.',
        homework: 'Tamborilea los dedos en orden sobre tu escritorio, 10 veces al día: 1-2-3-4-5.',
        youtubeSearch: 'piano finger numbers exercise beginners digitacion',
        teacherTip: 'Si confunde los números, usa nombres: "pulgar, índice, alto, anular, meñique".',
      },
      {
        title: 'El Código Secreto — Geografía del Teclado',
        duration: 12,
        whatToSay:
          '"El piano parece aleatorio pero no lo es — hay un código secreto. Mira las teclas negras: vienen en grupos de 2 y de 3. Ese patrón se repite por todo el teclado. El Do (C) SIEMPRE está a la izquierda del grupo de 2 negras. Encuentra un Do y los encuentras todos."',
        keyPoints: [
          'Las teclas negras vienen en grupos de 2 y 3 — nunca al azar',
          'Do (C) = justo a la IZQUIERDA del grupo de 2 negras',
          'Re (D) = en el MEDIO de las 2 negras',
          'El patrón Do-Re-Mi-Fa-Sol-La-Si se repite cada 7 teclas blancas',
        ],
        formula: 'Encontrar Do: ubica las 2 teclas negras → el Do está justo a su IZQUIERDA. Funciona en cualquier piano.',
        classExercise:
          'Carrera: ¿qué tan rápido toca todos los Do? Luego todos los Sol. Cronométralo — querrá superar su tiempo.',
        homework: 'Cada día: encuentra todos los Do, di "¡Do!" al tocar cada uno. Luego los Sol. 30 segundos en total.',
        youtubeSearch: 'find C notes on piano keyboard beginners notas piano',
        teacherTip: 'Para niños: "Las 2 negras son una casita — el Do vive al lado izquierdo." Para adultos: explica el patrón completo de 7 notas de una vez.',
      },
      {
        title: 'Tus Primeras Notas Reales — Do a Sol',
        duration: 15,
        whatToSay:
          '"Ahora tocamos de verdad. Mano derecha — pulgar en el Do central. Sin mover la mano, deja que los dedos descansen en las siguientes teclas: Re, Mi, Fa, Sol bajo los dedos 2-3-4-5. Imagina que sostienes una naranja pequeña — la mano curva, nunca plana. Subamos: 1-2-3-4-5."',
        keyPoints: [
          'Pulgar derecho (1) en el Do central',
          'Dedos 2-3-4-5 descansan en Re-Mi-Fa-Sol',
          '"Mano de huevo" — dedos curvos, nunca planos',
          'Una nota a la vez — presión limpia y pareja',
          'Mirada al frente, no a los dedos',
        ],
        formula: 'La Mano de Huevo: imagina un huevito en la palma. Los dedos se mantienen redondeados. Si se aplastan, llega la tensión.',
        classExercise:
          'Toca Do-Re-Mi-Fa-Sol subiendo, luego Sol-Fa-Mi-Re-Do bajando. Di el número de dedo en voz alta. 5 veces lento. Luego con ojos cerrados.',
        homework: 'Toca Do-Re-Mi-Fa-Sol subiendo y bajando, 5 veces al día. Enfócate SOLO en los dedos curvos.',
        youtubeSearch: 'five finger exercise piano C position beginners',
        teacherTip: 'Vigila que el 3er dedo no se aplaste en la articulación. Empuja suave la punta del dedo para que sienta qué es "curvo".',
      },
      {
        title: 'La Misión de Tarea — Cierre',
        duration: 15,
        whatToSay:
          '"Aprendiste las 4 cosas más importantes del piano en una clase: postura, números de dedos, el secreto del teclado y tus primeras notas. Ahora algo importante: lo que pasa ENTRE clases importa más que la clase misma. Te doy una misión diaria de 5 minutos. 5 minutos. Todos los días."',
        keyPoints: [
          'La práctica diaria — aunque sean 5 min — construye más que una sesión semanal larga',
          'Repasa los 4 elementos de hoy',
          'Dale una rutina escrita/por mensaje que pueda seguir sin ti',
          'Termina con un ánimo genuino — la primera clase es enorme',
        ],
        classExercise:
          'El estudiante te "enseña" a TI todo lo de hoy: chequeo de postura, números de dedos, encontrar los Do, tocar Do a Sol. Si lo puede enseñar, lo domina.',
        homework: 'Misión diaria de 5 min: (1) chequeo de postura (2) 1-2-3-4-5 ×3 (3) encontrar todos los Do (4) Do-Re-Mi-Fa-Sol subir/bajar ×5.',
        youtubeSearch: 'beginner piano practice routine first week rutina',
        teacherTip: 'Manda la tarea por WhatsApp al padre justo al terminar la clase. La tasa de tarea cumplida en la 1ª clase predice el éxito a largo plazo.',
      },
    ],
  },

  // ═══ MÓDULO 2 — ACORDES MÁGICOS ════════════════════════════════════════
  {
    moduleId: 2,
    totalMinutes: 60,
    intro: 'Meta: el estudiante construye y toca Do, Sol, Lam y Fa desde las fórmulas mayor y menor, y transiciona entre los 4.',
    steps: [
      {
        title: 'La Revelación de la Fórmula',
        duration: 10,
        whatToSay:
          '"Hoy te muestro algo que la mayoría de los estudiantes no aprende hasta años después: CÓMO se construyen los acordes — no qué notas tocar, sino POR QUÉ. Una vez que sabes la fórmula, construyes CUALQUIER acorde sin chuleta."',
        keyPoints: [
          'Semitono (semitone) = medio tono = teclas vecinas (incluye negras)',
          'Cuenta cada tecla, blanca y negra',
          'Acorde mayor = raíz + 4 semitonos + 3 semitonos',
          'La fórmula funciona en los 12 tonos — nunca memorizas, calculas',
        ],
        formula: 'Acorde Mayor = Raíz + 4 semitonos + 3 semitonos\nAcorde Menor = Raíz + 3 semitonos + 4 semitonos\nLos números se invierten entre mayor y menor.',
        classExercise:
          'Cuenten semitonos juntos desde Do: Do→Do#→Re→Re#→Mi (4 pasos). Luego Mi→Fa→Fa#→Sol (3 pasos). Do-Mi-Sol = Do mayor.',
        homework: 'Escribe la fórmula mayor en papel y déjala en tu teclado: Raíz + 4 + 3.',
        youtubeSearch: 'how to build major chords piano semitones formula',
        teacherTip: 'Algunos se asustan al "contar semitonos". Ve lento. El momento "ajá" cuando construye su primer acorde vale cada minuto extra.',
      },
      {
        title: 'Construir Do Mayor — Tu Primer Acorde',
        duration: 12,
        whatToSay:
          '"Construyamos Do mayor con la fórmula. Raíz = Do. Cuenta 4 semitonos: Do#, Re, Re#, Mi — llegamos a Mi. Desde Mi, cuenta 3 más: Fa, Fa#, Sol — llegamos a Sol. Do mayor = Do, Mi, Sol. Tres notas a la vez. Eso es un acorde."',
        keyPoints: [
          'Do mayor (C) = Do + Mi + Sol',
          'Toca con los dedos 1, 3, 5 (pulgar, alto, meñique)',
          'Las tres notas suenan a la vez',
          'TÚ lo construiste — no lo memorizaste',
          'El sonido mayor = brillante, alegre, abierto',
        ],
        classExercise:
          'Toca Do mayor 10 veces seguidas. Suelta y vuelve a encontrarlo sin mirar. Luego solo mano derecha, luego solo izquierda, luego alternando.',
        homework: 'Toca Do mayor 20 veces al día. Encuéntralo de memoria, no mirando.',
        youtubeSearch: 'C major chord piano tutorial beginners acorde Do',
        teacherTip: 'Haz de este momento algo grande. "Acabas de tocar tu primer acorde. Ya eres pianista." El festejo crea un anclaje emocional.',
      },
      {
        title: 'Construir Sol Mayor y Lam',
        duration: 15,
        whatToSay:
          '"Usemos la fórmula en Sol. Raíz = Sol. 4 arriba: Sol#, La, La#, Si. Luego 3 más: Do, Do#, Re. Sol mayor = Sol, Si, Re. Y para Lam la fórmula se INVIERTE: menor = raíz + 3 + 4. Desde La: 3 arriba = Do. Luego 4 más = Mi. Lam = La, Do, Mi."',
        keyPoints: [
          'Sol mayor (G) = Sol + Si + Re',
          'Lam (A minor) = La + Do + Mi (¡la fórmula menor es 3+4!)',
          'Mayor suena brillante — menor suena profundo/emocional',
          'Una sola nota distinta cambia toda la emoción',
        ],
        formula: 'Fórmula menor = Raíz + 3 semitonos + 4 semitonos.\nSolo INTERCAMBIA los números: 4+3 se vuelve 3+4.',
        classExercise:
          'Toca Sol mayor → Lam → Sol → Lam. Di "brillante" para mayor, "profundo" para menor. Luego La mayor y Lam seguidos — la diferencia de una nota es impactante.',
        homework: 'Toca Sol mayor y Lam, 10 veces cada uno. Luego alternando: Sol-Lam-Sol-Lam.',
        youtubeSearch: 'G major A minor chord piano lesson acordes',
        teacherTip: 'El contraste emocional mayor/menor es uno de los momentos más poderosos. Déjalo respirar. Pregunta "¿cuál te pone triste? ¿cuál esperanzado?"',
      },
      {
        title: 'Construir Fa Mayor — El Difícil',
        duration: 10,
        whatToSay:
          '"Último acorde: Fa mayor. Fórmula: Fa + 4 = La. Luego La + 3 = Do. Fa mayor = Fa, La, Do. Dato curioso: el acorde de Fa tiene las mismas notas que Do mayor, reordenadas. Ahora tenemos los cuatro: Do, Sol, Lam, Fa."',
        keyPoints: [
          'Fa mayor (F) = Fa + La + Do',
          'El acorde de Fa es el más difícil para la posición de la mano',
          'Ya tienes los 4: Do, Sol, Lam, Fa',
          'Estos 4 acordes mueven cientos de canciones pop',
        ],
        classExercise:
          'Toca los cuatro en orden: Do → Sol → Lam → Fa → Do. Lento. 4 tiempos por acorde. Cuenta en voz alta: 1-2-3-4.',
        homework: 'Toca Do-Sol-Lam-Fa cada día, 5 veces. 4 tiempos por acorde.',
        youtubeSearch: 'F major chord piano tutorial four chords',
        teacherTip: 'Fa es donde muchos batallan porque la mano se desplaza. No lo apresures. Está bien si toma dos clases.',
      },
      {
        title: 'La Progresión Mágica — Do-Sol-Lam-Fa',
        duration: 13,
        whatToSay:
          '"Algo increíble: estos 4 acordes son la columna vertebral de unas 500 canciones que ya conoces. Te toco algunas... [toca Let Her Go, Riptide, Hallelujah]. Los MISMOS 4 acordes. Distinto ritmo, distinta melodía — pero la misma secuencia."',
        keyPoints: [
          'Do-Sol-Lam-Fa = la progresión I-V-vi-IV',
          'Funciona en cualquier tonalidad — esta es la versión en Do',
          'La mano izquierda toca los acordes, la derecha la melodía',
          'Pronto podrás tocar cualquiera de estas canciones',
        ],
        classExercise:
          'Toca Do-Sol-Lam-Fa mientras el profe canta Let Her Go. Sostén cada acorde 4 tiempos. ¡Suena genial al instante!',
        homework: 'Toca el loop Do-Sol-Lam-Fa 2 min al día. Pon una pista de fondo o la canción real y toca encima.',
        youtubeSearch: 'C G Am F progression piano backing track',
        teacherTip: 'Este es el momento culminante del módulo 2. El estudiante se escucha tocando música real. No lo saltes.',
      },
    ],
  },

  // ═══ MÓDULO 3 — RITMO Y GROOVE ═════════════════════════════════════════
  {
    moduleId: 3,
    totalMinutes: 60,
    intro: 'Meta: el estudiante entiende pulso vs ritmo, usa el metrónomo y toca un patrón constante de mano izquierda bajo un acorde.',
    steps: [
      {
        title: 'Encuentra el Latido — Pulso vs Ritmo',
        duration: 12,
        whatToSay:
          '"Pon la mano en tu pecho. ¿Sientes el latido? Ese es el pulso — constante, no cambia. La música funciona igual: hay un latido constante por debajo, y encima la melodía baila. El latido = pulso. La melodía = ritmo."',
        keyPoints: [
          'Pulso = el latido constante de la música',
          'Ritmo = el patrón de sonidos largos y cortos encima del pulso',
          'El pulso nunca cambia — el ritmo baila a su alrededor',
          'Si se pierde el pulso, la canción se desmorona',
        ],
        formula: 'Pulso = constante. Ritmo = flexible.\nEl pulso es lo que marca tu pie. El ritmo es lo que aplaudes con la melodía.',
        classExercise:
          'Pon una canción que ame el estudiante. Marquen el pulso en la mesa. Luego marquen el ritmo de la melodía. Cambien entre ambos.',
        youtubeSearch: 'pulse vs rhythm music lesson pulso ritmo',
        teacherTip: 'No avances hasta que pueda marcar pulso y ritmo por separado. Es fundamental — muchos estudiantes intermedios batallan por no haberlo aprendido.',
      },
      {
        title: 'El Clic — El Metrónomo',
        duration: 10,
        whatToSay:
          '"Te presento a tu nuevo mejor amigo — y también tu maestro más molesto: el metrónomo. Cada clic es un tiempo. Nunca acelera, nunca perdona. Cuando tocas CON el clic, tocas a tiempo. Es retroalimentación honesta."',
        keyPoints: [
          'El metrónomo = la máquina de pulso perfecta',
          'Empieza a 60 BPM — un clic por segundo',
          'La meta: caer exacto en el clic, ni antes ni después',
          'Casi todos los principiantes se apuran (tocan antes del clic)',
        ],
        classExercise:
          'Toca notas sueltas con el metrónomo a 60 BPM. Una nota por clic. Luego dos clics por nota (blancas). Luego una nota cada dos clics.',
        homework: 'Toca Do-Re-Mi-Fa-Sol con el metrónomo a 60 BPM. Una nota por clic, exacto.',
        youtubeSearch: 'metronome 60 BPM piano beginner practice metronomo',
        teacherTip: 'Si se apura, no digas "más lento" — di "espera el clic". Apurarse es anticipar. Enséñale a REACCIONAR al clic. Con ojos cerrados ayuda.',
      },
      {
        title: 'La Mano Izquierda Despierta',
        duration: 15,
        whatToSay:
          '"Tu mano izquierda ha estado dormida. Ahora despierta — con suavidad. Por ahora hace UN solo trabajo: mantener el tiempo. Solo toca la nota raíz del acorde en cada tiempo. La izquierda marca el latido, la derecha toca el acorde."',
        keyPoints: [
          'Rol de la izquierda: constante, simple, rítmica',
          'Empieza con solo la nota raíz (Do para el acorde de Do)',
          'Una nota por tiempo — negras al inicio',
          'La izquierda debe sentirse como respirar',
        ],
        classExercise:
          'La derecha sostiene un acorde de Do. La izquierda toca negras constantes en Do: 1-2-3-4. Luego cambia al acorde de Sol con bajo de Sol.',
        homework: 'Toca bajos constantes con la izquierda bajo cada acorde: Do-Sol-Lam-Fa. 4 tiempos cada uno, 5 veces.',
        youtubeSearch: 'left hand piano bass note beginners mano izquierda',
        teacherTip: 'La izquierda tiende a apurarse porque el estudiante se enfoca en la derecha. Que toque SOLO izquierda 30 seg, luego agrega la derecha.',
      },
      {
        title: 'El Patrón Groove — Raíz y Quinta',
        duration: 13,
        whatToSay:
          '"El bajo constante está bien — pero la música real tiene más movimiento. En vez de Do-Do-Do-Do, tocamos Do-Sol-Do-Sol alternando — la raíz y la quinta del acorde. Crea un patrón que se mece, se siente como música real."',
        keyPoints: [
          'Patrón raíz-quinta: raíz, luego la 5ª del acorde, alternando',
          'Para el acorde de Do: Do → Sol → Do → Sol',
          'Para el acorde de Sol: Sol → Re → Sol → Re',
          'Es la base de casi todo el piano pop/rock',
        ],
        formula: 'Patrón Raíz-Quinta: Raíz en el tiempo 1, 5ª en el 2, Raíz en el 3, 5ª en el 4.\nLa 5ª = 7 semitonos arriba de la raíz.',
        classExercise:
          'Solo izquierda: patrón Do-Sol-Do-Sol a 60 BPM (dedos 5 y 1). Luego agrega la derecha con el acorde de Do. Cambia a la versión de Sol.',
        homework: 'Practica el patrón raíz-quinta bajo los acordes de Do y Sol, 2 min al día.',
        youtubeSearch: 'root fifth left hand piano pattern beginners groove',
        teacherTip: 'La digitación importa: en la izquierda, dedo 5 en la raíz y dedo 1 en la quinta. Se siente raro al inicio pero es correcto.',
      },
      {
        title: 'Únelo Todo — Toca con una Canción',
        duration: 10,
        whatToSay:
          '"Ahora usamos todo. Sabes los 4 acordes, sabes marcar el tiempo, tienes un patrón de groove. Pongamos una pista de fondo y toquemos junto a la música. Así se siente el piano cuando todo encaja."',
        keyPoints: [
          'Aplica todas las destrezas rítmicas a música real',
          'Enfócate primero en el pulso — no busques perfección',
          'Si pierdes el tiempo, recupéralo rápido — no pares',
          'Los músicos de verdad se recuperan, no se congelan',
        ],
        classExercise:
          'Toca junto a una pista Do-Sol-Lam-Fa. Izquierda hace raíz-quinta, derecha sostiene acordes. Grábalo en el teléfono.',
        homework: 'Toca junto a una pista de YouTube de Do-Sol-Lam-Fa, 3 min al día. Enfócate en NO parar al fallar.',
        youtubeSearch: 'C G Am F piano backing track loop beginner',
        teacherTip: 'La pista hace que suene música al instante. Es enorme motivador. Grábalo — que se escuche. Los que oyen su progreso se automotivan.',
      },
    ],
  },

  // ═══ MÓDULO 4 — INTERVALOS ═════════════════════════════════════════════
  {
    moduleId: 4,
    totalMinutes: 60,
    intro: 'Meta: el estudiante cuenta semitonos, nombra los intervalos 2ª-8ª, distingue mayor/menor y reconoce intervalos de oído.',
    steps: [
      {
        title: '¿Qué es un Intervalo?',
        duration: 10,
        whatToSay:
          '"Hoy aprendemos el ADN de la música: los intervalos. Un intervalo es simplemente la distancia entre dos notas. Un salto pequeño o un salto grande. Todo acorde y toda escala que tocas está hecho de intervalos apilados."',
        keyPoints: [
          'Intervalo = la distancia entre dos notas',
          'Se mide en semitonos (teclas vecinas, blancas y negras)',
          'Salto pequeño = intervalo pequeño (2ª). Salto grande = grande (8ª/octava)',
          'Los acordes y escalas se construyen con intervalos',
        ],
        formula: 'Un intervalo se NOMBRA por cuántas notas abarca: Do→Re = 2ª, Do→Mi = 3ª, Do→Sol = 5ª, Do→Do = 8ª (octava).',
        classExercise:
          'Toca dos notas vecinas (2ª). Luego salta una (3ª). Luego nombra: ¿cuántas notas hay de Do a Sol? Cuenta: Do-Re-Mi-Fa-Sol = 5ª.',
        homework: 'Cada día, toca y nombra 5 intervalos distintos desde Do.',
        youtubeSearch: 'music intervals explained piano beginners intervalos',
        teacherTip: 'Ya contaron semitonos en el módulo 2 (las fórmulas de acordes). Conéctalo: "Lo que hicimos con los acordes — eso eran intervalos."',
      },
      {
        title: 'Contar Semitonos — La Medida Exacta',
        duration: 12,
        whatToSay:
          '"Nombrar el intervalo es un nivel. Medirlo en semitonos es la precisión. Una 3ª mayor son 4 semitonos. Una 3ª menor son 3. La misma \'distancia de nombre\' pero distinto tamaño exacto — y distinta emoción."',
        keyPoints: [
          '2ª menor = 1 semitono, 2ª mayor = 2 semitonos',
          '3ª menor = 3 semitonos, 3ª mayor = 4 semitonos',
          '4ª justa = 5 semitonos, 5ª justa = 7 semitonos',
          'Octava = 12 semitonos (vuelta completa)',
        ],
        formula: 'Tabla de semitonos: 2ªm=1, 2ªM=2, 3ªm=3, 3ªM=4, 4ª=5, 5ª=7, 6ªM=9, 7ªM=11, 8ª=12.',
        classExercise:
          'Construye desde Do: una 3ª mayor (Do-Mi, 4 semitonos), una 3ª menor (Do-Mib, 3 semitonos), una 5ª justa (Do-Sol, 7 semitonos).',
        homework: 'Practica contar semitonos: el profe dice un intervalo, tú lo construyes desde una nota al azar.',
        youtubeSearch: 'counting semitones intervals piano semitonos',
        musescoreSearch: 'interval exercises piano',
        teacherTip: 'No abrumes con los 12 intervalos de golpe. Domina 2ª, 3ª, 4ª, 5ª y 8ª esta clase. El resto vendrá naturalmente.',
      },
      {
        title: '3ª Mayor vs 3ª Menor — La Emoción',
        duration: 13,
        whatToSay:
          '"Aquí está la magia: la 3ª es el intervalo que decide si algo suena alegre o triste. 3ª mayor (4 semitonos) = brillante, feliz. 3ª menor (3 semitonos) = oscura, melancólica. ¿Recuerdas la diferencia entre Do mayor y Do menor? Es exactamente esta nota."',
        keyPoints: [
          '3ª mayor = 4 semitonos = sonido alegre',
          '3ª menor = 3 semitonos = sonido triste',
          'Esta única nota define la emoción de un acorde',
          'Mayor y menor — todo se reduce a la 3ª',
        ],
        formula: 'La 3ª es el "interruptor de emoción". 3ª mayor → acorde mayor (alegre). 3ª menor → acorde menor (triste).',
        classExercise:
          'Toca Do-Mi (3ª M) y Do-Mib (3ª m) una y otra vez. Que el estudiante diga "alegre" o "triste" con ojos cerrados.',
        homework: 'Toca 3ª mayores y menores desde 3 notas distintas. Escucha la diferencia emocional.',
        youtubeSearch: 'major third vs minor third interval ear training',
        teacherTip: 'Este es el "ajá" del módulo. Conéctalo con todo lo que ya saben de acordes mayores/menores.',
      },
      {
        title: 'Intervalos Famosos — El Oído',
        duration: 15,
        whatToSay:
          '"Cada intervalo tiene un \'sonido\' que ya conoces de canciones famosas. La octava = \'Somewhere Over the Rainbow\'. La 5ª justa = el tema de Star Wars. La 4ª = \'Aquí viene la novia\'. La 2ª menor = el tema de Tiburón. Asociamos cada intervalo a una canción para reconocerlos de oído."',
        keyPoints: [
          'Octava ascendente = "Somewhere Over the Rainbow"',
          '5ª justa = tema de Star Wars',
          '4ª justa = "Here Comes the Bride"',
          '2ª menor = tema de Tiburón (Jaws)',
          '3ª mayor = "Cuando los Santos" / 3ª menor = "Greensleeves"',
        ],
        classExercise:
          'Por cada intervalo, toca su canción famosa. Luego el profe toca un intervalo al azar y el estudiante adivina cuál es por la canción.',
        homework: 'Escucha 3 canciones y trata de identificar un intervalo grande en la melodía.',
        youtubeSearch: 'interval ear training famous songs reference',
        teacherTip: 'Las canciones de referencia son el truco más eficaz para el entrenamiento de oído. Deja que el estudiante elija sus propias canciones de referencia si quiere.',
      },
      {
        title: 'Los Acordes son Intervalos Apilados',
        duration: 10,
        whatToSay:
          '"Cerramos uniendo todo. Un acorde mayor no es magia — es una 3ª mayor con una 3ª menor encima. Do mayor: Do→Mi es 3ª mayor, Mi→Sol es 3ª menor. ¡Lo que aprendiste hoy explica POR QUÉ funcionan las fórmulas de acordes!"',
        keyPoints: [
          'Acorde mayor = 3ª mayor + 3ª menor apiladas',
          'Acorde menor = 3ª menor + 3ª mayor apiladas',
          'Los intervalos explican las fórmulas de acordes',
          'Ahora entiendes la lógica, no solo memorizas',
        ],
        classExercise:
          'Toma Do mayor. Identifica las dos terceras dentro de él. Hazlo con Sol mayor y con Lam.',
        homework: 'Toma 3 acordes que ya sepas e identifica las terceras dentro de cada uno.',
        youtubeSearch: 'chords are stacked thirds intervals piano theory',
        teacherTip: 'Este cierre es clave: conecta el módulo 4 con el 2. El estudiante siente que la teoría es un sistema coherente, no datos sueltos.',
      },
    ],
  },

  // ═══ MÓDULO 5 — LA ESCALA MAYOR ════════════════════════════════════════
  {
    moduleId: 5,
    totalMinutes: 60,
    intro: 'Meta: el estudiante construye la escala mayor con la fórmula T-T-S-T-T-T-S, la toca con digitación correcta y conoce los grados.',
    steps: [
      {
        title: 'La Fórmula de la Escala Mayor',
        duration: 12,
        whatToSay:
          '"Una escala es una escalera de sonidos: subes nota por nota hasta la octava. La escala mayor tiene una fórmula secreta de tonos y semitonos: Tono-Tono-Semitono-Tono-Tono-Tono-Semitono. Esta única fórmula construye las 12 escalas mayores."',
        keyPoints: [
          'Tono (T) = 2 semitonos. Semitono (S) = 1 semitono',
          'Fórmula mayor: T-T-S-T-T-T-S',
          'La escala mayor suena "alegre" y "completa"',
          'La misma fórmula funciona empezando desde cualquier nota',
        ],
        formula: 'Escala Mayor = T - T - S - T - T - T - S\n(Tono-Tono-Semitono-Tono-Tono-Tono-Semitono)',
        classExercise:
          'Cuenten la fórmula desde Do aplicando T-T-S-T-T-T-S. Verán que caen en todas las teclas blancas: Do-Re-Mi-Fa-Sol-La-Si-Do.',
        homework: 'Memoriza la fórmula T-T-S-T-T-T-S. Escríbela y déjala en tu teclado.',
        youtubeSearch: 'major scale formula whole half steps piano',
        teacherTip: 'Para niños, simplifica: "salto grande, salto grande, salto chico..." El concepto importa más que el vocabulario formal.',
      },
      {
        title: 'Construir la Escala de Do Mayor',
        duration: 12,
        whatToSay:
          '"Construyamos Do mayor con la fórmula, tecla por tecla. Do, sube un tono = Re. Tono = Mi. Semitono = Fa. Tono = Sol. Tono = La. Tono = Si. Semitono = Do. ¡Solo teclas blancas! Por eso Do mayor es la escala más fácil para empezar."',
        keyPoints: [
          'Do mayor = Do-Re-Mi-Fa-Sol-La-Si-Do (todas blancas)',
          'Aplica la fórmula tecla por tecla para verificar',
          'Sube y baja la escala — es un viaje de ida y vuelta',
          'La octava (el Do de arriba) cierra la escala',
        ],
        classExercise:
          'Toca la escala de Do mayor subiendo lento, una nota a la vez, di el nombre. Luego bajando. 5 veces.',
        homework: 'Toca la escala de Do mayor subiendo y bajando, 5 veces al día.',
        youtubeSearch: 'C major scale piano how to play tutorial escala Do',
        musescoreSearch: 'C major scale piano',
        teacherTip: 'Que verifiquen la fórmula ellos mismos. El descubrimiento de que "Do mayor son todas blancas porque la fórmula cae así" es poderoso.',
      },
      {
        title: 'Digitación — El Paso del Pulgar',
        duration: 14,
        whatToSay:
          '"Una escala tiene 8 notas pero solo 5 dedos. ¿La solución? El paso del pulgar. Mano derecha: dedos 1-2-3, luego pasas el pulgar POR DEBAJO para seguir con 1-2-3-4-5. El pulgar se mueve en silencio mientras los otros dedos tocan."',
        keyPoints: [
          'Digitación MD subiendo: 1-2-3-1-2-3-4-5',
          'Digitación MI subiendo: 5-4-3-2-1-3-2-1',
          'El pulgar pasa por debajo de la mano — silencioso y suave',
          'La muñeca rota ligeramente para ayudar al pulgar',
        ],
        formula: 'Do mayor MD: 1-2-3 (pulgar pasa) 1-2-3-4-5.\nDo mayor MI: 5-4-3-2-1 (dedo 3 cruza) 3-2-1.',
        classExercise:
          'Practica solo el paso del pulgar en aislado: dedos 1-2-3, pasa el pulgar. Repítelo 10 veces hasta que sea silencioso. Luego la escala completa.',
        homework: 'Practica la escala de Do con la digitación correcta, manos separadas, lento.',
        youtubeSearch: 'piano scale fingering thumb under technique',
        teacherTip: 'El paso del pulgar es la habilidad técnica clave del módulo. Practícalo en aislado. Si el pulgar "salta" en vez de deslizarse, corrígelo de inmediato.',
      },
      {
        title: 'La Escala de Sol — Aparece el Fa#',
        duration: 12,
        whatToSay:
          '"Apliquemos la fórmula a Sol. Sol-La-Si-Do-Re-Mi... y aquí, si seguimos la fórmula, el último tono nos lleva a Fa SOSTENIDO, no Fa natural. La escala de Sol mayor tiene un Fa#. La fórmula nunca miente — solo síguela."',
        keyPoints: [
          'Sol mayor = Sol-La-Si-Do-Re-Mi-Fa#-Sol',
          'El Fa# es necesario para que la fórmula T-T-S-T-T-T-S funcione',
          'Cada escala mayor distinta a Do necesita sostenidos o bemoles',
          'La fórmula te dice exactamente cuáles',
        ],
        classExercise:
          'Construye Sol mayor con la fórmula. Descubre el Fa#. Toca la escala completa con digitación.',
        homework: 'Toca las escalas de Do mayor y Sol mayor, manos separadas, cada día.',
        youtubeSearch: 'G major scale piano tutorial F sharp escala Sol',
        musescoreSearch: 'G major scale piano',
        teacherTip: 'Esto prepara el módulo 7 (armaduras). Menciona: "Fíjate que Sol mayor necesita 1 sostenido — eso es su armadura, lo veremos pronto."',
      },
      {
        title: 'Los Grados de la Escala',
        duration: 10,
        whatToSay:
          '"Cada nota de la escala tiene un número — su grado — y un nombre. El grado 1 es la tónica (el \'hogar\'). El grado 5 es la dominante (crea tensión). El grado 7 es la sensible (\'quiere\' resolver al hogar). Estos nombres importarán mucho en armonía."',
        keyPoints: [
          'Grado 1 = tónica (el centro, el "hogar")',
          'Grado 4 = subdominante',
          'Grado 5 = dominante (la tensión)',
          'Grado 7 = sensible (jala hacia la tónica)',
        ],
        formula: 'Grados: 1=Tónica, 2=Supertónica, 3=Mediante, 4=Subdominante, 5=Dominante, 6=Superdominante, 7=Sensible.',
        classExercise:
          'Toca la escala de Do diciendo el número de cada grado. Luego el profe dice "tónica" o "dominante" y el estudiante toca esa nota.',
        homework: 'Practica nombrar los grados de la escala de Do mayor.',
        youtubeSearch: 'scale degrees tonic dominant explained piano grados',
        teacherTip: 'No exijas memorizar los 7 nombres hoy. Tónica, dominante y sensible son los esenciales. El resto se asienta con el tiempo.',
      },
    ],
  },

  // ═══ MÓDULO 6 — MUNDO MAYOR Y MENOR ════════════════════════════════════
  {
    moduleId: 6,
    totalMinutes: 60,
    intro: 'Meta: el estudiante construye los 12 acordes mayores y menores y entiende el carácter emocional de las tonalidades.',
    steps: [
      {
        title: 'Repaso de Fórmulas — Chequeo Rápido',
        duration: 8,
        whatToSay:
          '"Chequeo rápido — te digo una nota y me dices el acorde mayor. ¿Re mayor? [Re-Fa#-La]. ¿Mi mayor? [Mi-Sol#-Si]. Ahora menor: ¿Re menor? [Re-Fa-La]. Listo, estás preparado. Hoy vamos por TODOS los acordes que existen."',
        keyPoints: [
          'Repaso: fórmula mayor = raíz + 4 + 3 semitonos',
          'Repaso: fórmula menor = raíz + 3 + 4 semitonos',
          'Prueba: ¿puede construir 3 acordes al azar desde la fórmula?',
          'Si la fórmula no está sólida, no avances a los 12 tonos',
        ],
        classExercise:
          'Fuego rápido: el profe dice una nota al azar, el estudiante construye el acorde mayor en 10 segundos. Luego menor. 5 rondas.',
        youtubeSearch: 'major minor chord formula all 12 keys piano',
        teacherTip: 'Si batalla con la fórmula aquí, regresa al módulo 2-4 antes de expandir. La base antes que la expansión.',
      },
      {
        title: 'Tonalidades con Sostenidos',
        duration: 16,
        whatToSay:
          '"Vamos por el teclado de forma ordenada. Desde Sol — que ya conoces — construimos: Sol, Re, La, Mi, Si, Fa#. Son las tonalidades \'con sostenidos\'. Al construir sus acordes caerás en teclas negras. No les temas. Usa la fórmula. La fórmula siempre funciona."',
        keyPoints: [
          'Sol mayor = Sol-Si-Re',
          'Re mayor = Re-Fa#-La',
          'La mayor = La-Do#-Mi',
          'Mi mayor = Mi-Sol#-Si',
          'Si mayor = Si-Re#-Fa#',
        ],
        formula: 'Avanza en sentido horario por el Círculo de Quintas: Do-Sol-Re-La-Mi-Si-Fa#.',
        classExercise:
          'Construye cada acorde uno por uno con la fórmula. Tócalo, pasa al siguiente. Sin apurar — calidad antes que velocidad.',
        homework: 'Practica Re mayor, La mayor y Mi mayor cada día, un minuto cada uno.',
        youtubeSearch: 'sharp key chords piano D A E B major lesson',
        teacherTip: 'Reencuadra el miedo a las negras: "Las teclas negras son solo notas. A la fórmula no le importa el color de la tecla."',
      },
      {
        title: 'Tonalidades con Bemoles',
        duration: 12,
        whatToSay:
          '"El otro lado: Fa, Sib, Mib, Lab, Reb. Usan bemoles — la misma fórmula, solo que las notas caen en teclas negras del otro lado. Fa mayor ya lo sabes: Fa-La-Do. Construyamos el resto."',
        keyPoints: [
          'Fa mayor = Fa-La-Do (ya aprendido)',
          'Sib mayor = Sib-Re-Fa',
          'Mib mayor = Mib-Sol-Sib',
          'Lab mayor = Lab-Do-Mib',
          'Estas tonalidades suenan ricas — el jazz las ama',
        ],
        classExercise:
          'Construye Sib y Mib con la fórmula. Tócalos en orden. Son los bemoles más comunes en el pop.',
        homework: 'Construye Sib y Mib desde la fórmula, 5 veces cada uno.',
        youtubeSearch: 'Bb Eb flat keys major chords piano lesson',
        teacherTip: 'No abrumes con todas las tonalidades con bemoles en una sesión. Sib y Mib sólidos — esos aparecen constantemente en pop y R&B.',
      },
      {
        title: 'El Cambio Emocional — Menores Expandidos',
        duration: 14,
        whatToSay:
          '"Ya conoces Lam. Ahora aplicamos la fórmula menor a cada nota. Los acordes menores son donde la música se vuelve profunda. Escucha: [Do mayor] brillante. [Do menor] otro mundo. Un truco: del mayor al menor, baja la nota del MEDIO un semitono."',
        keyPoints: [
          'Rem = Re-Fa-La',
          'Mim = Mi-Sol-Si',
          'Sim = Si-Re-Fa# (muy común en pop)',
          'Truco: del acorde mayor, baja la 3ª (nota del medio) 1 semitono → menor',
        ],
        formula: 'Atajo Mayor→Menor: baja la nota del MEDIO un semitono.\nDo-Mi-Sol → Do-Mib-Sol = Do menor.',
        classExercise:
          'Toca la progresión Lam-Fa-Do-Sol en tono menor. Compárala con Do-Sol-Lam-Fa. Mismos acordes, emoción distinta.',
        homework: 'Toca Rem, Mim y Sim desde la fórmula, 10 veces cada uno.',
        youtubeSearch: 'minor chords piano Dm Em Bm lesson acordes menores',
        teacherTip: 'El atajo (bajar la 3ª) es útil una vez que dominan los mayores. Enséñalo como herramienta extra, no como reemplazo de la fórmula.',
      },
      {
        title: 'El Carácter de las Tonalidades',
        duration: 10,
        whatToSay:
          '"Algo hermoso: cada tonalidad tiene una \'personalidad\'. Do mayor = puro, simple, inocente. Re mayor = brillante, triunfal. Mi menor = melancólico, pensativo. La menor = introspectivo. Los compositores eligen la tonalidad por la emoción que transmite."',
        keyPoints: [
          'Do mayor = puro, simple, inocente',
          'Re mayor = brillante, triunfal, festivo',
          'Sol mayor = pastoral, calmado, alegre',
          'Mi menor = melancólico, pensativo',
          'La menor = introspectivo, natural, suave',
        ],
        classExercise:
          'Toca una progresión simple en Do, luego en Re, luego en Mim. Que el estudiante describa cómo "se siente" cada una.',
        homework: 'Escucha 3 canciones e intenta describir el "ánimo" de su tonalidad.',
        youtubeSearch: 'emotional character of musical keys explained',
        teacherTip: 'El carácter de las tonalidades es algo subjetivo y poético — no hay respuestas "incorrectas". Es para despertar la sensibilidad del estudiante.',
      },
    ],
  },

  // ═══ MÓDULO 7 — ARMADURAS Y CÍRCULO DE QUINTAS ═════════════════════════
  {
    moduleId: 7,
    totalMinutes: 60,
    intro: 'Meta: el estudiante lee armaduras, conoce el orden de sostenidos/bemoles y usa el Círculo de Quintas.',
    steps: [
      {
        title: '¿Qué es una Armadura?',
        duration: 10,
        whatToSay:
          '"Cuando abres una partitura, justo después de la clave hay unos símbolos: sostenidos o bemoles. Eso es la armadura (key signature). Te dice en qué tonalidad está la pieza y qué notas van alteradas todo el tiempo. Es un mensaje del compositor."',
        keyPoints: [
          'La armadura = sostenidos/bemoles al inicio del pentagrama',
          'Te dice la tonalidad de la pieza',
          'Las notas alteradas aplican a TODA la pieza',
          'Do mayor / La menor = sin armadura (0 alteraciones)',
        ],
        formula: 'Armadura con sostenidos → tonalidad mayor con sostenidos.\nArmadura con bemoles → tonalidad mayor con bemoles.\n0 alteraciones = Do mayor o La menor.',
        classExercise:
          'Mira 3 partituras distintas. Identifica la armadura de cada una. ¿Cuántos sostenidos o bemoles tiene?',
        youtubeSearch: 'key signatures explained piano armaduras',
        musescoreSearch: 'key signatures reference',
        teacherTip: 'Conecta con el módulo 5-6: "¿Recuerdas que Sol mayor necesitaba un Fa#? Ese Fa# es su armadura."',
      },
      {
        title: 'El Círculo de Quintas',
        duration: 14,
        whatToSay:
          '"Te presento la herramienta más poderosa de toda la teoría: el Círculo de Quintas. Es un reloj de tonalidades. Arriba está Do (sin alteraciones). Cada paso en sentido horario sube una 5ª y agrega un sostenido. Cada paso antihorario agrega un bemol."',
        keyPoints: [
          'Arriba (12 en punto) = Do mayor, 0 alteraciones',
          'Horario: Do→Sol→Re→La→Mi→Si→Fa# (suman sostenidos)',
          'Antihorario: Do→Fa→Sib→Mib→Lab→Reb (suman bemoles)',
          'Tonalidades vecinas en el círculo suenan bien juntas',
        ],
        formula: 'Horario = +1 sostenido por paso (subes una 5ª).\nAntihorario = +1 bemol por paso (bajas una 5ª).',
        classExercise:
          'Dibujen juntos el Círculo de Quintas. El estudiante lo recorre nombrando las tonalidades en sentido horario.',
        homework: 'Dibuja el Círculo de Quintas de memoria cada día hasta que te salga sin pensar.',
        youtubeSearch: 'circle of fifths explained beginners circulo de quintas',
        teacherTip: 'El Círculo de Quintas vale la pena dibujarlo a mano muchas veces. Cuando lo internalizan, la teoría entera "hace clic".',
      },
      {
        title: 'El Orden de los Sostenidos',
        duration: 12,
        whatToSay:
          '"Los sostenidos siempre aparecen en el mismo orden: Fa, Do, Sol, Re, La, Mi, Si. Sol mayor tiene 1 sostenido (Fa#). Re mayor tiene 2 (Fa#, Do#). Cada tonalidad nueva agrega el siguiente sostenido de la lista, en ese orden exacto."',
        keyPoints: [
          'Orden de sostenidos: Fa-Do-Sol-Re-La-Mi-Si',
          'Sol mayor = 1 sostenido (Fa#)',
          'Re mayor = 2 sostenidos (Fa#, Do#)',
          'La mayor = 3, Mi mayor = 4, etc.',
        ],
        formula: 'Truco para hallar la tonalidad: el ÚLTIMO sostenido + 1 semitono = la tónica. (Último sostenido Fa# → Sol mayor.)',
        classExercise:
          'Recita el orden de sostenidos. Luego, dada una cantidad de sostenidos, nombra la tonalidad.',
        homework: 'Memoriza el orden de sostenidos: Fa-Do-Sol-Re-La-Mi-Si.',
        youtubeSearch: 'order of sharps key signatures piano',
        teacherTip: 'El truco "último sostenido + semitono" es oro. Practícalo hasta que sea instantáneo.',
      },
      {
        title: 'El Orden de los Bemoles',
        duration: 12,
        whatToSay:
          '"Los bemoles aparecen en el orden INVERSO de los sostenidos: Si, Mi, La, Re, Sol, Do, Fa. Fa mayor tiene 1 bemol (Sib). Sib mayor tiene 2. Es el espejo exacto de los sostenidos."',
        keyPoints: [
          'Orden de bemoles: Si-Mi-La-Re-Sol-Do-Fa (inverso de los sostenidos)',
          'Fa mayor = 1 bemol (Sib)',
          'Sib mayor = 2 bemoles (Sib, Mib)',
          'El penúltimo bemol nombra la tonalidad',
        ],
        formula: 'Truco para tonalidades con bemoles: el PENÚLTIMO bemol ES la tónica. (Bemoles Sib, Mib → Sib mayor.)',
        classExercise:
          'Recita el orden de bemoles. Dada una armadura con bemoles, nombra la tonalidad usando el truco.',
        homework: 'Memoriza el orden de bemoles e practica el truco del penúltimo bemol.',
        youtubeSearch: 'order of flats key signatures piano',
        teacherTip: 'Excepción: Fa mayor tiene solo 1 bemol, así que el truco no aplica — se memoriza directo. Avísalo.',
      },
      {
        title: 'Tonalidades Relativas',
        duration: 10,
        whatToSay:
          '"Última pieza: cada tonalidad mayor tiene una \'gemela\' menor que comparte exactamente la misma armadura. Do mayor y La menor — ambas sin alteraciones. Sol mayor y Mi menor — ambas con Fa#. Son tonalidades relativas. La menor relativa está una 3ª menor abajo de la mayor."',
        keyPoints: [
          'Cada tonalidad mayor tiene una menor relativa con la misma armadura',
          'Do mayor ↔ La menor',
          'Sol mayor ↔ Mi menor',
          'La menor relativa = 3 semitonos abajo de la tónica mayor',
        ],
        formula: 'Menor relativa = baja 3 semitonos desde la tónica mayor.\n(Do → baja 3 → La. Do mayor y La menor comparten armadura.)',
        classExercise:
          'Para 4 tonalidades mayores, el estudiante encuentra su menor relativa.',
        homework: 'Practica encontrar la menor relativa de cualquier tonalidad mayor.',
        youtubeSearch: 'relative minor major keys explained piano',
        teacherTip: 'Las tonalidades relativas explican por qué una canción puede sentirse "mayor" y "menor" a la vez — usa ambos centros.',
      },
    ],
  },

  // ═══ MÓDULO 8 — INVERSIONES Y VOICINGS ═════════════════════════════════
  {
    moduleId: 8,
    totalMinutes: 60,
    intro: 'Meta: el estudiante toca acordes en posición fundamental, 1ª y 2ª inversión, y usa voicings cercanos para cambios suaves.',
    steps: [
      {
        title: '¿Qué es una Inversión?',
        duration: 10,
        whatToSay:
          '"Hasta ahora tocas los acordes \'apilados\' desde la raíz: Do-Mi-Sol. Pero puedes reordenar esas notas. Toma el Do de abajo y súbelo una octava: Mi-Sol-Do. ¡Es el MISMO acorde de Do — las mismas 3 notas — pero suena distinto! Eso es una inversión."',
        keyPoints: [
          'Una inversión = el mismo acorde con las notas reordenadas',
          'Mismas 3 notas, distinto orden, distinto color',
          'La nota más grave (el bajo) define qué inversión es',
          'Es el mismo acorde — no uno nuevo',
        ],
        formula: 'Para invertir: toma la nota más grave y súbela una octava. Repite para más inversiones.',
        classExercise:
          'Toca Do mayor en posición fundamental. Sube el Do una octava → 1ª inversión. Sube el Mi → 2ª inversión.',
        youtubeSearch: 'chord inversions explained piano beginners inversiones',
        teacherTip: 'Que el estudiante VEA que son las mismas notas. La confusión común: creen que es un acorde nuevo. Recálcalo.',
      },
      {
        title: 'Las 3 Posiciones de Do',
        duration: 14,
        whatToSay:
          '"Do mayor tiene 3 posiciones. Fundamental: Do-Mi-Sol. Primera inversión: Mi-Sol-Do. Segunda inversión: Sol-Do-Mi. Practiquemos las tres, una y otra vez, hasta que las tres se sientan naturales bajo la mano."',
        keyPoints: [
          'Fundamental: Do-Mi-Sol (la raíz abajo)',
          '1ª inversión: Mi-Sol-Do (la 3ª abajo)',
          '2ª inversión: Sol-Do-Mi (la 5ª abajo)',
          'La digitación cambia en cada posición',
        ],
        formula: 'Tríada de 3 notas → 3 posiciones: Fundamental, 1ª inversión, 2ª inversión.',
        classExercise:
          'Toca las 3 posiciones de Do mayor en orden, subiendo el teclado. Luego cicla entre ellas sin parar.',
        homework: 'Practica las 3 inversiones de Do mayor, subiendo y bajando, cada día.',
        youtubeSearch: 'C major chord inversions piano practice',
        musescoreSearch: 'triad inversions exercises piano',
        teacherTip: 'La digitación de las inversiones se siente extraña al inicio. Da digitaciones concretas y sé paciente — la mano necesita tiempo.',
      },
      {
        title: 'Inversiones de los 4 Acordes Mágicos',
        duration: 14,
        whatToSay:
          '"Apliquemos las inversiones a los 4 acordes que ya amas: Do, Sol, Lam, Fa. Cada uno tiene sus 3 posiciones. Esto te da 12 maneras de tocar tu progresión favorita — y algunas suenan MUCHO mejor que otras."',
        keyPoints: [
          'Cada uno de los 4 acordes mágicos tiene 3 posiciones',
          'Algunas posiciones están más cerca unas de otras',
          'Elegir la posición correcta = transiciones suaves',
          'Es lo que separa a un principiante de alguien pulido',
        ],
        classExercise:
          'Toca Do-Sol-Lam-Fa primero todo en posición fundamental (con saltos torpes). Luego busca posiciones cercanas. Compara el sonido.',
        homework: 'Practica los 4 acordes mágicos en sus 3 inversiones.',
        youtubeSearch: 'chord inversions four chords piano smooth',
        teacherTip: 'El contraste es la lección: toca la progresión "saltando" vs con inversiones cercanas. El estudiante OYE la diferencia y se convence solo.',
      },
      {
        title: 'Conducción de Voces — Mover lo Mínimo',
        duration: 12,
        whatToSay:
          '"La regla de oro de los acordes profesionales: al cambiar de acorde, mueve la MENOR cantidad de notas posible. Si una nota se puede quedar igual, que se quede. Eso es la conducción de voces (voice leading). Hace que los cambios suenen suaves, conectados, profesionales."',
        keyPoints: [
          'Voice leading = mover lo mínimo entre acordes',
          'Si una nota es común a dos acordes, mantenla',
          'Elige la inversión más cercana al acorde anterior',
          'Cambios suaves = sonido profesional',
        ],
        formula: 'Regla del voice leading: del acorde A al B, busca la inversión de B que esté MÁS CERCA de A.',
        classExercise:
          'Conecta Do → Sol moviendo lo mínimo posible. Luego toda la progresión Do-Sol-Lam-Fa con voicings cercanos.',
        homework: 'Toca Do-Sol-Lam-Fa con voicings cercanos hasta que suene completamente suave.',
        youtubeSearch: 'voice leading piano chord progressions smooth',
        teacherTip: 'Voice leading es lo que hace que un acompañamiento suene "pro". Vale dedicarle tiempo — es una de las habilidades de mayor impacto.',
      },
      {
        title: 'Voicing Abierto vs Cerrado',
        duration: 10,
        whatToSay:
          '"Una idea más: hasta ahora tocas voicings \'cerrados\' — las notas juntitas. Pero puedes separar las notas entre las dos manos para un sonido más amplio y rico. Eso es un voicing abierto. La izquierda toma la raíz, la derecha toma el resto, más arriba."',
        keyPoints: [
          'Voicing cerrado = notas del acorde juntas',
          'Voicing abierto = notas separadas, más espacio',
          'Reparte el acorde entre las dos manos',
          'El voicing abierto suena más amplio, más "pleno"',
        ],
        classExercise:
          'Toca Do mayor cerrado con una mano. Luego abierto: Do en la izquierda, Mi-Sol arriba en la derecha. Compara.',
        homework: 'Experimenta tocando los 4 acordes mágicos en voicing abierto.',
        youtubeSearch: 'open vs closed voicing piano chords',
        teacherTip: 'El voicing abierto es un puente hacia el módulo 9 (ambas manos). Conéctalo: "Pronto cada mano tendrá su propio trabajo."',
      },
    ],
  },

  // ═══ MÓDULO 9 — AMBAS MANOS ════════════════════════════════════════════
  {
    moduleId: 9,
    totalMinutes: 60,
    intro: 'Meta: el estudiante toca una canción simple con ambas manos juntas, aunque sea a tempo lento. La independencia es el gran salto.',
    steps: [
      {
        title: 'Dos Jugadores, Un Equipo',
        duration: 10,
        whatToSay:
          '"Hoy trabajamos la habilidad más difícil del piano: usar las dos manos de forma independiente. La verdad: tu cerebro QUIERE sincronizar las manos. Pero en el piano cada mano es su propio jugador. La izquierda es el bajista, la derecha es el cantante."',
        keyPoints: [
          'Independencia de manos = cada mano hace su propio trabajo',
          'El cerebro lo resiste al inicio — es normal',
          'Entrena cada mano hasta que sea automática, luego combina',
          'La práctica "manos separadas" es el 80% del trabajo',
        ],
        formula: 'La Regla 90/10: el 90% de los problemas de "manos juntas" se resuelven con mejor práctica de "manos separadas".',
        classExercise:
          'Date palmaditas en la cabeza mientras frotas tu panza. Ríete. Esa es la metáfora — no es imposible, solo necesita entrenamiento.',
        youtubeSearch: 'piano hand independence exercises beginners',
        teacherTip: 'No te apures a "manos juntas". El estudiante rogará saltar la práctica separada "aburrida". Mantente firme.',
      },
      {
        title: 'Mano Derecha Sola — La Melodía',
        duration: 15,
        whatToSay:
          '"Aprendemos [canción elegida]. Primero — solo mano derecha. Ni pienses en la izquierda. Tu único trabajo ahora es que la mano derecha quede perfecta. Lento, claro, con los dedos correctos."',
        keyPoints: [
          'Elige una sección corta — solo 4 compases',
          'Solo mano derecha, al 50% de velocidad',
          'Digitación correcta desde el compás 1',
          'Memoriza mientras avanzas — no leas las notas mil veces',
        ],
        classExercise:
          'Toca la sección de 4 compases solo con la derecha, al 50%. Pregúntale: "¿Puedes tocarla mientras te hablo?" Así sabes que es automática.',
        homework: 'Mano derecha de la sección, 5 veces lento, cada día.',
        youtubeSearch: 'slow practice piano right hand melody technique',
        teacherTip: 'Mantén la sección CORTA. 4 compases mejor que 16. Dominar algo pequeño da más confianza que tropezar con algo grande.',
      },
      {
        title: 'Mano Izquierda Sola — El Acompañamiento',
        duration: 12,
        whatToSay:
          '"Lo mismo para la izquierda. Mano derecha en el regazo. Solo izquierda. Tu trabajo es que el patrón de la izquierda se sienta como respirar — automático, sin esfuerzo. Debe sentirse fácil ANTES de agregar la derecha."',
        keyPoints: [
          'Izquierda: notas raíz o patrón de acordes, lo que pida la canción',
          'Mantenlo simple — la izquierda más simple que funcione es la mejor',
          'Debe ser automática antes de combinar',
          'Mirada al frente — no mires la izquierda',
        ],
        classExercise:
          'Solo izquierda, la misma sección de 4 compases. Tócala 5 veces limpia. Luego con ojos cerrados.',
        homework: 'Mano izquierda de la sección, 5 veces al día (aparte de la práctica de la derecha).',
        youtubeSearch: 'left hand piano accompaniment practice tips',
        teacherTip: 'La izquierda suele necesitar MÁS práctica que la derecha. Dale tiempo extra si hace falta.',
      },
      {
        title: 'El Punto de Encuentro — Juntas, Lento',
        duration: 15,
        whatToSay:
          '"El momento que veníamos construyendo. Ambas manos — pero LENTO. La meta no es velocidad, es limpieza. Empieza al 30% si hace falta. Cuando se rompa, identifica qué mano falló, arréglala por separado, y vuelve a intentar juntas."',
        keyPoints: [
          'Empieza al 30-50% del tempo objetivo — más lento de lo que crees',
          'Si una mano falla, identifica cuál y vuelve a manos separadas',
          'Cuenta en voz alta mientras tocas — ayuda a la coordinación',
          'Aunque sean 4 compases limpios juntos, es un hito enorme',
        ],
        classExercise:
          'Ambas manos, muy lento (metrónomo al 50% del objetivo). 4 compases. Repite 3 veces.',
        homework: 'Toca con ambas manos, lento, 3 veces al día. No aceleres hasta que esté limpio.',
        youtubeSearch: 'hands together piano practice slow method',
        teacherTip: 'Querrá ir más rápido. Explícale: "La velocidad llega sola cuando los movimientos están grabados. Apurar la práctica lenta es el error #1."',
      },
      {
        title: 'Celebrar y Construir',
        duration: 8,
        whatToSay:
          '"Escuchemos todo. Ambas manos, de principio a fin. A la velocidad que te sea cómoda. No busco perfecto — busco comprometido. Aunque sea lento y desordenado, tócalo todo sin parar. En un escenario nunca paras."',
        keyPoints: [
          'Primera pasada completa con ambas manos = gran hito',
          'No pares por los errores — sigue',
          'Evaluación: ¿qué secciones están fuertes? ¿qué falta?',
          'Graba al estudiante — que se escuche',
        ],
        classExercise:
          'Pasada completa, ambas manos, sin parar. Grábalo. Reprodúcelo. Identifica 1 cosa buena y 1 a mejorar.',
        homework: 'Toca la sección con ambas manos, de memoria, 3 veces al día.',
        youtubeSearch: 'performance mindset piano playing through mistakes',
        teacherTip: 'La grabación es poderosa. "¡Sonó mejor de lo que pensé!" — o escuchan exactamente qué mejorar. Más honesto que su propia percepción.',
      },
    ],
  },

  // ═══ MÓDULO 10 — LECTURA MUSICAL ═══════════════════════════════════════
  {
    moduleId: 10,
    totalMinutes: 60,
    intro: 'Meta: el estudiante nombra notas en clave de Sol y Fa, lee valores de notas y lee a primera vista una pieza simple.',
    steps: [
      {
        title: 'El Mapa del Sonido — La Clave de Sol',
        duration: 12,
        whatToSay:
          '"Una partitura es un mapa. Las notas en el papel te dicen qué tecla tocar y cuánto sostenerla. El pentagrama — estas 5 líneas — es el mapa. La clave de Sol al inicio dice: \'esta es la zona aguda, la mano derecha\'. Ese símbolo es una G estilizada."',
        keyPoints: [
          'Pentagrama = 5 líneas + 4 espacios',
          'Clave de Sol (treble clef) = mano derecha / notas agudas',
          'Las notas se sientan EN las líneas o EN los espacios',
          'Más arriba en el pentagrama = más agudo en el teclado',
        ],
        formula: 'Clave de Sol — Líneas (de abajo arriba): Mi-Sol-Si-Re-Fa.\nEspacios (de abajo arriba): Fa-La-Do-Mi = "FACE".',
        classExercise:
          'Dibujen un pentagrama y la clave de Sol. Coloca notas en líneas y espacios — el estudiante nombra cada una.',
        youtubeSearch: 'treble clef notes piano staff reading clave de sol',
        musescoreSearch: 'treble clef note reading exercises',
        teacherTip: 'No memorices las 9 posiciones de golpe. Primero las líneas (5 notas), domínalas, luego los espacios (4).',
      },
      {
        title: 'La Clave de Fa — La Mano Izquierda',
        duration: 13,
        whatToSay:
          '"Ahora la otra mitad: la clave de Fa (bass clef). Es para la mano izquierda, las notas graves. Tiene sus propias líneas y espacios. Es distinta a la clave de Sol — el mismo punto en el papel significa una nota diferente."',
        keyPoints: [
          'Clave de Fa (bass clef) = mano izquierda / notas graves',
          'Líneas (abajo arriba): Sol-Si-Re-Fa-La',
          'Espacios (abajo arriba): La-Do-Mi-Sol',
          'No confundas las dos claves — practica cada una aparte',
        ],
        formula: 'Clave de Fa — Líneas: Sol-Si-Re-Fa-La.\nEspacios: La-Do-Mi-Sol.',
        classExercise:
          'Dibuja la clave de Fa. Nombra notas en sus líneas y espacios. Compara con la clave de Sol — siente la diferencia.',
        homework: 'Practica nombrar notas en clave de Fa con flashcards, 5 min al día.',
        youtubeSearch: 'bass clef notes piano reading clave de fa',
        musescoreSearch: 'bass clef note reading exercises',
        teacherTip: 'La clave de Fa suele ser la más temida. Pero es solo otro mapa. Mantén las sesiones cortas y repetidas.',
      },
      {
        title: 'El Pentagrama Doble',
        duration: 10,
        whatToSay:
          '"Cuando tocas piano con ambas manos, lees DOS pentagramas a la vez: clave de Sol arriba, clave de Fa abajo. Juntos forman el pentagrama doble (grand staff). El Do central los conecta — vive justo en medio de ambos."',
        keyPoints: [
          'Pentagrama doble = clave de Sol + clave de Fa',
          'Clave de Sol = mano derecha, clave de Fa = mano izquierda',
          'El Do central conecta ambas claves (línea adicional)',
          'Lees ambos pentagramas a la vez al tocar',
        ],
        classExercise:
          'Identifica el Do central en el pentagrama doble. Lee una nota de la clave de Sol y una de la de Fa.',
        homework: 'Practica ubicar el Do central y leer notas en ambas claves.',
        youtubeSearch: 'grand staff middle C piano reading pentagrama doble',
        teacherTip: 'El Do central es el ancla. Si el estudiante lo ubica con seguridad, todo lo demás se referencia desde ahí.',
      },
      {
        title: 'Valores de Notas y Silencios',
        duration: 13,
        whatToSay:
          '"Sabes DÓNDE tocar — ahora CUÁNTO. La forma de la nota te dice la duración. Redonda = 4 tiempos. Blanca = 2. Negra = 1. Corchea = medio tiempo. Y los silencios (rests) te dicen cuándo NO tocar."',
        keyPoints: [
          'Redonda (whole note) = 4 tiempos',
          'Blanca (half note) = 2 tiempos',
          'Negra (quarter note) = 1 tiempo',
          'Corchea (eighth note) = ½ tiempo',
          'Los silencios = duración de quietud',
        ],
        formula: 'Árbol de valores: 1 Redonda = 2 Blancas = 4 Negras = 8 Corcheas.\nAplaude y cuenta el ritmo ANTES de tocar.',
        classExercise:
          'El profe escribe un ritmo de 4 compases. El estudiante lo aplaude contando en voz alta, luego lo toca en una sola nota.',
        homework: 'Aplaude un ritmo de 4 tiempos cada día con distintos valores de notas.',
        youtubeSearch: 'note values rests piano rhythm reading valores',
        teacherTip: 'Insiste en "aplaudir antes de tocar". Separa la lectura del ritmo del movimiento de los dedos — ambos deben ser conscientes.',
      },
      {
        title: 'Primera Lectura a Primera Vista',
        duration: 12,
        whatToSay:
          '"Ahora unimos todo. Te doy una melodía simple de 4 compases. Antes de tocar: nombra todas las notas en voz alta. Luego aplaude el ritmo. Luego tócala lento. La lectura a primera vista es una habilidad — esto es el día uno."',
        keyPoints: [
          'Proceso: 1) Escanea la música 2) Nombra las notas 3) Aplaude el ritmo 4) Toca lento',
          'Nunca apures la lectura a primera vista — precisión primero',
          'Marca las notas dudosas antes de tocar',
          'La lectura mejora con práctica diaria, no con esfuerzo en el momento',
        ],
        classExercise:
          'Dale una pieza simple de 4 compases. El estudiante nombra notas, aplaude el ritmo, toca la MD lento.',
        homework: 'Lee una pieza nueva pequeña cada día con el proceso de 4 pasos.',
        youtubeSearch: 'beginner piano sight reading easy pieces lectura',
        musescoreSearch: 'beginner sight reading exercises grade 1',
        teacherTip: 'El estudiante se avergonzará al fallar leyendo. Normalízalo: "Hasta los pianistas profesionales fallan leyendo a primera vista. Por eso se practica a diario."',
      },
    ],
  },

  // ═══ MÓDULO 11 — ACORDES DE SÉPTIMA Y COLOR ════════════════════════════
  {
    moduleId: 11,
    totalMinutes: 60,
    intro: 'Meta: el estudiante construye y toca acordes maj7, m7, dom7, disminuidos, aumentados y suspendidos.',
    steps: [
      {
        title: 'La Cuarta Nota — Más Color',
        duration: 10,
        whatToSay:
          '"Hasta ahora tus acordes tienen 3 notas — tríadas. Hoy agregamos una 4ª nota: la séptima. Esa nota extra transforma un acorde simple en algo expresivo, sofisticado, con \'color\'. Es el sonido del jazz, el soul, el R&B y el lo-fi."',
        keyPoints: [
          'Tríada = acorde de 3 notas (lo que ya sabes)',
          'Acorde de séptima = tríada + una 4ª nota (la 7ª)',
          'La 7ª agrega "color" y sofisticación',
          'Es el sonido del jazz, soul, R&B, neo-soul',
        ],
        formula: 'Acorde de 7ª = Tríada + la nota que está una 7ª arriba de la raíz.\nHay distintos tipos de 7ª = distintos colores.',
        classExercise:
          'Toca Do mayor (tríada). Ahora agrega un Si arriba → Domaj7. Escucha cómo cambia el color.',
        youtubeSearch: 'seventh chords explained piano beginners acordes septima',
        teacherTip: 'Empieza por el SONIDO, no la teoría. Toca una tríada y luego su 7ª — deja que oigan la diferencia antes de explicar.',
      },
      {
        title: 'Séptima Mayor (maj7) — El Soñador',
        duration: 13,
        whatToSay:
          '"El primer tipo: la séptima mayor. Toma una tríada mayor y agrega la 7ª mayor (11 semitonos desde la raíz). Domaj7 = Do-Mi-Sol-Si. Escucha — suena soñador, suave, hermoso. Es ese sonido \'aesthetic\' del lo-fi."',
        keyPoints: [
          'maj7 = tríada mayor + 7ª mayor',
          'Domaj7 (Cmaj7) = Do-Mi-Sol-Si',
          'Suena soñador, relajado, hermoso',
          'La 7ª mayor está 1 semitono debajo de la octava',
        ],
        formula: 'maj7 = Raíz + 4 + 3 + 4 semitonos.\nO más fácil: tríada mayor + la nota 1 semitono bajo la octava.',
        classExercise:
          'Construye Domaj7, Famaj7 y Solmaj7. Tócalos en secuencia y disfruta el sonido soñador.',
        homework: 'Toca Domaj7 y Famaj7 cada día. Escucha su color.',
        youtubeSearch: 'major seventh chord piano dreamy sound maj7',
        teacherTip: 'El maj7 es el más fácil de amar — suena precioso de inmediato. Empieza por aquí para enganchar al estudiante.',
      },
      {
        title: 'Séptima Menor (m7) — El Suave',
        duration: 12,
        whatToSay:
          '"El segundo tipo: la séptima menor. Tríada menor + 7ª menor. Rem7 = Re-Fa-La-Do. Suena suave, terso, cool. El m7 es el caballo de batalla del R&B y el neo-soul. Si el maj7 es soñador, el m7 es relajado y elegante."',
        keyPoints: [
          'm7 = tríada menor + 7ª menor',
          'Rem7 (Dm7) = Re-Fa-La-Do',
          'Suena suave, terso, sofisticado',
          'Es el acorde base del R&B y el neo-soul',
        ],
        formula: 'm7 = Raíz + 3 + 4 + 3 semitonos.\nO: tríada menor + la nota 2 semitonos bajo la octava.',
        classExercise:
          'Construye Rem7, Mim7 y Lam7. Tócalos en secuencia. Combina con los maj7 del paso anterior.',
        homework: 'Toca Rem7, Mim7 y Lam7 cada día.',
        youtubeSearch: 'minor seventh chord piano smooth m7 R&B',
        teacherTip: 'Los acordes m7 hacen que casi cualquier progresión suene "pro" al instante. Muestra una progresión pop simple convertida toda a m7.',
      },
      {
        title: 'Séptima de Dominante (dom7) — La Tensión',
        duration: 13,
        whatToSay:
          '"El tercer tipo es especial: la séptima de dominante. Tríada mayor + 7ª MENOR. Sol7 = Sol-Si-Re-Fa. Escucha — no suena resuelto, suena tenso, \'quiere\' moverse. Ese acorde JALA hacia el acorde de Do. Es el motor de toda la música."',
        keyPoints: [
          'dom7 = tríada MAYOR + 7ª MENOR (la mezcla)',
          'Sol7 (G7) = Sol-Si-Re-Fa',
          'Suena tenso, inestable, "quiere resolver"',
          'El dom7 jala hacia la tónica (Sol7 → Do)',
        ],
        formula: 'dom7 = Raíz + 4 + 3 + 3 semitonos.\nEl V7 resuelve al I — es la cadencia más poderosa.',
        classExercise:
          'Toca Sol7 y luego Do mayor. Siente cómo Sol7 "se resuelve" en Do. Ese es el corazón de la armonía.',
        homework: 'Practica Sol7 → Do y Do7 → Fa. Siente la resolución.',
        youtubeSearch: 'dominant seventh chord piano tension resolution dom7',
        teacherTip: 'El dom7 → I es el concepto más importante de la armonía funcional. Prepara el terreno para el módulo 13 (cadencias).',
      },
      {
        title: 'Disminuidos, Aumentados y Suspendidos',
        duration: 12,
        whatToSay:
          '"Cerramos con tres acordes de color especial. El disminuido (dim) — tenso y dramático, perfecto para suspenso. El aumentado (aug) — extraño, de ensueño. Y los suspendidos (sus2, sus4) — abiertos, sin definir, que \'quieren\' resolver."',
        keyPoints: [
          'Disminuido (dim) = dos 3ªs menores apiladas — tenso, dramático',
          'Aumentado (aug) = dos 3ªs mayores apiladas — extraño, flotante',
          'sus4 = reemplaza la 3ª por la 4ª — abierto, sin resolver',
          'sus2 = reemplaza la 3ª por la 2ª — fresco, ambiguo',
        ],
        formula: 'dim = Raíz + 3 + 3. aug = Raíz + 4 + 4.\nsus4 = Raíz + 5 + 2. sus2 = Raíz + 2 + 5.',
        classExercise:
          'Toca un acorde disminuido (drama), uno aumentado (misterio), un sus4 y resuélvelo a la tríada mayor.',
        homework: 'Experimenta con acordes dim, aug y sus. Escucha qué emoción transmite cada uno.',
        youtubeSearch: 'diminished augmented suspended chords piano',
        teacherTip: 'Estos acordes son "especias". No se usan todo el tiempo, pero saben transformar un momento. Preséntalos como herramientas de color.',
      },
    ],
  },

  // ═══ MÓDULO 12 — ESCALAS MENORES Y MODOS ═══════════════════════════════
  {
    moduleId: 12,
    totalMinutes: 60,
    intro: 'Meta: el estudiante toca las 3 escalas menores y al menos 3 modos, entendiendo el color de cada uno.',
    steps: [
      {
        title: 'La Escala Menor Natural',
        duration: 12,
        whatToSay:
          '"Conoces la escala mayor — la \'alegre\'. Ahora la menor natural, la \'misteriosa\'. La menor natural de La son todas las teclas blancas, pero empezando en La. Tiene su propia fórmula de tonos y semitonos, y un sonido más oscuro y emotivo."',
        keyPoints: [
          'Menor natural de La = teclas blancas desde La (La-Si-Do-Re-Mi-Fa-Sol-La)',
          'Suena oscura, misteriosa, melancólica',
          'Es la menor relativa de Do mayor (mismas notas)',
          'Tiene su propia fórmula de tonos/semitonos',
        ],
        formula: 'Escala Menor Natural = T-S-T-T-S-T-T.\n(Compárala con la mayor: T-T-S-T-T-T-S.)',
        classExercise:
          'Toca la escala menor natural de La, subiendo y bajando. Compárala con Do mayor — mismas notas, ánimo distinto.',
        homework: 'Toca la escala menor natural de La cada día.',
        youtubeSearch: 'natural minor scale piano escala menor natural',
        musescoreSearch: 'A natural minor scale piano',
        teacherTip: 'Conecta con el módulo 7: la menor natural de La es la relativa de Do mayor. El estudiante ya conoce las notas.',
      },
      {
        title: 'Menor Armónica y Melódica',
        duration: 13,
        whatToSay:
          '"Hay dos versiones más de la escala menor. La menor armónica eleva el 7º grado — crea ese sonido \'exótico\', medio español/medio oriental, y una tensión fuerte hacia la tónica. La menor melódica eleva el 6º y 7º al subir, pero los baja al regresar."',
        keyPoints: [
          'Menor armónica = menor natural con la 7ª ELEVADA un semitono',
          'La armónica suena exótica, dramática, con tensión',
          'Menor melódica = 6ª y 7ª elevadas al SUBIR, naturales al BAJAR',
          'La melódica suaviza el salto grande de la armónica',
        ],
        formula: 'Menor armónica: eleva el grado 7.\nMenor melódica: eleva grados 6 y 7 subiendo, naturales bajando.',
        classExercise:
          'Toca las tres menores de La en fila: natural, armónica, melódica. Escucha cómo cada una cambia el carácter.',
        homework: 'Practica la menor armónica de La. Escucha su sonido exótico.',
        youtubeSearch: 'harmonic melodic minor scale piano explained',
        musescoreSearch: 'harmonic minor melodic minor scale',
        teacherTip: 'No abrumes — la menor armónica es la más útil de las dos. La melódica puede quedar como concepto si el estudiante aún no está listo.',
      },
      {
        title: '¿Qué es un Modo?',
        duration: 12,
        whatToSay:
          '"Aquí viene algo fascinante: los modos. Toma la escala de Do mayor. Si la tocas pero empezando desde Re en vez de Do — usando las mismas teclas blancas — obtienes un sonido completamente distinto. Eso es un modo. Cada grado de la escala genera un modo."',
        keyPoints: [
          'Un modo = la escala mayor empezando desde un grado distinto',
          'Mismas notas, distinto centro = distinto color',
          'Hay 7 modos, uno por cada grado',
          'Cada modo tiene su propia personalidad emocional',
        ],
        formula: 'Los 7 modos (desde Do mayor): Jónico(1), Dórico(2), Frigio(3), Lidio(4), Mixolidio(5), Eólico(6), Locrio(7).',
        classExercise:
          'Toca las teclas blancas de Do a Do (Jónico = mayor). Luego de Re a Re (Dórico). Escucha el cambio.',
        youtubeSearch: 'music modes explained piano beginners modos',
        teacherTip: 'El concepto clave: "mismas teclas, distinto hogar". Hazlo concreto en el teclado antes de nombrar los 7 modos.',
      },
      {
        title: 'Dórico y Mixolidio — Los Más Útiles',
        duration: 13,
        whatToSay:
          '"De los 7 modos, dos son los más usados en la música popular. El Dórico — un menor con un toque \'cool\' y jazzy. Y el Mixolidio — un mayor con un toque \'bluesy\', usado en rock y funk. Si dominas estos dos, ya cubres mucho repertorio."',
        keyPoints: [
          'Dórico = empieza en el grado 2. Suena menor pero "cool/jazzy"',
          'Re Dórico = teclas blancas de Re a Re',
          'Mixolidio = empieza en el grado 5. Suena mayor pero "bluesy"',
          'Sol Mixolidio = teclas blancas de Sol a Sol',
        ],
        formula: 'Dórico = escala menor con la 6ª elevada.\nMixolidio = escala mayor con la 7ª bajada.',
        classExercise:
          'Toca Re Dórico y Sol Mixolidio. Improvisa una melodía corta en cada uno. Describe el ánimo.',
        homework: 'Practica Re Dórico y Sol Mixolidio. Improvisa con cada uno.',
        youtubeSearch: 'dorian mixolydian mode piano explained',
        teacherTip: 'Dórico y Mixolidio son suficientes para la mayoría. Frigio, Lidio y Locrio son para estudiantes muy avanzados o curiosos.',
      },
      {
        title: 'El Color de los Modos',
        duration: 10,
        whatToSay:
          '"Cada modo es como un filtro de emoción. Jónico = alegre (es el mayor). Dórico = cool, esperanzador. Frigio = oscuro, español, tenso. Lidio = mágico, de ensueño, espacial. Mixolidio = bluesy, terrenal. Eólico = triste (es el menor). Los compositores eligen el modo por su color."',
        keyPoints: [
          'Jónico = alegre / Dórico = cool, esperanzador',
          'Frigio = oscuro, español / Lidio = mágico, de ensueño',
          'Mixolidio = bluesy / Eólico = triste / Locrio = inestable',
          'Los modos aparecen mucho en bandas sonoras de cine y videojuegos',
        ],
        classExercise:
          'Toca fragmentos de varios modos y que el estudiante describa la emoción/imagen que le evoca cada uno.',
        homework: 'Escucha música de videojuegos o cine e intenta notar sonidos modales.',
        youtubeSearch: 'modes emotional color film music modos cine',
        teacherTip: 'El color de los modos es poético y subjetivo. El objetivo es despertar la curiosidad — no exigir clasificaciones exactas.',
      },
    ],
  },

  // ═══ MÓDULO 13 — ARMONÍA Y PROGRESIONES ════════════════════════════════
  {
    moduleId: 13,
    totalMinutes: 60,
    intro: 'Meta: el estudiante numera acordes con números romanos, entiende funciones y cadencias, y analiza una canción.',
    steps: [
      {
        title: 'Numerar los Acordes — Números Romanos',
        duration: 12,
        whatToSay:
          '"Hoy aprendemos el idioma universal de la armonía: los números romanos. Cada acorde de una tonalidad recibe un número según su grado. En Do: el acorde de Do es el I, Rem es el ii, Mim el iii, Fa el IV, Sol el V, Lam el vi. Mayúscula = mayor, minúscula = menor."',
        keyPoints: [
          'Cada acorde de la escala recibe un número romano',
          'Mayúsculas = acordes mayores (I, IV, V)',
          'Minúsculas = acordes menores (ii, iii, vi)',
          'vii° = acorde disminuido',
        ],
        formula: 'Acordes de una tonalidad mayor: I - ii - iii - IV - V - vi - vii°.\nEn Do: Do-Rem-Mim-Fa-Sol-Lam-Sim°.',
        classExercise:
          'Numera los 7 acordes de la escala de Do mayor con números romanos. Tócalos en orden diciendo el número.',
        homework: 'Practica numerar los acordes de Do y de Sol mayor.',
        youtubeSearch: 'roman numerals chords explained piano numeros romanos',
        teacherTip: 'Los números romanos hacen la armonía universal — independiente de la tonalidad. Es el concepto más poderoso del módulo.',
      },
      {
        title: 'Funciones — Tónica, Subdominante, Dominante',
        duration: 13,
        whatToSay:
          '"Los acordes tienen \'trabajos\' — funciones. El I es la tónica: el hogar, la estabilidad. El IV es la subdominante: se aleja del hogar, crea movimiento. El V es la dominante: pura tensión, \'quiere\' volver a casa. Toda progresión es un viaje entre estas tres funciones."',
        keyPoints: [
          'Tónica (I) = el hogar, estabilidad, reposo',
          'Subdominante (IV) = movimiento, alejarse del hogar',
          'Dominante (V) = tensión, "quiere" resolver al I',
          'Toda progresión navega entre estas 3 funciones',
        ],
        formula: 'Tónica (I, vi) = reposo. Subdominante (IV, ii) = movimiento. Dominante (V, vii°) = tensión.',
        classExercise:
          'Toca I-IV-V-I. Identifica la función de cada acorde. Siente el "viaje": hogar → alejarse → tensión → hogar.',
        homework: 'Toca I-IV-V-I en 2 tonalidades distintas.',
        youtubeSearch: 'chord functions tonic subdominant dominant piano',
        teacherTip: 'La metáfora del "viaje desde el hogar y de regreso" funciona con todas las edades. Es la idea más intuitiva de la armonía.',
      },
      {
        title: 'Cadencias — La Puntuación Musical',
        duration: 12,
        whatToSay:
          '"Las cadencias son la puntuación de la música — como los puntos y las comas. La cadencia auténtica V-I es el \'punto final\': la resolución más fuerte. La cadencia plagal IV-I es la del \'amén\', más suave. La cadencia rota V-vi es la \'sorpresa\': esperabas el hogar y te llevan a otro lado."',
        keyPoints: [
          'Cadencia auténtica V-I = resolución fuerte, "punto final"',
          'Cadencia plagal IV-I = resolución suave, sonido "amén"',
          'Cadencia rota V-vi = sorpresa, no resuelve donde esperas',
          'Semicadencia: termina en V = "coma", deja en suspenso',
        ],
        formula: 'Auténtica = V-I (final fuerte). Plagal = IV-I (final suave).\nRota = V-vi (sorpresa). Semicadencia = ...V (suspenso).',
        classExercise:
          'Toca cada cadencia: auténtica V-I, plagal IV-I, rota V-vi. El estudiante describe la "sensación de final" de cada una.',
        homework: 'Practica las cadencias auténtica y plagal en Do mayor.',
        youtubeSearch: 'cadences explained piano authentic plagal cadencias',
        teacherTip: 'La metáfora de la puntuación es clave: las cadencias le dan estructura y "respiración" a la música, igual que en el lenguaje.',
      },
      {
        title: 'La Progresión Universal',
        duration: 13,
        whatToSay:
          '"Ahora la revelación: la progresión I-V-vi-IV. La conociste en el módulo 2 como Do-Sol-Lam-Fa. Pero con números romanos funciona en CUALQUIER tonalidad. En Sol es Sol-Re-Mim-Do. En Re es Re-La-Sim-Sol. La misma progresión, infinitas canciones."',
        keyPoints: [
          'I-V-vi-IV = la progresión más usada del pop',
          'Con números romanos, transpones a cualquier tonalidad',
          'En Do: Do-Sol-Lam-Fa. En Sol: Sol-Re-Mim-Do',
          'Otras progresiones clave: ii-V-I (jazz), I-vi-IV-V (clásica del pop 50s)',
        ],
        formula: 'I-V-vi-IV en cualquier tono: solo aplica los números romanos a la escala de esa tonalidad.',
        classExercise:
          'Toca I-V-vi-IV en Do, luego en Sol, luego en Re. Mismo patrón, distintas teclas.',
        homework: 'Transpone la progresión I-V-vi-IV a 3 tonalidades distintas.',
        youtubeSearch: 'I V vi IV progression any key piano transpose',
        teacherTip: 'Este es el momento "todo conecta": el estudiante ve que la teoría le da PODER — puede tocar la misma canción en cualquier tono.',
      },
      {
        title: 'Analizar una Canción Real',
        duration: 10,
        whatToSay:
          '"Cerramos aplicando todo. Tomemos una canción real que ames y descifremos sus acordes con números romanos. Vas a ver que canciones que suenan totalmente distintas comparten la misma progresión. Es como tener visión de rayos X de la música."',
        keyPoints: [
          'Toma una canción real, identifica su tonalidad',
          'Convierte sus acordes a números romanos',
          'Compara con otras canciones — verás patrones repetidos',
          'El análisis te permite aprender canciones más rápido',
        ],
        classExercise:
          'Elige una canción simple. Identifica la tonalidad, escribe los acordes con números romanos. Compárala con otra canción.',
        homework: 'Analiza una canción favorita con números romanos.',
        youtubeSearch: 'analyze song chords roman numerals piano',
        teacherTip: 'Elige una canción que el estudiante ame. El "wow" de descubrir que su canción favorita usa I-V-vi-IV es inolvidable.',
      },
    ],
  },

  // ═══ MÓDULO 14 — PEDAL, DINÁMICA Y EXPRESIÓN ═══════════════════════════
  {
    moduleId: 14,
    totalMinutes: 60,
    intro: 'Meta: el estudiante usa el pedal de resonancia, controla la dinámica y la articulación, y frasea con sentido musical.',
    steps: [
      {
        title: 'El Pedal de Resonancia',
        duration: 10,
        whatToSay:
          '"¿Ves los pedales abajo del piano? El de la derecha es el pedal de resonancia (sustain). Cuando lo pisas, las notas siguen sonando aunque sueltes las teclas — el sonido \'flota\', se conecta. Es como agregar color y profundidad al instrumento."',
        keyPoints: [
          'El pedal derecho = pedal de resonancia (sustain pedal)',
          'Pisado: las notas siguen sonando tras soltar las teclas',
          'Conecta los sonidos, agrega resonancia y profundidad',
          'Se opera con el pie derecho, talón en el piso',
        ],
        classExercise:
          'Toca un acorde sin pedal, luego con pedal. Escucha cómo el sonido "flota" y se sostiene.',
        youtubeSearch: 'sustain pedal piano how it works pedal',
        teacherTip: 'Mantén el talón en el piso — solo se mueve la punta del pie. Un error común es levantar todo el pie.',
      },
      {
        title: 'Técnica del Pedal Legato',
        duration: 14,
        whatToSay:
          '"Hay un truco para que el pedal no \'embarre\' el sonido: el pedal legato o sincopado. Tocas la nota PRIMERO, LUEGO bajas el pedal, y lo levantas justo cuando cambias de armonía. Es: toca → pedal abajo → (cambio) → pedal arriba y abajo de nuevo."',
        keyPoints: [
          'Pedal legato: toca la nota PRIMERO, luego baja el pedal',
          'Levanta el pedal al cambiar de acorde/armonía',
          'Vuelve a bajarlo inmediatamente después',
          'Esto conecta los acordes sin mezclar sonidos sucios',
        ],
        formula: 'Pedal legato: Toca → baja pedal → (al cambiar armonía) sube y baja pedal de nuevo.\nEl oído es tu guía: si suena "sucio", cambia el pedal.',
        classExercise:
          'Toca la progresión Do-Sol-Lam-Fa aplicando pedal legato en cada cambio de acorde. Escucha la limpieza.',
        homework: 'Practica el pedal legato con una progresión de 4 acordes.',
        youtubeSearch: 'legato pedaling technique piano syncopated pedal',
        teacherTip: 'El oído debe guiar el pedal. Enseña al estudiante a ESCUCHAR cuándo el sonido se ensucia — esa es la señal de cambiar el pedal.',
      },
      {
        title: 'Dinámica — De lo Suave a lo Fuerte',
        duration: 12,
        whatToSay:
          '"Las notas correctas no bastan — la dinámica es la EMOCIÓN. La dinámica es qué tan fuerte o suave tocas. La escala va de pp (muy suave) a ff (muy fuerte). Y el secreto: el volumen sale del PESO del brazo, no de la fuerza de los dedos."',
        keyPoints: [
          'Dinámica = el volumen, qué tan fuerte/suave tocas',
          'Escala: pp - p - mp - mf - f - ff',
          'El volumen viene del peso del brazo, no de golpear',
          'Crescendo = subir gradual / Diminuendo = bajar gradual',
        ],
        formula: 'pp (pianissimo) → p → mp → mf → f → ff (fortissimo).\nCrescendo (<) = más fuerte. Diminuendo (>) = más suave.',
        classExercise:
          'Toca una escala de pp a ff y de regreso. Luego una progresión con crescendo y diminuendo, como una ola.',
        homework: 'Practica tocar una pieza simple con contrastes de dinámica.',
        youtubeSearch: 'piano dynamics crescendo diminuendo expression',
        teacherTip: 'Demuestra el contraste: toca una frase totalmente plana, luego con dinámica. El estudiante OYE por qué la dinámica es la emoción.',
      },
      {
        title: 'Articulación — Legato y Staccato',
        duration: 12,
        whatToSay:
          '"La articulación es CÓMO conectas las notas. Legato = suave, conectado, las notas se funden. Staccato = corto, separado, las notas \'rebotan\'. Una misma melodía cambia totalmente de carácter según la articulación."',
        keyPoints: [
          'Legato = notas conectadas, suaves, fluidas',
          'Staccato = notas cortas, separadas, "rebotando"',
          'La articulación cambia el carácter de la melodía',
          'Las partituras indican la articulación con símbolos',
        ],
        formula: 'Legato = ligadura (línea curva), tocar conectado.\nStaccato = punto sobre la nota, tocar corto.',
        classExercise:
          'Toca Do-Re-Mi-Fa-Sol en legato (suave), luego en staccato (rebotando). Exagera el contraste.',
        homework: 'Practica una melodía simple en legato y luego en staccato.',
        youtubeSearch: 'legato staccato articulation piano technique',
        teacherTip: 'Exagera el contraste al enseñar. El staccato muy corto y el legato muy conectado — los extremos hacen que el concepto sea claro.',
      },
      {
        title: 'Fraseo — La Música Respira',
        duration: 12,
        whatToSay:
          '"Lo último, lo más artístico: el fraseo. La música, como el habla, respira. Una frase musical tiene un inicio, un punto de crecimiento, y un cierre — como una oración. Tocar con fraseo es contar una historia, no solo apretar teclas correctas."',
        keyPoints: [
          'Una frase musical = una "oración" con inicio, clímax y cierre',
          'La música respira — hay puntos naturales de "respiración"',
          'El fraseo combina dinámica, articulación y tiempo',
          'Tocar con fraseo = contar una historia',
        ],
        classExercise:
          'Toma una melodía. Identifiquen las frases. Toca cada frase con un arco: crece hacia el clímax, relaja al cierre. Aplica pedal + dinámica.',
        homework: 'Toca una balada aplicando pedal, dinámica, articulación y fraseo juntos.',
        youtubeSearch: 'musical phrasing piano expression how to',
        teacherTip: 'Este es el cierre del módulo más "artístico". Aquí la música deja de ser técnica y se vuelve arte. Tómate el tiempo.',
      },
    ],
  },

  // ═══ MÓDULO 15 — DOMINIO DE CANCIONES ══════════════════════════════════
  {
    moduleId: 15,
    totalMinutes: 60,
    intro: 'Meta: el estudiante toca una canción completa con ambas manos, de principio a fin, a un tempo razonable.',
    steps: [
      {
        title: 'Elige Tu Canción — Fijar la Meta',
        duration: 10,
        whatToSay:
          '"Este módulo tiene una sola meta: vas a tocar una canción COMPLETA. No 4 compases — entera, de principio a fin. Primera pregunta: ¿qué canción quieres tocar? No elijas algo fácil — elige algo que de verdad te emocione tocar para alguien."',
        keyPoints: [
          'Elige una canción con significado personal, no solo fácil',
          'Evalúa la dificultad: ¿coincide con su nivel actual?',
          'Divide la canción en secciones: intro, verso, coro, puente',
          'Fija una "fecha de estreno" para crear compromiso',
        ],
        classExercise:
          'Mapea la canción elegida en papel: etiqueta cada sección A, B, C. Cuenta los compases. Identifica secciones repetidas.',
        homework: 'Escucha la canción elegida 5 veces con la partitura o cifrado en mano, sin tocar.',
        youtubeSearch: 'how to learn a full song piano section practice',
        teacherTip: 'Si no se decide, ofrécele 3 opciones de su nivel. Haber elegido = tener pertenencia = más práctica.',
      },
      {
        title: 'Sección A — Dominio de la Mano Derecha',
        duration: 18,
        whatToSay:
          '"Empezamos con la primera sección — la Sección A. Por ahora, solo mano derecha. Quiero que la Sección A quede tan limpia, tan memorizada, que la puedas tocar mientras alguien te habla. Esa es la meta de hoy."',
        keyPoints: [
          'Identifica la Sección A (intro o primer verso)',
          'Solo mano derecha, al 50% de velocidad',
          'Digitación correcta desde el compás 1',
          'Memoriza mientras avanzas',
        ],
        classExercise:
          'Toca la Sección A con la derecha al 50%, 3 veces. Aísla los compases difíciles y trabájalos aparte.',
        homework: 'Sección A mano derecha, 10 veces al día.',
        youtubeSearch: 'slow practice piano song section method',
        teacherTip: 'Si hay un compás difícil, dedícale 5 minutos solo a ese compás. "Domina la parte difícil y el resto es fácil."',
      },
      {
        title: 'Sección A — Mano Izquierda y Juntar',
        duration: 15,
        whatToSay:
          '"Ahora la mano izquierda — solo Sección A. Izquierda al 50%. Cuando esté limpia, combinamos. Recuerda: juntar las manos se sentirá desordenado al inicio. Es el proceso. Si una mano falla, vuelve a esa mano sola un momento y reintenta."',
        keyPoints: [
          'Mano izquierda de la Sección A solamente',
          'Mantén el patrón de la izquierda simple',
          'Cuando ambas estén limpias por separado, combina al 40%',
          'Sección A con ambas manos = gran hito',
        ],
        classExercise:
          'Izquierda Sección A ×3. Luego combina: ambas manos, muy lento. Meta: 2 pasadas limpias de la Sección A.',
        homework: 'Sección A con ambas manos, 5 veces al día.',
        youtubeSearch: 'piano learning method hands together first section',
        teacherTip: 'Cuando logre la Sección A con ambas manos (aunque sea torpe), celébralo visiblemente. "Es lo más difícil que has hecho en piano."',
      },
      {
        title: 'Sección B y Conectar Secciones',
        duration: 12,
        whatToSay:
          '"La Sección A está sólida — ahora la Sección B. Mismo proceso: derecha, luego izquierda, luego juntas. Después conectamos: A hacia B sin parar. La unión entre secciones — la \'costura\' — es donde casi todos tropiezan. La practicaremos aparte."',
        keyPoints: [
          'Sección B = nuevo material, nuevo ciclo de práctica',
          'Tras dominar B: toca A y pasa de inmediato a B',
          'Practica la transición: últimos 2 compases de A + primeros 2 de B',
          'Repite para C, D y las demás secciones',
        ],
        classExercise:
          'Practica el último compás de A → primer compás de B, 5 veces lento. Luego toca A+B juntas.',
        homework: 'Sección B con ambas manos, 5 veces al día. Luego intenta A hacia B sin parar.',
        youtubeSearch: 'connecting piano sections transitions practice',
        teacherTip: 'La costura entre secciones siempre es donde dudan. Practicar solo la costura (2+2 compases) lo resuelve más rápido que repetir toda la canción.',
      },
      {
        title: 'Pasada Completa y Preparación de Interpretación',
        duration: 5,
        whatToSay:
          '"Hoy tocamos la canción completa. Sin parar. Si te equivocas — sigue. Una interpretación de verdad no tiene botón de retroceso. Tócala como si interpretaras para alguien. Respira. ¿Listo? Adelante."',
        keyPoints: [
          'Pasada completa de la canción, sin parar',
          'Mentalidad de interpretación: comprométete con cada nota, recupérate de los errores',
          'Grábalo — que el estudiante se escuche',
          'Celebra: este es el momento en que se volvió pianista',
        ],
        classExercise:
          'Pasada completa, ambas manos, sin parar. Grábalo. Reprodúcelo. Identifica 2 cosas buenas y 1 a pulir.',
        homework: 'Pasada completa de la canción cada día. Meta: poder tocarla para cualquiera sin disculparte.',
        youtubeSearch: 'performance mindset piano play through mistakes',
        teacherTip: 'Si se disculpa a media interpretación, detenlo con suavidad: "No te disculpes — sigue tocando." El hábito de disculparse es enemigo de la presencia escénica.',
      },
    ],
  },

  // ═══ MÓDULO 16 — EXPRÉSATE ═════════════════════════════════════════════
  {
    moduleId: 16,
    totalMinutes: 60,
    intro: 'Meta: el estudiante improvisa libremente sobre progresiones y compone una pieza original de 8 compases.',
    steps: [
      {
        title: 'Libertad con Estructura — La Pentatónica',
        duration: 12,
        whatToSay:
          '"Todo lo que aprendiste — acordes, ritmo, técnica — fue preparación para esto: crear. Pero crear necesita estructura para sonar bien. La escala pentatónica es la solución: 5 notas que SIEMPRE suenan bien sobre los acordes mayores. No hay notas equivocadas."',
        keyPoints: [
          'Pentatónica mayor de Do: Do-Re-Mi-Sol-La (sin Fa ni Si)',
          'Estas 5 notas siempre suenan bien sobre Do, Sol, Lam, Fa',
          'Es la base del blues, pop, rock y folk del mundo entero',
          'Cualquier orden, cualquier ritmo — las notas son "seguras"',
        ],
        formula: 'Pentatónica mayor = Do-Re-Mi-Sol-La (saltas el grado 4 y 7).\nPentatónica menor = La-Do-Re-Mi-Sol (mismas notas, sonido bluesy).',
        classExercise:
          'Toca la pentatónica de Do. Luego improvisa solo con esas 5 notas mientras el profe toca el loop Do-Sol-Lam-Fa.',
        homework: 'Juega con la pentatónica de Do 2 min al día. Sin meta — solo explora.',
        youtubeSearch: 'C pentatonic scale piano improvisation beginners',
        teacherTip: 'Puede sentirse cohibido al improvisar. Tranquilízalo: "No hay notas equivocadas en la pentatónica." Voltéate o cierra los ojos para que se sienta menos observado.',
      },
      {
        title: 'El Patio de Juego — Improvisación con Estructura',
        duration: 15,
        whatToSay:
          '"Agreguemos estructura a tu improvisación. El profe toca los acordes. Tú improvisas la melodía. Reglas: quédate en la pentatónica, aterriza en Do cuando el acorde sea de Do, y escucha lo que hacen los acordes. La armonía guía tu melodía."',
        keyPoints: [
          'Aterriza en notas fuertes (raíz o 3ª) al cambiar el acorde',
          'Variedad rítmica: mezcla notas largas y cortas',
          'El silencio es poderoso — los silencios dejan respirar la frase',
          'Tu melodía conversa con los acordes',
        ],
        classExercise:
          'El profe toca Do-Sol-Lam-Fa lento. El estudiante improvisa con la pentatónica. Ronda 1: notas sueltas. Ronda 2: variedad rítmica. Ronda 3: "cuenta una historia".',
        homework: 'Improvisa sobre una pista de Do-Sol-Lam-Fa, 3 min al día.',
        youtubeSearch: 'improvise pentatonic piano over chords backing track',
        teacherTip: 'Graba estas sesiones de improvisación. El estudiante siempre se sorprende de lo musical que suena. La grabación también muestra su crecimiento.',
      },
      {
        title: 'Llamada y Respuesta — Conversación Musical',
        duration: 10,
        whatToSay:
          '"La música es una conversación. En el jazz y el blues hay algo llamado \'llamada y respuesta\': un músico dice algo, el otro responde. Yo toco 2 compases de melodía — una \'llamada\' — y tú respondes con 2 compases tuyos. No hay respuesta correcta. Solo reacciona."',
        keyPoints: [
          'Llamada: el profe toca una frase de 2 compases',
          'Respuesta: el estudiante responde con 2 compases en la pentatónica',
          'La respuesta no tiene que copiar el ritmo ni las notas',
          'Escucha el "ánimo" de la llamada y responde a eso',
        ],
        classExercise:
          'Rondas de llamada y respuesta. El profe toca llamadas con distintas emociones (alegre, triste, enérgica). El estudiante responde igualando el ánimo.',
        youtubeSearch: 'call and response piano improvisation lesson',
        teacherTip: 'Este ejercicio suelta a los estudiantes rígidos. La mentalidad de "estoy respondiendo" quita la presión de "¿qué debo tocar?"',
      },
      {
        title: 'Hora de Componer — Crea Algo Tuyo',
        duration: 15,
        whatToSay:
          '"Ahora vas a escribir una pieza. Mínimo 4 compases, idealmente 8. Elige un ánimo — alegre, triste, cinematográfico, lo que sientas. Elige tu progresión de acordes. Crea tu melodía con la mano derecha. No tiene que ser perfecta. Tiene que ser TUYA."',
        keyPoints: [
          'Elige una progresión de acordes (Do-Sol-Lam-Fa, o cualquiera)',
          'Crea una melodía con la pentatónica o la escala completa',
          'Escríbela o grábala de inmediato — la memoria es poco confiable',
          'Ponle un título — darle nombre la hace real',
        ],
        classExercise:
          'El estudiante compone una pieza de 4-8 compases. El profe la anota o graba. Ayúdalo a pulirla. Termina con un título.',
        homework: 'Practica tu composición hasta poder tocarla de memoria.',
        youtubeSearch: 'beginner piano composition write your own music',
        teacherTip: 'La composición no necesita ser "buena" objetivamente. Necesita ser suya. Celebra el ACTO de crear: "Escribiste algo que no existía antes."',
      },
      {
        title: 'Interpretación — Comparte lo que Creaste',
        duration: 8,
        whatToSay:
          '"Lo último: toca tu composición como si fuera una interpretación. Ponte de pie. Respira. Tócala de principio a fin. Sin parar. Sin disculparte. Solo música. Luego hablamos de hacia dónde vas desde aquí."',
        keyPoints: [
          'Interpretación completa de la composición original',
          'Reflexiona: ¿qué destrezas de los 16 módulos usaste en esta pieza?',
          'Conversa: ¿qué quiere aprender ahora?',
          'El módulo 16 nunca "termina" — es continuo',
        ],
        classExercise:
          'Interpretación de la pieza original, seguida de reflexión: "¿Qué módulos usaste?" Luego planea los próximos pasos.',
        homework: 'Toca tu composición cada día. Intenta agregarle algo nuevo — un final, una variación.',
        youtubeSearch: 'beginner piano original composition performance',
        teacherTip: 'Este es el final del método RÜVEL completo. Reconoce el viaje: "Mira dónde empezaste — módulo 1, buscando los Do. Ahora interpretaste una composición tuya."',
      },
    ],
  },
];
