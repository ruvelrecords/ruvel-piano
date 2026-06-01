// ─── RÜVEL — Sincronización en la nube (Supabase) ──────────────────────────
// Todo se guarda en localStorage (rápido, offline-first) y se replica a
// Supabase para que celular / iPad / desktop estén siempre sincronizados.
//
// Setup del usuario (una sola vez):
//   1. Crear proyecto gratis en https://supabase.com
//   2. SQL Editor → pegar el SQL de SETUP.md
//   3. Settings → API → copiar "Project URL" y "anon public key"
//   4. En Vercel → Settings → Environment Variables, agregar:
//        NEXT_PUBLIC_SUPABASE_URL = (la URL)
//        NEXT_PUBLIC_SUPABASE_ANON_KEY = (la anon key)
//   5. Redeploy
//
// Sin las env vars la app funciona normal con solo localStorage (modo offline).

// Trim any accidental trailing slash the user may have pasted
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

// Keys de localStorage que se sincronizan con la nube
export const SYNCED_KEYS = [
  'students',
  'classes',
  'payments',
  'activity',
  'reviews',
  'media',
  'settings',
  'auth',
  'quiz_results',
  'practice_log',
  'method_sticky_notes',
  'initialized',
];

const STORAGE_PREFIX = 'ruvel_';
const TS_SUFFIX = '__ts'; // per-key local timestamp for last-write-wins

export function isCloudEnabled(): boolean {
  return !!(SUPABASE_URL && SUPABASE_KEY);
}

// ─── Per-key timestamps (last-write-wins) ──────────────────────────────────
export function getLocalTs(key: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_PREFIX + key + TS_SUFFIX);
}

export function setLocalTs(key: string, ts: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + key + TS_SUFFIX, ts);
  } catch {
    /* full */
  }
}

// Stamp any synced key that exists locally but has no timestamp yet.
// This protects data created before timestamp-tracking existed: it gets
// marked as "current" so the automatic cloud-pull won't silently overwrite it.
export function stampMissingTimestamps(): void {
  if (typeof window === 'undefined') return;
  const now = new Date().toISOString();
  for (const key of SYNCED_KEYS) {
    const hasValue = localStorage.getItem(STORAGE_PREFIX + key) !== null;
    const hasTs = localStorage.getItem(STORAGE_PREFIX + key + TS_SUFFIX) !== null;
    if (hasValue && !hasTs) setLocalTs(key, now);
  }
}

