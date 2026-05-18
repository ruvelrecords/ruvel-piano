'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Star, Copy, Eye, EyeOff, Trash2, Check, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Modal from '@/components/ui/Modal';

function StarDisplay({ rating, size = 4 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-${size} h-${size} ${s <= rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#2a2a2a] fill-[#2a2a2a]'}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { reviews, updateReview, deleteReview, students, settings } = useApp();
  const [copied, setCopied] = useState(false);
  const [copiedStudentId, setCopiedStudentId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Published' | 'Hidden'>('all');
  const [showShareSection, setShowShareSection] = useState(false);

  const published = reviews.filter((r) => r.status === 'Published');
  const pending = reviews.filter((r) => r.status === 'Pending');
  const avgRating = published.length > 0
    ? published.reduce((s, r) => s + r.rating, 0) / published.length
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: published.filter((r) => r.rating === star).length,
    pct: published.length > 0 ? (published.filter((r) => r.rating === star).length / published.length) * 100 : 0,
  }));

  const filtered = reviews
    .filter((r) => filter === 'all' || r.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const copyLink = () => {
    const url = `${window.location.origin}/review`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const buildPersonalizedMessage = (studentName: string) => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/review` : '/review';
    return `Hey ${studentName}! 🎹\n\nIt's been amazing having you as a student at ${settings.studioName || 'RÜVEL Piano Method'}.\n\nIf you've been enjoying your classes, it would mean so much if you could leave a quick review — it only takes 2 minutes and helps other students find us! 🌟\n\n👉 ${url}\n\nThank you so much! 🙏\n${settings.teacherName || 'Your Piano Teacher'}`;
  };

  const shareViaWhatsApp = (studentName: string) => {
    const text = encodeURIComponent(buildPersonalizedMessage(studentName));
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const copyPersonalizedMessage = (studentId: string, studentName: string) => {
    navigator.clipboard.writeText(buildPersonalizedMessage(studentName)).then(() => {
      setCopiedStudentId(studentId);
      setTimeout(() => setCopiedStudentId(null), 2000);
    });
  };

  const statusBadge: Record<string, string> = {
    Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Published: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    Hidden: 'bg-[#2a2a2a] text-[#555555] border-[#2a2a2a]',
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Reviews</h1>
          <p className="text-[#888888] text-sm mt-0.5">{reviews.length} total · {pending.length} pending approval</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] border border-[#2a2a2a] text-white rounded-lg text-sm font-medium hover:border-[#C9A84C]/50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={() => setShowShareSection(!showShareSection)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Share via WhatsApp
            {showShareSection ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* WhatsApp share section */}
      {showShareSection && (
        <div className="mb-6 bg-green-500/5 border border-green-500/20 rounded-xl p-5">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-1">
            <MessageCircle className="w-4 h-4 text-green-400" /> Send Personalized Review Request
          </h3>
          <p className="text-xs text-[#888888] mb-4">Each message is personalised with the student&apos;s name and includes the review link.</p>
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-white text-sm">{student.name}</p>
                  <p className="text-xs text-[#888888]">{student.ageGroup} · {student.level}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyPersonalizedMessage(student.id, student.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      copiedStudentId === student.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888] hover:text-white'
                    }`}
                  >
                    {copiedStudentId === student.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedStudentId === student.id ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() => shareViaWhatsApp(student.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating overview */}
      {published.length > 0 && (
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Big rating */}
            <div className="text-center flex-shrink-0">
              <div className="text-5xl font-black text-[#C9A84C]">{avgRating.toFixed(1)}</div>
              <StarDisplay rating={Math.round(avgRating)} size={5} />
              <p className="text-xs text-[#888888] mt-1">{published.length} review{published.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Breakdown bars */}
            <div className="flex-1 w-full">
              {ratingCounts.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs text-[#888888] w-4">{star}</span>
                  <Star className="w-3 h-3 text-[#C9A84C] fill-[#C9A84C] flex-shrink-0" />
                  <div className="flex-1 h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <div className="h-full bg-[#C9A84C] rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-[#555555] w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending alert */}
      {pending.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4 flex items-center gap-3">
          <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <p className="text-sm text-yellow-400">
            {pending.length} review{pending.length !== 1 ? 's' : ''} waiting for your approval
          </p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(['all', 'Pending', 'Published', 'Hidden'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              filter === f
                ? 'bg-[#C9A84C] text-black font-semibold'
                : 'bg-[#111111] border border-[#2a2a2a] text-[#888888] hover:text-white'
            }`}
          >
            {f === 'all' ? 'All' : f}
            <span className="ml-1 text-xs opacity-70">
              {f === 'all' ? reviews.length : reviews.filter((r) => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Reviews list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#111111] border border-[#2a2a2a] rounded-xl">
          <Star className="w-12 h-12 text-[#2a2a2a] mx-auto mb-3" />
          <p className="text-[#555555] mb-2">No reviews yet</p>
          <p className="text-xs text-[#444]">Share the review link with your students to collect testimonials</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className={`bg-[#111111] border rounded-xl p-4 ${
              review.status === 'Pending' ? 'border-yellow-500/30' : 'border-[#2a2a2a]'
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-semibold text-white">{review.name}</span>
                    <span className="text-xs text-[#555555]">·</span>
                    <span className="text-xs text-[#888888]">{review.relationship}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusBadge[review.status]}`}>
                      {review.status}
                    </span>
                  </div>
                  <StarDisplay rating={review.rating} />
                  <p className="text-sm text-white mt-2 leading-relaxed">{review.experience}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-[#555555]">
                    <span>{formatDate(review.createdAt)}</span>
                    <span>·</span>
                    <span>{review.duration}</span>
                    {review.recommend && <span className="text-emerald-400">✓ Recommends</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {review.status === 'Pending' && (
                    <button
                      onClick={() => updateReview(review.id, { status: 'Published' })}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium hover:bg-emerald-500/30 transition-colors"
                    >
                      <Eye className="w-3 h-3" /> Approve
                    </button>
                  )}
                  {review.status === 'Published' && (
                    <button
                      onClick={() => updateReview(review.id, { status: 'Hidden' })}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888] rounded-lg text-xs font-medium hover:text-white transition-colors"
                    >
                      <EyeOff className="w-3 h-3" /> Hide
                    </button>
                  )}
                  {review.status === 'Hidden' && (
                    <button
                      onClick={() => updateReview(review.id, { status: 'Published' })}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#888888] rounded-lg text-xs font-medium hover:text-white transition-colors"
                    >
                      <Eye className="w-3 h-3" /> Show
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteId(review.id)}
                    className="p-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#555555] rounded-lg hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Remove Review?"
        size="sm"
        footer={
          <>
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-[#888888] hover:text-white">Cancel</button>
            <button onClick={() => { if (deleteId) { deleteReview(deleteId); setDeleteId(null); } }} className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600">Remove</button>
          </>
        }
      >
        <p className="text-[#888888] text-sm">This review will be permanently deleted.</p>
      </Modal>
    </div>
  );
}
