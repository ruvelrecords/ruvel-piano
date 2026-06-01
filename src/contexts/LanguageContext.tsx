'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Lang, translate, detectLang, LANG_STORAGE_KEY } from '@/lib/i18n';

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default 'es' on the server; corrected on mount from storage / browser.
  const [lang, setLangState] = useState<Lang>('es');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
      if (stored === 'es' || stored === 'en') {
        setLangState(stored);
      } else {
        setLangState(detectLang());
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'es' ? 'en' : 'es');
  }, [lang, setLang]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
