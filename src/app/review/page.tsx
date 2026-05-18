'use client';

import { useState, useEffect } from 'react';
import { Star, CheckCircle, Music } from 'lucide-react';
import { getStorage, setStorage } from '@/lib/storage';
import { Review } from '@/lib/types';
import { generateId } from '@/lib/utils';

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="star-btn p-1"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              s <= (hovered || value)
                ? 'text-[#C9A84C] fill-[#C9A84C]'
                : 'text-[#2a2a2a] fill-[#2a2a2a]'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-4 h-4 ${s <= rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#2a2a2a]'}`} />
      ))}
    </div>
  );
}

export default function PublicReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    relationship: 'Current Student' as Review['relationship'],
    rating: 0,
    experience: '',
    duration: 'Less than 1 month',
    recommend: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const all = getStorage<Review[]>('reviews', []);
    setReviews(all.filter((r) => r.status === 'Published'));
  }, []);

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (form.rating === 0) e.rating = 'Please select a rating';
    if (form.experience.trim().length < 20) e.experience = 'Please write at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const review: Review = {
      id: generateId(),
      name: form.name.trim(),
      relationship: form.relationship,
      rating: form.rating,
      experience: form.experience.trim(),
      duration: form.duration,
      recommend: form.recommend,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const existing = getStorage<Review[]>('reviews', []);
    setStorage('reviews', [...existing, review]);
    setSubmitted(true);
  };

  const inputCls = 'w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#C9A84C] transition-colors';
  const selectCls = 'w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C9A84C] transition-colors';

  return (
    <div className="min-h-screen bg-[#0a0a0a]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Hero */}
      <div className="text-center py-16 px-6 border-b border-[#2a2a2a]" style={{ background: 'linear-gradient(180deg, #111111 0%, #0a0a0a 100%)' }}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Music className="w-6 h-6 text-[#C9A84C]" />
          <span className="text-3xl font-black gold-gradient-text tracking-wider">RÜVEL</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Piano Method</h1>
        <p className="text-[#888888] max-w-md mx-auto">Premium piano lessons in Perth, Australia. Share your experience and help other students discover the joy of piano.</p>

        {reviews.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#2a2a2a]'}`} />
              ))}
            </div>
            <span className="text-xl font-bold text-[#C9A84C]">{avgRating.toFixed(1)}</span>
            <span className="text-[#888888] text-sm">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Recent reviews */}
        {reviews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-white mb-4">What students say</h2>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="font-semibold text-white">{r.name}</span>
                      <span className="text-xs text-[#888888] ml-2">{r.relationship}</span>
                    </div>
                    <StarDisplay rating={r.rating} />
                  </div>
                  <p className="text-sm text-[#888888] leading-relaxed">&ldquo;{r.experience}&rdquo;</p>
                  {r.recommend && (
                    <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Recommends RÜVEL Piano
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Review form */}
        <div className="bg-[#111111] border border-[#2a2a2a] rounded-2xl p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Thank you!</h2>
              <p className="text-[#888888]">Your review has been submitted and will be published after approval.</p>
              <div className="mt-6 flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-5 h-5 ${s <= form.rating ? 'text-[#C9A84C] fill-[#C9A84C]' : 'text-[#2a2a2a]'}`} />
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Leave a Review</h2>
                <p className="text-sm text-[#888888]">Your experience helps other students</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Your Name *</label>
                <input
                  className={inputCls}
                  placeholder="First name or full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Your Relationship</label>
                <select
                  className={selectCls}
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value as Review['relationship'] })}
                >
                  <option>Current Student</option>
                  <option>Former Student</option>
                  <option>Parent of Student</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Your Rating *</label>
                <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                {form.rating > 0 && (
                  <p className="text-xs text-[#C9A84C] mt-1">
                    {form.rating === 5 ? 'Excellent!' : form.rating === 4 ? 'Great!' : form.rating === 3 ? 'Good' : form.rating === 2 ? 'Fair' : 'Poor'}
                  </p>
                )}
                {errors.rating && <p className="text-xs text-red-400 mt-1">{errors.rating}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Your Experience *</label>
                <textarea
                  className={`${inputCls} h-28 resize-none leading-relaxed`}
                  placeholder="Tell us about your experience with RÜVEL Piano Method..."
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: e.target.value })}
                />
                <div className="flex justify-between text-xs mt-1">
                  {errors.experience ? (
                    <span className="text-red-400">{errors.experience}</span>
                  ) : (
                    <span className="text-[#555555]">{form.experience.length < 20 ? `${20 - form.experience.length} more chars needed` : '✓ Good length'}</span>
                  )}
                  <span className="text-[#444]">{form.experience.length}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">How long have you been learning?</label>
                <select
                  className={selectCls}
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                >
                  <option>Less than 1 month</option>
                  <option>1-3 months</option>
                  <option>3-6 months</option>
                  <option>6+ months</option>
                  <option>Former student</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Would you recommend RÜVEL Piano?</label>
                <div className="flex gap-3">
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => setForm({ ...form, recommend: val })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                        form.recommend === val
                          ? val ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-red-500/20 border-red-500/50 text-red-400'
                          : 'bg-[#1a1a1a] border-[#2a2a2a] text-[#888888]'
                      }`}
                    >
                      {val ? '👍 Yes, definitely!' : '👎 Not really'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#C9A84C] text-black rounded-xl font-bold text-sm hover:bg-[#d4b56a] transition-colors"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
