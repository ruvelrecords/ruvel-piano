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

export function isCloudEnabled(): boolean {
  return !!(SUPABASE_URL && SUPABASE_KEY);
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

// Pull all keys from the cloud at once
export async function cloudPullAll(): Promise<Record<string, unknown>> {
  if (!isCloudEnabled()) return {};
  const res = await supabaseFetch('/rest/v1/app_kv?select=key,value');
  if (!res || !res.ok) return {};
  try {
    const rows: Array<{ key: string; value: unknown }> = await res.json();
    const out: Record<string, unknown> = {};
    for (const row of rows) out[row.key] = row.value;
    return out;
  } catch {
    return {};
  }
}

// Push one key to the cloud (upsert)
export async function cloudPush(key: string, value: unknown): Promise<boolean> {
  if (!isCloudEnabled()) return false;
  const res = await supabaseFetch('/rest/v1/app_kv', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      key,
      value,
      updated_at: new Date().toISOString(),
    }),
  });
  return !!(res && res.ok);
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
    const cloud = await cloudPullAll();
    const cloudKeys = Object.keys(cloud);

    if (cloudKeys.length === 0) {
      // Nube vacía — subir lo que tenemos local
      for (const key of SYNCED_KEYS) {
        const raw = localStorage.getItem(STORAGE_PREFIX + key);
        if (raw !== null) {
          try {
            const value = JSON.parse(raw);
            await cloudPush(key, value);
          } catch {
            /* skip */
          }
        }
      }
    } else {
      // Nube tiene datos — bajar y sobrescribir local
      for (const [k, v] of Object.entries(cloud)) {
        try {
          localStorage.setItem(STORAGE_PREFIX + k, JSON.stringify(v));
        } catch {
          /* localStorage full */
        }
      }
    }
  } catch (e) {
    console.warn('[cloud] bootstrap failed', e);
  }
}

// Re-pull all from cloud (used on visibility change). Returns the data so the
// caller can update React state.
export async function cloudResync(): Promise<Record<string, unknown>> {
  const cloud = await cloudPullAll();
  for (const [k, v] of Object.entries(cloud)) {
    try {
      localStorage.setItem(STORAGE_PREFIX + k, JSON.stringify(v));
    } catch {
      /* skip */
    }
  }
  return cloud;
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

// Push ALL local synced keys to the cloud at once.
// Use this for "Force Sync" so even data that was never pushed gets uploaded.
export async function cloudPushAll(): Promise<number> {
  if (!isCloudEnabled()) return 0;
  let pushed = 0;
  for (const key of SYNCED_KEYS) {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (raw !== null) {
      try {
        const value = JSON.parse(raw);
        const ok = await cloudPush(key, value);
        if (ok) pushed++;
      } catch {
        /* skip */
      }
    }
  }
  return pushed;
}
