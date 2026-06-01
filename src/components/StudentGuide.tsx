'use client';

import { useLang } from '@/contexts/LanguageContext';
import { PIANO_GLOSSARY, NOTE_NAMES } from '@/lib/i18n';
import Modal from '@/components/ui/Modal';
import LangToggle from '@/components/LangToggle';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  accent: string;
}

// Mensaje de bienvenida + guía corta, bilingüe. Se abre automáticamente la
// primera vez que un estudiante entra, y se puede reabrir con el botón "Guía".
export default function StudentGuide({ isOpen, onClose, studentName, accent }: Props) {
  const { lang } = useLang();
  const es = lang === 'es';

  const sections = es
    ? [
        { icon: '🏠', t: 'Inicio', d: 'Tu resumen: racha, módulo actual y próxima clase.' },
        { icon: '🎹', t: 'Módulo', d: 'Lo que estás aprendiendo ahora y tu quiz.' },
        { icon: '🎯', t: 'Práctica', d: 'Registra tu práctica diaria, metrónomo y ejercicios Hanon.' },
        { icon: '🎵', t: 'Canciones', d: '156 canciones para tocar, con videos y partituras.' },
        { icon: '🎼', t: 'Piano', d: 'Piano interactivo con sonido. Toca acordes y escalas.' },
        { icon: '🎶', t: 'Pentagrama', d: 'Construye y escucha escalas y acordes en el pentagrama.' },
        { icon: '🎮', t: 'Juegos', d: 'Entrena tu oído y tu lectura jugando.' },
        { icon: '📺', t: 'Tutoriales', d: 'Videos seleccionados para tu módulo.' },
        { icon: '📅', t: 'Clases', d: 'Tu historial con notas y material multimedia.' },
        { icon: '📝', t: 'Tarea', d: 'Lo que debes practicar para la próxima clase.' },
      ]
    : [
        { icon: '🏠', t: 'Home', d: 'Your summary: streak, current module and next class.' },
        { icon: '🎹', t: 'Module', d: "What you're learning right now plus your quiz." },
        { icon: '🎯', t: 'Practice', d: 'Log your daily practice, metronome and Hanon exercises.' },
        { icon: '🎵', t: 'Songs', d: '156 songs to play, with videos and sheet music.' },
        { icon: '🎼', t: 'Piano', d: 'Interactive piano with sound. Play chords and scales.' },
        { icon: '🎶', t: 'Staff', d: 'Build and hear scales and chords on the staff.' },
        { icon: '🎮', t: 'Games', d: 'Train your ear and reading by playing.' },
        { icon: '📺', t: 'Tutorials', d: 'Hand-picked videos for your module.' },
        { icon: '📅', t: 'Classes', d: 'Your history with notes and multimedia material.' },
        { icon: '📝', t: 'Homework', d: 'What to practice for your next class.' },
      ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={es ? '¡Bienvenido a RÜVEL! 🎹' : 'Welcome to RÜVEL! 🎹'} size="md">
      <div className="space-y-5">
        {/* Selector de idioma */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#888]">{es ? 'Idioma' : 'Language'}</p>
          <LangToggle />
        </div>

        {/* Saludo */}
        <div className="rounded-xl p-4" style={{ background: `${accent}12`, border: `1px solid ${accent}30` }}>
          <p className="text-white leading-relaxed text-sm">
            {es ? (
              <>Hola <span className="font-bold">{studentName}</span> 👋 Esta es tu app de piano.
              Aquí verás tus clases, tareas, el material que te comparte tu profe, y un montón de
              herramientas para practicar. ¡Explora cada pestaña!</>
            ) : (
              <>Hi <span className="font-bold">{studentName}</span> 👋 This is your piano app.
              Here you&apos;ll find your classes, homework, the material your teacher shares, and lots
              of tools to practice. Explore each tab!</>
            )}
          </p>
        </div>

        {/* Qué hay en cada pestaña */}
        <div>
          <p className="text-xs uppercase tracking-wider text-[#888] font-semibold mb-2">
            {es ? '¿Qué hay en cada parte?' : 'What each tab does'}
          </p>
          <div className="space-y-1.5">
            {sections.map((s) => (
              <div key={s.t} className="flex items-start gap-3 p-2.5 bg-[#1a1a1a] rounded-lg">
                <span className="text-lg">{s.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{s.t}</p>
                  <p className="text-xs text-[#888]">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instalar como app */}
        <div className="rounded-xl p-4 bg-[#111] border border-[#2a2a2a]">
          <p className="text-sm font-semibold text-white mb-2">
            📱 {es ? 'Instálala como app en tu celular' : 'Install it as an app on your phone'}
          </p>
          <p className="text-xs text-[#aaa] leading-relaxed">
            {es ? (
              <><span className="font-semibold text-white">iPhone:</span> abre en Safari → botón compartir
              (cuadro con flecha) → &quot;Añadir a pantalla de inicio&quot;.<br />
              <span className="font-semibold text-white">Android:</span> abre en Chrome → menú (⋮) →
              &quot;Instalar app&quot; / &quot;Añadir a pantalla de inicio&quot;.</>
            ) : (
              <><span className="font-semibold text-white">iPhone:</span> open in Safari → share button
              (square with arrow) → &quot;Add to Home Screen&quot;.<br />
              <span className="font-semibold text-white">Android:</span> open in Chrome → menu (⋮) →
              &quot;Install app&quot; / &quot;Add to Home screen&quot;.</>
            )}
          </p>
        </div>

        {/* Glosario de términos (spanglish) */}
        <div>
          <p className="text-xs uppercase tracking-wider text-[#888] font-semibold mb-2">
            {es ? 'Términos de piano (ES ↔ EN)' : 'Piano terms (ES ↔ EN)'}
          </p>
          <div className="rounded-xl border border-[#2a2a2a] overflow-hidden">
            <div className="grid grid-cols-2 text-[10px] uppercase tracking-wide text-[#666] bg-[#1a1a1a] px-3 py-1.5">
              <span>Español</span><span>English</span>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {PIANO_GLOSSARY.map((g) => (
                <div key={g.en} className="grid grid-cols-2 px-3 py-1.5 text-xs border-t border-[#1a1a1a]">
                  <span className="text-white">{g.es}</span>
                  <span className="text-[#aaa]">{g.en}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-[#666] mt-2">
            {es ? 'Notas: ' : 'Notes: '}
            {NOTE_NAMES.map((n) => `${n.es}=${n.en}`).join(' · ')}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-lg font-bold text-sm text-black"
          style={{ background: accent }}
        >
          {es ? '¡Entendido, vamos! 🚀' : 'Got it, let’s go! 🚀'}
        </button>
      </div>
    </Modal>
  );
}
