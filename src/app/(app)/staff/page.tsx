'use client';

import StaffBuilder from '@/components/StaffBuilder';

export default function StaffPage() {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Pentagrama Interactivo</h1>
        <p className="text-sm text-[#888] mt-1">
          Construye escalas, acordes y melodías. Úsalo en clase para explicar lectura musical.
        </p>
      </div>
      <StaffBuilder accent="#C9A84C" />

      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-white">Cómo usarlo</p>
        <ul className="text-xs text-[#888] space-y-1 list-disc list-inside">
          <li>Click en cualquier parte del pentagrama para colocar una nota.</li>
          <li>Click en una nota existente para escucharla.</li>
          <li>Cambia la clave (Sol, Fa o ambas) antes de colocar la nota.</li>
          <li>Selecciona ♯ o ♭ antes de colocar la nota para hacerla sostenida o bemol.</li>
          <li>El botón <b>Reproducir</b> toca todas las notas en orden.</li>
        </ul>
      </div>
    </div>
  );
}
