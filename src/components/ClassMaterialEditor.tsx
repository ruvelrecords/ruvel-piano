'use client';

import { useState, useRef } from 'react';
import { ClassMaterial, MaterialKind } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { Video, FileText, Music, Image as ImgIcon, Link2, Plus, Trash2, ExternalLink, Upload, LucideIcon } from 'lucide-react';

interface Props {
  materials: ClassMaterial[];
  onChange: (next: ClassMaterial[]) => void;
  accent?: string;
}

const KIND_INFO: Record<MaterialKind, { label: string; icon: LucideIcon; color: string }> = {
  video: { label: 'Video', icon: Video, color: 'text-rose-400' },
  pdf: { label: 'PDF', icon: FileText, color: 'text-orange-400' },
  sheet: { label: 'Partitura', icon: Music, color: 'text-emerald-400' },
  image: { label: 'Imagen', icon: ImgIcon, color: 'text-blue-400' },
  link: { label: 'Enlace', icon: Link2, color: 'text-purple-400' },
  audio: { label: 'Audio', icon: Music, color: 'text-yellow-400' },
};

export default function ClassMaterialEditor({ materials, onChange, accent = '#C9A84C' }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [kind, setKind] = useState<MaterialKind>('video');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setShowAdd(false);
    setKind('video');
    setLabel('');
    setUrl('');
    setImagePreview(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 800 * 1024) {
      alert('La imagen es muy grande. Máximo 800KB. Comprímela primero.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!label.trim()) {
      alert('Pon un nombre al material');
      return;
    }
    if (kind === 'image' && !imagePreview && !url.trim()) {
      alert('Sube una imagen o pega un URL');
      return;
    }
    if (kind !== 'image' && !url.trim()) {
      alert('Pega el enlace (YouTube, Drive, Dropbox, etc.)');
      return;
    }

    const newMat: ClassMaterial = {
      id: generateId(),
      kind,
      label: label.trim(),
      url: url.trim() || undefined,
      dataUri: kind === 'image' && imagePreview ? imagePreview : undefined,
      createdAt: new Date().toISOString(),
    };
    onChange([...(materials || []), newMat]);
    reset();
  };

  const handleRemove = (id: string) => {
    onChange(materials.filter((m) => m.id !== id));
  };

  return (
    <div>
      {/* Lista de materiales */}
      {materials && materials.length > 0 && (
        <div className="space-y-2 mb-3">
          {materials.map((m) => {
            const info = KIND_INFO[m.kind];
            const Icon = info.icon;
            return (
              <div key={m.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                <Icon className={`w-4 h-4 flex-shrink-0 ${info.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{m.label}</p>
                  <p className="text-[10px] text-[#555] uppercase">{info.label}</p>
                </div>
                {m.url && (
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-white">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {m.dataUri && (
                  <a href={m.dataUri} target="_blank" rel="noopener noreferrer" className="text-[#888] hover:text-white">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => handleRemove(m.id)} className="text-rose-400 hover:text-rose-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Botón agregar / formulario */}
      {!showAdd ? (
        <button
          onClick={() => setShowAdd(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-[#1a1a1a] border border-dashed border-[#3a3a3a] text-[#888] hover:text-white hover:border-[#555]"
        >
          <Plus className="w-4 h-4" /> Agregar material
        </button>
      ) : (
        <div className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg space-y-3">
          {/* Tipo */}
          <div>
            <p className="text-[10px] uppercase text-[#888] mb-1">Tipo</p>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(KIND_INFO) as MaterialKind[]).map((k) => {
                const info = KIND_INFO[k];
                const Icon = info.icon;
                return (
                  <button
                    key={k}
                    onClick={() => setKind(k)}
                    className={`flex flex-col items-center gap-1 py-2 rounded-md text-[10px] font-medium transition-colors ${
                      kind === k ? 'text-black' : 'bg-[#0a0a0a] border border-[#2a2a2a] text-[#888]'
                    }`}
                    style={kind === k ? { background: accent } : {}}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {info.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nombre */}
          <div>
            <p className="text-[10px] uppercase text-[#888] mb-1">Nombre</p>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej: Tutorial de Mary Had a Little Lamb"
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-sm text-white placeholder-[#555]"
            />
          </div>

          {/* URL o imagen */}
          {kind === 'image' ? (
            <div>
              <p className="text-[10px] uppercase text-[#888] mb-1">Imagen (máx 800KB) o URL</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm bg-[#0a0a0a] border border-dashed border-[#3a3a3a] text-[#888] hover:text-white"
              >
                <Upload className="w-4 h-4" /> {imagePreview ? 'Imagen cargada ✓' : 'Subir imagen'}
              </button>
              {imagePreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="" className="mt-2 max-h-32 rounded-md mx-auto" />
              )}
              <p className="text-[10px] text-[#555] mt-1 text-center">— o —</p>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL de la imagen (Google, Imgur, etc.)"
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-sm text-white placeholder-[#555]"
              />
            </div>
          ) : (
            <div>
              <p className="text-[10px] uppercase text-[#888] mb-1">
                Enlace ({kind === 'video' ? 'YouTube' : kind === 'pdf' || kind === 'sheet' ? 'Google Drive, Dropbox, MuseScore' : 'cualquiera'})
              </p>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-sm text-white placeholder-[#555]"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex-1 py-2 rounded-md text-xs font-medium bg-[#0a0a0a] border border-[#2a2a2a] text-[#888] hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-2 rounded-md text-xs font-semibold text-black"
              style={{ background: accent }}
            >
              Agregar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
