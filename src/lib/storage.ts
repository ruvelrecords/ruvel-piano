import { cloudPush, isCloudEnabled, SYNCED_KEYS } from './cloud';

const PREFIX = 'ruvel_';

export function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

// Debounced cloud-push timers per key — evita spammar Supabase con cada teclazo
const pushTimers: Record<string, ReturnType<typeof setTimeout>> = {};
// Pending values waiting for their debounce timer to fire
const pendingPushes: Record<string, unknown> = {};
const PUSH_DEBOUNCE_MS = 200; // 200ms — fast enough to catch page-hide, slow enough to batch keystrokes

export function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // localStorage full
  }

  // También empujar a la nube si está configurada y la key se sincroniza
  if (isCloudEnabled() && SYNCED_KEYS.includes(key)) {
    pendingPushes[key] = value; // track what's pending
    if (pushTimers[key]) clearTimeout(pushTimers[key]);
    pushTimers[key] = setTimeout(() => {
      delete pendingPushes[key];
      cloudPush(key, value).catch(() => {
        /* silent */
      });
    }, PUSH_DEBOUNCE_MS);
  }
}

// Flush all pending debounced pushes immediately (call on page hide/unload).
export async function flushPendingPushes(): Promise<void> {
  const entries = Object.entries(pendingPushes);
  if (entries.length === 0) return;
  // Cancel timers — we're pushing right now
  for (const key of Object.keys(pendingPushes)) {
    if (pushTimers[key]) {
      clearTimeout(pushTimers[key]);
      delete pushTimers[key];
    }
  }
  // Fire all pushes in parallel
  await Promise.allSettled(
    entries.map(([key, value]) => {
      delete pendingPushes[key];
      return cloudPush(key, value);
    })
  );
}

export function removeStorage(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PREFIX + key);
}

export function clearAllStorage(): void {
  if (typeof window === 'undefined') return;
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}

export function getStorageUsage(): number {
  if (typeof window === 'undefined') return 0;
  let total = 0;
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => {
      total += (localStorage.getItem(k) || '').length * 2;
    });
  return total;
}

export function exportAllData(): string {
  if (typeof window === 'undefined') return '{}';
  const data: Record<string, unknown> = {};
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => {
      try {
        data[k.replace(PREFIX, '')] = JSON.parse(localStorage.getItem(k) || 'null');
      } catch {
        data[k.replace(PREFIX, '')] = localStorage.getItem(k);
      }
    });
  return JSON.stringify(data, null, 2);
}

export function importAllData(json: string): void {
  if (typeof window === 'undefined') return;
  const data = JSON.parse(json) as Record<string, unknown>;
  clearAllStorage();
  Object.entries(data).forEach(([key, value]) => {
    setStorage(key, value);
  });
}
