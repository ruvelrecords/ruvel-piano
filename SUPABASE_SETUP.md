# 🔄 Sincronización entre dispositivos — Supabase Setup

Esta guía conecta tu app a Supabase (gratis) para que **celular, iPad y computador siempre muestren los mismos datos**.

**Tiempo total: ~5 minutos. Costo: $0 para siempre.**

---

## Paso 1 — Crear cuenta en Supabase

1. Ve a **https://supabase.com**
2. Click en **"Start your project"**
3. Inicia sesión con GitHub (la misma cuenta que usas para Vercel)
4. **NO pide tarjeta de crédito**

---

## Paso 2 — Crear el proyecto

1. Click en **"New project"**
2. Nombre: `ruvel-piano`
3. Database password: genera una fuerte y guárdala (la necesitarás solo si algún día quieres acceder a la base de datos)
4. Region: elige la más cercana a Australia (Sydney o Singapore)
5. Plan: **Free**
6. Click **"Create new project"** y espera ~2 minutos

---

## Paso 3 — Crear la tabla de datos

1. En el panel izquierdo, click en **"SQL Editor"** (ícono `</>`)
2. Click en **"+ New query"**
3. Pega EXACTAMENTE este código y dale **"Run"** (botón verde abajo a la derecha):

```sql
-- Tabla key-value para sincronizar todo el estado de la app
create table app_kv (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

-- Permitir lectura y escritura desde el navegador (anon role)
-- Esto está bien porque la app es de un solo profesor.
alter table app_kv enable row level security;

create policy "Allow all for anon"
  on app_kv for all
  to anon
  using (true)
  with check (true);
```

Si todo sale bien verás "Success. No rows returned" abajo.

---

## Paso 4 — Copiar las credenciales

1. En el panel izquierdo, click en **"Project Settings"** (ícono engranaje)
2. Click en **"API"**
3. Copia estos dos valores:
   - **Project URL** (algo como `https://abcdefghij.supabase.co`)
   - **anon public** key (un texto largo que empieza con `eyJ...`)

---

## Paso 5 — Agregarlas a Vercel

1. Ve a **https://vercel.com** y entra a tu proyecto **ruvel-piano**
2. Click en **"Settings"** (arriba)
3. En el menú izquierdo, click en **"Environment Variables"**
4. Agrega la primera variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: pega el **Project URL** del paso anterior
   - Environments: marca **Production, Preview, Development** (todas)
   - Click **"Save"**
5. Agrega la segunda:
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: pega la **anon public** key
   - Environments: todas
   - Click **"Save"**

---

## Paso 6 — Re-desplegar

1. En Vercel, ve a la pestaña **"Deployments"**
2. En el deployment más reciente, click los **"..."** a la derecha → **"Redeploy"**
3. Espera ~1 minuto

---

## ✅ Listo

Ahora todos tus dispositivos están sincronizados:
- **Editas en el celular** → aparece en el desktop al instante (cuando recargas o vuelves a la pestaña)
- **El estudiante ve material nuevo** que le asignaste sin que tú tengas que hacer nada
- **Si pierdes el celular**, los datos siguen en la nube y los recuperas iniciando sesión

### ¿Cómo verificar que funciona?

1. Abre la app en el desktop → entra como teacher
2. En Settings deberías ver: **"☁️ Sincronización: Activa"**
3. Edita cualquier cosa (ej: agrega una nota a una clase)
4. Abre la app en el celular y entra como teacher
5. Verás los mismos datos automáticamente

### Sin Supabase

Si no haces este setup, la app sigue funcionando — pero cada dispositivo tendrá sus propios datos (no se comparten). Útil solo para uso en un dispositivo.
