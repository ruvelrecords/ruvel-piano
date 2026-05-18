'use client';

import { useState, useRef } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Video, Upload, X, HardDrive } from 'lucide-react';
import { formatDate, getInitials, getAgeGroupColor } from '@/lib/utils';
import { getStorageUsage } from '@/lib/storage';
import Modal from '@/components/ui/Modal';

export default function MediaPage() {
  const { students, media, addMedia, deleteMedia } = useApp();
  const [filterStudent, setFilterStudent] = useState('');
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [uploadModal, setUploadModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [preview, setPreview] = useState<{ data: string; type: 'photo' | 'video' } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const usage = getStorageUsage();
  const usageMB = (usage / 1024 / 1024).toFixed(2);
  const usagePct = Math.min((usage / (5 * 1024 * 1024)) * 100, 100);

  const filtered = media
    .filter((m) => !filterStudent || m.studentId === filterStudent)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith('video') ? 'video' : 'photo';
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview({ data: ev.target?.result as string, type });
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!preview || !selectedStudentId) return;
    addMedia({
      studentId: selectedStudentId,
      type: preview.type,
      data: preview.data,
      caption,
      date: new Date().toISOString().split('T')[0],
    });
    setPreview(null);
    setCaption('');
    setSelectedStudentId('');
    setUploadModal(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const getStudent = (id: string) => students.find((s) => s.id === id);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Media Gallery</h1>
          <p className="text-[#888888] text-sm mt-0.5">{media.length} item{media.length !== 1 ? 's' : ''} · photos & videos</p>
        </div>
        <button
          onClick={() => setUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] transition-colors"
        >
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>

      {/* Storage indicator */}
      <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#888888]" />
            <span className="text-sm text-[#888888]">localStorage usage</span>
          </div>
          <span className="text-xs text-[#888888]">{usageMB} MB / ~5 MB</span>
        </div>
        <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${usagePct}%`,
              background: usagePct > 80 ? '#E74C3C' : usagePct > 60 ? '#F39C12' : '#C9A84C',
            }}
          />
        </div>
        {usagePct > 70 && (
          <p className="text-xs text-yellow-400 mt-2">⚠ Storage getting full — consider exporting and clearing old media</p>
        )}
        <p className="text-xs text-[#555555] mt-2">Media is stored in browser localStorage. Export data regularly to backup.</p>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filterStudent}
          onChange={(e) => setFilterStudent(e.target.value)}
          className="bg-[#111111] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]"
        >
          <option value="">All Students</option>
          {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Gallery grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Video className="w-16 h-16 text-[#2a2a2a] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No media yet</h3>
          <p className="text-[#555555] text-sm mb-6">Upload photos and videos of your students&apos; progress</p>
          <button
            onClick={() => setUploadModal(true)}
            className="px-5 py-2.5 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a]"
          >
            Upload First Media
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => {
            const student = getStudent(item.studentId);
            return (
              <div key={item.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl overflow-hidden group">
                {/* Thumbnail */}
                <div
                  className="relative aspect-video bg-[#1a1a1a] cursor-pointer overflow-hidden"
                  onClick={() => setLightbox(item.id)}
                >
                  {item.type === 'photo' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.data} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video className="w-8 h-8 text-[#555555]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-[#C9A84C]/80 rounded-full flex items-center justify-center">
                          <span className="text-black text-sm ml-0.5">▶</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete button overlay */}
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-red-500/80"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Type badge */}
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] px-1.5 py-0.5 bg-black/60 rounded text-white">
                      {item.type === 'photo' ? '📷' : '🎬'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0"
                      style={{ background: getAgeGroupColor(student?.ageGroup || '') }}
                    >
                      {getInitials(student?.name || '?')}
                    </div>
                    <span className="text-xs text-[#888888] truncate">{student?.name}</span>
                  </div>
                  {item.caption && <p className="text-xs text-white truncate">{item.caption}</p>}
                  <p className="text-[10px] text-[#555555] mt-0.5">{formatDate(item.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (() => {
        const item = media.find((m) => m.id === lightbox);
        if (!item) return null;
        const student = getStudent(item.studentId);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.92)' }}
            onClick={() => setLightbox(null)}
          >
            <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-0 right-0 -mt-10 -mr-0 w-8 h-8 flex items-center justify-center text-white hover:text-[#C9A84C]"
              >
                <X className="w-5 h-5" />
              </button>

              {item.type === 'photo' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.data} alt={item.caption} className="w-full rounded-xl max-h-[70vh] object-contain" />
              ) : (
                <video src={item.data} controls className="w-full rounded-xl max-h-[70vh]" />
              )}

              <div className="mt-3">
                <p className="text-white font-medium">{item.caption || 'No caption'}</p>
                <p className="text-xs text-[#888888]">{student?.name} · {formatDate(item.date)}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Upload modal */}
      <Modal
        isOpen={uploadModal}
        onClose={() => { setUploadModal(false); setPreview(null); setCaption(''); setSelectedStudentId(''); }}
        title="Upload Media"
        size="md"
        footer={
          <>
            <button onClick={() => { setUploadModal(false); setPreview(null); setCaption(''); setSelectedStudentId(''); }} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button
              onClick={handleUpload}
              disabled={!preview || !selectedStudentId}
              className="px-5 py-2 bg-[#C9A84C] text-black rounded-lg font-semibold text-sm hover:bg-[#d4b56a] disabled:opacity-50"
            >
              Upload
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#888888] mb-1.5 font-medium">Student</label>
            <select
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              <option value="">Select student...</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs text-[#888888] mb-1.5 font-medium">File</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="w-full text-sm text-[#888888] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#C9A84C]/20 file:text-[#C9A84C] hover:file:bg-[#C9A84C]/30 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg py-2 px-2"
            />
          </div>

          {preview && (
            <div className="rounded-xl overflow-hidden bg-[#0a0a0a] border border-[#2a2a2a]">
              {preview.type === 'photo' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.data} alt="preview" className="w-full max-h-40 object-contain" />
              ) : (
                <video src={preview.data} className="w-full max-h-40" />
              )}
            </div>
          )}

          <div>
            <label className="block text-xs text-[#888888] mb-1.5 font-medium">Caption (optional)</label>
            <input
              className="w-full bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-3 py-2.5 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C]"
              placeholder="Describe this moment..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <p className="text-xs text-[#555555]">⚠ Images and videos are stored locally in your browser. Large files may fill up storage quickly.</p>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Remove Media?"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button onClick={() => { if (deleteId) { deleteMedia(deleteId); setDeleteId(null); } }} className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600">Remove</button>
          </>
        }
      >
        <p className="text-[#888888] text-sm">This media item will be permanently deleted from storage.</p>
      </Modal>
    </div>
  );
}
