'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Student, ClassEntry, Payment, Review, MediaItem, Settings, ActivityEntry } from '@/lib/types';
import { getStorage, setStorage } from '@/lib/storage';
import { RUVEL_KEYS } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import { createSeedData } from '@/lib/seedData';
import { ensureCloudBootstrap, cloudResync, isCloudEnabled } from '@/lib/cloud';
import { useToast } from './ToastContext';

interface AppContextValue {
  students: Student[];
  classes: ClassEntry[];
  payments: Payment[];
  reviews: Review[];
  media: MediaItem[];
  settings: Settings;
  activity: ActivityEntry[];

  // Students
  addStudent: (s: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'keysEarned'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Classes
  addClass: (c: Omit<ClassEntry, 'id' | 'createdAt'>) => void;
  updateClass: (id: string, updates: Partial<ClassEntry>) => void;
  deleteClass: (id: string) => void;

  // Payments
  addPayment: (p: Omit<Payment, 'id' | 'createdAt'>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  deletePayment: (id: string) => void;

  // Reviews
  addReview: (r: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  updateReview: (id: string, updates: Partial<Review>) => void;
  deleteReview: (id: string) => void;

  // Media
  addMedia: (m: Omit<MediaItem, 'id' | 'createdAt'>) => void;
  deleteMedia: (id: string) => void;

  // Settings
  updateSettings: (s: Partial<Settings>) => void;

  // Keys
  assignKey: (studentId: string, keyId: string) => void;
  removeKey: (studentId: string, keyId: string) => void;

  // Utils
  getStudentClasses: (studentId: string) => ClassEntry[];
  getStudentPayments: (studentId: string) => Payment[];
  getCompletedClassCount: (studentId: string) => number;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_SETTINGS: Settings = {
  teacherName: 'Maestro',
  studioName: 'RÜVEL Piano Method',
  location: 'Perth, Australia',
  currency: 'AUD',
  priceSingle: 60,
  price4Pack: 220,
  price8Pack: 460,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount (después de sync con la nube)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Esperar a que el bootstrap de la nube termine (AuthContext también lo
      // llama, pero como retorna la misma promesa, esto solo espera).
      await ensureCloudBootstrap();
      if (cancelled) return;

      const seeded = getStorage<boolean>('initialized', false);
      if (!seeded) {
        const seed = createSeedData();
        setStudents(seed.students);
        setClasses(seed.classes);
        setPayments(seed.payments);
        setActivity(seed.activity);
        setReviews([]);
        setMedia([]);
        setSettings(DEFAULT_SETTINGS);
        setStorage('students', seed.students);
        setStorage('classes', seed.classes);
        setStorage('payments', seed.payments);
        setStorage('reviews', []);
        setStorage('media', []);
        setStorage('settings', DEFAULT_SETTINGS);
        setStorage('activity', seed.activity);
        setStorage('initialized', true);
      } else {
        // Load existing data (ya con datos frescos de la nube si aplica)
        let loadedStudents = getStorage<Student[]>('students', []);

        // Migration: patch students missing username/pin
        const seed = createSeedData();
        let needsPatch = false;
        loadedStudents = loadedStudents.map((s) => {
          if (!s.username || !s.pin) {
            const seedMatch = seed.students.find((ss) => ss.id === s.id);
            if (seedMatch && (seedMatch.username || seedMatch.pin)) {
              needsPatch = true;
              return { ...s, username: seedMatch.username, pin: seedMatch.pin };
            }
          }
          return s;
        });
        if (needsPatch) setStorage('students', loadedStudents);

        setStudents(loadedStudents);
        setClasses(getStorage<ClassEntry[]>('classes', []));
        setPayments(getStorage<Payment[]>('payments', []));
        setReviews(getStorage<Review[]>('reviews', []));
        setMedia(getStorage<MediaItem[]>('media', []));
        setSettings(getStorage<Settings>('settings', DEFAULT_SETTINGS));
        setActivity(getStorage<ActivityEntry[]>('activity', []));
      }
      setInitialized(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Re-sync helper ────────────────────────────────────────────────
  const applyCloudData = useCallback(async () => {
    try {
      const cloud = await cloudResync();
      if (cloud.students) setStudents(cloud.students as Student[]);
      if (cloud.classes) setClasses(cloud.classes as ClassEntry[]);
      if (cloud.payments) setPayments(cloud.payments as Payment[]);
      if (cloud.activity) setActivity(cloud.activity as ActivityEntry[]);
      if (cloud.reviews) setReviews(cloud.reviews as Review[]);
      if (cloud.media) setMedia(cloud.media as MediaItem[]);
      if (cloud.settings) setSettings(cloud.settings as Settings);
    } catch {
      /* silent */
    }
  }, []);

  // ─── Re-sync on visibility change (mobile-friendly) ────────────────
  // `window.focus` doesn't fire reliably on iOS Safari/Chrome.
  // `document.visibilitychange` fires every time the user returns to the tab.
  useEffect(() => {
    if (!isCloudEnabled()) return;

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        applyCloudData();
      }
    };

    // Also keep window.focus as belt-and-suspenders for desktop browsers
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [applyCloudData]);

  // ─── Polling fallback every 30 s ───────────────────────────────────
  // In case visibility/focus events are blocked (some browsers, PWA mode),
  // quietly re-pull the latest cloud data in the background.
  useEffect(() => {
    if (!isCloudEnabled()) return;
    const id = setInterval(applyCloudData, 30_000);
    return () => clearInterval(id);
  }, [applyCloudData]);

  const logActivity = useCallback((message: string, type: ActivityEntry['type']) => {
    const entry: ActivityEntry = { id: generateId(), message, type, timestamp: new Date().toISOString() };
    setActivity((prev) => {
      const updated = [entry, ...prev].slice(0, 50);
      setStorage('activity', updated);
      return updated;
    });
  }, []);

  const checkAutoKeys = useCallback((studentId: string, completedCount: number, studentName: string) => {
    const autoKeys = RUVEL_KEYS.filter((k) => k.type === 'auto' && k.milestone === completedCount);
    setStudents((prev) => {
      const updated = prev.map((s) => {
        if (s.id !== studentId) return s;
        const newKeys = autoKeys
          .map((k) => k.id)
          .filter((id) => !s.keysEarned.includes(id));
        if (newKeys.length === 0) return s;
        const updatedStudent = { ...s, keysEarned: [...s.keysEarned, ...newKeys], updatedAt: new Date().toISOString() };
        newKeys.forEach((kid) => {
          const key = RUVEL_KEYS.find((k) => k.id === kid);
          if (key) {
            showToast(`${studentName} earned ${key.name} ${key.emoji}!`, 'success');
            logActivity(`${studentName} earned ${key.name} ${key.emoji}`, 'key');
          }
        });
        return updatedStudent;
      });
      setStorage('students', updated);
      return updated;
    });
  }, [showToast, logActivity]);

  // Students
  const addStudent = useCallback((data: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'keysEarned'>) => {
    const s: Student = { ...data, id: generateId(), keysEarned: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setStudents((prev) => { const u = [...prev, s]; setStorage('students', u); return u; });
    logActivity(`New student added: ${data.name}`, 'student');
    showToast(`${data.name} added!`, 'success');
  }, [logActivity, showToast]);

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    setStudents((prev) => {
      const u = prev.map((s) => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s);
      setStorage('students', u);
      return u;
    });
    showToast('Student updated', 'success');
  }, [showToast]);

  const deleteStudent = useCallback((id: string) => {
    setStudents((prev) => { const u = prev.filter((s) => s.id !== id); setStorage('students', u); return u; });
    setClasses((prev) => { const u = prev.filter((c) => c.studentId !== id); setStorage('classes', u); return u; });
    setPayments((prev) => { const u = prev.filter((p) => p.studentId !== id); setStorage('payments', u); return u; });
    showToast('Student removed', 'info');
  }, [showToast]);

  // Classes
  const addClass = useCallback((data: Omit<ClassEntry, 'id' | 'createdAt'>) => {
    const c: ClassEntry = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setClasses((prev) => { const u = [...prev, c]; setStorage('classes', u); return u; });

    if (data.status === 'Completed') {
      const student = students.find((s) => s.id === data.studentId);
      const completedCount = classes.filter((cl) => cl.studentId === data.studentId && cl.status === 'Completed').length + 1;
      if (student) {
        logActivity(`${student.name} completed class — Module ${data.module}`, 'class');
        checkAutoKeys(data.studentId, completedCount, student.name);
      }
    }
    showToast('Class logged!', 'success');
  }, [students, classes, logActivity, checkAutoKeys, showToast]);

  const updateClass = useCallback((id: string, updates: Partial<ClassEntry>) => {
    setClasses((prev) => { const u = prev.map((c) => c.id === id ? { ...c, ...updates } : c); setStorage('classes', u); return u; });
    showToast('Class updated', 'success');
  }, [showToast]);

  const deleteClass = useCallback((id: string) => {
    setClasses((prev) => { const u = prev.filter((c) => c.id !== id); setStorage('classes', u); return u; });
    showToast('Class removed', 'info');
  }, [showToast]);

  // Payments
  const addPayment = useCallback((data: Omit<Payment, 'id' | 'createdAt'>) => {
    const p: Payment = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setPayments((prev) => { const u = [...prev, p]; setStorage('payments', u); return u; });
    const student = students.find((s) => s.id === data.studentId);
    if (student) logActivity(`${student.name} paid $${data.amount} — ${data.type}`, 'payment');
    showToast(`Payment of $${data.amount} recorded!`, 'success');
  }, [students, logActivity, showToast]);

  const updatePayment = useCallback((id: string, updates: Partial<Payment>) => {
    setPayments((prev) => { const u = prev.map((p) => p.id === id ? { ...p, ...updates } : p); setStorage('payments', u); return u; });
    showToast('Payment updated', 'success');
  }, [showToast]);

  const deletePayment = useCallback((id: string) => {
    setPayments((prev) => { const u = prev.filter((p) => p.id !== id); setStorage('payments', u); return u; });
    showToast('Payment removed', 'info');
  }, [showToast]);

  // Reviews
  const addReview = useCallback((data: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const r: Review = { ...data, id: generateId(), status: 'Pending', createdAt: new Date().toISOString() };
    setReviews((prev) => { const u = [...prev, r]; setStorage('reviews', u); return u; });
  }, []);

  const updateReview = useCallback((id: string, updates: Partial<Review>) => {
    setReviews((prev) => { const u = prev.map((r) => r.id === id ? { ...r, ...updates } : r); setStorage('reviews', u); return u; });
    showToast('Review updated', 'success');
  }, [showToast]);

  const deleteReview = useCallback((id: string) => {
    setReviews((prev) => { const u = prev.filter((r) => r.id !== id); setStorage('reviews', u); return u; });
    showToast('Review removed', 'info');
  }, [showToast]);

  // Media
  const addMedia = useCallback((data: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const m: MediaItem = { ...data, id: generateId(), createdAt: new Date().toISOString() };
    setMedia((prev) => { const u = [...prev, m]; setStorage('media', u); return u; });
    showToast('Media uploaded!', 'success');
  }, [showToast]);

  const deleteMedia = useCallback((id: string) => {
    setMedia((prev) => { const u = prev.filter((m) => m.id !== id); setStorage('media', u); return u; });
    showToast('Media removed', 'info');
  }, [showToast]);

  // Settings
  const updateSettings = useCallback((s: Partial<Settings>) => {
    setSettings((prev) => { const u = { ...prev, ...s }; setStorage('settings', u); return u; });
    showToast('Settings saved', 'success');
  }, [showToast]);

  // Keys
  const assignKey = useCallback((studentId: string, keyId: string) => {
    setStudents((prev) => {
      const u = prev.map((s) => {
        if (s.id !== studentId || s.keysEarned.includes(keyId)) return s;
        return { ...s, keysEarned: [...s.keysEarned, keyId], updatedAt: new Date().toISOString() };
      });
      setStorage('students', u);
      return u;
    });
    const student = students.find((s) => s.id === studentId);
    const key = RUVEL_KEYS.find((k) => k.id === keyId);
    if (student && key) {
      showToast(`${key.name} ${key.emoji} assigned to ${student.name}!`, 'success');
      logActivity(`${student.name} earned ${key.name} ${key.emoji}`, 'key');
    }
  }, [students, showToast, logActivity]);

  const removeKey = useCallback((studentId: string, keyId: string) => {
    setStudents((prev) => {
      const u = prev.map((s) => s.id === studentId ? { ...s, keysEarned: s.keysEarned.filter((k) => k !== keyId), updatedAt: new Date().toISOString() } : s);
      setStorage('students', u);
      return u;
    });
    showToast('Key removed', 'info');
  }, [showToast]);

  // Helpers
  const getStudentClasses = useCallback((studentId: string) => classes.filter((c) => c.studentId === studentId), [classes]);
  const getStudentPayments = useCallback((studentId: string) => payments.filter((p) => p.studentId === studentId), [payments]);
  const getCompletedClassCount = useCallback((studentId: string) => classes.filter((c) => c.studentId === studentId && c.status === 'Completed').length, [classes]);

  if (!initialized) return null;

  return (
    <AppContext.Provider value={{
      students, classes, payments, reviews, media, settings, activity,
      addStudent, updateStudent, deleteStudent,
      addClass, updateClass, deleteClass,
      addPayment, updatePayment, deletePayment,
      addReview, updateReview, deleteReview,
      addMedia, deleteMedia,
      updateSettings,
      assignKey, removeKey,
      getStudentClasses, getStudentPayments, getCompletedClassCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
