export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-AU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateShort(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-AU', { day: '2-digit', month: 'short' });
}

export function formatAUD(amount: number): string {
  return `$${amount.toFixed(2).replace(/\.00$/, '')}`;
}

export function getActivityStatus(lastClassDate: string | null): 'active' | 'warning' | 'inactive' {
  if (!lastClassDate) return 'inactive';
  const last = new Date(lastClassDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 14) return 'active';
  if (diffDays <= 30) return 'warning';
  return 'inactive';
}

export function getAgeGroupColor(ageGroup: string): string {
  switch (ageGroup) {
    case 'Kids (6-12)': return '#FF6B35';
    case 'Youth (13-17)': return '#9B59B6';
    case 'Adults (18+)': return '#C9A84C';
    default: return '#888888';
  }
}

export function getAgeGroupBg(ageGroup: string): string {
  switch (ageGroup) {
    case 'Kids (6-12)': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'Youth (13-17)': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'Adults (18+)': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

export function getLevelBadge(level: string): string {
  switch (level) {
    case 'Beginner': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'Intermediate': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'Advanced': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    default: return 'bg-gray-500/20 text-gray-400';
  }
}

export function getStatusBadge(status: string): string {
  switch (status) {
    case 'Completed': return 'bg-emerald-500/20 text-emerald-400';
    case 'Scheduled': return 'bg-blue-500/20 text-blue-400';
    case 'Cancelled': return 'bg-red-500/20 text-red-400';
    case 'Rescheduled': return 'bg-yellow-500/20 text-yellow-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export function musescoreUrl(song: string, artist: string): string {
  const query = encodeURIComponent(`${song} ${artist} easy piano`);
  return `https://musescore.com/sheetmusic?text=${query}`;
}

export function formatTime12h(time: string): string {
  if (!time) return '';
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr || '00';
  if (isNaN(hour)) return time;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${minute} ${ampm}`;
}

export function formatDateFull(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

export function isToday(iso: string): boolean {
  if (!iso) return false;
  const today = new Date().toISOString().split('T')[0];
  return iso.split('T')[0] === today;
}

export function isFuture(iso: string): boolean {
  if (!iso) return false;
  const today = new Date().toISOString().split('T')[0];
  return iso.split('T')[0] > today;
}
