'use client';

import { ClassMaterial, MaterialKind } from '@/lib/types';
import { Video, FileText, Music, Image as ImgIcon, Link2, ExternalLink, LucideIcon } from 'lucide-react';

const KIND_INFO: Record<MaterialKind, { label: string; icon: LucideIcon; color: string; bg: string }> = {
  video: { label: 'Video', icon: Video, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  pdf: { label: 'PDF', icon: FileText, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  sheet: { label: 'Partitura', icon: Music, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  image: { label: 'Imagen', icon: ImgIcon, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  link: { label: 'Enlace', icon: Link2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  audio: { label: 'Audio', icon: Music, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
};

export default function ClassMaterialViewer({ materials }: { materials?: ClassMaterial[] }) {
  if (!materials || materials.length === 0) return null;

  return (
    <div className="space-y-2">
      {materials.map((m) => {
        const info = KIND_INFO[m.kind];
        const Icon = info.icon;
        const href = m.url || m.dataUri || '#';

        if (m.kind === 'image' && m.dataUri) {
          return (
            <div key={m.id} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${info.color}`} />
                <p className="text-sm font-medium text-white flex-1">{m.label}</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.dataUri} alt={m.label} className="w-full rounded-md" />
            </div>
          );
        }

        return (
          <a
            key={m.id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 p-3 rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors ${info.bg}`}
          >
            <div className={`w-9 h-9 rounded-lg bg-black/30 flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-4 h-4 ${info.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{m.label}</p>
              <p className="text-[10px] uppercase text-[#888]">{info.label}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-[#888]" />
          </a>
        );
      })}
    </div>
  );
}