async function supabaseFetch(path: string, options: RequestInit = {}): Promise<Response | null> {
  if (!isCloudEnabled()) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}${path}`, {
      ...options,
      headers: {
        apikey: SUPABASE_KEY!,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      // Log the actual Supabase error so we can debug
      let body = '';
      try { body = await res.clone().text(); } catch { /* ignore */ }
      console.error(`[cloud] ${options.method ?? 'GET'} ${path} → ${res.status}`, body);
    }
    return res;
  } catch (e) {
    console.error('[cloud] network error', e);
    return null;
  }
}

interface CloudRow { key: string; value: unknown; updated_at: string | null }

// Pull all rows (with timestamps) from the cloud
export async function cloudPullAllRaw(): Promise<CloudRow[]> {
  if (!isCloudEnabled()) return [];
  const res = await supabaseFetch('/rest/v1/app_kv?select=key,value,updated_at');
  if (!res || !res.ok) return [];
  try {
    return (await res.json()) as CloudRow[];
  } catch {
    return [];
  }
}

// Pull all keys from the cloud as a plain map (no timestamps)
export async function cloudPullAll(): Promise<Record<string, unknown>> {
  const rows = await cloudPullAllRaw();
  const out: Record<string, unknown> = {};
  for (const row of rows) out[row.key] = row.value;
  return out;
}

// Push one key to the cloud (upsert). Pass `ts` so the cloud's updated_at
// matches the local timestamp exactly — avoids pull/push ping-pong.
export async function cloudPush(key: string, value: unknown, ts?: string): Promise<boolean> {
  if (!isCloudEnabled()) return false;
  const updated_at = ts ?? new Date().toISOString();
  const res = await supabaseFetch('/rest/v1/app_kv', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ key, value, updated_at }),
  });
  return !!(res && res.ok);
}

// ─── Merge cloud rows into localStorage using last-write-wins ───────────────
// force=true  → overwrite local unconditionally (manual "download" button)
// force=false → only overwrite a key if the cloud copy is strictly newer
// Returns the keys/values that were actually applied so React state can update.
function mergeCloudIntoLocal(rows: CloudRow[], force: boolean): Record<string, unknown> {
  const applied: Record<string, unknown> = {};
  for (const row of rows) {
    if (!SYNCED_KEYS.includes(row.key)) continue;
    const localTs = getLocalTs(row.key);
    const cloudTs = row.updated_at ?? '';
    const cloudWins = force || !localTs || (!!cloudTs && cloudTs > localTs);
    if (cloudWins) {
      try {
        localStorage.setItem(STORAGE_PREFIX + row.key, JSON.stringify(row.value));
        setLocalTs(row.key, cloudTs || new Date().toISOString());
        applied[row.key] = row.value;
      } catch {
        /* full */
      }
    }
  }
  return applied;
}

// ─── Bootstrap: se llama UNA VEZ al inicio ─────────────────────────────────
// Si la nube está vacía → sube lo local.
// Si la nube tiene datos → los baja y sobrescribe lo local.
let bootstrapPromise: Promise<void> | null = null;

export function ensureCloudBootstrap(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!isCloudEnabled()) return Promise.resolve();
  if (!bootstrapPromise) bootstrapPromise = doBootstrap();
  return bootstrapPromise;
}

async function doBootstrap(): Promise<void> {
  try {
    // CRÍTICO: marca con timestamp los datos locales existentes ANTES de
    // tocar la nube. Así los datos viejos (creados antes del sistema de
    // sincronización) se consideran "actuales" y NO se sobrescriben al jalar.
    stampMissingTimestamps();

    const rows = await cloudPullAllRaw();

    if (rows.length === 0) {
      // Nube vacía — subir lo que tenemos local (con su timestamp)
      for (const key of SYNCED_KEYS) {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        if (raw !== null) {
          try {
            const value = JSON.parse(raw);
            const ts = getLocalTs(key) ?? new Date().toISOString();
            setLocalTs(key, ts);
            await cloudPush(key, value, ts);
          } catch {
            /* skip */
          }
        }
      }
    } else {
      // Nube tiene datos — fusionar con last-write-wins (NO sobrescribir ciegamente)
      mergeCloudIntoLocal(rows, false);
    }
  } catch (e) {
    console.warn('[cloud] bootstrap failed', e);
  }
}

// Re-pull from cloud (automatic — visibility change / 30s poll).
// Uses last-write-wins so a stale cloud copy never clobbers fresh local data.
// Returns only the keys that were actually updated, for React state.
export async function cloudResync(): Promise<Record<string, unknown>> {
  const rows = await cloudPullAllRaw();
  return mergeCloudIntoLocal(rows, false);
}

// FORCE pull — manual "Download from cloud" button. Overwrites local
// unconditionally with whatever is in the cloud. Returns all cloud data.
export async function cloudForcePull(): Promise<Record<string, unknown>> {
  const rows = await cloudPullAllRaw();
  return mergeCloudIntoLocal(rows, true);
}

// Test the connection and return diagnostic info.
export async function cloudTest(): Promise<{ ok: boolean; rowCount: number; error?: string; studentCount?: number }> {
  if (!isCloudEnabled()) return { ok: false, rowCount: 0, error: 'Cloud not configured' };
  try {
    const res = await supabaseFetch('/rest/v1/app_kv?select=key,value');
    if (!res) return { ok: false, rowCount: 0, error: 'Network error — no response' };
    if (!res.ok) {
      let body = '';
      try { body = await res.text(); } catch { /* ignore */ }
      return { ok: false, rowCount: 0, error: `HTTP ${res.status}: ${body.slice(0, 120)}` };
    }
    const rows: Array<{ key: string; value: unknown }> = await res.json();
    const studentsRow = rows.find(r => r.key === 'students');
    const studentCount = studentsRow ? (studentsRow.value as unknown[])?.length ?? 0 : 0;
    return { ok: true, rowCount: rows.length, studentCount };
  } catch (e) {
    return { ok: false, rowCount: 0, error: String(e) };
  }
}

// FORCE push — manual "Upload to cloud" button. Pushes ALL local synced keys
// to the cloud with a FRESH timestamp (now), making this device the source of
// truth. Other devices will then pull these as the newest version.
export async function cloudPushAll(): Promise<number> {
  if (!isCloudEnabled()) return 0;
  let pushed = 0;
  const now = new Date().toISOString();
  for (const key of SYNCED_KEYS) {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw !== null) {
      try {
        const value = JSON.parse(raw);
        setLocalTs(key, now); // mark local as freshly synced
        const ok = await cloudPush(key, value, now);
        if (ok) pushed++;
      } catch {
        /* skip */
      }
    }
  }
  return pushed;
}
