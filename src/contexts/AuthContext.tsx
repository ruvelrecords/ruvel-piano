'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppSession, AuthStore } from '@/lib/types';
import { getStorage, setStorage, removeStorage } from '@/lib/storage';
import { createSeedData } from '@/lib/seedData';

interface AuthContextValue {
  session: AppSession | null;
  isLoading: boolean;
  login: (username: string, credential: string) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_AUTH: AuthStore = {
  teacher: {
    username: 'teacher',
    password: 'ruvel2024',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AppSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure auth store exists
    const auth = getStorage<AuthStore>('auth', DEFAULT_AUTH);
    if (!auth.teacher) {
      setStorage('auth', DEFAULT_AUTH);
    }

    // Credential migration — patch any stored students missing username/pin.
    // Must live here (AuthContext) because /login only has AuthContext, not AppContext.
    const seedData = createSeedData();
    const storedStudents = getStorage<Array<{ id: string; username?: string; pin?: string }>>('students', []);
    if (storedStudents.length > 0) {
      let patched = false;
      const patchedStudents = storedStudents.map((s) => {
        if (!s.username || !s.pin) {
          const seedMatch = seedData.students.find((ss) => ss.id === s.id);
          if (seedMatch && (seedMatch.username || seedMatch.pin)) {
            patched = true;
            return { ...s, username: seedMatch.username, pin: seedMatch.pin };
          }
        }
        return s;
      });
      if (patched) setStorage('students', patchedStudents);
    }

    // Load existing session
    const existing = getStorage<AppSession | null>('session', null);
    setSession(existing);
    setIsLoading(false);
  }, []);

  const login = useCallback((username: string, credential: string): { success: boolean; message: string } => {
    const auth = getStorage<AuthStore>('auth', DEFAULT_AUTH);

    // Check teacher credentials
    if (username.toLowerCase() === auth.teacher.username.toLowerCase()) {
      if (credential === auth.teacher.password) {
        const newSession: AppSession = {
          role: 'teacher',
          name: 'Teacher',
          loggedInAt: new Date().toISOString(),
        };
        setStorage('session', newSession);
        setSession(newSession);
        return { success: true, message: 'Welcome back!' };
      } else {
        return { success: false, message: 'Incorrect password.' };
      }
    }

    // Check student credentials (read from students)
    const students = getStorage<Array<{ id: string; name: string; username?: string; pin?: string }>>('students', []);
    const student = students.find(
      (s) => s.username && s.username.toLowerCase() === username.toLowerCase()
    );

    if (student) {
      if (credential === student.pin) {
        const newSession: AppSession = {
          role: 'student',
          studentId: student.id,
          name: student.name,
          loggedInAt: new Date().toISOString(),
        };
        setStorage('session', newSession);
        setSession(newSession);
        return { success: true, message: `Welcome, ${student.name}!` };
      } else {
        return { success: false, message: 'Incorrect PIN. Ask your teacher to reset it.' };
      }
    }

    return { success: false, message: 'Username not found. Check your username and try again.' };
  }, []);

  const logout = useCallback(() => {
    removeStorage('session');
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
