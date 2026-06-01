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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
    return await fetch(`${SUPABASE_URL}${path}`, {
      ...options,
      headers: {
        apikey: SUPABASE_KEY!,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch (e) {
    console.warn('[cloud] fetch error', e);
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
