'use client';

import { useLang } from '@/contexts/LanguageContext';

// Pequeño switch ES / EN. Se usa en el login y en el portal de estudiante.
export default function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div className={`inline-flex items-center rounded-lg bg-[#0a0a0a] border border-[#2a2a2a] p-0.5 ${className}`}>
      <button
        onClick={() => setLang('es')}
        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
          lang === 'es' ? 'bg-[#C9A84C] text-black' : 'text-[#888] hover:text-white'
        }`}
        aria-label="Español"
      >
        ES
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors ${
          lang === 'en' ? 'bg-[#C9A84C] text-black' : 'text-[#888] hover:text-white'
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
